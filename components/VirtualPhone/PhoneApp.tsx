
import React, { useContext } from 'react';
import { ArrowLeft, User, Clock, Phone } from 'lucide-react';
import { AppScreen } from '../../types';
import { AppContext } from '../../contexts/AppContext';

interface AppProps {
  setCurrentApp: (app: AppScreen) => void;
}

const PhoneApp: React.FC<AppProps> = ({ setCurrentApp }) => {
  const context = useContext(AppContext);
  if (!context || !context.characterProfile) return null;

  const contacts = context.characterProfile.appContent.contacts || [];

  return (
    <div className="bg-gray-100 h-full w-full text-black flex flex-col">
      <header className="flex items-center justify-between p-2 border-b bg-white sticky top-0 z-10">
        <button onClick={() => setCurrentApp(AppScreen.HOME)}>
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <h1 className="text-lg font-bold mx-auto text-gray-800">Điện thoại</h1>
        <User size={24} className="text-gray-600" />
      </header>
      <div className="p-4">
        <h2 className="font-semibold mb-2 text-gray-600">Gần đây</h2>
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            {contacts.map((contact, index) => (
                <div key={index} className={`flex items-center justify-between p-3 hover:bg-gray-50 ${index < contacts.length - 1 ? 'border-b' : ''}`}>
                    <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                            {contact.name[0]}
                         </div>
                        <div>
                            <p className="font-medium text-gray-800">{contact.name}</p>
                            <p className="text-xs text-gray-500">{contact.status}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400">
                        <span className="text-xs">{contact.time}</span>
                        <Phone size={16} className="text-blue-500"/>
                    </div>
                </div>
            ))}
            {contacts.length === 0 && <p className="p-4 text-center text-gray-500">Trống</p>}
        </div>
      </div>
    </div>
  );
};

export default PhoneApp;
