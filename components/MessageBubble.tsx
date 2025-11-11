import React from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  isSpeaking: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isSpeaking }) => {
  const { persona, text } = message;

  return (
    <div className={`flex items-end gap-2 justify-start animate-fade-in`}>
      <img
        src={persona.iconUrl}
        alt={persona.name}
        className={`w-10 h-10 rounded-full flex-shrink-0 border-2 ${persona.borderColor} ${isSpeaking ? `animate-glow-spoke` : ''} ${persona.ringColor}`}
      />
      <div className="flex flex-col" style={{ maxWidth: '80%' }}>
        <p className={`text-sm mb-1 ${persona.nameColor} text-left`}>{persona.name}</p>
        <div className={`px-4 py-2 rounded-2xl ${persona.bubbleColor} rounded-bl-none`}>
          <p className="text-white">{text}</p>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;