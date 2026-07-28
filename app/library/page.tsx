import { AppShell } from "@/components/layout/AppShell";
import { AssetGrid } from "@/components/library/AssetGrid";
import { getCurrentUser } from "@/lib/auth";
import { listAssets } from "@/lib/data";

export const metadata = { title: "Libreria asset" };

export default async function LibraryPage() {
  const user = await getCurrentUser();
  const assets = await listAssets();

  return (
    <AppShell user={user}>
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl">Libreria asset</h1>
          <p className="text-sm text-muted">Mappe, musiche, note e prompt IA di tutte le tue campagne.</p>
        </div>
        <AssetGrid assets={assets} />
      </div>
    </AppShell>
  );
}
