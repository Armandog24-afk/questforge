import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function CTASection() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-20 text-center md:px-8">
      <h2 className="font-display text-3xl font-bold sm:text-4xl">Apri il tavolo.</h2>
      <p className="mx-auto mt-3 max-w-xl text-muted">
        Nessuna installazione, nessun regolamento da configurare. Solo la tua storia, pronta per essere giocata.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/create">Crea una campagna</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/auth">Accedi</Link>
        </Button>
      </div>
    </section>
  );
}
