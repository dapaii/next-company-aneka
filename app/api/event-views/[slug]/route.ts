// app/api/event-views/[slug]/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// POST /api/event-views/:slug  -> increment 1
export async function POST(_req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params; // ⬅️ WAJIB await

  const ev = await prisma.event.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!ev) {
    return NextResponse.json({ ok: false, message: "Event not found" }, { status: 404 });
  }

  await prisma.event.update({
    where: { id: ev.id },
    data: { viewsTotal: { increment: 1 } },
  });

  return NextResponse.json({ ok: true });
}

// (Opsional) GET /api/event-views/:slug -> baca total
export async function GET(_req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;

  const ev = await prisma.event.findUnique({
    where: { slug },
    select: { id: true, viewsTotal: true },
  });

  if (!ev) {
    return NextResponse.json({ ok: false, message: "Event not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, viewsTotal: ev.viewsTotal });
}
