import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAuthUser, createAuditLog } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const summons = await query(
      `SELECT s.*, u.name as generated_by_name
       FROM summons s LEFT JOIN users u ON s.generated_by = u.id
       WHERE s.case_id = ? ORDER BY s.created_at DESC`,
      [id]
    );
    return NextResponse.json({ summons });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch summons' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'secretary') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const caseData = await query('SELECT * FROM cases WHERE id = ?', [id]) as any[];
    if (caseData.length === 0) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    const caseRecord = caseData[0];

    let respondentPassword = caseRecord.respondent_password;
    if (!respondentPassword) {
      respondentPassword = Math.random().toString(36).slice(2, 10);
      const hashedPassword = await bcrypt.hash(respondentPassword, 12);

      let respondentEmail = caseRecord.respondent_contact;
      if (respondentEmail && respondentEmail.includes('@')) {
        const existingResp = await query('SELECT id FROM users WHERE email = ?', [respondentEmail]) as any[];
        if (existingResp.length === 0) {
          await query(
            'INSERT INTO users (email, password, name, role, contact, address) VALUES (?, ?, ?, ?, ?, ?)',
            [respondentEmail, hashedPassword, caseRecord.respondent_name, 'respondent', caseRecord.respondent_contact, caseRecord.respondent_address]
          );
        }
      }

      await query('UPDATE cases SET respondent_password = ? WHERE id = ?', [respondentPassword, id]);
    }

    await query(
      'INSERT INTO summons (case_id, generated_by, respondent_credentials) VALUES (?, ?, ?)',
      [id, user.id, `Email: ${caseRecord.respondent_contact || 'N/A'}, Password: ${respondentPassword}`]
    );

    await createAuditLog(user.id, 'GENERATE_SUMMON', `Generated summon for case ${caseRecord.case_number}`);

    return NextResponse.json({
      message: 'Summon generated',
      respondent_password: respondentPassword,
      case_number: caseRecord.case_number,
      respondent_name: caseRecord.respondent_name,
      respondent_address: caseRecord.respondent_address,
      respondent_contact: caseRecord.respondent_contact,
      hearing_schedule: '',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate summon' }, { status: 500 });
  }
}
