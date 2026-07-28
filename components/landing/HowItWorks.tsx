const STEPS = [
  { n: "01", title: "Crea campagna", description: "Nome, genere, tono e sistema di gioco: in meno di un minuto." },
  { n: "02", title: "Forgia una scena", description: "Scegli una mappa, posiziona i token, imposta l'atmosfera." },
  { n: "03", title: "Invita il gruppo", description: "Condividi codice o link: i giocatori entrano subito nella stanza." },
  { n: "04", title: "Gioca", description: "Dadi, note, chat e IA a portata di mano durante la sessione." },
];

export function HowItWorks() {
  return (
    <section className="border-y border-border bg-surface/40 py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <h2 className="mb-10 text-center font-display text-2xl font-semibold sm:text-3xl">Come funziona</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div key={step.n} className="space-y-2">
              <span className="font-display text-3xl font-bold text-accent-purple/60">{step.n}</span>
              <h3 className="font-display text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
