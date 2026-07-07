import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAuthUser, createAuditLog } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const attendance = await query(
      `SELECT a.*, u.name as user_name
       FROM attendance a
       JOIN users u ON a.user_id = u.id
       WHERE a.hearing_id IN (SELECT id FROM hearings WHERE case_id = ?)
       ORDER BY a.hearing_id, a.role`,
      [id]
    );
    return NextResponse.json({ attendance });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch attendance' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'secretary') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const { hearing_id, records } = await req.json();

    for (const record of records) {
      const existing = await query(
        'SELECT id FROM attendance WHERE hearing_id = ? AND user_id = ?',
        [hearing_id, record.user_id]
      ) as any[];

      if (existing.length > 0) {
        await query('UPDATE attendance SET attended = ? WHERE id = ?', [record.attended ? 1 : 0, existing[0].id]);
      } else {
        await query(
          'INSERT INTO attendance (hearing_id, user_id, role, attended) VALUES (?, ?, ?, ?)',
          [hearing_id, record.user_id, record.role, record.attended ? 1 : 0]
        );
      }
    }

    await createAuditLog(user.id, 'RECORD_ATTENDANCE', `Recorded attendance for hearing #${hearing_id} (case #${id})`);

    return NextResponse.json({ message: 'Attendance recorded' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record attendance' }, { status: 500 });
  }
}
