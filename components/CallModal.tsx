
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../contexts/AppContext';
import { PhoneOff } from 'lucide-react';

const CallModal: React.FC = () => {
  const context = useContext(AppContext);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: number | undefined;
    if (context?.callStatus === 'connected') {
      setTimer(0); // Reset timer on new connection
      interval = window.setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [context?.callStatus]);

  if (!context) return null;
  const { isCalling, endCall, characterProfile, callStatus } = context;

  if (!isCalling || !characterProfile) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const getStatusText = () => {
    switch (callStatus) {
      case 'calling':
        return 'Đang gọi...';
      case 'connected':
        return formatTime(timer);
      case 'ended':
        return 'Cuộc gọi đã kết thúc';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 z-50 flex flex-col items-center justify-between text-white p-8 animate-fade-in-up">
      <div className="absolute inset-0">
        <img src={characterProfile.image} alt="" className="w-full h-full object-cover opacity-30 blur-md" />
      </div>
      
      <div className="relative z-10 flex flex-col items-center pt-24">
        <img src={characterProfile.image} alt={characterProfile.name} className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg" />
        <h1 className="text-4xl font-bold mt-6 drop-shadow-lg">{characterProfile.name}</h1>
        <p className="text-lg mt-2 text-gray-200 drop-shadow-md">{getStatusText()}</p>
      </div>

      <div className="relative z-10 mb-8">
        <button 
          onClick={endCall} 
          className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-2xl hover:bg-red-600 transition-colors"
          aria-label="End call"
        >
          <PhoneOff size={36} />
        </button>
      </div>
    </div>
  );
};

export default CallModal;
