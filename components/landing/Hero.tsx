import Link from "next/link";
import { Sparkles, Dice5, Map as MapIcon } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { Button } from "@/components/ui/Button";
import { DEMO_MAPS } from "@/lib/demo-maps";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_-10%,rgba(124,58,237,0.18),transparent_50%),radial-gradient(circle_at_85%_10%,rgba(37,99,235,0.14),transparent_45%)]" />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:py-24 md:grid-cols-2 md:items-center md:px-8">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-purple/30 bg-accent-purple/10 px-3 py-1 text-xs font-medium text-[#c4b5fd]">
            <Sparkles className="size-3.5" /> {BRAND.payoff}
          </span>
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            {BRAND.hero}
          </h1>
          <p className="max-w-lg text-lg text-muted">{BRAND.description}</p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/create">Crea una campagna</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/dashboard">Prova demo</Link>
            </Button>
          </div>
          <div className="flex items-center gap-6 pt-2 text-xs text-muted">
            <span className="flex items-center gap-1.5"><Dice5 className="size-4" /> Dadi personalizzabili</span>
            <span className="flex items-center gap-1.5"><MapIcon className="size-4" /> Mappe e token</span>
          </div>
        </div>
        <div className="relative">
          <div className="qf-glow overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface shadow-2xl">
            <div
              className="qf-map-checker aspect-[4/3] w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${DEMO_MAPS.crypt})` }}
            >
              <div className="flex h-full flex-col justify-between p-4">
                <div className="flex justify-between">
                  <span className="rounded-full bg-black/50 px-2.5 py-1 text-xs text-white backdrop-blur">
                    Cripta delle Lanterne
                  </span>
                  <span className="rounded-full bg-black/50 px-2.5 py-1 text-xs text-white backdrop-blur">
                    4 online
                  </span>
                </div>
                <div className="flex gap-2">
                  {["#ef4444", "#7c3aed", "#22c55e"].map((c) => (
                    <span
                      key={c}
                      className="flex size-9 items-center justify-center rounded-full border-2 border-white/70 text-xs font-bold text-white shadow"
                      style={{ backgroundColor: c }}
                    >
                      ●
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
