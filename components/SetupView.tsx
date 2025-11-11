import React, { useState, useEffect } from 'react';
import { Persona, ConversationMode } from '../types';
import { PERSONAS } from '../constants/personas';
import { SUGGESTED_TOPICS } from '../constants/topics';
import { validateApiKey } from '../services/geminiService';
import PersonaCard from './PersonaCard';
import AgeConfirmationModal from './AgeConfirmationModal';
import Spinner from './Spinner';

interface SetupViewProps {
  onStart: (personas: Persona[], topic: string, mode: ConversationMode, apiKey:string) => void;
}

const SetupView: React.FC<SetupViewProps> = ({ onStart }) => {
  const [selectedPersonas, setSelectedPersonas] = useState<Persona[]>([]);
  const [topic, setTopic] = useState('');
  const [apiKey, setApiKey] = useState(''); // The validated key
  const [apiKeyInput, setApiKeyInput] = useState(''); // The input field value
  const [keyValidationStatus, setKeyValidationStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');
  const [showAgeModal, setShowAgeModal] = useState(false);
  
  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKeyInput(savedKey);
    }
  }, []);

  const handleApiKeyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKeyInput(e.target.value);
    setKeyValidationStatus('idle'); // Reset status when user types
    setApiKey(''); // Invalidate the saved key if user is editing
  };
  
  const handleVerifyKey = async () => {
    if (!apiKeyInput.trim()) {
      setKeyValidationStatus('invalid');
      return;
    }
    setKeyValidationStatus('validating');
    const isValid = await validateApiKey(apiKeyInput);
    if (isValid) {
      setKeyValidationStatus('valid');
      setApiKey(apiKeyInput);
      localStorage.setItem('gemini_api_key', apiKeyInput);
    } else {
      setKeyValidationStatus('invalid');
      setApiKey('');
      localStorage.removeItem('gemini_api_key');
    }
  };

  const handlePersonaSelect = (persona: Persona) => {
    setSelectedPersonas(prev => {
      const isSelected = prev.some(p => p.id === persona.id);
      if (isSelected) {
        return prev.filter(p => p.id !== persona.id); // Deselect
      }
      if (prev.length < 4) {
        return [...prev, persona]; // Select if space is available
      }
      return prev; // Do nothing if 4 are already selected
    });
  };

  const handleSuggestTopic = () => {
    const randomTopic = SUGGESTED_TOPICS[Math.floor(Math.random() * SUGGESTED_TOPICS.length)];
    setTopic(randomTopic);
  };

  const handleStart = (mode: ConversationMode, requiredTopic: boolean = true) => {
    if (keyValidationStatus !== 'valid') return;
    if (requiredTopic && !topic.trim()) return;
    if (selectedPersonas.length < 2) return;

    if (mode === 'vulgar_roast') {
      setShowAgeModal(true);
    } else {
      onStart(selectedPersonas, topic, mode, apiKey);
    }
  };

  const handleAgeConfirm = () => {
    setShowAgeModal(false);
    onStart(selectedPersonas, "18+ Roast Battle", 'vulgar_roast', apiKey);
  };

  const selectionValid = selectedPersonas.length >= 2 && selectedPersonas.length <= 4;
  const topicSet = !!topic.trim();
  const apiKeySet = keyValidationStatus === 'valid';

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen flex flex-col">
       {showAgeModal && (
        <AgeConfirmationModal
          onConfirm={handleAgeConfirm}
          onCancel={() => setShowAgeModal(false)}
        />
      )}
      <header className="text-center mb-6">
        <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
          AI Banter
        </h1>
      </header>

      <div className="flex-grow">
        <section className="mb-8 p-4 bg-brand-surface rounded-lg border border-gray-700">
           <h2 className="text-xl font-semibold mb-3 text-gray-300">Your Gemini API Key</h2>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="flex-grow">
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={handleApiKeyInputChange}
                    placeholder="Enter your Google Gemini API Key"
                    className="flex-grow bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                  <button
                    onClick={handleVerifyKey}
                    disabled={!apiKeyInput.trim() || keyValidationStatus === 'validating'}
                    className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors font-semibold flex items-center gap-2 disabled:bg-gray-600 disabled:cursor-not-allowed"
                  >
                    {keyValidationStatus === 'validating' ? <Spinner /> : null}
                    <span>{keyValidationStatus === 'valid' ? 'Key Saved' : 'Save & Verify'}</span>
                  </button>
                </div>
                <div className="h-5 mt-2">
                  {keyValidationStatus === 'valid' && (
                    <p className="text-sm text-green-400 animate-fade-in">✓ API Key is valid and saved.</p>
                  )}
                  {keyValidationStatus === 'invalid' && (
                    <p className="text-sm text-red-400 animate-fade-in">✗ Invalid API Key. Please check the key and your Google Cloud billing status.</p>
                  )}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
                Your key is stored in your browser's local storage and is never sent to our servers. 
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline ml-1">
                    Get a key from Google AI Studio.
                </a>
            </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-300">1. Select 2 to 4 Combatants</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {PERSONAS.map(p => (
              <PersonaCard
                key={p.id}
                persona={p}
                isSelected={selectedPersonas.some(sp => sp.id === p.id)}
                onSelect={handlePersonaSelect}
              />
            ))}
          </div>
        </section>

        {selectedPersonas.length > 0 && (
            <section className="mb-8 p-4 bg-brand-surface/50 rounded-lg">
                 <h3 className="text-lg font-semibold mb-3 text-gray-400">Your Lineup:</h3>
                <div className="flex items-center gap-4">
                    {selectedPersonas.map(p => (
                        <img key={p.id} src={p.iconUrl} alt={p.name} title={p.name} className={`w-16 h-16 rounded-full border-2 ${p.borderColor}`} />
                    ))}
                </div>
            </section>
        )}

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-300">2. Set The Topic (for Banter)</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g., Is pineapple on pizza a crime?"
              className="flex-grow bg-brand-surface border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
            <button
              onClick={handleSuggestTopic}
              className="px-6 py-3 bg-brand-secondary/80 hover:bg-brand-secondary rounded-lg transition-colors font-semibold"
            >
              Suggest Topic
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-300">3. Choose Your Mode</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => handleStart('banter')}
              disabled={!selectionValid || !topicSet || !apiKeySet}
              className="px-8 py-4 text-lg font-bold bg-blue-600 hover:bg-blue-700 rounded-lg transition-all disabled:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-400"
            >
              Start Banter
            </button>
            <button
              onClick={() => handleStart('roast', false)}
              disabled={!selectionValid || !apiKeySet}
              className="px-8 py-4 text-lg font-bold bg-orange-600 hover:bg-orange-700 rounded-lg transition-all disabled:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-400"
            >
              Instant Roast
            </button>
             <button
              onClick={() => handleStart('vulgar_roast', false)}
              disabled={!selectionValid || !apiKeySet}
              className="px-8 py-4 text-lg font-bold bg-red-700 hover:bg-red-800 rounded-lg transition-all disabled:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-400"
            >
              18+ Vulgar Roast
            </button>
          </div>
        </section>
      </div>
      <footer className="text-center text-gray-500 mt-8">
        <p>Built with React, Tailwind, and the Gemini API.</p>
      </footer>
    </div>
  );
};

export default SetupView;