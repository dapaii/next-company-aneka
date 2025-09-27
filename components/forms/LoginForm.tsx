"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, LogIn, Mail, Lock } from "lucide-react";

function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export default function LoginForm() {
  const router = useRouter();

  // form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  // ui state
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  // Prefill email jika pernah dicentang "remember me"
  useEffect(() => {
    try {
      const saved = localStorage.getItem("rememberedEmail");
      if (saved) {
        setEmail(saved);
        setRemember(true);
      }
    } catch {
      // ignore
    }
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading || redirecting) return;

    if (!email) return toast.error("Email wajib diisi");
    if (!isEmail(email)) return toast.error("Format email tidak valid");
    if (password.length < 6) return toast.error("Password minimal 6 karakter");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password, remember }),
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
      });

      if (res.ok) {
        // simpan HANYA email (bukan password)
        try {
          if (remember) localStorage.setItem("rememberedEmail", email);
          else localStorage.removeItem("rememberedEmail");
        } catch {}

        toast.success(`Selamat datang, ${email}! 🎉`);
        setRedirecting(true);
        setTimeout(() => router.replace("/dashboard"), 800);
      } else {
        let message = "Login gagal. Periksa email/password.";
        try {
          const body = (await res.json()) as { error?: unknown };
          if (typeof body?.error === "string" && body.error.trim()) message = body.error;
        } catch {}
        toast.error(message);
      }
    } catch {
      toast.error("Error jaringan. Coba lagi sebentar lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {redirecting && <FullScreenTransition />}

      <Card className="w-full max-w-sm border shadow-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Enter your credentials to access the dashboard</CardDescription>
        </CardHeader>

        {/* name + autoComplete penting agar password manager paham */}
        <form onSubmit={onSubmit} className="flex flex-col gap-6" autoComplete="on" noValidate>
          <CardContent className="flex flex-col gap-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  inputMode="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  required
                  disabled={loading || redirecting}
                  className="pl-9"
                  aria-invalid={email.length > 0 && !isEmail(email)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  disabled={loading || redirecting}
                  className="pl-9 pr-10"
                  aria-invalid={password.length > 0 && password.length < 6}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground/80 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  aria-label={showPw ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember */}
            <div className="flex items-center justify-between">
              <label className="inline-flex select-none items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  name="remember"
                  className="h-4 w-4 accent-primary"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  disabled={loading || redirecting}
                />
                Remember me
              </label>
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full font-semibold" disabled={loading || redirecting}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Logging in…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Login
                </span>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </>
  );
}

/* =========================
   Full-screen transition overlay
========================= */
function FullScreenTransition() {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-gradient-to-br from-background to-muted/60 backdrop-blur-sm"
      aria-live="polite"
      aria-busy="true"
      role="status"
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 animate-spin rounded-full bg-[conic-gradient(var(--tw-gradient-stops))] from-primary via-primary/40 to-primary" />
          <div className="absolute inset-2 rounded-full bg-background shadow-inner" />
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Menyiapkan dashboard…</p>
          <p className="text-base font-medium animate-pulse">Redirecting</p>
        </div>
      </div>
    </div>
  );
}
