import LoginForm from "@/components/forms/LoginForm";
import { Shield } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="min-h-dvh relative grid place-items-center px-4">
      {/* subtle animated gradient bg */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(45rem_45rem_at_50%_-10%,hsl(var(--primary)/0.08),transparent),radial-gradient(35rem_35rem_at_110%_10%,hsl(var(--primary)/0.06),transparent),linear-gradient(to_bottom_right,hsl(var(--background)),hsl(var(--muted)))]" />

      <div className="w-full max-w-sm space-y-6">
        {/* Branding / Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 shadow-sm">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Panel</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to manage events and dashboard content.
          </p>
        </div>

        {/* Form */}
        <LoginForm />

        {/* Footer / Info */}
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} PT. Aneka Distribusi Indonesia. All rights reserved.
        </p>
      </div>
    </main>
  );
}
