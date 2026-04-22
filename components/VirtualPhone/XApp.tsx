
import React, { useContext } from 'react';
import { ArrowLeft, MessageCircle, Repeat, Heart, Upload, BadgeCheck } from 'lucide-react';
import { AppScreen, Tweet } from '../../types';
import { AppContext } from '../../contexts/AppContext';

interface AppProps {
  setCurrentApp: (app: AppScreen) => void;
}

const XIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231h0.001zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z"/>
    </svg>
);
  
const TweetComponent: React.FC<{ tweet: Tweet }> = ({ tweet }) => {
    const formatNumber = (num: number) => {
        if (num > 999) return `${(num / 1000).toFixed(1)}K`;
        return num;
    };
    return (
        <div className="flex items-start gap-3 p-3 border-b border-gray-800">
            <img src={tweet.authorAvatar} alt={tweet.authorName} className="w-10 h-10 rounded-full object-cover" />
            <div className="flex-1">
                <div className="flex items-center gap-1">
                    <span className="font-bold text-white">{tweet.authorName}</span>
                    <span className="text-gray-500 text-sm">@{tweet.authorHandle}</span>
                    <span className="text-gray-500 text-sm">· 2h</span>
                </div>
                <p className="whitespace-pre-wrap text-white mt-1">{tweet.content}</p>
                <div className="flex justify-between items-center mt-3 text-gray-500 max-w-sm">
                    <button className="flex items-center gap-1 hover:text-blue-500 group"><MessageCircle size={18} className="group-hover:bg-blue-900/20 rounded-full p-0.5 box-content"/> <span className="text-xs">{formatNumber(tweet.replies)}</span></button>
                    <button className="flex items-center gap-1 hover:text-green-500 group"><Repeat size={18} className="group-hover:bg-green-900/20 rounded-full p-0.5 box-content"/> <span className="text-xs">{formatNumber(tweet.retweets)}</span></button>
                    <button className="flex items-center gap-1 hover:text-pink-500 group"><Heart size={18} className="group-hover:bg-pink-900/20 rounded-full p-0.5 box-content"/> <span className="text-xs">{formatNumber(tweet.likes)}</span></button>
                    <button className="hover:text-blue-500 group"><Upload size={18} className="group-hover:bg-blue-900/20 rounded-full p-0.5 box-content"/></button>
                </div>
            </div>
        </div>
    );
};

const XApp: React.FC<AppProps> = ({ setCurrentApp }) => {
  const context = useContext(AppContext);
  if (!context || !context.characterProfile) return null;

  const xData = context.characterProfile.appContent.x;

  if (!xData) return (
      <div className="bg-black h-full w-full text-white flex flex-col items-center justify-center">
          <p>Ứng dụng không khả dụng.</p>
          <button onClick={() => setCurrentApp(AppScreen.HOME)} className="mt-4 text-blue-500">Quay lại</button>
      </div>
  );

  return (
    <div className="bg-black h-full w-full text-white flex flex-col">
      <header className="flex items-center justify-between p-3 border-b border-gray-800 sticky top-0 bg-black/80 backdrop-blur-sm z-10">
        <button onClick={() => setCurrentApp(AppScreen.HOME)} className="p-1 rounded-full hover:bg-gray-800">
          <ArrowLeft size={20} />
        </button>
        <div className="mx-auto">
            <XIcon />
        </div>
        <div className="w-8"></div>
      </header>
      
      {/* Profile Header (Simplified) */}
      <div className="relative">
          <div className="h-24 bg-gray-800"></div>
          <div className="px-4 pb-4">
              <div className="relative -mt-10 mb-3">
                  <img src={context.characterProfile.image} className="w-20 h-20 rounded-full border-4 border-black object-cover"/>
              </div>
              <div>
                  <h2 className="font-bold text-xl flex items-center gap-1">
                      {context.characterProfile.name}
                      {xData.profile.verified && <BadgeCheck size={18} className="text-blue-400 fill-white" />}
                  </h2>
                  <p className="text-gray-500">@{xData.profile.handle}</p>
              </div>
              <p className="mt-3 text-sm">{xData.profile.bio}</p>
              <div className="flex gap-4 mt-3 text-sm">
                  <p><span className="font-bold text-white">{xData.profile.following}</span> <span className="text-gray-500">Following</span></p>
                  <p><span className="font-bold text-white">{xData.profile.followers}</span> <span className="text-gray-500">Followers</span></p>
              </div>
          </div>
          <div className="flex border-b border-gray-800">
              <div className="flex-1 text-center py-3 font-bold border-b-2 border-blue-500">Posts</div>
              <div className="flex-1 text-center py-3 text-gray-500">Replies</div>
              <div className="flex-1 text-center py-3 text-gray-500">Media</div>
              <div className="flex-1 text-center py-3 text-gray-500">Likes</div>
          </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {xData.posts.map(tweet => <TweetComponent key={tweet.id} tweet={tweet} />)}
        {xData.posts.length === 0 && <p className="text-center text-gray-500 py-8">Chưa có bài đăng nào.</p>}
      </div>
    </div>
  );
};

export default XApp;
