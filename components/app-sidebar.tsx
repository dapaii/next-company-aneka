"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { Calendar, Home, PlusCircle, Shield, Settings } from "lucide-react";
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
import { useEffect, useState } from "react";
import LogoutButton from "./forms/LogoutButton";

// tipe nav
type NavItem = { title: string; url: string; icon: LucideIcon };

const items: NavItem[] = [
  { title: "Home",      url: "/dashboard",            icon: Home },
  { title: "Events",    url: "/dashboard/events",     icon: Calendar },
  { title: "New Event", url: "/dashboard/events/new", icon: PlusCircle },
  { title: "Settings",  url: "/dashboard/settings",   icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  // >>> Fix hydration: hindari Date() di render SSR
  const [year, setYear] = useState<string>("");
  useEffect(() => {
    setYear(String(new Date().getFullYear()));
  }, []);
  // <<<

  return (
    <Sidebar className="border-r">
      {/* BRAND / HEADER */}
      <div className="px-3 py-4 border-b">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold">Admin Panel</span>
            <span className="text-xs text-muted-foreground">Event Manager</span>
          </div>
        </Link>
      </div>

      <SidebarContent className="py-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wide text-muted-foreground">
            Navigation
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active =
                  pathname === item.url || pathname?.startsWith(item.url + "/");

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      // kalau komponenmu belum support prop ini, hapus saja
                      isActive={active}
                      className={`transition-all hover:bg-muted ${
                        active ? "bg-muted font-medium" : "font-normal"
                      }`}
                    >
                      <Link href={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <form action="/api/auth/logout" method="post" className="w-full">
          <LogoutButton />
        </form>

        {/* footer kecil */}
        <div className="px-3 pt-1">
          {/* suppressHydrationWarning: jaga-jaga kalau year masih kosong saat SSR */}
          <p className="text-[10px] text-muted-foreground" suppressHydrationWarning>
            © {year || ""} PT.Aneka Distribusi Indonesia
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
