// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { compare } from "@/lib/auth/hash";
import { signSession } from "@/lib/auth/jwt";
import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  remember: z.boolean().optional().default(false),
});

// 30 hari (detik)
const REMEMBER_MAX_AGE = 60 * 60 * 24 * 30;
// Nama cookie (samakan dengan yang dibaca di middleware / getSession)
const COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? "session";

export async function POST(req: NextRequest) {
  const { email, password, remember } = LoginSchema.parse(await req.json());

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const ok = await compare(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await signSession({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  // Kembalikan JSON agar cocok dengan fetch() di LoginForm
  const res = NextResponse.json({ ok: true });

  // Set cookie sesi:
  // - kalau remember=true => persistent cookie (maxAge 30 hari)
  // - kalau remember=false => session cookie (tanpa maxAge)
  res.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    ...(remember ? { maxAge: REMEMBER_MAX_AGE } : {}),
  });

  return res;
}
