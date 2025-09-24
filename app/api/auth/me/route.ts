import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET() {
  const sess = await getSession();
  if (!sess) return NextResponse.json({ user: null });
  return NextResponse.json({ user: { id: sess.sub, email: sess.email, role: sess.role } });
}
