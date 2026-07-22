import { GoogleGenAI } from "@google/genai";
import config from "../../../config/env";
import { AiProviderResponse } from "../types/ai.types";

let aiInstance: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = config.gemini.apiKey;
    aiInstance = new GoogleGenAI({
      apiKey: apiKey || undefined,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

export async function generateContentWithGemini(
  prompt: string,
  model = "gemini-3.6-flash"
): Promise<AiProviderResponse> {
  try {
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    const text = response.text || "";
    return {
      text,
      success: true,
    };
  } catch (error: any) {
    console.error("[Gemini Provider Error]:", error);
    return {
      text: "",
      success: false,
      error: error?.message || "Falha na comunicação com o provedor Gemini.",
    };
  }
}
