"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar, NAV_ITEMS } from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator,} from "@/components/ui/command";

/**
 * Perubahan penting anti-hydration:
 * - Tombol Search pakai <button> biasa (bukan shadcn <Button>), jadi markup SSR/CSR identik.
 * - Hindari class merge runtime yang bikin perbedaan di server vs client.
 * - Shortcut ⌘/Ctrl+K tetap jalan.
 */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [openSearch, setOpenSearch] = useState(false);

  // ⌘/Ctrl+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const ae = document.activeElement as HTMLElement | null;
      const typing =
        ae && (ae.tagName === "INPUT" || ae.tagName === "TEXTAREA" || ae.isContentEditable);
      if (typing) return;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpenSearch((s) => !s);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const items = useMemo(() => NAV_ITEMS, []);

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-dvh w-full bg-gradient-to-br from-background to-muted/30">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-20 border-b border-border bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
            <div className="container mx-auto flex items-center gap-3 px-4 py-3">
              {/* Satu-satunya toggle sidebar */}
              <SidebarTrigger />

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Admin</span>
                <span className="text-sm">/</span>
                <h1 className="text-sm font-semibold">Dashboard</h1>
              </div>

              <div className="ml-auto flex items-center gap-2">
                {/* Tombol Search: plain button, hydration-safe */}
                <button
                  type="button"
                  aria-label="Open search (Ctrl/⌘+K)"
                  onClick={() => setOpenSearch(true)}
                  className="inline-flex h-8 items-center gap-2 rounded-md border px-2.5 text-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Search aria-hidden className="h-4 w-4" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </div>
          </header>

          <main className="container mx-auto w-full px-4 py-6">
            {children}
          </main>
        </div>
      </div>

      {/* Command Palette */}
      <CommandDialog open={openSearch} onOpenChange={setOpenSearch}>
        <CommandInput placeholder="Search pages, actions..." />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>

          <CommandGroup heading="Go to">
            {items.map((it) => (
              <CommandItem
                key={it.url}
                onSelect={() => {
                  setOpenSearch(false);
                  router.push(it.url);
                }}
              >
                <it.icon className="mr-2 h-4 w-4" />
                <span>{it.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Actions">
            <CommandItem
              onSelect={() => {
                setOpenSearch(false);
                router.push("/dashboard/events/new");
              }}
            >
              <Search className="mr-2 h-4 w-4 rotate-90" />
              <span>Create new event</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </SidebarProvider>
  );
}
