import React, { useState, useContext, useRef } from 'react';
import { X, Camera } from 'lucide-react';
import { AppContext } from '../contexts/AppContext';

interface CreateCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateCharacterModal: React.FC<CreateCharacterModalProps> = ({ isOpen, onClose }) => {
  const context = useContext(AppContext);
  const [name, setName] = useState('');
  const [image, setImage] = useState('https://i.pinimg.com/564x/e7/7e/34/e77e34f107f91880f684496b866a4f9b.jpg');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [systemInstruction, setSystemInstruction] = useState('');
  const [firstMessage, setFirstMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !context) return null;
  const { addCharacter } = context;

  const handleCreate = () => {
    if (name && systemInstruction && firstMessage) {
        addCharacter({
            name,
            image,
            description,
            tags: tags.split(',').map(t => t.trim()).filter(Boolean),
            systemInstruction,
            firstMessage
        });
        onClose();
    } else {
        alert("Vui lòng điền các trường bắt buộc: Tên, Hướng dẫn hệ thống, Tin nhắn đầu tiên.");
    }
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setImage(event.target.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg w-full max-w-lg mx-4 h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Tạo nhân vật mới</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 text-gray-500">
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex flex-col items-center">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <img src={image} alt="Avatar" className="w-24 h-24 rounded-full object-cover"/>
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera size={32} className="text-white"/>
                    </div>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden"/>
                <p className="text-xs text-gray-500 mt-2">Nhấp để thay đổi avatar</p>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên char *</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md"/>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio ngắn gọn</label>
                <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md"/>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (cách nhau bởi dấu phẩy)</label>
                <input type="text" value={tags} onChange={e => setTags(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" placeholder="VD: nữ, genz, báo"/>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prompt tính cách (càng chi tiết càng real nha) *</label>
                <textarea value={systemInstruction} onChange={e => setSystemInstruction(e.target.value)} rows={6} className="w-full p-2 border border-gray-300 rounded-md resize-y"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Câu chào đầu tiên *</label>
                <textarea value={firstMessage} onChange={e => setFirstMessage(e.target.value)} rows={3} className="w-full p-2 border border-gray-300 rounded-md resize-y"/>
            </div>
        </div>
        <div className="p-4 border-t flex justify-end">
            <button onClick={handleCreate} className="bg-pink-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors">
                Tạo Char
            </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCharacterModal;
