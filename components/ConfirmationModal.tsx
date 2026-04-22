
import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4 animate-pop-in" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={24} className="text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 text-gray-500">
            <X size={24} />
          </button>
        </div>
        <div>
            <p className="text-gray-600">{message}</p>
        </div>
        <div className="mt-6 flex justify-end gap-3">
            <button 
                onClick={onClose}
                className="bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
                Hủy
            </button>
            <button 
                onClick={() => {
                    onConfirm();
                    onClose();
                }}
                className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
                Xác nhận
            </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
