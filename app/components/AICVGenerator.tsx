// @ts-nocheck
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

type FormCore = {
  roleTarget: string;
  industry: string;
  strengths: string;
  tone: "Sobre" | "Moderne" | "Créatif";
  color: "Bleu" | "Vert" | "Violet" | "Gris";
  fullName: string;
  email: string;
  phone: string;
  city: string;
  linkedin?: string;
  experienceLevel?: string;
  jobType?: string;
  languages?: string;
};

const initial: FormCore = {
  roleTarget: "",
  industry: "",
  strengths: "",
  tone: "Moderne",
  color: "Bleu",
  fullName: "",
  email: "",
  phone: "",
  city: "",
  linkedin: "",
  experienceLevel: "",
  jobType: "",
  languages: "",
};

export default function AICVGenerator() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormCore>(initial);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cv, setCv] = useState("");
  const [error, setError] = useState<string>("");

  const previewRef = useRef<HTMLDivElement>(null);

  const handleChange = (k: keyof FormCore, v: string) =>
    setData((d) => ({ ...d, [k]: v }));

  const onSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = Array.from(e.target.files || []);
    if (!f.length) return;
    setFiles((prev) => [...prev, ...f]);
  };

  const removeFile = (i: number) =>
    setFiles((prev) => prev.filter((_, idx) => idx !== i));

  useEffect(() => {
    if (!loading) return;
    setProgress(10);
    const id = setInterval(() => {
      setProgress((p) => (p < 90 ? p + Math.random() * 6 : p));
    }, 400);
    return () => clearInterval(id);
  }, [loading]);

  const promptBase = useMemo(() => {
    return [
      `RÔLE: Tu es un expert RH, coach carrière et designer de CV.`,
      `OBJECTIF: Créer un CV complet, clair et structuré en **Markdown**, adapté à un profil francophone.`,
      `STYLE: ${data.tone}, palette ${data.color}.`,
      ``,
      `CANDIDAT: ${data.fullName} (${data.city})`,
      `CONTACT: ${data.email} – ${data.phone}`,
      data.linkedin ? `LinkedIn: ${data.linkedin}` : ``,
      ``,
      `NIVEAU D’EXPÉRIENCE: ${data.experienceLevel || "non précisé"}`,
      `TYPE DE POSTE: ${data.jobType || "non précisé"}`,
      `LANGUES: ${data.languages || "non précisées"}`,
      ``,
      `POSTE VISÉ: ${data.roleTarget} – Domaine: ${data.industry}`,
      `FORCES / RÉALISATIONS: ${data.strengths}`,
      ``,
      `MISE EN FORME DEMANDÉE:`,
      `# NOM PRÉNOM`,
      `**Poste visé** · Ville · email · tel · linkedin`,
      `## Résumé (2–4 lignes maximum)`,
      `## Compétences (Hard / Soft / Langues)`,
      `## Expériences (3–6 bullet points avec résultats chiffrés)`,
      `## Formation`,
      `## Projets ou Réalisations marquantes`,
    ]
      .filter(Boolean)
      .join("\n");
  }, [data]);

  const onGenerate = async () => {
    setError("");
    setCv("");
    setLoading(true);
    try {
      const form = new FormData();
      form.append("promptBase", promptBase);
      Object.entries(data).forEach(([k, v]) => form.append(k, v || ""));
      files.forEach((f) => form.append("files", f, f.name));

      const res = await fetch("/api/generate-cv", {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(`API ${res.status}: ${t}`);
      }
      const json = await res.json();
      setProgress(100);
      setCv(json.cv || "");
    } catch (e: any) {
      setError(e?.message || "Erreur inconnue");
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const onPrint = () => window.print();

  const grad = "from-blue-600 to-teal-400";
  const card =
    "card hover:-translate-y-1 bg-white/90 dark:bg-[#0f172a]/70 backdrop-blur-md transition-all duration-300";

  return (
    <div className="max-w-6xl mx-auto px-6">
      <motion.h2
        className="text-4xl font-bold mb-8 text-[--color-primary] dark:text-[--color-secondary] text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        Générateur de CV SKEO
      </motion.h2>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* FORMULAIRE */}
        <div className={card}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Tes infos</h3>
            <div className="text-sm opacity-70">Étape {step} / 4</div>
          </div>

          {/* Étape 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <Input
                label="Poste visé"
                value={data.roleTarget}
                onChange={(v) => handleChange("roleTarget", v)}
                placeholder="Ex: Développeur Frontend"
              />
              <Input
                label="Domaine / secteur"
                value={data.industry}
                onChange={(v) => handleChange("industry", v)}
                placeholder="Ex: Tech, Marketing, Santé…"
              />
              <TextArea
                label="Quelques forces ou réalisations marquantes"
                value={data.strengths}
                onChange={(v) => handleChange("strengths", v)}
                placeholder="Ex: +30% de ventes, MVP livré en 2 mois…"
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <Select
                  label="Style"
                  value={data.tone}
                  options={["Sobre", "Moderne", "Créatif"]}
                  onChange={(v) => handleChange("tone", v as any)}
                />
                <Select
                  label="Couleur"
                  value={data.color}
                  options={["Bleu", "Vert", "Violet", "Gris"]}
                  onChange={(v) => handleChange("color", v as any)}
                />
              </div>
            </div>
          )}

          {/* Étape 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Nom complet" value={data.fullName} onChange={(v) => handleChange("fullName", v)} />
                <Input label="Ville" value={data.city} onChange={(v) => handleChange("city", v)} />
                <Input label="Email" value={data.email} onChange={(v) => handleChange("email", v)} />
                <Input label="Téléphone" value={data.phone} onChange={(v) => handleChange("phone", v)} />
                <Input label="LinkedIn (optionnel)" value={data.linkedin} onChange={(v) => handleChange("linkedin", v)} />
              </div>
            </div>
          )}

          {/* Étape 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <Select
                label="Niveau d’expérience"
                value={data.experienceLevel}
                options={["Débutant", "Intermédiaire", "Confirmé", "Expert"]}
                onChange={(v) => handleChange("experienceLevel", v)}
              />
              <Select
                label="Type de poste"
                value={data.jobType}
                options={["CDI", "CDD", "Alternance", "Stage", "Freelance"]}
                onChange={(v) => handleChange("jobType", v)}
              />
              <Input
                label="Langues"
                value={data.languages}
                onChange={(v) => handleChange("languages", v)}
                placeholder="Ex: Français (C2), Anglais (B2)"
              />
            </div>
          )}

          {/* Étape 4 */}
          {step === 4 && (
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm opacity-80">
                  Ajoute tes fichiers (CV existant, portfolio, lettre, images…)
                </span>
                <input
                  type="file"
                  multiple
                  onChange={onSelectFiles}
                  className="mt-2 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-[#0b1220]/60 px-3 py-2"
                />
              </label>

              {!!files.length && (
                <ul className="mt-2 space-y-2 text-sm">
                  {files.map((f, i) => (
                    <li key={i} className="flex justify-between border rounded-lg px-3 py-2">
                      <span className="truncate">{f.name} ({(f.size / 1024).toFixed(1)} Ko)</span>
                      <button className="text-red-500" onClick={() => removeFile(i)}>Supprimer</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Navigation boutons */}
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
              disabled={step === 1}
            >
              ← Précédent
            </button>
            {step < 4 ? (
              <button
                onClick={() => setStep((s) => Math.min(4, s + 1))}
                className={`px-4 py-2 rounded-lg bg-gradient-to-r ${grad} text-white`}
              >
                Continuer →
              </button>
            ) : (
              <button
                onClick={onGenerate}
                disabled={loading}
                className={`px-5 py-3 rounded-xl font-semibold shadow-sm bg-gradient-to-r ${grad} text-white`}
              >
                {loading ? "Génération…" : "🚀 Générer mon CV"}
              </button>
            )}
          </div>

          {loading && (
            <div className="mt-5">
              <div className="w-full h-3 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                <div
                  className={`h-3 rounded-full bg-gradient-to-r ${grad}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-sm opacity-70">
                Analyse + génération IA ({Math.round(progress)}%)
              </p>
            </div>
          )}

          {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
        </div>

        {/* PREVIEW */}
        <div className={`${card} relative`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Prévisualisation</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={onGenerate}
                className={`px-4 py-2 rounded-lg bg-gradient-to-r ${grad} text-white`}
                disabled={loading}
              >
                Relancer
              </button>
              <button
                onClick={onPrint}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                disabled={!cv}
              >
                Export PDF
              </button>
            </div>
          </div>

          {!cv ? (
            <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center">
              <p className="opacity-70">
                Le CV apparaîtra ici après la génération.  
                Renseigne les 4 étapes puis clique <b>Générer</b>.
              </p>
            </div>
          ) : (
            <div
              ref={previewRef}
              className="prose prose-slate dark:prose-invert max-w-none prose-h1:mb-2 prose-p:my-2 prose-li:my-1"
            >
              <pre className="whitespace-pre-wrap break-words text-sm leading-6">{cv}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* === UI MINI COMPOSANTS === */
function Input({ label, value, onChange, placeholder }: any) {
  return (
    <label className="block">
      <span className="text-sm opacity-80">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-[#0b1220]/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
      />
    </label>
  );
}
function Select({ label, value, options, onChange }: any) {
  return (
    <label className="block">
      <span className="text-sm opacity-80">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-[#0b1220]/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
      >
        {options.map((o: string) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
function TextArea({ label, value, onChange, placeholder }: any) {
  return (
    <label className="block">
      <span className="text-sm opacity-80">{label}</span>
      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-[#0b1220]/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
      />
    </label>
  );
}
