
import React, { useContext } from 'react';
import { ArrowLeft, Search, Mic, Clock } from 'lucide-react';
import { AppScreen } from '../../types';
import { AppContext } from '../../contexts/AppContext';

interface AppProps {
  setCurrentApp: (app: AppScreen) => void;
}

const GoogleApp: React.FC<AppProps> = ({ setCurrentApp }) => {
  const context = useContext(AppContext);
  if (!context || !context.characterProfile) return null;

  const history = context.characterProfile.appContent.searchHistory || [];

  return (
    <div className="bg-white h-full w-full text-black flex flex-col">
      <header className="p-2 border-b sticky top-0 bg-white z-10">
         <button onClick={() => setCurrentApp(AppScreen.HOME)}>
          <ArrowLeft size={24} className="text-gray-600 mb-2" />
        </button>
        <div className="flex items-center w-full bg-white rounded-full px-4 py-2 border border-gray-200 shadow-sm focus-within:shadow-md transition-shadow">
            <Search size={18} className="text-gray-400 mr-2" />
            <input type="text" placeholder="Tìm kiếm" className="bg-transparent w-full outline-none text-sm text-gray-700" />
            <Mic size={18} className="text-blue-500 ml-2" />
        </div>
      </header>
      <div className="p-4">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Tìm kiếm gần đây</h2>
        <div className="space-y-1">
            {history.map((search, index) => (
                <div key={index} className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 -mx-2">
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-700">{search}</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default GoogleApp;
