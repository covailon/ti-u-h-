

import React, { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../contexts/AppContext';
import { ChevronLeft, Sparkles, Heart, MoreVertical, Phone, RefreshCw, MessageSquareQuote } from 'lucide-react';

const Header: React.FC = () => {
  const context = useContext(AppContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsMenuOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  if (!context) return null;
  const { characterProfile, closeChat, startCall, resetChat, askInnerThoughts, userProfile } = context;

  if (!characterProfile) return null;

  const handleReset = () => {
    resetChat();
    setIsMenuOpen(false);
  }

  const handleAskThoughts = () => {
    askInnerThoughts();
    setIsMenuOpen(false);
  }

  return (
    <header className="flex items-center p-2 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
      <button onClick={closeChat} className="p-2 rounded-full hover:bg-gray-100">
        <ChevronLeft size={24} className="text-gray-600" />
      </button>

      <div className="flex-1 flex justify-center">
        <div className="flex items-center gap-2">
            <img src={characterProfile.image} alt={characterProfile.name} className="w-9 h-9 rounded-full object-cover" />
            <h1 className="text-lg font-bold text-gray-800">{characterProfile.name}</h1>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button onClick={startCall} className="p-2 rounded-full hover:bg-pink-50 text-pink-500">
            <Phone size={24}/>
        </button>
        <div className="flex items-center bg-pink-100 rounded-full px-3 py-1.5">
          <span className="font-bold text-sm text-pink-600">{userProfile.coins || 0}</span>
          <Heart size={16} className="ml-1 text-pink-500 fill-current" />
        </div>
        <div className="relative" ref={menuRef}>
            <button onClick={() => setIsMenuOpen(prev => !prev)} className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
              <MoreVertical size={24} />
            </button>
            {isMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border z-20 animate-pop-in origin-top-right">
                    <button onClick={handleAskThoughts} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg">
                        <MessageSquareQuote size={16} />
                        <span>Nghĩ gì nè</span>
                    </button>
                    <button onClick={handleReset} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg">
                        <RefreshCw size={16} />
                        <span>Đặt lại chat</span>
                    </button>
                </div>
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;