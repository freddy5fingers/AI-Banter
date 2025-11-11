import React from 'react';
import { Persona } from '../types';
import { PERSONAS } from '../constants/personas';
import PersonaCard from './PersonaCard';

interface AddCharacterModalProps {
  currentPersonas: Persona[];
  onSelect: (persona: Persona) => void;
  onClose: () => void;
}

const AddCharacterModal: React.FC<AddCharacterModalProps> = ({ currentPersonas, onSelect, onClose }) => {
  const currentPersonaIds = new Set(currentPersonas.map(p => p.id));
  const availablePersonas = PERSONAS.filter(p => !currentPersonaIds.has(p.id));

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-brand-surface rounded-lg p-6 shadow-2xl max-w-4xl w-full border border-gray-700 flex flex-col" style={{ maxHeight: '90vh' }}>
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
              A New Challenger Appears!
            </h2>
            <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors text-3xl leading-none"
            >
                &times;
            </button>
        </div>
        <div className="overflow-y-auto pr-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {availablePersonas.map(p => (
                <PersonaCard
                    key={p.id}
                    persona={p}
                    isSelected={false}
                    onSelect={onSelect}
                />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AddCharacterModal;
