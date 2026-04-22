import React, { useContext, useState } from 'react';
import { X } from 'lucide-react';
import { AppContext } from '../contexts/AppContext';
import { availableGifts } from '../mockData';
import { Gift } from '../types';

const GiftModal: React.FC = () => {
  const context = useContext(AppContext);
  const [message, setMessage] = useState('');
  
  if (!context) return null;
  const { isGiftModalOpen, setIsGiftModalOpen, sendGift } = context;
  if (!isGiftModalOpen) return null;

  const handleSendGift = (gift: Gift) => {
    const giftMessage = message.trim() || gift.description;
    sendGift(gift, giftMessage);
    setMessage('');
    setIsGiftModalOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setIsGiftModalOpen(false)}>
      <div className="bg-white rounded-lg w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Gửi quà tặng cho crush</h2>
          <button onClick={() => setIsGiftModalOpen(false)} className="p-1 rounded-full hover:bg-gray-200 text-gray-500"><X size={24} /></button>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            {availableGifts.map(gift => (
              <div key={gift.id} onClick={() => handleSendGift(gift)} className="flex flex-col items-center p-2 rounded-lg hover:bg-pink-50 cursor-pointer transition-colors">
                <span className="text-4xl">{gift.icon}</span>
                <span className="text-xs mt-1 text-gray-600">{gift.name}</span>
              </div>
            ))}
          </div>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Gửi lời iu thương..."
            className="w-full p-2 mt-4 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-pink-400"
            rows={2}
          />
        </div>
      </div>
    </div>
  );
};

export default GiftModal;