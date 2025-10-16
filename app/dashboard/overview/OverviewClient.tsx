// app/dashboard/overview/OverviewClient.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card, CardHeader, CardTitle, CardContent,
} from "@/components/ui/card";
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,   // NEW
  Area,        // NEW
} from "recharts";
import { ArrowUpDown, Download, RefreshCcw, Loader2 } from "lucide-react";

type Status = "draft" | "published" | "archived";

type RowClient = {
  id: string;
  title: string;
  slug: string;
  status: Status;
  viewsTotal: number;
  startsAt: string; // ISO
};

type Props = { rows: RowClient[] };

const formatNumber = (n: number): string => Intl.NumberFormat().format(n);
const truncate = (s: string, max = 22): string => (s.length > max ? `${s.slice(0, max - 1)}…` : s);

const StatusBadge = ({ status }: { status: Status }): React.ReactElement => {
  const style =
    status === "published"
      ? "bg-emerald-600 text-white"
      : status === "draft"
      ? "bg-slate-600 text-white"
      : "bg-amber-600 text-white";
  return <Badge className={style}>{status}</Badge>;
};

const PIE_COLORS = ["#0ea5e9", "#22c55e", "#eab308"];

function pingView(slug: string, src: "table" | "top-chart"): void {
  const url = `/api/event-views/${encodeURIComponent(slug)}?src=${encodeURIComponent(src)}`;
  if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
    const blob = new Blob([], { type: "application/json" });
    navigator.sendBeacon(url, blob);
  } else {
    void fetch(url, { method: "POST", keepalive: true });
  }
}

// NEW: helper label bulan (MMM yy)
const monthLabel = (d: Date): string =>
  d.toLocaleDateString(undefined, { month: "short", year: "2-digit" });

const OverviewClient: React.FC<Props> = ({ rows }) => {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  // UI state
  const [q, setQ] = React.useState<string>("");
  const [status, setStatus] = React.useState<"all" | Status>("all");
  const [sort, setSort] = React.useState<"visitors" | "title" | "date">("visitors");
  const [dir, setDir] = React.useState<"asc" | "desc">("desc");
  const [pageSize, setPageSize] = React.useState<number>(12);
  const [page, setPage] = React.useState<number>(1);
  const [compact, setCompact] = React.useState<boolean>(false);
  const [topLimit, setTopLimit] = React.useState<number>(10);

  // NEW: controls grafik bulanan
  const [monthsWindow, setMonthsWindow] = React.useState<6 | 12>(12);
  const [monthlyMetric, setMonthlyMetric] = React.useState<"visitors" | "events">("visitors");

  // derived list
  const filtered = React.useMemo(() => {
    const query = q.trim().toLowerCase();
    let list = rows.filter((r) =>
      query ? r.title.toLowerCase().includes(query) || r.slug.toLowerCase().includes(query) : true
    );
    list = status === "all" ? list : list.filter((r) => r.status === status);
    list = [...list].sort((a, b) => {
      if (sort === "visitors") return dir === "desc" ? b.viewsTotal - a.viewsTotal : a.viewsTotal - b.viewsTotal;
      if (sort === "title") return dir === "desc" ? b.title.localeCompare(a.title) : a.title.localeCompare(b.title);
      const ad = new Date(a.startsAt).getTime();
      const bd = new Date(b.startsAt).getTime();
      return dir === "desc" ? bd - ad : ad - bd;
    });
    return list;
  }, [rows, q, status, sort, dir]);

  // pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  React.useEffect(() => setPage(1), [q, status, sort, dir, pageSize]);
  const paged = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  // metrics
  const totalVisitors = React.useMemo(() => filtered.reduce((acc, r) => acc + r.viewsTotal, 0), [filtered]);
  const avgVisitors = React.useMemo(
    () => (filtered.length ? Math.round(totalVisitors / filtered.length) : 0),
    [totalVisitors, filtered.length]
  );

  // charts
  const topChart = React.useMemo(
    () =>
      [...filtered]
        .sort((a, b) => b.viewsTotal - a.viewsTotal)
        .slice(0, topLimit)
        .map((r) => ({ name: truncate(r.title, 16), visitors: r.viewsTotal, slug: r.slug })),
    [filtered, topLimit]
  );

  const statusSlices = React.useMemo(() => {
    const counters: Record<Status, number> = { published: 0, draft: 0, archived: 0 };
    filtered.forEach((r) => {
      counters[r.status] += 1;
    });
    return (Object.keys(counters) as Status[]).map((k) => ({ name: k as Status, value: counters[k as Status] }));
  }, [filtered]);

  // NEW: data bulanan (terisi untuk 6/12 bulan ke belakang)
  type Monthly = { label: string; visitors: number; events: number };
  const monthlyData: Monthly[] = React.useMemo(() => {
    const now = new Date();
    const buckets: Monthly[] = [];
    // isi array mundur dari bulan sekarang
    for (let i = monthsWindow - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets.push({ label: monthLabel(d), visitors: 0, events: 0 });
    }
    // helper cek cocok bulan-tahun
    const sameMonth = (a: Date, b: Date) =>
      a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

    filtered.forEach((r) => {
      const sd = new Date(r.startsAt);
      const idx = buckets.findIndex((_b, j) => {
        const ref = new Date(now.getFullYear(), now.getMonth() - (monthsWindow - 1 - j), 1);
        return sameMonth(sd, ref);
      });
      if (idx >= 0) {
        buckets[idx].visitors += r.viewsTotal;
        buckets[idx].events += 1;
      }
    });

    return buckets;
  }, [filtered, monthsWindow]);

  // actions
  const toggleSort = (key: "visitors" | "title" | "date"): void => {
    if (sort === key) setDir((d) => (d === "desc" ? "asc" : "desc"));
    else {
      setSort(key);
      setDir("desc");
    }
  };

  const exportCsv = (rowsToExport: RowClient[]): void => {
    const header = ["id", "title", "slug", "status", "viewsTotal", "startsAt"];
    const lines = rowsToExport.map((r) =>
      [r.id, r.title, r.slug, r.status, String(r.viewsTotal), r.startsAt]
        .map((v) => `"${String(v).replaceAll('"', '""')}"`)
        .join(",")
    );
    const csv = [header.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "events-overview.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleEventLinkClick = (slug: string) => (e: React.MouseEvent<HTMLAnchorElement>): void => {
    const isModified = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;
    if (!isModified) pingView(slug, "table");
  };

  const handleBarClick = (_: unknown, index: number): void => {
    const d = topChart[index];
    if (!d) return;
    pingView(d.slug, "top-chart");
    startTransition(() => router.push(`/events/${d.slug}`));
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header + controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Event Overview</h1>
          <p className="text-muted-foreground">Pantau total pengunjung per event & status — live dan responsif.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            placeholder="Cari event atau slug…"
            value={q}
            onChange={(e): void => setQ(e.target.value)}
            className="w-full sm:w-64"
          />
          <Select value={status} onValueChange={(v: "all" | Status): void => setStatus(v)}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={(): void => toggleSort("visitors")} title="Sortir berdasarkan pengunjung">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Sort Pengunjung ({dir})
            </Button>
            <Button variant="outline" onClick={(): void => exportCsv(filtered)} title="Export CSV">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button
              variant="secondary"
              onClick={(): void => startTransition(() => router.refresh())}
              title="Refresh data"
              disabled={isPending}
            >
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />}
              {isPending ? "Refreshing…" : "Refresh"}
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm bg-gradient-to-br from-slate-50 to-transparent dark:from-slate-900/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Event</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{filtered.length}</div>
            <Separator className="my-3" />
            <div className="text-xs text-muted-foreground">
              Published: {filtered.filter((r) => r.status === "published").length}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm bg-gradient-to-br from-emerald-50 to-transparent dark:from-emerald-900/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pengunjung</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{formatNumber(totalVisitors)}</div>
            <Separator className="my-3" />
            <div className="text-xs text-muted-foreground">Rata-rata / Event: {formatNumber(Math.max(0, avgVisitors))}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm sm:col-span-2 bg-gradient-to-br from-sky-50 to-transparent dark:from-sky-900/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Distribusi Status</CardTitle>
          </CardHeader>
          <CardContent className="h-44">
            {statusSlices.every((d) => d.value === 0) ? (
              <div className="text-sm text-muted-foreground">Tidak ada data.</div>
            ) : (
              <div className="flex h-full items-center gap-4">
                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip />
                      <Pie data={statusSlices} dataKey="value" nameKey="name" outerRadius="80%" paddingAngle={2}>
                        {statusSlices.map((_s, idx) => (
                          <Cell key={String(idx)} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <ul className="text-xs min-w-[130px] space-y-1">
                  {statusSlices.map((s, i) => (
                    <li key={s.name} className="flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-2">
                        <span className="inline-block h-3 w-3 rounded" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                        {s.name}
                      </span>
                      <span className="tabular-nums">{s.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts + Controls */}
      <div className="grid gap-4 lg:grid-cols-5">
        {/* Left column: Top + Monthly big chart (stacked vertically) */}
        <div className="lg:col-span-2 flex flex-col gap-4 order-2 lg:order-1">
          {/* Top events (Bar) */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base">Top Events berdasarkan Pengunjung</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Tampilkan</span>
                <Select value={String(topLimit)} onValueChange={(v): void => setTopLimit(Number(v))}>
                  <SelectTrigger className="h-8 w-[84px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="h-72">
              {topChart.length === 0 ? (
                <div className="text-sm text-muted-foreground">Belum ada data.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topChart} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(v: number): [string, string] => [formatNumber(v), "Pengunjung"]} />
                    <Bar dataKey="visitors" onClick={handleBarClick} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* NEW: Tren Bulanan (grafik besar beda fungsi) */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base">Tren Bulanan</CardTitle>
              <div className="flex items-center gap-2">
                <Select value={monthlyMetric} onValueChange={(v: "visitors" | "events"): void => setMonthlyMetric(v)}>
                  <SelectTrigger className="h-8 w-[150px]">
                    <SelectValue placeholder="Metrik" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visitors">Total Pengunjung</SelectItem>
                    <SelectItem value="events">Jumlah Event</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={String(monthsWindow)} onValueChange={(v): void => setMonthsWindow(Number(v) as 6 | 12)}>
                  <SelectTrigger className="h-8 w-[84px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 bln</SelectItem>
                    <SelectItem value="12">12 bln</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(v: number): [string, string] => [
                      monthlyMetric === "visitors" ? formatNumber(v) : String(v),
                      monthlyMetric === "visitors" ? "Pengunjung" : "Event",
                    ]}
                  />
                  <Area type="monotone" dataKey={monthlyMetric} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Right: Table */}
        <Card className="lg:col-span-3 order-1 lg:order-2 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Daftar Event</CardTitle>
          </CardHeader>
          <CardContent className="pt-2 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={(): void => setCompact((c) => !c)} title="Toggle compact rows">
                  {compact ? "Normal" : "Compact"}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Rows</span>
                <Select value={String(pageSize)} onValueChange={(v): void => setPageSize(Number(v))}>
                  <SelectTrigger className="h-8 w-[84px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="12">12</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead className="cursor-pointer select-none" onClick={(): void => toggleSort("title")}>
                      Event {sort === "title" && (dir === "desc" ? "▼" : "▲")}
                    </TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                    <TableHead className="hidden lg:table-cell cursor-pointer select-none" onClick={(): void => toggleSort("date")}>
                      Tanggal Mulai {sort === "date" && (dir === "desc" ? "▼" : "▲")}
                    </TableHead>
                    <TableHead className="text-right cursor-pointer select-none" onClick={(): void => toggleSort("visitors")}>
                      Total Pengunjung {sort === "visitors" && (dir === "desc" ? "▼" : "▲")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paged.map((it) => (
                    <TableRow key={it.id} className={`hover:bg-muted/50 ${compact ? "[&>td]:py-1.5" : ""}`}>
                      <TableCell className="font-medium">
                        <Link href={`/events/${it.slug}`} className="hover:underline" onClick={handleEventLinkClick(it.slug)}>
                          {it.title}
                        </Link>
                        <div className="text-xs text-muted-foreground">@{it.slug}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell align-middle">
                        <StatusBadge status={it.status} />
                      </TableCell>
                      <TableCell className="hidden lg:table-cell align-middle">
                        {new Date(it.startsAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right align-middle">{formatNumber(it.viewsTotal)}</TableCell>
                    </TableRow>
                  ))}
                  {paged.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4}>Belum ada event.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-muted-foreground">
                Page <span className="tabular-nums">{page}</span> / <span className="tabular-nums">{totalPages}</span> •{" "}
                <span className="tabular-nums">{filtered.length}</span> items
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={(): void => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
                  Prev
                </Button>
                <Button variant="outline" size="sm" onClick={(): void => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewClient;
