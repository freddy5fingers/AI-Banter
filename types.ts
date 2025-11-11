export interface Persona {
  id: string;
  name: string;
  iconUrl: string;
  systemInstruction: string;
  voiceInstruction: string;
  voice: 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr';
  bubbleColor: string;
  borderColor: string;
  nameColor: string;
  ringColor: string;
}

export interface Message {
  id: string;
  text: string;
  persona: Persona;
  audioBuffer?: AudioBuffer;
}

export type ConversationMode = 'banter' | 'roast' | 'vulgar_roast';
