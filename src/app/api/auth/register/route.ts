import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, username, password, name, contact, address, role } = await req.json();

    if (!username || !password || !name) {
      return NextResponse.json({ error: 'Username, password, and name are required' }, { status: 400 });
    }

    if (email) {
      const existingEmail = await query('SELECT id FROM users WHERE email = ?', [email]) as any[];
      if (existingEmail.length > 0) {
        return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
      }
    }

    const existingUsername = await query('SELECT id FROM users WHERE username = ?', [username]) as any[];
    if (existingUsername.length > 0) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
    }

    const validRole = role || 'complainant';
    if (!['complainant', 'respondent'].includes(validRole)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    await query(
      'INSERT INTO users (email, username, password, name, role, contact, address) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [email || null, username, hashedPassword, name, validRole, contact || null, address || null]
    );

    return NextResponse.json({ message: 'Registration successful' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
