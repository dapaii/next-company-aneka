// app/dashboard/overview/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;                // jangan pernah di-static
export const fetchCache = "force-no-store"; // jaga-jaga

import { prisma } from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";
import OverviewClient from "./OverviewClient";
import AutoRefreshOnFocus from "./AutoRefreshOnFocus"; // ⬅️ tambah

type Status = "draft" | "published" | "archived";

type RowServer = {
  id: string;
  title: string;
  slug: string;
  status: Status;
  viewsTotal: number;
  startsAt: Date;
};

const getRows = async (): Promise<RowServer[]> => {
  noStore(); // ⬅️ pastikan query ini tidak di-cache oleh RSC
  const events = await prisma.event.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      viewsTotal: true,
      startsAt: true,
    },
    orderBy: { startsAt: "desc" },
  });
  return events as RowServer[];
};

export default async function OverviewPage() {
  const rows = await getRows();

  // serialize Date → string untuk dikirim ke client
  const clientRows = rows.map((r) => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    status: r.status,
    viewsTotal: r.viewsTotal,
    startsAt: r.startsAt.toISOString(),
  }));

  return (
    <>
      {/* Auto refresh saat tab fokus / user balik ke halaman */}
      <AutoRefreshOnFocus />
      <OverviewClient rows={clientRows} />
    </>
  );
}
