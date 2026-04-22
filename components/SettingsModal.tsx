import React, { useContext, useRef } from 'react';
import { AppContext } from '../contexts/AppContext';
import { X, Camera } from 'lucide-react';

const SettingsModal: React.FC = () => {
  const context = useContext(AppContext);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!context) return null;

  const { isSettingsOpen, setIsSettingsOpen, userProfile, setUserProfile } = context;

  if (!isSettingsOpen) return null;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserProfile(prev => ({ ...prev, name: e.target.value }));
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setUserProfile(prev => ({...prev, avatar: event.target.result as string}));
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleNsfwToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserProfile(prev => ({ ...prev, isNsfwEnabled: e.target.checked }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-white" onClick={() => setIsSettingsOpen(false)}>
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Cài đặt</h2>
          <button onClick={() => setIsSettingsOpen(false)} className="p-1 rounded-full hover:bg-gray-700">
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
              <img src={userProfile.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover"/>
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={32} />
              </div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden"/>
          </div>

          <div>
            <label htmlFor="charName" className="block text-sm font-medium text-gray-400 mb-1">Tên của bạn</label>
            <input 
              type="text"
              id="charName"
              value={userProfile.name}
              onChange={handleNameChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label htmlFor="charAge" className="block text-sm font-medium text-gray-400 mb-1">Tuổi</label>
                <input 
                    type="number"
                    id="charAge"
                    value={userProfile.age}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, age: parseInt(e.target.value, 10) || 0 }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-pink-500"
                />
             </div>
             <div>
                <label htmlFor="charGender" className="block text-sm font-medium text-gray-400 mb-1">Giới tính</label>
                <select 
                    id="charGender" 
                    value={userProfile.gender}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, gender: e.target.value as 'male' | 'female' | 'other' }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-pink-500"
                >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                </select>
             </div>
          </div>

           <div className="flex justify-between items-center">
            <div>
              <label className="block text-sm font-medium text-gray-400">Bộ lọc nội dung 18+</label>
              <p className="text-xs text-gray-500">Cho phép nội dung người lớn và nhạy cảm.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={userProfile.isNsfwEnabled} 
                onChange={handleNsfwToggle} 
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-pink-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
            </label>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SettingsModal;