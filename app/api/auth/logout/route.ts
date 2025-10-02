// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { clearSessionCookieOn } from '@/lib/auth/cookies';

export async function POST() {
  const res = NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'));
  clearSessionCookieOn(res);
  return res;
}