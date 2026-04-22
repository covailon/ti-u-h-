
import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

const TypingIndicator: React.FC = () => {
  const context = useContext(AppContext);
  if (!context || !context.characterProfile) return null;
  const { characterProfile } = context;

  return (
    <div className="flex items-end gap-2">
      <img src={characterProfile.image} alt={characterProfile.name} className="w-8 h-8 rounded-full object-cover" />
      <div className="px-4 py-3 rounded-2xl bg-white rounded-bl-none shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;