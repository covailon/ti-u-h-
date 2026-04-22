
import React, { useContext } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { AppScreen } from '../../types';
import { AppContext } from '../../contexts/AppContext';

interface AppProps {
  setCurrentApp: (app: AppScreen) => void;
}

const NotesApp: React.FC<AppProps> = ({ setCurrentApp }) => {
  const context = useContext(AppContext);
  if (!context || !context.characterProfile) return null;

  const notes = context.characterProfile.appContent.notes || [];

  return (
    <div className="bg-yellow-50 h-full w-full text-black flex flex-col">
      <header className="flex items-center justify-between p-2 border-b bg-white sticky top-0 z-10">
        <button onClick={() => setCurrentApp(AppScreen.HOME)}>
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <h1 className="text-lg font-bold mx-auto text-gray-800">Ghi chú</h1>
        <button>
          <Plus size={24} className="text-gray-600" />
        </button>
      </header>
      <div className="p-4 space-y-3 overflow-y-auto flex-1">
        {notes.length > 0 ? (
             notes.map(note => (
                <div key={note.id} className="p-3 bg-white rounded-lg shadow-sm border border-yellow-100">
                    <h2 className="font-semibold mb-1 text-gray-800">{note.title}</h2>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{note.content}</p>
                </div>
            ))
        ) : (
            <p className="text-center text-gray-400 mt-10">Chưa có ghi chú nào.</p>
        )}
      </div>
    </div>
  );
};

export default NotesApp;
