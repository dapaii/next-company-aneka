// lib/cookies.ts
import { cookies as nextCookies } from 'next/headers';
import { NextResponse } from 'next/server';

const NAME = 'session';

const base = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // false saat dev
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7 hari
};

// ✅ dipakai di Route Handler untuk SET cookie
export function setSessionCookieOn(res: NextResponse, token: string) {
  res.cookies.set(NAME, token, base);
}

// ✅ dipakai di Route Handler untuk CLEAR cookie
export function clearSessionCookieOn(res: NextResponse) {
  res.cookies.set(NAME, '', { ...base, maxAge: 0 });
}

// ✅ baca cookie dari server component / action
export async function getSessionCookie() {
  const store = await nextCookies();
  return store.get(NAME)?.value;
}
