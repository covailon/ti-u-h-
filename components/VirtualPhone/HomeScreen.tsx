
import React, { useState, useEffect, useContext } from 'react';
import { AppScreen } from '../../types';
import { Image } from 'lucide-react';
import { AppContext } from '../../contexts/AppContext';

// Colored SVG Icons
const InstagramIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="7" fill="url(#paint0_radial_1_2)" />
    <rect x="3" y="3" width="26" height="26" rx="5" stroke="white" strokeWidth="2" />
    <circle cx="16" cy="16" r="7" stroke="white" strokeWidth="2" />
    <circle cx="24" cy="8" r="1.5" fill="white" />
    <defs>
      <radialGradient id="paint0_radial_1_2" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(3.5 3.5) rotate(45) scale(39.598)">
        <stop stopColor="#FEDA77" />
        <stop offset="0.3" stopColor="#F58529" />
        <stop offset="0.6" stopColor="#DD2A7B" />
        <stop offset="1" stopColor="#8134AF" />
      </radialGradient>
    </defs>
  </svg>
);

const NotesIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="7" fill="#FFDE6C"/>
    <rect x="5" y="5" width="22" height="4" rx="1" fill="#D9A44E"/>
    <line x1="8" y1="14" x2="24" y2="14" stroke="#D1D1D1" strokeWidth="2" strokeLinecap="round"/>
    <line x1="8" y1="20" x2="24" y2="20" stroke="#D1D1D1" strokeWidth="2" strokeLinecap="round"/>
    <line x1="8" y1="26" x2="16" y2="26" stroke="#D1D1D1" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const BankIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="7" fill="#60D883"/>
    <path d="M16 10L10 14V22H22V14L16 10Z" stroke="#2D6B3F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 22H25" stroke="#2D6B3F" strokeWidth="2" strokeLinecap="round"/>
    <path d="M13 18H19" stroke="#2D6B3F" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const GoogleIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="7" fill="white"/>
    <path d="M16.5 16.5V20.5H23.1C22.8 22.5 21.2 24 19 24C16.2 24 14 21.8 14 19C14 16.2 16.2 14 19 14C20.3 14 21.4 14.5 22.2 15.3L25 12.5C23.2 10.9 21.2 10 19 10C14.6 10 11 13.6 11 18C11 22.4 14.6 26 19 26C23.4 26 26.5 22.9 26.5 18.6C26.5 18 26.5 17.3 26.4 16.5H16.5Z" fill="#4285F4"/>
  </svg>
);

const TikTokIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="5" fill="black"/>
        <path d="M14.5 4.00002C13 4.00002 12.5 5.50002 12.5 6.50002V12.5C12.5 14.7 10.7 16.5 8.5 16.5C6.3 16.5 4.5 14.7 4.5 12.5C4.5 10.3 6.3 8.50002 8.5 8.50002V11.5C7.9 11.5 7.5 11.9 7.5 12.5C7.5 13.1 7.9 13.5 8.5 13.5C9.1 13.5 9.5 13.1 9.5 12.5V4.00002H12.5C12.5 4.00002 14 1.50002 16.5 1.50002C19 1.50002 19.5 4.00002 19.5 4.00002C19.5 4.00002 19.5 6.50002 17 6.50002C14.5 6.50002 14.5 4.00002 14.5 4.00002Z" fill="url(#tik-tok-grad)"/>
        <defs>
            <linearGradient id="tik-tok-grad" x1="4.5" y1="9" x2="19.5" y2="9" gradientUnits="userSpaceOnUse">
                <stop stopColor="#25F4EE"/>
                <stop offset="1" stopColor="#FE2C55"/>
            </linearGradient>
        </defs>
    </svg>
);


const XIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="7" fill="black"/>
    <path d="M12 10L22 22M12 22L22 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="7" fill="#4BD366"/>
    <path d="M22.9 19.8C22.9 20.5 22.3 21.1 21.6 21.1C18.6 21.1 15.9 19.9 13.7 17.7C11.5 15.5 10.3 12.8 10.3 9.8C10.3 9.1 10.9 8.5 11.6 8.5H13.4C13.9 8.5 14.4 8.9 14.5 9.4L15.4 12.6C15.5 13.1 15.3 13.6 14.9 13.9L13.1 15.7C14.3 18 16.4 20.1 18.7 21.3L20.5 19.5C20.8 19.1 21.3 18.9 21.8 19L25 19.9C25.5 20 25.9 20.5 25.9 21V22.9L22.9 19.8Z" transform="rotate(-45 16 16)" fill="white"/>
  </svg>
);

const MessagesIcon = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="7" fill="#4BD366"/>
        <path d="M24 10H8C6.9 10 6 10.9 6 12V18C6 19.1 6.9 20 8 20H22L26 24V12C26 10.9 25.1 10 24 10Z" fill="white"/>
    </svg>
);

const CameraIcon = () => (
    <div className="w-full h-full rounded-lg bg-gray-600 flex items-center justify-center">
        <Image size={20} className="text-white"/>
    </div>
);


const APP_REGISTRY: Record<AppScreen, { name: string; icon: React.ReactNode }> = {
    [AppScreen.INSTAGRAM]: { name: 'Instagram', icon: <InstagramIcon /> },
    [AppScreen.NOTES]: { name: 'Ghi chú', icon: <NotesIcon /> },
    [AppScreen.BANK]: { name: 'Ngân hàng', icon: <BankIcon /> },
    [AppScreen.GOOGLE]: { name: 'Google', icon: <GoogleIcon /> },
    [AppScreen.TIKTOK]: { name: 'TikTok', icon: <TikTokIcon /> },
    [AppScreen.X]: { name: 'X', icon: <XIcon /> },
    [AppScreen.PHONE]: { name: 'Điện thoại', icon: <PhoneIcon /> },
    [AppScreen.MESSAGES]: { name: 'Tin nhắn', icon: <MessagesIcon /> },
    [AppScreen.CAMERA]: { name: 'Ảnh', icon: <CameraIcon /> },
    [AppScreen.HOME]: { name: 'Home', icon: <span>H</span> },
};


interface HomeScreenProps {
  setCurrentApp: (app: AppScreen) => void;
  apps: AppScreen[];
  dockApps: AppScreen[];
}

const AppIcon: React.FC<{ icon: React.ReactNode; name: string; onClick?: () => void }> = ({ icon, name, onClick }) => (
  <div onClick={onClick} className="flex flex-col items-center gap-1 text-white cursor-pointer transform hover:scale-110 transition-transform">
    <div className="w-14 h-14 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">{icon}</div>
    {name && <span className="text-xs font-medium drop-shadow-md">{name}</span>}
  </div>
);

const FrogClock: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    const hourDeg = (hours % 12 + minutes / 60) * 30;
    const minuteDeg = (minutes + seconds / 60) * 6;

    return (
        <div className="w-full h-full bg-green-300/80 backdrop-blur-sm rounded-2xl relative flex items-center justify-center p-2 shadow-lg">
            <div className="absolute w-16 h-16 rounded-full bg-white"></div>
            {/* Eyes */}
            <div className="absolute top-1 left-2 w-6 h-6 rounded-full bg-white border-2 border-black">
                <div className="w-2 h-2 bg-black rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
            </div>
            <div className="absolute top-1 right-2 w-6 h-6 rounded-full bg-white border-2 border-black">
                <div className="w-2 h-2 bg-black rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
            </div>

            {/* Hands */}
            <div style={{ transform: `rotate(${hourDeg}deg)` }} className="absolute w-1 h-8 bg-black bottom-1/2 left-1/2 -translate-x-1/2 origin-bottom rounded-t-full"></div>
            <div style={{ transform: `rotate(${minuteDeg}deg)` }} className="absolute w-0.5 h-10 bg-black bottom-1/2 left-1/2 -translate-x-1/2 origin-bottom rounded-t-full"></div>
            <div className="absolute w-2 h-2 bg-red-500 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        </div>
    )
}

const DayCounterWidget: React.FC = () => {
    const [dayOfYear, setDayOfYear] = useState(0);

    useEffect(() => {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
        const oneDay = 1000 * 60 * 60 * 24;
        setDayOfYear(Math.floor(diff / oneDay));
    }, []);

    return (
         <div className="w-full h-full bg-purple-300/80 backdrop-blur-sm rounded-2xl p-2 text-purple-900 flex flex-col justify-center items-center shadow-lg">
             <span className="font-bold text-4xl">{dayOfYear}</span>
             <span className="text-xs">ngày đã trôi qua</span>
         </div>
    );
};


const HomeScreen: React.FC<HomeScreenProps> = ({ setCurrentApp, apps, dockApps }) => {
  const context = useContext(AppContext);
  if (!context) return null;
  const { setIsWallpaperModalOpen } = context;

  const handleDockClick = (appId: AppScreen) => {
    if (appId === AppScreen.CAMERA) {
      setIsWallpaperModalOpen(true);
    } else {
      setCurrentApp(appId);
    }
  }

  return (
    <div className="h-full w-full p-4 flex flex-col relative">
      {/* This div provides a slight blur/darken effect to make widgets/icons more readable */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>

      {/* All content must be in a relative container to appear above the background effect */}
      <div className="relative z-10 flex flex-col h-full">
        <div className="grid grid-cols-2 gap-2 h-32 mb-4">
          <DayCounterWidget />
          <FrogClock />
        </div>

        <div className="grid grid-cols-4 gap-y-4 flex-grow content-start">
            {apps.map(appId => {
                const app = APP_REGISTRY[appId];
                if (!app) return null;
                return <AppIcon key={appId} icon={app.icon} name={app.name} onClick={() => setCurrentApp(appId)} />;
            })}
        </div>

        {/* Dock */}
        <div className="flex-shrink-0 bg-black/20 backdrop-blur-lg rounded-2xl p-2 mt-2">
          <div className="flex justify-around items-center">
              {dockApps.map(appId => {
                  const app = APP_REGISTRY[appId];
                  if (!app) return null;
                  return <AppIcon key={appId} icon={app.icon} name="" onClick={() => handleDockClick(appId)} />;
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;