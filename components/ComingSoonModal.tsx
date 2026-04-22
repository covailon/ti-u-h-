import React from 'react';
import { X } from 'lucide-react';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

const ComingSoonModal: React.FC<ComingSoonModalProps> = ({ isOpen, onClose, title = "Sắp ra mắt", message = "Tính năng này đang được phát triển. Vui lòng quay lại sau!" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 text-gray-500">
            <X size={24} />
          </button>
        </div>
        <div>
            <p className="text-gray-600 whitespace-pre-wrap">{message}</p>
        </div>
        <div className="mt-6 flex justify-end">
            <button 
                onClick={onClose}
                className="bg-pink-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors"
            >
                Đã hiểu
            </button>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonModal;
