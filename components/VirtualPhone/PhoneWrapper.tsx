
import React, { useState, useContext } from 'react';
import { AppScreen } from '../../types';
import HomeScreen from './HomeScreen';
import { AppContext } from '../../contexts/AppContext';
import InstagramApp from './InstagramApp';
import NotesApp from './NotesApp';
import BankApp from './BankApp';
import GoogleApp from './GoogleApp';
import PhoneApp from './PhoneApp';
import MessagesApp from './MessagesApp';
import WallpaperModal from './WallpaperModal';
import TikTokApp from './TikTokApp';
import XApp from './XApp';
import { ArrowLeft } from 'lucide-react';

const PhoneWrapper: React.FC = () => {
  const [currentApp, setCurrentApp] = useState<AppScreen>(AppScreen.HOME);
  const context = useContext(AppContext);

  if (!context) return null;
  const { isPhoneOpen, setIsPhoneOpen, isWallpaperModalOpen, characterProfile } = context;
  
  if (!isPhoneOpen || !characterProfile) return null;

  const renderApp = () => {
    switch (currentApp) {
      case AppScreen.INSTAGRAM:
        return <InstagramApp setCurrentApp={setCurrentApp} />;
      case AppScreen.NOTES:
        return <NotesApp setCurrentApp={setCurrentApp} />;
      case AppScreen.BANK:
        return <BankApp setCurrentApp={setCurrentApp} />;
      case AppScreen.GOOGLE:
        return <GoogleApp setCurrentApp={setCurrentApp} />;
      case AppScreen.PHONE:
        return <PhoneApp setCurrentApp={setCurrentApp} />;
      case AppScreen.MESSAGES:
        return <MessagesApp setCurrentApp={setCurrentApp} />;
      case AppScreen.TIKTOK:
        return <TikTokApp setCurrentApp={setCurrentApp} />;
      case AppScreen.X:
        return <XApp setCurrentApp={setCurrentApp} />;
      case AppScreen.CAMERA:
        return (
            <div className="bg-black h-full w-full text-white flex flex-col items-center justify-center p-4">
                 <header className="absolute top-0 left-0 right-0 flex items-center p-2 z-10">
                    <button onClick={() => setCurrentApp(AppScreen.HOME)}>
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-lg font-bold mx-auto">Máy ảnh</h1>
                </header>
                <p>Tính năng Máy ảnh sắp ra mắt!</p>
            </div>
        )
      case AppScreen.HOME:
      default:
        return <HomeScreen 
            setCurrentApp={setCurrentApp} 
            apps={characterProfile.phoneConfig.apps}
            dockApps={characterProfile.phoneConfig.dockApps}
        />;
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40" 
      onClick={() => setIsPhoneOpen(false)}
    >
      <div 
        className="bg-black rounded-[40px] p-2 shadow-2xl border-2 border-gray-700" 
        style={{ width: '225px', height: '458px' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-blue-300 w-full h-full rounded-[32px] overflow-hidden relative" style={{backgroundImage: `url(${characterProfile.phoneConfig.wallpaper})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-b-lg z-20"></div>
          <div className="absolute top-2 left-0 w-1 h-8 bg-gray-800 rounded-r-full"></div>
          <div className="absolute top-12 left-0 w-1 h-8 bg-gray-800 rounded-r-full"></div>
          <div className="absolute top-10 right-0 w-1 h-12 bg-gray-800 rounded-l-full"></div>
          <div className="w-full h-full overflow-y-auto">
            {renderApp()}
          </div>
        </div>
      </div>
      {isWallpaperModalOpen && <WallpaperModal />}
    </div>
  );
};

export default PhoneWrapper;