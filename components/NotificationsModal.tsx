import React from 'react';
import { X, Bot } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockNotifications = [
    { id: 3, user: 'Hệ thống', action: 'Chào mừng bạn đến với thế giới AI!', time: '1 ngày trước', icon: <Bot size={20} /> },
];

const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg w-full max-w-md mx-4 h-3/4 flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Thông báo</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 text-gray-500">
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
            {mockNotifications.length > 0 ? (
                 <div className="divide-y">
                    {mockNotifications.map(notif => (
                        <div key={notif.id} className="p-4 flex items-start gap-3 hover:bg-gray-50">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                {notif.avatar ? <img src={notif.avatar} className="w-full h-full rounded-full object-cover" /> : notif.icon}
                            </div>
                            <div>
                                <p className="text-gray-800">
                                    <span className="font-semibold">{notif.user}</span> {notif.action}
                                </p>
                                <p className="text-xs text-blue-500 mt-0.5">{notif.time}</p>
                            </div>
                        </div>
                    ))}
                 </div>
            ) : (
                <div className="text-center p-10 text-gray-500">
                    <p>Chưa có thông báo mới.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsModal;
