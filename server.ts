import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check route
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

import { buildReportPrompt } from "./src/modules/ai-engine/prompts/report.prompt";
import { buildAdvisorPrompt } from "./src/modules/ai-engine/prompts/advisor.prompt";

// API route to generate AI Split Payment Executive Report
app.post("/api/gemini/report", async (req, res) => {
  try {
    const { company, inputs, metrics } = req.body;

    if (!inputs || !metrics) {
      return res.status(400).json({ error: "Dados incompletos para geração de relatório." });
    }

    // Normalize metric properties for report prompt compatibility
    const normalizedMetrics = {
      ...metrics,
      splitReadyScore: metrics.splitReadyScore ?? metrics.scoreTotal ?? 50,
      scoreClassification: metrics.scoreClassification ?? metrics.scoreClassificacao?.titulo ?? 'Atenção',
      riscoTitulo: metrics.riscoTitulo ?? metrics.riscoNivel ?? 'Risco Moderado',
      cfpSobreLucroPct: metrics.cfpSobreLucroPct ?? 0,
      reajusteRecomendadoPct: metrics.reajusteRecomendadoPct ?? 0,
      reajusteRecomendadoValor: metrics.reajusteRecomendadoValor ?? 0,
    };

    const prompt = buildReportPrompt({
      company: company || { nomeEmpresa: "Empresa Avaliada", setor: "Geral", regimeTributario: "Simples Nacional" },
      inputs,
      metrics: normalizedMetrics,
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const reportText = response.text || "Não foi possível gerar o relatório no momento.";
    return res.json({ report: reportText });
  } catch (error: any) {
    console.error("Erro ao gerar relatório via Gemini:", error);
    return res.status(500).json({
      error: "Falha ao conectar ao serviço de inteligência artificial.",
      details: error?.message || String(error),
    });
  }
});

// API route for Interactive AI Consultant Chat
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { messages, contextData } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Lista de mensagens inválida." });
    }

    const fullPrompt = buildAdvisorPrompt(messages, contextData);

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: fullPrompt,
    });

    const reply = response.text || "Desculpe, não consegui processar sua pergunta.";
    return res.json({ reply });
  } catch (error: any) {
    console.error("Erro no chat do Gemini:", error);
    return res.status(500).json({
      error: "Erro no assistente de IA.",
      details: error?.message || String(error),
    });
  }
});

async function startServer() {
  // Vite middleware for development
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
    console.log(`[Split Ready AI] Servidor rodando na porta http://localhost:${PORT}`);
  });
}

startServer();
