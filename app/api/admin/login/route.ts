import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, checkPassword } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const token = checkPassword(typeof body?.password === 'string' ? body.password : '');
  if (!token) {
    await new Promise((r) => setTimeout(r, 800)); // slows down guessing
    return NextResponse.json({ error: 'wrong' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
