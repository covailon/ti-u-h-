import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { Heart } from 'lucide-react';

const ChatsScreen: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;

    const { startChatWithCharacter, recentChats, allCharacters, userProfile } = context;
    
    const handleChatClick = (chat: any) => {
        const character = allCharacters.find(c => c.id === chat.id);
        if (character) {
            startChatWithCharacter(character);
        }
    }

    return (
        <div className="bg-white h-full">
            <header className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10 flex justify-between items-center">
                <h1 className="text-xl font-bold">Trò chuyện</h1>
                <div className="flex items-center bg-pink-50 rounded-full px-3 py-1 text-pink-600 border border-pink-100">
                    <span className="font-bold text-sm mr-1">{userProfile.coins || 0}</span>
                    <Heart size={14} className="fill-current" />
                </div>
            </header>
            <div className="divide-y divide-gray-100">
                {recentChats.length > 0 ? (
                    recentChats.map((chat) => (
                        <div key={chat.id} onClick={() => handleChatClick(chat)} className="flex items-center p-3 gap-3 hover:bg-gray-50 cursor-pointer">
                            <img src={chat.avatar} alt={chat.name} className="w-14 h-14 rounded-full object-cover" />
                            <div className="flex-1 overflow-hidden">
                                <div className="flex justify-between items-start">
                                    <h2 className="font-semibold">{chat.name}</h2>
                                    <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{chat.date}</span>
                                </div>
                                <div className="flex justify-between items-end mt-1">
                                    <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                                    {chat.unread && <div className="w-2.5 h-2.5 bg-pink-500 rounded-full flex-shrink-0 ml-2"></div>}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center p-16 text-gray-500">
                        <p>Chưa có cuộc trò chuyện nào.</p>
                        <p className="text-sm mt-2">Bắt đầu khám phá và trò chuyện với các nhân vật nhé!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatsScreen;