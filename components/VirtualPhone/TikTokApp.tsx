
import React, { useContext, useState } from 'react';
import { ArrowLeft, Heart, MessageCircle, Share, Music } from 'lucide-react';
import { AppScreen } from '../../types';
import { AppContext } from '../../contexts/AppContext';

interface AppProps {
  setCurrentApp: (app: AppScreen) => void;
}

const TikTokApp: React.FC<AppProps> = ({ setCurrentApp }) => {
  const context = useContext(AppContext);
  if (!context || !context.characterProfile) return null;

  const tiktokData = context.characterProfile.appContent.tiktok;
  
  if (!tiktokData) return (
      <div className="bg-black h-full w-full text-white flex flex-col items-center justify-center">
          <p>Ứng dụng chưa được cài đặt.</p>
          <button onClick={() => setCurrentApp(AppScreen.HOME)} className="mt-4 text-gray-400">Quay lại</button>
      </div>
  );

  return (
    <div className="bg-black h-full w-full text-white flex flex-col relative overflow-hidden">
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-3 text-white">
         <button onClick={() => setCurrentApp(AppScreen.HOME)}>
          <ArrowLeft size={24} className="drop-shadow-md" />
        </button>
        <div className="flex gap-4 font-semibold">
          <span className="text-gray-300">Following</span>
          <span className="text-white font-bold border-b-2">For You</span>
        </div>
        <div className="w-6"></div>
      </header>

      <div className="h-full w-full overflow-y-auto snap-y snap-mandatory scrollbar-hide">
        {tiktokData.posts.map((post) => (
          <div key={post.id} className="h-full w-full flex-shrink-0 relative snap-start">
            <img src={post.videoUrl} alt={post.description} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none"></div>
            
            <div className="absolute bottom-12 left-4 right-16 z-10 text-left">
              <div className="flex items-center gap-2 mb-2">
                 <p className="font-bold text-shadow">@{tiktokData.profile.handle}</p>
              </div>
              <p className="text-sm mb-2 text-shadow">{post.description}</p>
              <div className="flex items-center gap-2 mt-2 bg-white/20 px-3 py-1 rounded-full w-max backdrop-blur-sm">
                <Music size={14} />
                <p className="text-xs">Original Sound - {tiktokData.profile.handle}</p>
              </div>
            </div>

            <div className="absolute bottom-12 right-2 z-10 flex flex-col items-center gap-6">
               <div className="relative">
                 <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden p-0.5">
                    <img src={post.userAvatar} alt="user avatar" className="w-full h-full rounded-full object-cover" />
                 </div>
                 <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-[10px] font-bold">+</span>
                 </div>
               </div>
              <button className="flex flex-col items-center gap-1">
                <Heart size={30} className="text-white fill-white/10" />
                <span className="text-xs font-semibold">{post.likes}</span>
              </button>
              <button className="flex flex-col items-center gap-1">
                <MessageCircle size={30} className="text-white fill-white/10" />
                <span className="text-xs font-semibold">{post.comments}</span>
              </button>
               <button className="flex flex-col items-center gap-1">
                <Share size={30} className="text-white fill-white/10" />
                <span className="text-xs font-semibold">{post.shares}</span>
              </button>
              <div className="w-8 h-8 bg-gray-800 rounded-full border-4 border-gray-700 flex items-center justify-center animate-spin-slow">
                 <img src={post.userAvatar} className="w-full h-full rounded-full opacity-80"/>
              </div>
            </div>
          </div>
        ))}
        {tiktokData.posts.length === 0 && (
             <div className="h-full w-full flex items-center justify-center">
                <p>Không có video nào.</p>
             </div>
        )}
      </div>
    </div>
  );
};

export default TikTokApp;
