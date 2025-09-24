import LoginForm from '@/components/forms/LoginForm';
import { Shield } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="min-h-dvh grid place-items-center px-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-sm space-y-6">
        {/* Branding / Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
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
