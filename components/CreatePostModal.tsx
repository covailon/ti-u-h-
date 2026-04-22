import React, { useState, useContext } from 'react';
import { X } from 'lucide-react';
import { AppContext } from '../contexts/AppContext';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
  const [content, setContent] = useState('');
  const context = useContext(AppContext);

  if (!isOpen) return null;

  const handlePost = () => {
    if (content.trim() && context) {
      context.addUserPost(content.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Tạo bài viết mới</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 text-gray-500">
            <X size={24} />
          </button>
        </div>
        
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Bạn đang nghĩ gì?"
          className="w-full h-40 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-pink-400"
          autoFocus
        />

        <div className="mt-4 flex justify-end">
            <button 
                onClick={handlePost}
                disabled={!content.trim()}
                className="bg-pink-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                Đăng
            </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
