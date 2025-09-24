import { type ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-dvh w-full bg-gradient-to-br from-background to-muted/30">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-20 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
            <div className="container mx-auto flex items-center gap-3 px-4 py-3">
              <SidebarTrigger />
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Admin</span>
                <span className="text-sm">/</span>
                <h1 className="text-sm font-semibold">Dashboard</h1>
              </div>
              <div className="ml-auto flex items-center gap-2">
                {/* taruh quick actions di sini kalau perlu */}
              </div>
            </div>
          </header>

          <main className="container mx-auto w-full px-4 py-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
