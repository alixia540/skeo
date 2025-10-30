// @ts-nocheck
import { NextResponse } from "next/server";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import Tesseract from "tesseract.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// --- Extraction Helpers ---
async function extractFromPDF(buf: Buffer) {
  try {
    const data = await pdfParse(buf);
    return data.text || "";
  } catch {
    return "";
  }
}

async function extractFromDOCX(buf: Buffer) {
  try {
    const { value } = await mammoth.extractRawText({ buffer: buf });
    return value || "";
  } catch {
    return "";
  }
}

async function extractFromTXT(buf: Buffer) {
  return buf.toString("utf-8");
}

async function extractFromImage(buf: Buffer) {
  try {
    const { data } = await Tesseract.recognize(buf, "fra+eng", {
      // ✅ Correct: la config doit être passée sous "config"
      config: {
        tessedit_char_whitelist:
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_/.,:;()[]{}+%$€@!?'\" \n",
      },
    });
    return data.text || "";
  } catch {
    return "";
  }
}

function truncate(s: string, max = 8000) {
  return s.length <= max ? s : s.slice(0, max) + "\n\n[...] (contenu tronqué)";
}

// --- ROUTE POST ---
export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const promptBase = (form.get("promptBase") as string) || "";

    const fieldNames = [
      "roleTarget",
      "industry",
      "strengths",
      "tone",
      "color",
      "fullName",
      "email",
      "phone",
      "city",
      "linkedin",
      "portfolio",
    ];

    const fields: Record<string, string> = {};
    for (const name of fieldNames) {
      fields[name] = (form.get(name) as string) || "";
    }

    const files = form.getAll("files") as unknown as File[];

    let extracted = "";

    for (const f of files) {
      try {
        const ab = await f.arrayBuffer();
        const buf = Buffer.from(ab);
        const type = f.type || f.name.split(".").pop()?.toLowerCase() || "";

        let text = "";

        if (type.includes("pdf")) text = await extractFromPDF(buf);
        else if (
          type.includes("officedocument") ||
          f.name.toLowerCase().endsWith(".docx")
        )
          text = await extractFromDOCX(buf);
        else if (type.startsWith("image/")) text = await extractFromImage(buf);
        else if (type.includes("text") || f.name.toLowerCase().endsWith(".txt"))
          text = await extractFromTXT(buf);
        else text = buf.toString("utf-8");

        if (text.trim()) {
          extracted += `\n\n===== CONTENU DU FICHIER: ${f.name} =====\n${text.trim()}\n`;
        }
      } catch {
        extracted += `\n\n[Erreur de lecture du fichier ${f.name}]`;
      }
    }

    // ✅ Lis ton URL Ollama depuis l’environnement (.env ou Vercel)
    const OLLAMA_URL = process.env.OLLAMA_URL || "http://127.0.0.1:11434";

    const finalPrompt = [
      promptBase,
      "",
      "===== CONTEXTE FICHIERS =====",
      truncate(extracted),
      "",
      "===== INSTRUCTIONS =====",
      "1) Génére un CV clair et professionnel en Markdown.",
      "2) Structure : Résumé, Compétences, Expériences, Formation, Projets.",
      "3) Utilise les infos du candidat et les fichiers.",
      "4) Ne renvoie QUE le texte final du CV.",
    ].join("\n");

    // ✅ Appel vers ton instance Ollama distante
    const ollamaRes = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3", // ton modèle (ex: llama3, mistral, phi3…)
        prompt: finalPrompt,
        stream: false,
        options: { temperature: 0.6, top_p: 0.9, num_ctx: 4096 },
      }),
    });

    if (!ollamaRes.ok) {
      const text = await ollamaRes.text();
      return NextResponse.json(
        { error: `Erreur Ollama (${ollamaRes.status}): ${text}` },
        { status: 500 }
      );
    }

    const data = await ollamaRes.json();
    const content = data?.response || "Aucune réponse générée.";

    return NextResponse.json({ cv: content });
  } catch (e: any) {
    console.error("Erreur route /generate-cv:", e);
    return NextResponse.json(
      { error: e?.message || "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
