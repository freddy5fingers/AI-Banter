import { GoogleGenAI, Chat, GenerateContentResponse, Modality } from "@google/genai";
import { Persona } from '../types';

let ai: GoogleGenAI | null = null;

const withRetry = async <T>(apiCall: () => Promise<T>, maxRetries = 3): Promise<T> => {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await apiCall();
    } catch (error) {
      attempt++;
      if (attempt >= maxRetries) {
        throw error; // Re-throw the error on the final attempt
      }
      
      const isNetworkError = error instanceof Error && (error.message.toLowerCase().includes('fetch') || error.name === 'TypeError');

      if (isNetworkError) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff: 2s, 4s, etc.
        console.warn(`API call failed with network error (attempt ${attempt}/${maxRetries}). Retrying in ${delay}ms...`, error);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error; // Don't retry for non-network errors (e.g., auth)
      }
    }
  }
  // This line should be unreachable due to the throws inside the loop
  throw new Error('Retry logic exited unexpectedly.');
};


export const initializeAi = (apiKey: string) => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please provide a valid Gemini API key.");
  }
  ai = new GoogleGenAI({ apiKey });
};

export const validateApiKey = async (key: string): Promise<boolean> => {
  if (!key.trim()) return false;
  try {
    const tempAi = new GoogleGenAI({ apiKey: key });
    await withRetry(() => tempAi.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'hi',
    }));
    return true;
  } catch (error) {
    console.error("API Key validation failed:", error);
    return false;
  }
};

const getAi = (): GoogleGenAI => {
  if (!ai) {
    throw new Error("AI Service not initialized. Please call initializeAi(apiKey) before using the service.");
  }
  return ai;
};

export const createChatSession = (personas: Persona[], topic: string, mode: 'banter' | 'roast' | 'vulgar_roast') => {
  const ai = getAi();
  
  const personaDescriptions = personas.map((p, i) => `Persona ${i + 1} is ${p.name}. Their personality is: ${p.systemInstruction}.`).join('\n');

  let systemInstruction = `
    You are in a conversation.
    ${personaDescriptions}
    The topic is: "${topic}".
    Keep responses concise, under 80 words. Never break character.
    Do not repeat other people's points. Engage directly with what was just said.
  `;

  if (mode === 'roast') {
    systemInstruction = `
      You are in a roast battle.
      ${personaDescriptions}
      The goal is to deliver witty, funny, and clever insults.
      Keep responses short and punchy. Never break character. Be ruthless but clever.
    `;
  } else if (mode === 'vulgar_roast') {
    systemInstruction = `
      You are in an 18+, uncensored, vulgar roast battle.
      ${personaDescriptions}
      The goal is to deliver brutal, offensive, and vulgar insults. No holds barred.
      Keep responses short and punchy. Never break character. Go for the jugular.
    `;
  }
  
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: { systemInstruction },
  });
};

export const getNextTurn = async (chat: Chat, lastMessage: string, currentPersona: Persona, otherPersonas: Persona[], isFirstTurn?: boolean): Promise<GenerateContentResponse> => {
  let prompt: string;
  
  if (isFirstTurn) {
    prompt = `[SYSTEM NOTE: ${currentPersona.name} has just joined the conversation. Their personality is: ${currentPersona.systemInstruction}]. It is now ${currentPersona.name}'s turn. The last thing said was: "${lastMessage}". Introduce yourself and respond as ${currentPersona.name}.`;
  } else if (otherPersonas.length > 1) {
    prompt = `It's now ${currentPersona.name}'s turn. The last thing said was: "${lastMessage}". Respond to the others as ${currentPersona.name}.`;
  } else {
    prompt = `It's now ${currentPersona.name}'s turn. The last thing said was: "${lastMessage}". Respond as ${currentPersona.name}.`;
  }
  
  return await withRetry(() => chat.sendMessage({ message: prompt }));
};

export const generateSpeech = async (text: string, persona: Persona): Promise<GenerateContentResponse | null> => {
  const ai = getAi();
  try {
    const prompt = `${persona.voiceInstruction} "${text}"`;
    const response = await withRetry(() => ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: persona.voice },
          },
        },
      },
    }));
    return response;
  } catch (error) {
    console.error("Error generating speech:", error);
    return null;
  }
};
