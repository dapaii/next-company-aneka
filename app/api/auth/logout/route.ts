// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookieOn } from "@/lib/auth/cookies";

function logout(request: NextRequest) {
  // Redirect selalu ke domain yang sedang dipakai (lokal/Vercel/custom)
  const res = NextResponse.redirect(new URL("/login", request.url));
  try {
    clearSessionCookieOn?.(res);
  } catch {
    // biarkan; fallback di bawah akan tetap menghapus cookie
  }

  const killers = [
    "session",
    "token",
    "sb:token",
    "sb-access-token",
    "sb-refresh-token",
  ];
  killers.forEach((name) => {
    res.cookies.set(name, "", {
      expires: new Date(0),
      path: "/", // penting: samakan dengan path saat set cookie
      httpOnly: true, // samakan flag dengan saat set cookie
      sameSite: "lax", // samakan juga jika perlu
      secure: true, // di Vercel (https) sebaiknya true
    });
  });

  return res;
}

export async function GET(request: NextRequest) {
  return logout(request);
}

export async function POST(request: NextRequest) {
  return logout(request);
}
