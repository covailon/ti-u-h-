
import React, { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Send, X, ImageIcon, Bookmark, History, BookText, Smartphone, Lightbulb, Gift } from 'lucide-react';

const ActionButton: React.FC<{ icon: React.ReactNode; label: string; onClick?: () => void }> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center gap-2 text-center text-gray-600 hover:text-pink-500 transition-colors">
      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md border border-gray-100">
        {icon}
      </div>
      <span className="text-xs font-medium w-full">{label}</span>
    </button>
);


const InputBar: React.FC = () => {
  const [text, setText] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const context = useContext(AppContext);
  
  if (!context) return null;
  const { sendMessage, sendImage, isLoading, setIsPhoneOpen, setIsDiaryModalOpen, setIsGiftModalOpen } = context;

  const handleSend = () => {
    if (text.trim() && !isLoading) {
      sendMessage(text.trim());
      setText('');
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        sendImage(base64, file.type, text.trim());
        setText('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const actions = [
    { icon: <ImageIcon size={32} className="text-gray-500"/>, label: 'Gửi ảnh', onClick: () => fileInputRef.current?.click() },
    { icon: <Gift size={32} className="text-gray-500"/>, label: 'Tặng quà', onClick: () => setIsGiftModalOpen(true) },
    { icon: <BookText size={32} className="text-gray-500"/>, label: 'Nhật ký bẻ lái', onClick: () => setIsDiaryModalOpen(true) },
    { icon: <Smartphone size={32} className="text-gray-500"/>, label: 'Check đt', onClick: () => setIsPhoneOpen(true) },
  ];

  return (
    <div className="px-4 pt-3 pb-4 bg-[#FFF5F8] border-t border-pink-200">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImageSelect} 
        accept="image/*" 
        className="hidden" 
      />
      <div className="flex items-center bg-white rounded-full p-1 shadow-sm border border-gray-200 mb-4">
        <button onClick={() => setText('')} className="p-2 text-gray-400 hover:text-gray-600 rounded-full">
          <X size={20} />
        </button>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Nhập tin nhắn của bạn..."
          className="flex-1 bg-transparent px-2 py-1 outline-none resize-none text-gray-800 placeholder:text-gray-400"
          rows={1}
          style={{ maxHeight: '80px' }}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !text.trim()}
          className="p-2 text-pink-500 disabled:text-gray-300 rounded-full"
        >
          <Send size={24} />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-x-2 gap-y-4">
        {actions.map((action, index) => <ActionButton key={index} {...action} />)}
      </div>
    </div>
  );
};

export default InputBar;