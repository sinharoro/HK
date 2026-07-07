import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const users = await query(
      'SELECT id, email, username, name, role, contact, address, created_at FROM users WHERE id = ?',
      [user.id]
    ) as any[];

    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user: users[0] });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
