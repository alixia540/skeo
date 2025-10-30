// app/components/Pricing.tsx
const plans = [
  {
    name: "Pack Brevet",
    price: "14,99 €",
    features: ["Fiches Notion", "Quiz IA", "Accès Discord"],
    cta: "Obtenir le pack",
    href: "#checkout-brevet",
  },
  {
    name: "Pack Bac",
    price: "24,99 €",
    features: ["Fiches + IA", "Corrections modèles", "Accès Discord"],
    cta: "Obtenir le pack",
    highlighted: true,
    href: "#checkout-bac",
  },
  {
    name: "All Access",
    price: "49 €",
    features: ["Tout illimité", "Mises à jour", "Bonus premium"],
    cta: "Choisir All Access",
    href: "#checkout-all",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-16">
      <div className="section">
        <h2 className="h2">Choisis ton format de réussite</h2>
        <p className="p mt-2">Des offres simples, pensées pour réussir.</p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`card flex flex-col ${p.highlighted ? "border-primary shadow-soft" : ""}`}
            >
              {p.highlighted && <span className="badge mb-4">Populaire</span>}
              <h3 className="font-poppins text-xl font-semibold">{p.name}</h3>
              <p className="mt-2 text-3xl font-semibold">{p.price}</p>
              <ul className="mt-4 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="p">• {f}</li>
                ))}
              </ul>
              <a href={p.href} className="btn btn-primary mt-6"> {p.cta} </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
