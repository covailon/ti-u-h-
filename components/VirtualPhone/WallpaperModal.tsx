import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { X } from 'lucide-react';

const wallpapers = [
    'https://i.pinimg.com/564x/a7/67/da/a767da40795c75333f32408013665a3c.jpg',
    'https://i.pinimg.com/564x/77/84/75/7784755a73e4811a4bbd82845c083697.jpg',
    'https://i.pinimg.com/564x/d5/36/44/d53644265d638971d2b8600d2da285d8.jpg',
    'https://i.pinimg.com/564x/e7/0a/e7/e70ae7330f4e1f79a93077e6826139c5.jpg',
    'https://i.pinimg.com/564x/f3/7a/a8/f37aa83f6f14b62089f2130026e632d4.jpg',
    'https://i.pinimg.com/564x/05/88/a3/0588a3810145c26a5758f8e53f19114b.jpg',
];

const WallpaperModal: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;

    const { setIsWallpaperModalOpen, setPhoneWallpaper } = context;

    const handleSelectWallpaper = (url: string) => {
        setPhoneWallpaper(url);
        setIsWallpaperModalOpen(false);
    };

    return (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setIsWallpaperModalOpen(false)}>
            <div className="bg-white rounded-lg p-4 w-11/12 max-w-xs" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-black">Chọn hình nền</h3>
                    <button onClick={() => setIsWallpaperModalOpen(false)} className="p-1"><X size={20} className="text-gray-500" /></button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {wallpapers.map(url => (
                        <div key={url} onClick={() => handleSelectWallpaper(url)} className="cursor-pointer aspect-[9/16] rounded-md overflow-hidden ring-2 ring-transparent hover:ring-pink-500 transition-all">
                            <img src={url} alt="wallpaper" className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WallpaperModal;