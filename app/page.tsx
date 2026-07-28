import { Ghost, Skull, Rocket, Cpu, Search, Wand2 } from "lucide-react";
import { Hero } from "@/components/landing/Hero";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { CTASection } from "@/components/landing/CTASection";
import { Badge } from "@/components/ui/Badge";

const SYSTEMS = [
  { icon: Wand2, label: "Fantasy" },
  { icon: Ghost, label: "Horror" },
  { icon: Cpu, label: "Cyberpunk" },
  { icon: Rocket, label: "Sci-fi" },
  { icon: Search, label: "Investigativo" },
  { icon: Skull, label: "Homebrew" },
];

export default function LandingPage() {
  return (
    <div className="flex-1">
      <Hero />
      <HowItWorks />
      <FeatureGrid />

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-8">
        <h2 className="mb-2 text-center font-display text-2xl font-semibold sm:text-3xl">Per qualsiasi GDR</h2>
        <p className="mx-auto mb-8 max-w-xl text-center text-muted">
          QuestForge non automatizza un regolamento specifico: funziona con D&D, Pathfinder, Cyberpunk RED, Vampiri,
          Call of Cthulhu, Not the End, OSR o il tuo sistema homebrew.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {SYSTEMS.map(({ icon: Icon, label }) => (
            <Badge key={label} variant="purple" className="gap-2 px-4 py-2 text-sm">
              <Icon className="size-4" /> {label}
            </Badge>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface/40 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center md:px-8">
          <h2 className="mb-3 font-display text-2xl font-semibold sm:text-3xl">Non un VTT complicato</h2>
          <p className="text-muted">
            QuestForge non è un clone di Roll20 o Foundry. È uno strumento leggero per visualizzare la scena,
            costruire atmosfera e supportare il Master — senza settimane di configurazione, adatto anche a gruppi
            non tecnici e a sessioni ibride online/al tavolo.
          </p>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
