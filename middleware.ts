// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Allow GET /api/events (publik)
  if (pathname.startsWith('/api/events') && req.method === 'GET') {
    return NextResponse.next();
  }

  // Proteksi dashboard & API admin-only
  const protectedPaths = ['/dashboard', '/api/events', '/api/users'];
  if (!protectedPaths.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = req.cookies.get('session')?.value;
  if (!token) return NextResponse.redirect(new URL('/login', req.url));

  try {
    const { payload } = await jwtVerify(token, secret);
    if (payload.role !== 'admin') throw new Error('not admin');
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/events/:path*', '/api/users/:path*'],
};
