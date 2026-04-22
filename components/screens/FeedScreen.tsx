import React, { useContext, useState } from 'react';
import { Mail, MessageCircle, Plus } from 'lucide-react';
import CreatePostModal from '../CreatePostModal';
import { AppContext } from '../../contexts/AppContext';

const FeedScreen: React.FC = () => {
    const context = useContext(AppContext);
    const [isCreatePostModalOpen, setCreatePostModalOpen] = useState(false);
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [replyText, setReplyText] = useState("");

    if (!context) return null;
    const { posts, addReply, userProfile } = context;

    const allPosts = [...posts].sort((a,b) => b.id - a.id);

    const handleReplySubmit = (postId: number) => {
        if (replyText.trim()) {
            addReply(postId, replyText.trim());
            setReplyText("");
            // Keep the reply box open for conversation flow
            // setReplyingTo(null);
        }
    };

    return (
        <div className="bg-gray-50 h-full relative overflow-y-auto">
            <header className="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                <h1 className="text-xl font-bold">Bài viết</h1>
                <button className="text-gray-500"><Mail size={24} /></button>
            </header>
            <div className="p-3 space-y-3 pb-20">
                {allPosts.map(post => (
                    <div key={post.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3">
                            <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full" />
                            <div>
                                <p className="font-semibold">{post.author}</p>
                                <p className="text-xs text-gray-400">{post.date}</p>
                            </div>
                        </div>
                        <p className="my-3 whitespace-pre-wrap">{post.content}</p>
                        <div className="flex justify-end text-sm text-gray-500">
                           <button onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)} className="flex items-center gap-1 hover:text-pink-500">
                               <MessageCircle size={16}/>
                               <span>{post.replies.length}</span>
                           </button>
                        </div>
                        
                        {(post.replies.length > 0 || replyingTo === post.id) && (
                            <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
                                {post.replies.map(reply => (
                                    <div key={reply.id} className="flex items-start gap-2 text-sm">
                                        <img src={reply.avatar} alt={reply.author} className="w-7 h-7 rounded-full" />
                                        <div className="bg-gray-100 p-2 rounded-lg flex-1">
                                            <p><span className="font-semibold">{reply.author}</span> {reply.text}</p>
                                        </div>
                                    </div>
                                ))}

                                {replyingTo === post.id && (
                                    <div className="flex items-center gap-2 pt-2">
                                        <img src={userProfile.avatar} alt={userProfile.name} className="w-7 h-7 rounded-full"/>
                                        <div className="flex-1 flex items-center bg-gray-100 rounded-full">
                                            <input
                                                type="text"
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleReplySubmit(post.id)}
                                                placeholder={`Trả lời ${post.author}...`}
                                                className="w-full bg-transparent outline-none text-sm px-3 py-1.5"
                                                autoFocus
                                            />
                                            <button onClick={() => handleReplySubmit(post.id)} className="text-pink-500 font-semibold text-sm pr-3 pl-1">Gửi</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <button 
                onClick={() => setCreatePostModalOpen(true)}
                className="fixed bottom-20 right-6 bg-pink-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-pink-600 transition-colors z-20"
            >
                <Plus size={32} />
            </button>
            <CreatePostModal isOpen={isCreatePostModalOpen} onClose={() => setCreatePostModalOpen(false)} />
        </div>
    );
};

export default FeedScreen;