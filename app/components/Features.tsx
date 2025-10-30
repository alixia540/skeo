// app/components/Features.tsx
import { FaRobot, FaBookOpen, FaComments } from "react-icons/fa";

const items = [
  {
    icon: <FaBookOpen className="text-primary" />,
    title: "Fiches intelligentes",
    desc: "Des fiches claires, structurées et prêtes à réviser pour chaque chapitre.",
  },
  {
    icon: <FaRobot className="text-primary" />,
    title: "IA intégrée",
    desc: "Résumés, explications, quiz et plans en 1 clic pour apprendre plus vite.",
  },
  {
    icon: <FaComments className="text-primary" />,
    title: "Communauté d’entraide",
    desc: "Pose ta question sur Discord, obtiens une réponse — humaine ou IA — rapidement.",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-blue-weak/40 py-16">
      <div className="section">
        <h2 className="h2">Pourquoi choisir Skolr ?</h2>
        <p className="p mt-2">Ton allié de révision nouvelle génération.</p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {items.map((it) => (
            <div key={it.title} className="card">
              <div className="mb-3 text-2xl">{it.icon}</div>
              <h3 className="font-medium text-lg">{it.title}</h3>
              <p className="p mt-2">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
