import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let totalCases, activeCases, settledCases, escalatedCases, pendingHearings, totalComplainants;

    if (user.role === 'complainant') {
      totalCases = await query('SELECT COUNT(*) as count FROM cases WHERE complainant_id = ?', [user.id]) as any[];
      activeCases = await query("SELECT COUNT(*) as count FROM cases WHERE complainant_id = ? AND status IN ('filed','under_mediation')", [user.id]) as any[];
      settledCases = await query("SELECT COUNT(*) as count FROM cases WHERE complainant_id = ? AND status = 'settled'", [user.id]) as any[];
      escalatedCases = await query("SELECT COUNT(*) as count FROM cases WHERE complainant_id = ? AND status = 'escalated'", [user.id]) as any[];
      pendingHearings = await query(
        `SELECT COUNT(*) as count FROM hearings WHERE status = 'scheduled' AND case_id IN (SELECT id FROM cases WHERE complainant_id = ?)`,
        [user.id]
      ) as any[];
      totalComplainants = [{ count: 0 }];
    } else if (user.role === 'lupon_member') {
      totalCases = await query(
        'SELECT COUNT(*) as count FROM case_assignments WHERE lupon_member_id = ?', [user.id]
      ) as any[];
      activeCases = await query(
        "SELECT COUNT(*) as count FROM case_assignments ca JOIN cases c ON ca.case_id = c.id WHERE ca.lupon_member_id = ? AND c.status IN ('filed','under_mediation')",
        [user.id]
      ) as any[];
      settledCases = [{ count: 0 }];
      escalatedCases = [{ count: 0 }];
      pendingHearings = await query(
        `SELECT COUNT(*) as count FROM hearings h
         JOIN case_assignments ca ON h.case_id = ca.case_id
         WHERE ca.lupon_member_id = ? AND h.status = 'scheduled'`,
        [user.id]
      ) as any[];
      totalComplainants = [{ count: 0 }];
    } else if (user.role === 'respondent') {
      totalCases = await query('SELECT COUNT(*) as count FROM cases WHERE respondent_email = ?', [user.email]) as any[];
      activeCases = await query("SELECT COUNT(*) as count FROM cases WHERE respondent_email = ? AND status IN ('filed','under_mediation')", [user.email]) as any[];
      settledCases = await query("SELECT COUNT(*) as count FROM cases WHERE respondent_email = ? AND status = 'settled'", [user.email]) as any[];
      escalatedCases = [{ count: 0 }];
      pendingHearings = [{ count: 0 }];
      totalComplainants = [{ count: 0 }];
    } else {
      totalCases = await query('SELECT COUNT(*) as count FROM cases') as any[];
      activeCases = await query("SELECT COUNT(*) as count FROM cases WHERE status IN ('filed','under_mediation')") as any[];
      settledCases = await query("SELECT COUNT(*) as count FROM cases WHERE status = 'settled'") as any[];
      escalatedCases = await query("SELECT COUNT(*) as count FROM cases WHERE status = 'escalated'") as any[];
      pendingHearings = await query("SELECT COUNT(*) as count FROM hearings WHERE status = 'scheduled'") as any[];
      totalComplainants = await query("SELECT COUNT(*) as count FROM users WHERE role = 'complainant'") as any[];
    }

    return NextResponse.json({
      totalCases: totalCases[0].count,
      activeCases: activeCases[0].count,
      settledCases: settledCases[0].count,
      escalatedCases: escalatedCases[0].count,
      pendingHearings: pendingHearings[0].count,
      totalComplainants: totalComplainants[0].count,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
