import type { AppUser } from "@/lib/types";
import { TopBar } from "@/components/layout/TopBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";

export function AppShell({ user, children }: { user: AppUser; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar user={user} />
      <div className="flex flex-1">
        <Sidebar className="hidden md:flex" />
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
