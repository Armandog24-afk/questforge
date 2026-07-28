"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ScrollText, Users, Library, Store, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/campaigns", label: "Campagne", icon: ScrollText },
  { href: "/characters", label: "Personaggi", icon: Users },
  { href: "/library", label: "Libreria asset", icon: Library },
  { href: "/forge-store", label: "Forge Store", icon: Store },
  { href: "/profile", label: "Profilo", icon: UserCircle },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  return (
    <nav className={cn("flex w-60 shrink-0 flex-col gap-1 border-r border-border bg-surface/60 p-4", className)}>
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname?.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-foreground",
              active && "bg-accent-purple/15 text-accent-purple",
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
