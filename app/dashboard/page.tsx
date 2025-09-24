import { getSession } from '@/lib/auth';

export default async function DashboardPage() {
  const sess = await getSession();
  return (
    <main className="p-6">
      <h1 className="text-xl font-bold">Halo {sess?.email} 👋</h1>
      <p className="mt-2">Kelola event di menu Events.</p>
    </main>
  );
}
