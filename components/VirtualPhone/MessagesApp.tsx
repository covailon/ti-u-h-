
import React, { useContext } from 'react';
import { ArrowLeft, Edit } from 'lucide-react';
import { AppScreen } from '../../types';
import { AppContext } from '../../contexts/AppContext';

interface AppProps {
  setCurrentApp: (app: AppScreen) => void;
}

const MessagesApp: React.FC<AppProps> = ({ setCurrentApp }) => {
  const context = useContext(AppContext);
  if (!context || !context.characterProfile) return null;

  const messages = context.characterProfile.appContent.messages || [];

  return (
    <div className="bg-white h-full w-full text-black flex flex-col">
      <header className="flex items-center justify-between p-2 border-b sticky top-0 bg-white z-10">
        <button onClick={() => setCurrentApp(AppScreen.HOME)}>
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <h1 className="text-lg font-bold mx-auto text-gray-800">Tin nhắn</h1>
        <button>
          <Edit size={20} className="text-gray-600" />
        </button>
      </header>
      <div className="divide-y">
        {messages.map((msg, index) => (
            <div key={index} className="flex items-center p-3 gap-3 hover:bg-gray-50">
                {msg.unread && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full self-start mt-2"></div>}
                <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold ${msg.unread ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 'bg-gray-300'}`}>
                    {msg.sender[0]}
                </div>
                <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-start">
                        <h2 className={`text-sm ${msg.unread ? 'font-bold' : 'font-semibold'}`}>{msg.sender}</h2>
                        <span className="text-xs text-gray-400">{msg.time}</span>
                    </div>
                    <p className={`text-sm truncate ${msg.unread ? 'text-black font-medium' : 'text-gray-500'}`}>{msg.text}</p>
                </div>
            </div>
        ))}
         {messages.length === 0 && <p className="p-8 text-center text-gray-500">Hộp thư trống</p>}
      </div>
    </div>
  );
};

export default MessagesApp;
