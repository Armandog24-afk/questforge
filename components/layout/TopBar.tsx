import Link from "next/link";
import { Dice5, Menu } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { Button } from "@/components/ui/Button";
import type { AppUser } from "@/lib/types";
import { initials } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/dashboard" className={`flex items-center gap-2 ${className ?? ""}`}>
      <span className="flex size-8 items-center justify-center rounded-lg bg-accent-purple/20 text-accent-purple qf-glow">
        <Dice5 className="size-4" />
      </span>
      <span className="font-display text-lg font-semibold tracking-wide text-foreground">{BRAND.name}</span>
    </Link>
  );
}

export function TopBar({ user, onMenuClick }: { user: AppUser; onMenuClick?: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Apri menu"
          className="rounded-lg p-2 text-muted hover:bg-surface md:hidden"
        >
          <Menu className="size-5" />
        </button>
        <Logo />
      </div>
      <div className="flex items-center gap-3">
        <Button asChild variant="secondary" size="sm" className="hidden sm:inline-flex">
          <Link href="/library">Libreria</Link>
        </Button>
        <Button asChild variant="secondary" size="sm" className="hidden sm:inline-flex">
          <Link href="/forge-store">Forge Store</Link>
        </Button>
        <Link
          href="/profile"
          className="flex size-9 items-center justify-center rounded-full bg-accent-purple/20 text-sm font-semibold text-accent-purple"
          aria-label="Profilo"
        >
          {initials(user.name)}
        </Link>
      </div>
    </header>
  );
}
