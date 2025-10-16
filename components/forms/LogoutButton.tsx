'use client';

import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils'; // pastikan kamu punya util ini; kalau tidak, bisa ganti jadi clsx

export default function LogoutButton() {
  const [signingOut, setSigningOut] = useState(false);

  async function handleLogout(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (signingOut) return;
    setSigningOut(true);

    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 6000);

      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        cache: 'no-store',
        headers: { 'content-type': 'application/json' },
        signal: ctrl.signal,
      });

      clearTimeout(t);
      if (!res.ok) throw new Error('non-2xx');

      toast.success('Logged out');
      setTimeout(() => {
        window.location.assign('/login'); // hard redirect
      }, 500);
      return;
    } catch {
      // Fallback: native form submit (browser pasti proses cookie)
      try {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/api/auth/logout';
        form.style.display = 'none';
        document.body.appendChild(form);
        form.submit();
      } catch {
        setSigningOut(false);
        toast.error('Gagal logout. Coba lagi.');
      }
    }
  }

  return (
    <>
      {signingOut && <FullScreenSignOut />}

      <button
        type="button"
        onClick={handleLogout}
        className={cn(
          'flex w-full items-center gap-3 rounded-md border text-sm transition',
          'px-2 lg:px-3 py-2 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring',
          signingOut ? 'cursor-wait opacity-90' : 'cursor-pointer'
        )}
        title="Logout"
        // Hindari boolean "false" pada SSR -> tidak render atribut saat false
        aria-busy={signingOut ? true : undefined}
        // optional: untuk screen reader
        aria-live="polite"
      >
        <span className="relative inline-flex h-4 w-4 items-center justify-center">
          {/* ikon normal */}
          <LogOut className={cn('h-4 w-4 transition-opacity', signingOut && 'opacity-0')} />
          {/* spinner mini saat proses */}
          {signingOut && (
            <span
              aria-hidden
              className="absolute inset-0 rounded-full border-2 border-current border-t-transparent motion-safe:animate-spin"
            />
          )}
        </span>
        <span className="hidden lg:inline">{signingOut ? 'Signing out…' : 'Logout'}</span>
      </button>
    </>
  );
}

/** Full-screen overlay transition saat logout */
function FullScreenSignOut() {
  return (
    <div
      className={cn(
        'fixed inset-0 z-[9999] grid place-items-center',
        'bg-background/60 backdrop-blur-sm transition-opacity duration-200'
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative h-16 w-16">
          {/* glow pulsing */}
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-md motion-safe:animate-pulse" />
          {/* ring luar */}
          <div className="absolute inset-0 rounded-full border-4 border-primary/30 border-t-transparent motion-safe:animate-spin" />
          {/* ring dalam (reverse) */}
          <div className="absolute inset-2 rounded-full border-4 border-primary/60 border-b-transparent motion-safe:animate-spin [animation-direction:reverse]" />
          {/* inti */}
          <div className="absolute inset-4 rounded-full bg-background" />
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">Menyelesaikan sesi…</p>
          <p className="text-base font-medium motion-safe:animate-pulse">Signing out</p>
        </div>
      </div>
    </div>
  );
}
