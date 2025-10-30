// app/components/Hero.tsx
import Logo from "./Logo";

export default function Hero() {
  return (
    <section className="section grid gap-10 pt-14 pb-16 md:grid-cols-2 md:items-center">
      <div>
        <div className="badge mb-4">Nouveau • IA + Notion + Discord</div>
        <h1 className="font-poppins text-4xl md:text-5xl font-semibold tracking-tight">
          Révise plus vite. <span className="bg-skolr-gradient bg-clip-text text-transparent">Apprends plus malin.</span>
        </h1>
        <p className="p mt-4 max-w-xl">
          Des fiches de révision claires et intelligentes, propulsées par l’IA. Disponibles sur Notion et au sein d’une communauté Discord bienveillante.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a href="#pricing" className="btn btn-primary">Découvrir les packs</a>
          <a href="https://discord.gg/ton-invite" className="btn btn-ghost">Rejoindre le Discord</a>
        </div>
        <p className="mt-3 text-xs text-ink/60">Skolr est en bêta — mises à jour hebdomadaires.</p>
      </div>

      <div className="relative">
        <div className="card">
          <div className="flex items-center gap-3">
            <Logo withText={false} />
            <div>
              <p className="font-medium">Pack Bac — Notion</p>
              <p className="text-sm text-ink/60">Chapitres, notions, quiz + IA</p>
            </div>
          </div>
          <div className="mt-4 h-40 rounded-xl bg-blue-weak" />
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="h-16 rounded-lg bg-surface border border-blue-weak"></div>
            <div className="h-16 rounded-lg bg-surface border border-blue-weak"></div>
            <div className="h-16 rounded-lg bg-surface border border-blue-weak"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
