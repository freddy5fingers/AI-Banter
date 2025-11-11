import React, { useState, useCallback } from 'react';
import { Persona, ConversationMode } from './types';
import SetupView from './components/SetupView';
import ConversationView from './components/ConversationView';

type View = 'setup' | 'conversation';

const App: React.FC = () => {
  const [view, setView] = useState<View>('setup');
  
  const [conversationConfig, setConversationConfig] = useState<{
    personas: Persona[],
    topic: string,
    mode: ConversationMode,
  } | null>(null);

  const startConversation = useCallback((personas: Persona[], topic: string, mode: ConversationMode) => {
    setConversationConfig({ personas, topic, mode });
    setView('conversation');
  }, []);

  const endConversation = useCallback(() => {
    setView('setup');
    setConversationConfig(null);
  }, []);

  const renderContent = () => {
    if (view === 'setup') {
      return <SetupView onStart={startConversation} />;
    }

    if (view === 'conversation' && conversationConfig) {
      return <ConversationView {...conversationConfig} onEnd={endConversation} />;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-brand-bg font-sans">
      {renderContent()}
    </div>
  );
};

export default App;
