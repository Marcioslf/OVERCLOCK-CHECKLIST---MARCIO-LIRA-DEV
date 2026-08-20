import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "25mb" }));

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // AI Image Generation Endpoint
  app.post("/api/generate-image", async (req, res) => {
    try {
      const {
        prompt,
        aspectRatio = "1:1",
        imageSize = "1K",
        model = "gemini-3-pro-image-preview",
        referenceImageBase64,
        referenceMimeType = "image/png",
      } = req.body;

      if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const ai = getGeminiClient();

      // Normalize model selection
      // Allowed models: gemini-3-pro-image-preview, gemini-3.1-flash-image-preview, gemini-3.1-flash-lite-image
      let selectedModel = model;
      if (!selectedModel || selectedModel === "pro" || selectedModel === "gemini-3-pro-image") {
        selectedModel = "gemini-3-pro-image-preview";
      } else if (selectedModel === "flash" || selectedModel === "gemini-3.1-flash-image") {
        selectedModel = "gemini-3.1-flash-image-preview";
      }

      const parts: any[] = [];
      if (referenceImageBase64) {
        // Strip data URL header if present
        const cleanBase64 = referenceImageBase64.replace(/^data:[^;]+;base64,/, "");
        parts.push({
          inlineData: {
            data: cleanBase64,
            mimeType: referenceMimeType,
          },
        });
      }
      parts.push({ text: prompt });

      // Supported aspect ratios: "1:1", "2:3", "3:2", "3:4", "4:3", "9:16", "16:9", "21:9"
      // Supported image sizes: "1K", "2K", "4K" (and "512px" for flash)
      const validAspectRatios = ["1:1", "2:3", "3:2", "3:4", "4:3", "9:16", "16:9", "21:9", "1:4", "1:8", "4:1", "8:1"];
      const finalAspectRatio = validAspectRatios.includes(aspectRatio) ? aspectRatio : "1:1";

      const validSizes = ["512px", "1K", "2K", "4K"];
      const finalSize = validSizes.includes(imageSize) ? imageSize : "1K";

      const config: any = {
        imageConfig: {
          aspectRatio: finalAspectRatio,
          imageSize: finalSize,
        },
      };

      const response = await ai.models.generateContent({
        model: selectedModel,
        contents: { parts },
        config,
      });

      let foundImage: { data: string; mimeType: string } | null = null;
      let textFeedback: string = "";

      if (response.candidates && response.candidates[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            foundImage = {
              data: part.inlineData.data,
              mimeType: part.inlineData.mimeType || "image/png",
            };
            break;
          } else if (part.text) {
            textFeedback += part.text + " ";
          }
        }
      }

      if (!foundImage) {
        return res.status(500).json({
          error: "A imagem não pôde ser gerada pelo modelo. Mensagem: " + (textFeedback || "Sem retorno de imagem"),
          text: textFeedback,
        });
      }

      const imageUrl = `data:${foundImage.mimeType};base64,${foundImage.data}`;
      return res.json({
        imageUrl,
        mimeType: foundImage.mimeType,
        textFeedback: textFeedback.trim(),
        modelUsed: selectedModel,
        aspectRatio: finalAspectRatio,
        imageSize: finalSize,
      });
    } catch (error: any) {
      console.error("Error generating image:", error);
      return res.status(500).json({
        error: error?.message || "Falha ao gerar imagem com IA",
      });
    }
  });

  // AI Task Breakdown & Smart Suggestions
  app.post("/api/ai/breakdown-tasks", async (req, res) => {
    try {
      const { goal, currentTasks = [] } = req.body;
      if (!goal || typeof goal !== "string") {
        return res.status(400).json({ error: "Goal or prompt is required" });
      }

      const ai = getGeminiClient();

      const prompt = `Você é o assistente de alta performance do Overclock Checklist.
O usuário quer quebrar ou planejar a seguinte meta/tarefas:
"${goal}"

Tarefas já existentes na lista: ${JSON.stringify(currentTasks.map((t: any) => t.text || t))}

Retorne uma lista JSON com tarefas diretas, acionáveis, concisas e práticas (em português).
Para cada tarefa, forneça:
- text: título curto e objetivo da tarefa (máximo 80 caracteres)
- isPriority: booleano indicando se deve ser a primeira prioridade

Responda ESTRITAMENTE em formato JSON com o seguinte schema:
{
  "tasks": [
    { "text": "...", "isPriority": false }
  ],
  "motivationalTip": "Uma dica rápida de 1 frase para foco estilo Overclock."
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      const responseText = response.text || "{}";
      const parsed = JSON.parse(responseText);
      return res.json(parsed);
    } catch (error: any) {
      console.error("Error in AI task breakdown:", error);
      return res.status(500).json({ error: error?.message || "Falha ao gerar sugestões com IA" });
    }
  });

  // AI Notes Optimizer / Summarizer
  app.post("/api/ai/summarize-notes", async (req, res) => {
    try {
      const { notes, tasks = [] } = req.body;
      const ai = getGeminiClient();

      const prompt = `Você é o assistente executivo do Overclock Checklist.
Notas atuais:
"""
${notes || "(Sem notas registradas)"}
"""

Tarefas atuais:
${tasks.map((t: any) => `- [${t.done ? "X" : " "}] ${t.text}`).join("\n")}

Gere uma síntese estratégica e organizada das notas em formato limpo (com seções: Pontos-Chave, Ações Imediatas e Ideias Futuras), em português.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          temperature: 0.5,
        },
      });

      return res.json({ summary: response.text });
    } catch (error: any) {
      console.error("Error in AI notes summary:", error);
      return res.status(500).json({ error: error?.message || "Falha ao resumir notas" });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Overclock Checklist server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Fatal error starting server:", err);
  process.exit(1);
});
