import React from 'react';
import { Send } from 'lucide-react';

interface ThoughtBubbleProps {
    thought: string;
    onClick: () => void;
}

const ThoughtBubble: React.FC<ThoughtBubbleProps> = ({ thought, onClick }) => {
  return (
    <div 
        onClick={onClick}
        className="absolute bottom-full mb-2 w-full flex justify-center animate-fade-in-up cursor-pointer"
    >
      <div className="relative bg-white border border-pink-200 rounded-full py-2 px-4 shadow-md flex items-center gap-2 group hover:bg-pink-50 transition-colors">
        <p className="text-sm text-gray-700 italic">"{thought}"</p>
        <Send size={16} className="text-pink-400 group-hover:text-pink-600 transition-colors" />
        <div 
            className="absolute left-1/2 -translate-x-1/2 bottom-0 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-white"
            style={{ filter: 'drop-shadow(0 1px 0 rgb(0 0 0 / 0.05))' }}
        ></div>
         <div 
            className="absolute left-1/2 -translate-x-1/2 bottom-[-1.5px] w-0 h-0 border-l-[11px] border-l-transparent border-r-[11px] border-r-transparent border-t-[11px] border-t-pink-200 -z-10"
        ></div>
      </div>
    </div>
  );
};

export default ThoughtBubble;