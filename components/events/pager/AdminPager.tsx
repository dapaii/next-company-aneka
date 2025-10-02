// components/events/pager/AdminPager.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

type SP = Record<string, string | string[] | undefined>;

function buildPageUrl(basePath: string, sp: SP, to: number) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (v == null || k === "page") continue;
    params.set(k, Array.isArray(v) ? v[0] : String(v));
  }
  params.set("page", String(to));
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export default function AdminPager({
  page,
  per,
  total,
  searchParams,
  basePath = "/dashboard/events",
  alwaysVisible = true, // <-- default: SELALU tampil
}: {
  page: number;
  per: number;
  total: number;
  searchParams: SP;
  basePath?: string;
  alwaysVisible?: boolean;
}) {
  const last = Math.max(1, Math.ceil(total / per));

  // hide hanya kalau kosong total dan kita nggak mau show
  if (!alwaysVisible && total <= per) return null;

  const canPrev = page > 1;
  const canNext = page < last;
  const prevUrl = buildPageUrl(basePath, searchParams, Math.max(1, page - 1));
  const nextUrl = buildPageUrl(basePath, searchParams, Math.min(last, page + 1));

  return (
    <nav className="flex items-center justify-center gap-2 pt-2" aria-label="Pagination" aria-controls="events-grid">
      <Button variant="outline" size="sm" asChild={!canPrev} disabled={!canPrev} aria-disabled={!canPrev}>
        {canPrev ? <Link href={prevUrl} prefetch={false}>Prev</Link> : <span>Prev</span>}
      </Button>

      <span className="text-xs text-muted-foreground">Page {page} of {last}</span>

      <Button variant="outline" size="sm" asChild={!canNext} disabled={!canNext} aria-disabled={!canNext}>
        {canNext ? <Link href={nextUrl} prefetch={false}>Next</Link> : <span>Next</span>}
      </Button>
    </nav>
  );
}
