// @ts-nocheck
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

type FormCore = {
  roleTarget: string;
  industry: string;
  strengths: string; // 2-4 réalisations fortes
  tone: "Sobre" | "Moderne" | "Créatif";
  color: "Bleu" | "Vert" | "Violet" | "Gris";
  fullName: string;
  email: string;
  phone: string;
  city: string;
  linkedin?: string;
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

  // progress “vivant”
  useEffect(() => {
    if (!loading) return;
    setProgress(10);
    const id = setInterval(() => {
      setProgress((p) => (p < 90 ? p + Math.random() * 8 : p));
    }, 450);
    return () => clearInterval(id);
  }, [loading]);

  const promptBase = useMemo(() => {
    return [
      `RÔLE: Tu es un expert RH + designer de CV.`,
      `OBJECTIF: Générer un CV en **FRANÇAIS**, format **Markdown** uniquement (pas de commentaires), lisible, clair et orienté résultats.`,
      `STYLE: ${data.tone}, palette dominante: ${data.color}.`,
      ``,
      `CANDIDAT: ${data.fullName || "Nom Prénom"} – ${data.city}`,
      `CONTACT: ${data.email} – ${data.phone}`,
      data.linkedin ? `LinkedIn: ${data.linkedin}` : ``,
      ``,
      `POSTE VISÉ: ${data.roleTarget} – Domaine: ${data.industry}`,
      `FORCES / FAITS MARQUANTS: ${data.strengths}`,
      ``,
      `MISE EN FORME DEMANDÉE:`,
      `# NOM PRÉNOM`,
      `**Poste visé** · Ville · email · tel · linkedin`,
      `## Résumé (2–4 lignes)`,
      `## Compétences (Hard/Soft/Langues)`,
      `## Expériences (ordre inverse chrono, 3–6 bullets à impact chiffré)`,
      `## Formation`,
      `## Projets (si pertinent)`,
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

  const card =
    "card hover:-translate-y-1 bg-white/90 dark:bg-[#0f172a]/70 backdrop-blur-md transition-all duration-300";
  const grad = "from-blue-600 to-teal-400";

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
        {/* FORM */}
        <div className={card}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Tes infos clés</h3>
            <div className="text-sm opacity-70">Étape {step} / 3</div>
          </div>

          {/* Étape 1 : objectifs & style */}
          {step === 1 && (
            <div className="space-y-4">
              <Input
                label="Poste visé"
                value={data.roleTarget}
                onChange={(v) => handleChange("roleTarget", v)}
                placeholder="Ex: Développeur Frontend"
              />
              <Input
                label="Domaine"
                value={data.industry}
                onChange={(v) => handleChange("industry", v)}
                placeholder="Ex: Tech, Santé, Industrie…"
              />
              <TextArea
                label="Tes 2–4 forces / résultats marquants"
                value={data.strengths}
                onChange={(v) => handleChange("strengths", v)}
                placeholder="Ex: +35% de conversion, 2 applis publiées, certif AWS…"
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

          {/* Étape 2 : identité & contact */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Nom complet"
                  value={data.fullName}
                  onChange={(v) => handleChange("fullName", v)}
                />
                <Input
                  label="Ville"
                  value={data.city}
                  onChange={(v) => handleChange("city", v)}
                />
                <Input
                  label="Email"
                  value={data.email}
                  onChange={(v) => handleChange("email", v)}
                />
                <Input
                  label="Téléphone"
                  value={data.phone}
                  onChange={(v) => handleChange("phone", v)}
                />
                <Input
                  label="LinkedIn (optionnel)"
                  value={data.linkedin || ""}
                  onChange={(v) => handleChange("linkedin", v)}
                />
              </div>
            </div>
          )}

          {/* Étape 3 : Upload fichiers */}
          {step === 3 && (
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm opacity-80">
                  Ajoute tes fichiers (CV existant, portfolio, descriptions de
                  postes, captures…). Formats: PDF, DOCX, TXT, PNG/JPG.
                </span>
                <input
                  type="file"
                  multiple
                  onChange={onSelectFiles}
                  className="mt-2 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-[#0b1220]/60 px-3 py-2"
                />
              </label>

              {!!files.length && (
                <ul className="mt-2 space-y-2">
                  {files.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2"
                    >
                      <span className="truncate">{f.name}</span>
                      <button
                        className="text-red-600 dark:text-red-400 text-sm"
                        onClick={() => removeFile(i)}
                      >
                        Supprimer
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
              disabled={step === 1}
            >
              ← Précédent
            </button>
            {step < 3 ? (
              <button
                onClick={() => setStep((s) => Math.min(3, s + 1))}
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
                {loading ? "Génération…" : "Générer mon CV"}
              </button>
            )}
          </div>

          {/* Progress */}
          {loading && (
            <div className="mt-5">
              <div className="w-full h-3 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                <div
                  className={`h-3 rounded-full bg-gradient-to-r ${grad}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-sm opacity-70">
                Analyse des fichiers + génération ({Math.round(progress)}%)
              </p>
            </div>
          )}

          {error && (
            <p className="mt-4 text-red-600 dark:text-red-400 text-sm">{error}</p>
          )}
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
                {loading ? "Génération…" : "Relancer"}
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
                Renseigne les 3 étapes puis clique <b>Générer</b>.
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

/* UI mini-compos */
function Input({ label, value, onChange, placeholder }: any) {
  return (
    <label className="block">
      <span className="text-sm opacity-80">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-[#0b1220]/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
        className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-[#0b1220]/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
        className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-[#0b1220]/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </label>
  );
}
