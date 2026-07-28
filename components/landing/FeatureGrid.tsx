import { Map, Users2, Dice5, Sparkles, Music2, NotebookPen } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

const FEATURES = [
  { icon: Map, title: "Mappe", description: "Carica, genera o scegli tra mappe demo pronte all'uso." },
  { icon: Users2, title: "Token", description: "Trascina i token sulla mappa, con permessi per Master e giocatori." },
  { icon: Dice5, title: "Dadi", description: "Formule personalizzate, storico dei tiri, critici in evidenza." },
  { icon: Sparkles, title: "IA", description: "Genera scene, PNG, oggetti e incontri in pochi secondi." },
  { icon: Music2, title: "Musica", description: "Atmosfera sonora per ogni scena, con categorie e mood." },
  { icon: NotebookPen, title: "Note", description: "Note private per il Master e condivise per il gruppo." },
];

export function FeatureGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-8">
      <h2 className="mb-8 text-center font-display text-2xl font-semibold sm:text-3xl">
        Tutto quello che serve al tavolo
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <Card key={title} className="transition-colors hover:border-accent-purple/40">
            <CardHeader>
              <span className="mb-2 flex size-10 items-center justify-center rounded-xl bg-accent-purple/15 text-accent-purple">
                <Icon className="size-5" />
              </span>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
