// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { compare } from '@/lib/hash';
import { signSession } from '@/lib/jwt';
import { setSessionCookieOn } from '@/lib/cookies';
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  const { email, password } = LoginSchema.parse(await req.json());

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  const ok = await compare(password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  const token = await signSession({ sub: user.id, email: user.email, role: user.role });

  // kamu bisa pilih redirect langsung biar pasti
  const res = NextResponse.redirect(new URL('/dashboard', req.url));
  setSessionCookieOn(res, token);
  return res;
}
