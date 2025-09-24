'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // loading = proses kirim request; redirecting = show transition screen ke dashboard
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading || redirecting) return;
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        toast.success(`Selamat datang, ${email}`);
        // TAMPILKAN LAYAR TRANSISI
        setRedirecting(true);
        // beri sedikit waktu biar animasi kebaca, lalu masuk dashboard
        setTimeout(() => router.replace('/dashboard'), 2000);
      } else {
        const { error } = await res.json().catch(() => ({ error: 'Login gagal' }));
        toast.error(error || 'Login gagal. Periksa email/password.');
      }
    } catch {
      toast.error('Error jaringan. Coba lagi sebentar lagi.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Fullscreen transition overlay — hanya muncul SETELAH login sukses */}
      {redirecting && <FullScreenTransition />}

      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-6" autoComplete="on">
          <CardContent className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
                disabled={loading || redirecting}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                disabled={loading || redirecting}
              />
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full" disabled={loading || redirecting}>
              {loading ? 'Logging in…' : 'Login'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </>
  );
}

/* =========================
   Full-screen transition overlay
   - gradient background
   - spinner cincin bergradasi (conic)
   - teks animasi
========================= */
function FullScreenTransition() {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-gradient-to-br from-background to-muted/60 backdrop-blur-sm"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-6">
        {/* Ring spinner gradient */}
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full bg-[conic-gradient(var(--tw-gradient-stops))] from-primary via-primary/40 to-primary animate-spin" />
          <div className="absolute inset-2 rounded-full bg-background" />
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">Menyiapkan dashboard…</p>
          <p className="text-base font-medium animate-pulse">Redirecting</p>
        </div>
      </div>
    </div>
  );
}
