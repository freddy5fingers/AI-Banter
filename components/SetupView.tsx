import React, { useState } from 'react';
import { Persona, ConversationMode } from '../types';
import { PERSONAS } from '../constants/personas';
import { SUGGESTED_TOPICS } from '../constants/topics';
import PersonaCard from './PersonaCard';
import AgeConfirmationModal from './AgeConfirmationModal';

interface SetupViewProps {
  onStart: (personas: Persona[], topic: string, mode: ConversationMode) => void;
}

const SetupView: React.FC<SetupViewProps> = ({ onStart }) => {
  const [selectedPersonas, setSelectedPersonas] = useState<Persona[]>([]);
  const [topic, setTopic] = useState('');
  const [showAgeModal, setShowAgeModal] = useState(false);

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
    if (requiredTopic && !topic.trim()) return;
    if (selectedPersonas.length < 2) return;

    if (mode === 'vulgar_roast') {
      setShowAgeModal(true);
    } else {
      onStart(selectedPersonas, topic, mode);
    }
  };

  const handleAgeConfirm = () => {
    setShowAgeModal(false);
    onStart(selectedPersonas, "18+ Roast Battle", 'vulgar_roast');
  };

  const selectionValid = selectedPersonas.length >= 2 && selectedPersonas.length <= 4;
  const topicSet = !!topic.trim();

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
              disabled={!selectionValid || !topicSet}
              className="px-8 py-4 text-lg font-bold bg-blue-600 hover:bg-blue-700 rounded-lg transition-all disabled:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-400"
            >
              Start Banter
            </button>
            <button
              onClick={() => handleStart('roast', false)}
              disabled={!selectionValid}
              className="px-8 py-4 text-lg font-bold bg-orange-600 hover:bg-orange-700 rounded-lg transition-all disabled:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-400"
            >
              Instant Roast
            </button>
             <button
              onClick={() => handleStart('vulgar_roast', false)}
              disabled={!selectionValid}
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