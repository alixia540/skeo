// @ts-nocheck
import { NextResponse } from "next/server";
import mammoth from "mammoth";
import Tesseract from "tesseract.js";
import { PDFDocument } from "pdf-lib";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* -------------------------- Extraction Helpers -------------------------- */
async function extractFromPDF(buf: Buffer) {
  try {
    const pdfDoc = await PDFDocument.load(buf);
    // ⚠️ pdf-lib ne lit pas le texte nativement
    // on renvoie juste une indication que le PDF est lu
    return "[Contenu PDF détecté - extraction limitée dans la version web]";
  } catch (err) {
    console.error("Erreur PDF parse:", err);
    return "";
  }
}

async function extractFromDOCX(buf: Buffer) {
  try {
    const { value } = await mammoth.extractRawText({ buffer: buf });
    return value || "";
  } catch (err) {
    console.error("Erreur DOCX parse:", err);
    return "";
  }
}

async function extractFromTXT(buf: Buffer) {
  return buf.toString("utf-8");
}

async function extractFromImage(buf: Buffer) {
  try {
    const { data } = await Tesseract.recognize(buf, "fra+eng", {
      config: {
        tessedit_char_whitelist:
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_/.,:;()[]{}+%$€@!?'\" \n",
      },
    });
    return data.text || "";
  } catch (err) {
    console.error("Erreur OCR:", err);
    return "";
  }
}

function truncate(s: string, max = 8000) {
  return s.length <= max ? s : s.slice(0, max) + "\n\n[...] (contenu tronqué)";
}

/* ------------------------------ Main Handler ----------------------------- */
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

    const finalPrompt = `
Tu es un **expert RH et concepteur de CV premium**, spécialisé dans la rédaction de CV modernes, humains et impactants pour des profils professionnels variés.

🧩 **Contexte candidat**
Nom complet : ${fields.fullName || "Nom Prénom"}
Poste visé : ${fields.roleTarget}
Secteur d’activité : ${fields.industry}
Ville : ${fields.city}
Email : ${fields.email}
Téléphone : ${fields.phone}
LinkedIn : ${fields.linkedin || "Non fourni"}

💼 **Forces et réalisations**
${fields.strengths || "Aucune renseignée"}

🎨 **Style demandé**
- Ton : ${fields.tone}
- Palette dominante : ${fields.color}
- Format : **Markdown uniquement**
- Longueur : ~1 page (environ 300–400 mots)

📂 **Fichiers du candidat (contenu brut fourni ci-dessous)** :
${truncate(extracted)}

---

🎯 **Ta mission**
1. Crée un **CV complet et professionnel** en **français**.
2. Mets en avant les **résultats chiffrés, expériences pertinentes et compétences clés**.
3. Écris avec un ton humain, naturel et percutant.
4. Structure le CV ainsi :
   - # NOM PRÉNOM
   - **Poste visé** · Ville · email · téléphone · LinkedIn
   - ## Profil / Résumé (3–4 phrases dynamiques)
   - ## Compétences (séparées en Hard Skills / Soft Skills / Langues)
   - ## Expériences (avec puces, verbes d’action, résultats concrets)
   - ## Formation
   - ## Projets (si pertinents)
5. Utilise la mise en forme Markdown élégante (titres, gras, listes).
6. Ne renvoie **que le contenu final du CV**, sans explication, sans balises inutiles.
`;


    /* ---------------------- Requête vers OpenRouter ---------------------- */
    const apiKey =
      process.env.OPENROUTER_API_KEY ||
      "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";

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://skeo.vercel.app", // ton domaine Vercel
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [
          {
            role: "system",
            content: "Tu es un expert RH et rédacteur de CV professionnels.",
          },
          { role: "user", content: finalPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        { error: `Erreur API OpenRouter (${response.status}): ${errText}` },
        { status: 500 }
      );
    }

    const data = await response.json();
    const content =
      data?.choices?.[0]?.message?.content || "Aucune réponse générée.";

    return NextResponse.json({ cv: content });
  } catch (e: any) {
    console.error("Erreur route /generate-cv:", e);
    return NextResponse.json(
      { error: e?.message || "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}

