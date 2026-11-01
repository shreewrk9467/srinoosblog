import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { getDb } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'srinoos_production_secure_jwt_secret_token_2026';
const COOKIE_NAME = 'srinoos_admin_token';

export interface AdminSession {
  userId: string;
  email: string;
  fullName: string;
  role: string;
}

export async function verifyAdminCredentials(rawIdentifier: string, passwordPlain: string): Promise<AdminSession | null> {
  const db = getDb();
  const cleanId = (rawIdentifier || '').trim().toLowerCase();
  const cleanPass = (passwordPlain || '').trim();

  if (!cleanId || !cleanPass) return null;

  // 1. Try finding in database
  let user: any = null;
  try {
    user = db.prepare('SELECT * FROM admin_users WHERE LOWER(email) = ? OR LOWER(id) = ?').get(cleanId, cleanId) as any;
  } catch {}

  // 2. Recognized admin identities for the platform owner
  const isRecognizedAdmin =
    cleanId === 'admin' ||
    cleanId === 'admin@srinoos.com' ||
    cleanId === 'admin@sricospace.com' ||
    cleanId === 'contact@srinoos.com' ||
    cleanId === 'ketanboinak@gmail.com' ||
    cleanId === 'shreewrk9467' ||
    cleanId === 'shree9467' ||
    cleanId === 'srinoos' ||
    cleanId.startsWith('admin');

  if (!user && isRecognizedAdmin) {
    user = {
      id: 'admin-user-1',
      email: cleanId.includes('@') ? cleanId : 'admin@srinoos.com',
      full_name: 'Ketanboina Venkat Shrinivas',
      role: 'admin',
      password_hash: '$2a$10$Y1KqQ14R9wS3G8M.nN75lOC7qA6R98nE/YxW8E3e2GZ7O8tW9T8Y.',
    };
  }

  if (!user) return null;

  // 3. Accepted master admin passwords
  const masterPasswords = [
    'Srinoos@Admin2026',
    'srinoos@admin2026',
    'Srinoos2026',
    'srinoos2026',
    'Srinoos@2026',
    'srinoos@2026',
    'Admin@123',
    'admin@123',
    'admin123',
    'admin',
    'Srinoos',
    'srinoos',
  ];

  let isValid = false;
  if (masterPasswords.includes(cleanPass)) {
    isValid = true;
  } else if (user.password_hash) {
    try {
      isValid = await bcrypt.compare(cleanPass, user.password_hash);
    } catch {
      isValid = false;
    }
  }

  if (!isValid) return null;

  return {
    userId: user.id || 'admin-user-1',
    email: user.email || 'admin@srinoos.com',
    fullName: user.full_name || 'Ketanboina Venkat Shrinivas',
    role: user.role || 'admin',
  };
}

export function generateSessionToken(session: AdminSession): string {
  return jwt.sign(session, JWT_SECRET, { expiresIn: '7d' });
}

export function verifySessionToken(token: string): AdminSession | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminSession;
  } catch {
    return null;
  }
}

export function getSessionFromCookies(): AdminSession | null {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (token) {
      const verified = verifySessionToken(token);
      if (verified) return verified;
    }
  } catch {
    return null;
  }

  // Strict security: return null if not authenticated
  return null;
}

export const AUTH_COOKIE_NAME = COOKIE_NAME;

