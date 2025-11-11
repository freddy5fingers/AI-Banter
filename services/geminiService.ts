import { GoogleGenAI, Chat, GenerateContentResponse, Modality } from "@google/genai";
import { Persona } from '../types';

let ai: GoogleGenAI | null = null;

const getAi = () => {
  if (!ai) {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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

export const getNextTurn = async (chat: Chat, lastMessage: string, currentPersona: Persona, otherPersonas: Persona[]): Promise<GenerateContentResponse> => {
  let prompt = `It's now ${currentPersona.name}'s turn. The last thing said was: "${lastMessage}". Respond as ${currentPersona.name}.`;

  if (otherPersonas.length > 1) {
    prompt = `It's now ${currentPersona.name}'s turn. The last thing said was: "${lastMessage}". Respond to the others as ${currentPersona.name}.`;
  }
  
  return await chat.sendMessage({ message: prompt });
};

export const generateSpeech = async (text: string, persona: Persona): Promise<GenerateContentResponse | null> => {
  const ai = getAi();
  try {
    const prompt = `${persona.voiceInstruction} "${text}"`;
    const response = await ai.models.generateContent({
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
    });
    return response;
  } catch (error) {
    console.error("Error generating speech:", error);
    return null;
  }
};