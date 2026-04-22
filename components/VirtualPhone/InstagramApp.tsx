
import React, { useContext, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { ArrowLeft, Grid3x3, Heart, MessageCircle, BadgeCheck } from 'lucide-react';
import { AppScreen, InstagramPost as InstagramPostType } from '../../types';

interface InstagramAppProps {
  setCurrentApp: (app: AppScreen) => void;
}

const PostModal: React.FC<{ post: InstagramPostType; onClose: () => void; avatar: string; handle: string }> = ({ post, onClose, avatar, handle }) => {
    const [liked, setLiked] = useState(post.likedByUser);
    const [likes, setLikes] = useState(post.likes);

    const handleLike = () => {
        if (liked) {
            setLikes(prev => prev - 1);
        } else {
            setLikes(prev => prev + 1);
        }
        setLiked(!liked);
    }

    return (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-lg w-11/12 max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="flex items-center p-2 border-b">
                    <img src={avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                    <span className="font-bold ml-2 text-sm text-black">{handle}</span>
                </div>
                <img src={post.imageUrl} alt={post.caption} className="w-full aspect-square object-cover" />
                <div className="p-2 text-black">
                    <div className="flex gap-4">
                        <button onClick={handleLike}>
                            <Heart size={24} className={liked ? "text-red-500 fill-current" : "text-black"} />
                        </button>
                        <MessageCircle size={24} className="text-black" />
                    </div>
                    <p className="font-bold text-sm mt-2">{likes.toLocaleString()} likes</p>
                    <p className="text-sm mt-1">
                        <span className="font-bold">{handle}</span> {post.caption}
                    </p>
                </div>
            </div>
        </div>
    );
};


const InstagramApp: React.FC<InstagramAppProps> = ({ setCurrentApp }) => {
  const context = useContext(AppContext);
  const [selectedPost, setSelectedPost] = useState<InstagramPostType | null>(null);

  if (!context || !context.characterProfile) return <div className="bg-white h-full w-full flex items-center justify-center text-black"><p>Vui lòng bắt đầu cuộc trò chuyện.</p></div>;
  const { characterProfile } = context;
  const instaData = characterProfile.appContent.instagram;

  if (!instaData) return (
      <div className="bg-white h-full w-full text-black flex flex-col items-center justify-center">
          <p>Chưa cài đặt Instagram.</p>
          <button onClick={() => setCurrentApp(AppScreen.HOME)} className="mt-4 text-blue-500">Quay lại</button>
      </div>
  );

  return (
    <div className="bg-white h-full w-full text-black flex flex-col">
      {/* Header */}
      <header className="flex items-center p-2 border-b sticky top-0 bg-white z-10">
        <button onClick={() => setCurrentApp(AppScreen.HOME)}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold mx-auto flex items-center gap-1">
            {instaData.profile.handle}
            {instaData.profile.verified && <BadgeCheck size={16} className="text-blue-500 fill-blue-500 text-white" />}
        </h1>
      </header>
      
      {/* Profile Info */}
      <div className="p-4 flex items-center">
        <img src={characterProfile.image} alt={characterProfile.name} className="w-20 h-20 rounded-full object-cover border border-gray-200" />
        <div className="flex-grow flex justify-around items-center ml-2">
          <div className="text-center">
            <span className="font-bold block">{instaData.posts.length}</span>
            <span className="text-gray-500 text-sm">Posts</span>
          </div>
          <div className="text-center">
            <span className="font-bold block">{instaData.profile.followers}</span>
            <span className="text-gray-500 text-sm">Followers</span>
          </div>
          <div className="text-center">
            <span className="font-bold block">{instaData.profile.following}</span>
            <span className="text-gray-500 text-sm">Following</span>
          </div>
        </div>
      </div>
      <div className="px-4 pb-4">
        <p className="font-bold text-sm">{characterProfile.name}</p>
        <p className="text-sm">{instaData.profile.bio}</p>
      </div>

      {/* Posts */}
      <div className="border-t flex-grow overflow-y-auto">
        <div className="p-1 justify-center flex border-b">
            <Grid3x3 size={24} className="text-blue-500"/>
        </div>
        
        {instaData.posts.length > 0 ? (
             <div className="grid grid-cols-3 gap-0.5">
                {instaData.posts.map(post => (
                    <div key={post.id} className="aspect-square bg-gray-100 cursor-pointer relative group" onClick={() => setSelectedPost(post)}>
                    <img src={post.imageUrl} alt={post.caption} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="flex items-center justify-center h-48 text-gray-400">
                <p>Chưa có bài viết nào.</p>
            </div>
        )}
       
      </div>

      {selectedPost && (
        <PostModal 
            post={selectedPost} 
            onClose={() => setSelectedPost(null)} 
            avatar={characterProfile.image}
            handle={instaData.profile.handle}
        />
      )}
    </div>
  );
};

export default InstagramApp;
