import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAuthUser, createAuditLog, createNotification } from '@/lib/auth';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'secretary') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const { lupon_member_id, role } = await req.json();

    const existing = await query(
      'SELECT id FROM case_assignments WHERE case_id = ? AND lupon_member_id = ?',
      [id, lupon_member_id]
    ) as any[];

    if (existing.length > 0) {
      return NextResponse.json({ error: 'Member already assigned to this case' }, { status: 409 });
    }

    await query(
      'INSERT INTO case_assignments (case_id, lupon_member_id, role) VALUES (?, ?, ?)',
      [id, lupon_member_id, role || 'member']
    );

    const caseData = await query('SELECT case_number FROM cases WHERE id = ?', [id]) as any[];
    if (caseData.length > 0) {
      await createNotification(
        lupon_member_id,
        'New Case Assignment',
        `You have been assigned to case ${caseData[0].case_number} as ${role || 'member'}.`
      );
    }

    await createAuditLog(user.id, 'ASSIGN_MEMBER', `Assigned member #${lupon_member_id} to case #${id}`);

    return NextResponse.json({ message: 'Member assigned' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to assign member' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'secretary') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const { assignment_id } = await req.json();

    await query('DELETE FROM case_assignments WHERE id = ? AND case_id = ?', [assignment_id, id]);
    await createAuditLog(user.id, 'UNASSIGN_MEMBER', `Removed assignment #${assignment_id} from case #${id}`);

    return NextResponse.json({ message: 'Member unassigned' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to unassign member' }, { status: 500 });
  }
}
