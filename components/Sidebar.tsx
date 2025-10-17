"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  Calendar,
  Home,
  PlusCircle,
  Shield,
  Settings,
  BarChart3,     
  Search,
  Lightbulb,
  Share2,
  UploadCloud,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useEffect, useMemo, useRef, useState } from "react";
import LogoutButton from "./forms/LogoutButton";
import { cn } from "@/lib/utils";

/* ---------------- Types ---------------- */
export type NavItem = { title: string; url: string; icon: LucideIcon };

/* ---------------- Nav Items (diexport) ---------------- */
export const NAV_ITEMS: NavItem[] = [
  { title: "Home", url: "/dashboard", icon: Home },
  { title: "Overview", url: "/dashboard/overview", icon: BarChart3 }, // <- ikon baru
  { title: "Events", url: "/dashboard/events", icon: Calendar },
  { title: "New Event", url: "/dashboard/events/new", icon: PlusCircle },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

/* ---------------- Helpers ---------------- */
const esc = (s: string): string => s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");

/** Kumpulan quick tips: akan dipilih kontekstual + auto-rotate */
const BASE_TIPS = [
  { icon: Search, text: "Gunakan kolom pencarian di Overview untuk filter cepat berdasarkan judul/slug." },
  { icon: Share2, text: "Klik ‘Bagikan’ di halaman detail untuk copy link event ke clipboard." },
  { icon: UploadCloud, text: "Tambahkan 3–5 foto agar galeri terlihat seimbang di berbagai ukuran layar." },
  { icon: Lightbulb, text: "Status ‘Published’ otomatis tampil di halaman publik /events." },
];

const TIPS_BY_ROUTE: Array<{ test: RegExp; icon: LucideIcon; text: string }> = [
  { test: /^\/dashboard\/overview(?:\/|$)/, icon: BarChart3, text: "Coba ubah metrik ‘Tren Bulanan’ antara Total Pengunjung / Jumlah Event." },
  { test: /^\/dashboard\/events(?:\/|$)/,    icon: Calendar,  text: "Klik baris event untuk membuka detail cepat. Gunakan sort judul/tanggal/visitor." },
  { test: /^\/dashboard\/events\/new(?:\/|$)/, icon: PlusCircle, text: "Isi lokasi dengan format jelas agar tombol ‘Buka di Google Maps’ bekerja." },
  { test: /^\/dashboard(?:\/|$)/,            icon: Home,      text: "Butuh ringkasan? Lihat ‘Overview’ untuk grafik status & top events." },
];

export function AppSidebar() {
  const pathname = usePathname() ?? "";

  const [year, setYear] = useState<string>("");
  useEffect(() => setYear(String(new Date().getFullYear())), []);

  const items = useMemo(() => NAV_ITEMS, []);
  const activeUrl = useMemo(() => {
    const matches = items.filter((it) =>
      new RegExp(`^${esc(it.url)}(?:/|$)`).test(pathname)
    );
    if (matches.length === 0) return "";
    return matches.sort((a, b) => b.url.length - a.url.length)[0]!.url;
  }, [items, pathname]);

  // ---------- Quick Tip (kontekstual + rotasi) ----------
  const contextualTip = useMemo(() => {
    const found = TIPS_BY_ROUTE.find((t) => t.test.test(pathname));
    return found ?? { icon: Lightbulb, text: "Kelola event lebih cepat dari Sidebar di sebelah kiri." };
  }, [pathname]);

  const tipsToRotate = useMemo(() => [contextualTip, ...BASE_TIPS], [contextualTip]);

  const [tipIdx, setTipIdx] = useState(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    setTipIdx(0); // reset saat berpindah route
  }, [pathname]);

  useEffect(() => {
    const id = setInterval(() => {
      if (!pausedRef.current) {
        setTipIdx((i) => (i + 1) % tipsToRotate.length);
      }
    }, 6000);
    return () => clearInterval(id);
  }, [tipsToRotate.length]);

  const TipIcon = tipsToRotate[tipIdx]?.icon ?? Lightbulb;
  const tipText = tipsToRotate[tipIdx]?.text ?? "Kelola event Anda dengan mudah.";

  return (
    <Sidebar className="border-r border-border bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40">
      {/* BRAND / HEADER */}
      <div className="px-3 py-4 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-3 group" prefetch={false}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/10 group-hover:ring-primary/20 transition">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight group-hover:underline underline-offset-4">
              Admin Panel
            </span>
            <span className="text-[11px] text-muted-foreground">Event Manager</span>
          </div>
        </Link>
      </div>

      <SidebarContent className="py-3">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-[11px] uppercase tracking-wider text-muted-foreground">
            Navigation
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = item.url === activeUrl;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="group w-full">
                      <Link
                        href={item.url}
                        prefetch={false}
                        className={cn(
                          "relative flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                          "hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                          isActive && "bg-muted"
                        )}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {/* Left active strip */}
                        <span
                          aria-hidden
                          className={cn(
                            "absolute left-1.5 h-5 w-1 rounded-full",
                            isActive ? "bg-primary" : "bg-transparent"
                          )}
                        />
                        <item.icon
                          className={cn(
                            "h-4 w-4 shrink-0 transition-opacity",
                            isActive ? "opacity-100" : "opacity-80 group-hover:opacity-100"
                          )}
                        />
                        <span className={cn("truncate text-sm", isActive ? "font-medium" : "font-normal")}>
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Tip (dengan ikon & auto-rotate) */}
        <div className="px-3 pt-2">
          <div
            className="rounded-xl border bg-card text-card-foreground shadow-sm"
            onMouseEnter={() => (pausedRef.current = true)}
            onMouseLeave={() => (pausedRef.current = false)}
          >
            <div className="p-3 flex items-start gap-2">
              <TipIcon className="mt-0.5 h-4 w-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Quick tip</p>
                <p className="mt-1 text-sm leading-snug">{tipText}</p>
              </div>
            </div>
          </div>
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t border-border">
        <form action="/api/auth/logout" method="post" className="w-full px-3 py-2">
          <LogoutButton />
        </form>
        <div className="px-3 pb-3">
          <p className="text-[10px] text-muted-foreground" suppressHydrationWarning>
            © {year || ""} PT. Aneka Distribusi Indonesia
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
