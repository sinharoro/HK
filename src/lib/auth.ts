import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { query } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'hustisyakonek-secret-key-2026';

export interface UserPayload {
  id: number;
  email: string;
  username: string;
  name: string;
  role: 'secretary' | 'lupon_chairman' | 'lupon_member' | 'complainant' | 'respondent';
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(user: UserPayload): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
  } catch {
    return null;
  }
}

export async function getAuthUser(): Promise<UserPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireAuth(roles?: string[]): Promise<UserPayload> {
  const user = await getAuthUser();
  if (!user) throw new Error('Unauthorized');
  if (roles && !roles.includes(user.role)) throw new Error('Forbidden');
  return user;
}

export async function createAuditLog(userId: number, action: string, details?: string) {
  await query(
    'INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)',
    [userId, action, details || '']
  );
}

export async function createNotification(userId: number, title: string, message: string) {
  await query(
    'INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)',
    [userId, title, message]
  );
}
