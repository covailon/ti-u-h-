
import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(onFinish, 500); // Wait for transition
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-pink-500 to-rose-600 transition-opacity duration-500 ${fading ? 'opacity-0' : 'opacity-100'}`}>
      <div className="text-center animate-bounce">
        <div className="inline-block p-4 bg-white rounded-full shadow-xl mb-4">
            <Heart size={64} className="text-pink-500 fill-pink-500" />
        </div>
        <h1 className="text-5xl font-bold text-white tracking-widest drop-shadow-md font-serif">HeartChat!</h1>
        <p className="text-white/80 mt-2 font-light tracking-widest uppercase text-sm">Kết nối trái tim AI</p>
      </div>
    </div>
  );
};

export default SplashScreen;