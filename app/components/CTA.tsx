// app/components/CTA.tsx
export default function CTA() {
  return (
    <section id="community" className="bg-white py-16">
      <div className="section text-center">
        <h2 className="h2">Prêt à réviser autrement ?</h2>
        <p className="p mt-2">Rejoins la communauté Skolr et démarre aujourd’hui.</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <a href="https://discord.gg/ton-invite" className="btn btn-ghost">Rejoindre le Discord</a>
          <a href="#pricing" className="btn btn-primary">Voir les packs</a>
        </div>
      </div>
    </section>
  );
}
