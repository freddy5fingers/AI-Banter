import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Persona, ConversationMode, Message } from '../types';
import { createChatSession, getNextTurn, generateSpeech, initializeAi } from '../services/geminiService';
import { getAudioBuffer } from '../utils/audioUtils';
import MessageBubble from './MessageBubble';
import Spinner from './Spinner';
import type { Chat } from '@google/genai';

interface ConversationViewProps {
  personas: Persona[];
  topic: string;
  mode: ConversationMode;
  apiKey: string;
  onEnd: () => void;
}

const ConversationView: React.FC<ConversationViewProps> = ({ personas, topic, mode, apiKey, onEnd }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [activeSpeakerId, setActiveSpeakerId] = useState<string | null>(null);

  const chatRef = useRef<Chat | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioQueueRef = useRef<(() => Promise<void>)[]>([]);
  const isPlayingAudioRef = useRef(false);
  const conversationStoppedRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const processAudioQueue = useCallback(async () => {
    if (isPlayingAudioRef.current || audioQueueRef.current.length === 0) {
      return;
    }
    isPlayingAudioRef.current = true;
    const playAudio = audioQueueRef.current.shift();
    if (playAudio) {
      await playAudio();
    }
    isPlayingAudioRef.current = false;
    processAudioQueue();
  }, []);
  
  const playAudio = useCallback((buffer: AudioBuffer, personaId: string) => {
    return new Promise<void>((resolve) => {
      if (!audioContextRef.current || !isSoundOn) {
        resolve();
        return;
      }
      setActiveSpeakerId(personaId);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      source.onended = () => {
        setActiveSpeakerId(null);
        resolve();
      };
      source.start();
    });
  }, [isSoundOn]);

  const fetchAndProcessTurn = useCallback(async () => {
    if (conversationStoppedRef.current || isPaused) return;

    setIsThinking(true);
    
    const lastMessage = messages.length > 0 ? messages[messages.length - 1].text : topic;
    const currentPersonaIndex = messages.length % personas.length;
    const currentPersona = personas[currentPersonaIndex];
    const otherPersonas = personas.filter(p => p.id !== currentPersona.id);
    
    try {
      if (!chatRef.current) return;
      const response = await getNextTurn(chatRef.current, lastMessage, currentPersona, otherPersonas);
      const text = response.text;
      
      if (conversationStoppedRef.current) return;
      
      let audioBuffer: AudioBuffer | undefined = undefined;
      if (isSoundOn) {
        const speechResponse = await generateSpeech(text, currentPersona);
        const base64Audio = speechResponse?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio && audioContextRef.current) {
          const buffer = await getAudioBuffer(base64Audio, audioContextRef.current);
          if (buffer) audioBuffer = buffer;
        }
      }

      const newMessage: Message = { id: Date.now().toString(), text, persona: currentPersona, audioBuffer };
      setMessages(prev => [...prev, newMessage]);

      if (audioBuffer) {
        audioQueueRef.current.push(() => playAudio(audioBuffer!, currentPersona.id));
        processAudioQueue();
      }

    } catch (error) {
      console.error("Error getting next turn:", error);
      alert(`An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}. Your API key might be invalid or have billing issues. Pausing conversation.`);
      setIsPaused(true); // Pause on error
    } finally {
      if(!conversationStoppedRef.current) {
        setIsThinking(false);
      }
    }
  }, [messages, topic, isPaused, isSoundOn, playAudio, processAudioQueue, personas]);

  useEffect(() => {
    if(!isThinking && !isPaused && !conversationStoppedRef.current) {
        const timer = setTimeout(() => {
            fetchAndProcessTurn();
        }, 2000); // 2 second delay between turns
        return () => clearTimeout(timer);
    }
  }, [isThinking, isPaused, fetchAndProcessTurn]);


  useEffect(() => {
    conversationStoppedRef.current = false;
    try {
      initializeAi(apiKey);
    } catch(e) {
      alert(e instanceof Error ? e.message : "An unknown error occurred during initialization.");
      onEnd();
      return;
    }
    
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    chatRef.current = createChatSession(personas, topic, mode);
    fetchAndProcessTurn();

    return () => {
      conversationStoppedRef.current = true;
      audioContextRef.current?.close();
      audioQueueRef.current = [];
      isPlayingAudioRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStop = () => {
    conversationStoppedRef.current = true;
    onEnd();
  }

  const toggleSound = () => {
      setIsSoundOn(prev => {
          if(!prev && audioContextRef.current?.state === 'suspended') {
              audioContextRef.current.resume();
          }
          return !prev;
      });
  }
  
  const personaNames = personas.map(p => p.name);
  let title = '';
  if (personaNames.length <= 2) {
      title = personaNames.join(' vs ');
  } else {
      title = `${personaNames.slice(0, -1).join(', ')}, & ${personaNames[personaNames.length - 1]}`;
  }


  return (
    <div className="flex flex-col h-screen bg-brand-bg p-4">
      <header className="flex-shrink-0 mb-4">
        <h2 className="text-xl text-center font-semibold text-gray-300">
            {title}
        </h2>
        <p className="text-center text-gray-500">Topic: {topic}</p>
      </header>
      
      <div ref={scrollRef} className="flex-grow overflow-y-auto pr-2 space-y-4">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isSpeaking={activeSpeakerId === msg.persona.id}
          />
        ))}
        {isThinking && (
          <div className="flex justify-center items-center gap-2 p-4">
            <Spinner/>
            <span className="text-gray-400">AI is thinking...</span>
          </div>
        )}
      </div>

      <footer className="flex-shrink-0 mt-4 p-2 bg-brand-surface rounded-lg">
        <div className="flex justify-center items-center flex-wrap gap-2">
            <button onClick={toggleSound} className={`px-4 py-2 rounded-lg transition-colors ${isSoundOn ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'}`}>
                {isSoundOn ? 'Sound ON' : 'Sound OFF'}
            </button>
            <button onClick={() => setIsPaused(!isPaused)} className={`px-4 py-2 rounded-lg transition-colors ${isPaused ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-600 hover:bg-gray-700'}`}>
                {isPaused ? 'Resume' : 'Pause'}
            </button>
             <button onClick={handleStop} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors">
                New Topic
            </button>
        </div>
      </footer>
    </div>
  );
};

export default ConversationView;