import React, { useContext } from 'react';
import { X, BookOpen } from 'lucide-react';
import { AppContext } from '../contexts/AppContext';

interface DiaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DiaryModal: React.FC<DiaryModalProps> = ({ isOpen, onClose }) => {
  const context = useContext(AppContext);
  if (!isOpen || !context) return null;

  const { activeChatSession, characterProfile } = context;
  const diaryEntries = activeChatSession?.diary || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg w-full max-w-md mx-4 h-3/4 flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Nhật ký của {characterProfile?.name}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 text-gray-500">
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 bg-yellow-50">
            {diaryEntries.length > 0 ? (
                 <div className="space-y-4">
                    {diaryEntries.map((entry, index) => (
                        <div key={index} className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                           <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{entry}</p>
                        </div>
                    ))}
                 </div>
            ) : (
                <div className="text-center p-10 text-gray-500 flex flex-col items-center">
                    <BookOpen size={48} className="mb-4" />
                    <p>Nhật ký trống.</p>
                    <p className="text-sm mt-1">Có vẻ như {characterProfile?.name} chưa viết gì cả.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default DiaryModal;