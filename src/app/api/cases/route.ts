import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAuthUser, createAuditLog } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const q = searchParams.get('q');

    let sql = `
      SELECT c.*, u.name as complainant_name, l.name as lupon_chairman_name
      FROM cases c
      LEFT JOIN users u ON c.complainant_id = u.id
      LEFT JOIN users l ON c.lupon_chairman_id = l.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (user.role === 'complainant') {
      sql += ' AND c.complainant_id = ?';
      params.push(user.id);
    } else if (user.role === 'respondent') {
      sql += ' AND c.respondent_email = ?';
      params.push(user.email);
    } else if (user.role === 'lupon_member') {
      sql += ' AND c.id IN (SELECT case_id FROM case_assignments WHERE lupon_member_id = ?)';
      params.push(user.id);
    }

    if (status) {
      sql += ' AND c.status = ?';
      params.push(status);
    }
    if (q) {
      sql += ' AND (c.case_number LIKE ? OR c.title LIKE ? OR c.respondent_name LIKE ?)';
      const like = `%${q}%`;
      params.push(like, like, like);
    }

    sql += ' ORDER BY c.created_at DESC';

    const cases = await query(sql, params);
    return NextResponse.json({ cases });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cases' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!['secretary', 'complainant'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { title, description, respondent_name, respondent_address, respondent_contact } = await req.json();
    if (!title || !respondent_name) {
      return NextResponse.json({ error: 'Title and respondent name are required' }, { status: 400 });
    }

    const year = new Date().getFullYear();
    const count = await query('SELECT COUNT(*) as cnt FROM cases WHERE YEAR(created_at) = ?', [year]) as any[];
    const caseNumber = `HSN-${year}-${String(count[0].cnt + 1).padStart(4, '0')}`;

    const result = await query(
      `INSERT INTO cases (case_number, title, description, complainant_id, respondent_name, respondent_address, respondent_contact)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [caseNumber, title, description || null, user.role === 'secretary' ? null : user.id, respondent_name, respondent_address || null, respondent_contact || null]
    ) as any;

    await createAuditLog(user.id, 'CREATE_CASE', `Created case ${caseNumber}: ${title}`);

    return NextResponse.json({ message: 'Case created', caseId: result.insertId, case_number: caseNumber }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create case' }, { status: 500 });
  }
}
