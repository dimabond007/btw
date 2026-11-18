import 'server-only';
import { createHash, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

// The orders screen is protected by one shared password, kept in the ADMIN_PASSWORD
// environment variable. The browser holds only a hash of it, in an httpOnly cookie.
export const ADMIN_COOKIE = 'btw_admin';

const tokenFor = (password: string) => createHash('sha256').update(`btw-admin:${password}`).digest('hex');

const same = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

export const adminConfigured = () => Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length >= 8);

export function checkPassword(password: string): string | null {
  if (!adminConfigured()) return null;
  return same(tokenFor(password), tokenFor(process.env.ADMIN_PASSWORD!)) ? tokenFor(password) : null;
}

export function isAdmin(): boolean {
  if (!adminConfigured()) return false;
  const token = cookies().get(ADMIN_COOKIE)?.value ?? '';
  return same(token, tokenFor(process.env.ADMIN_PASSWORD!));
}
