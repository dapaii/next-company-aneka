// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookieOn } from '@/lib/auth/cookies';

function logout(req: NextRequest) {
  // Paksa jadi GET di target dengan status 303
  const res = NextResponse.redirect(new URL('/login', req.url), { status: 303 });

  // Hapus cookie sesi
  try { clearSessionCookieOn?.(res); } catch {}

  // (opsional) jika perlu, hapus fallback cookie di sini
  return res;
}

export const GET = logout;
export const POST = logout;
