'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';

export default function LogoutButton() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleLogout(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (signingOut) return;

    setSigningOut(true);

    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to logout');

      // optional: kasih notifikasi cepat
      toast.success('Logged out');
      // Tampilkan overlay sebentar biar smooth, lalu redirect
      setTimeout(() => router.replace('/login'), 1000);
    } catch {
      setSigningOut(false);
      toast.error('Gagal logout. Coba lagi.');
    }
  }

  return (
    <>
      {signingOut && <FullScreenSignOut />}

      <button
        onClick={handleLogout}
        className={[
          'flex w-full items-center gap-3 rounded-md border text-sm transition cursor-pointer',
          'px-2 lg:px-3 py-2 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring',
        ].join(' ')}
        title="Logout"
      >
        <LogOut className="h-4 w-4 shrink-0"/>
        <span className="hidden lg:inline ">Logout</span>
      </button>
    </>
  );
}

/** Full-screen overlay transition saat logout */
function FullScreenSignOut() {
  return (
    <div
      className="fixed inset-0 z-[9999] grid place-items-center bg-gradient-to-br from-background to-muted/60 backdrop-blur-sm"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-6">
        {/* Spinner cincin bergradasi */}
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full bg-[conic-gradient(var(--tw-gradient-stops))] from-primary via-primary/40 to-primary animate-spin" />
          <div className="absolute inset-2 rounded-full bg-background" />
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">Menyelesaikan sesi…</p>
          <p className="text-base font-medium animate-pulse">Signing out</p>
        </div>
      </div>
    </div>
  );
}
