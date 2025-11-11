import React from 'react';
import { Persona } from '../types';

interface PersonaCardProps {
  persona: Persona;
  isSelected: boolean;
  onSelect: (persona: Persona) => void;
}

const PersonaCard: React.FC<PersonaCardProps> = ({ persona, isSelected, onSelect }) => {
  const ringColorClass = persona.borderColor.replace('border-', 'ring-');

  return (
    <div
      onClick={() => onSelect(persona)}
      className={`
        p-2 bg-brand-surface rounded-lg cursor-pointer transition-all duration-200 
        transform hover:scale-105
        ${isSelected ? `ring-2 ${ringColorClass}` : `hover:ring-2 ${ringColorClass} ring-1 ring-transparent`}
      `}
    >
      <div className="aspect-square bg-gray-700 rounded-md overflow-hidden">
        <img src={persona.iconUrl} alt={persona.name} className="w-full h-full object-cover" />
      </div>
      <p className="text-center text-sm mt-2 font-semibold truncate text-gray-300">{persona.name}</p>
    </div>
  );
};

export default PersonaCard;