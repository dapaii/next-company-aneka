import Link from "next/link";
import { Button } from "@/components/ui/button";

type SP = Record<string, string | string[] | undefined>;

function buildPageUrl(basePath: string, sp: SP, to: number) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (v == null) continue;
    if (k === "page") continue;
    params.set(k, Array.isArray(v) ? v[0] : v);
  }
  params.set("page", String(to));
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export default function PublicPager({
  page, per, total, searchParams, basePath = "/events",
}: { page: number; per: number; total: number; searchParams: SP; basePath?: string }) {
  if (total <= per) return null;

  const last = Math.max(1, Math.ceil(total / per));
  const prev = Math.max(1, page - 1);
  const next = Math.min(last, page + 1);

  return (
    <nav className="flex items-center justify-center gap-2 pt-2" aria-label="Pagination" aria-controls="events-grid">
      <Button asChild variant="outline" size="sm" disabled={page === 1} aria-disabled={page === 1}>
        <Link href={buildPageUrl(basePath, searchParams, prev)} prefetch={false}>Sebelumnya</Link>
      </Button>
      <span className="text-xs text-muted-foreground" aria-live="polite">
        Halaman {page} dari {last}
      </span>
      <Button asChild variant="outline" size="sm" disabled={page === last} aria-disabled={page === last}>
        <Link href={buildPageUrl(basePath, searchParams, next)} prefetch={false}>Berikutnya</Link>
      </Button>
    </nav>
  );
}
