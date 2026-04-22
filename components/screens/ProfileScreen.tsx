
import React, { useState, useContext } from 'react';
import { Bell, Settings, Heart, ChevronRight, Edit, Gift } from 'lucide-react';
import { AppContext } from '../../contexts/AppContext';
import NotificationsModal from '../NotificationsModal';
import { mockCollectionItems } from '../../mockData';
import { CollectionItem } from '../../types';

const CollectionPanel: React.FC = () => (
    <div className="py-4 grid grid-cols-3 gap-3">
        {mockCollectionItems.map((item: CollectionItem) => (
            <div key={item.id} className="flex flex-col items-center gap-2">
                <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover bg-gray-100" />
                <span className="text-xs text-gray-600">{item.name}</span>
            </div>
        ))}
    </div>
);

const ProfileScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'characters' | 'collection'>('characters');
    const context = useContext(AppContext);
    if (!context) return null;

    const { 
        userProfile,
        userCharacters,
        setIsSettingsOpen,
        setIsCreateCharacterModalOpen,
        isNotificationsModalOpen, setIsNotificationsModalOpen,
        startChatWithCharacter,
        setIsRedeemCodeModalOpen,
        logout
    } = context;

    return (
        <div className="bg-white h-full overflow-y-auto">
            <header className="flex justify-between items-center p-3">
                <div className="flex gap-2">
                    <button onClick={() => setIsRedeemCodeModalOpen(true)} className="flex items-center gap-1 bg-pink-50 text-pink-600 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-pink-100 transition-colors">
                        <Gift size={14} />
                        <span>Mã quà tặng</span>
                    </button>
                     <button onClick={logout} className="flex items-center gap-1 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-gray-100 transition-colors">
                        <span>Đăng xuất</span>
                    </button>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => setIsNotificationsModalOpen(true)} className="text-gray-500"><Bell size={24} /></button>
                    <button onClick={() => setIsSettingsOpen(true)} className="text-gray-500"><Settings size={24} /></button>
                </div>
            </header>

            <div className="px-4">
                <div className="flex items-center gap-4">
                    <div className="relative">
                       <div className="w-20 h-20 rounded-full bg-pink-100 flex items-center justify-center">
                           <img src={userProfile.avatar} alt={userProfile.name} className="w-full h-full object-cover rounded-full" />
                       </div>
                       <button onClick={() => setIsSettingsOpen(true)} className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md">
                           <Edit size={12} className="text-gray-600" />
                       </button>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">{userProfile.name}</h1>
                        <div className="flex items-center gap-2 mt-1">
                             <div className="flex items-center gap-1 bg-yellow-100 px-2 py-0.5 rounded-full border border-yellow-200">
                                <div className="w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center text-[10px] font-bold text-yellow-800">$</div>
                                <span className="font-bold text-xs text-yellow-800">{(userProfile.coins || 0).toLocaleString()} Tim</span>
                             </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-around text-center my-6">
                    <div>
                        <p className="font-bold text-lg">4</p>
                        <p className="text-sm text-gray-500">Theo dõi</p>
                    </div>
                    <div>
                        <p className="font-bold text-lg">1.2M</p>
                        <p className="text-sm text-gray-500">Người theo dõi</p>
                    </div>
                    <div>
                        <p className="font-bold text-lg">8</p>
                        <p className="text-sm text-gray-500">Trò chuyện</p>
                    </div>
                </div>


                <div className="flex border-b">
                    <button 
                        onClick={() => setActiveTab('characters')}
                        className={`flex-1 pb-2 font-semibold transition-colors ${activeTab === 'characters' ? 'text-pink-500 border-b-2 border-pink-500' : 'text-gray-400'}`}
                    >
                        Char của tui ({userCharacters.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('collection')}
                        className={`flex-1 pb-2 font-semibold transition-colors ${activeTab === 'collection' ? 'text-pink-500 border-b-2 border-pink-500' : 'text-gray-400'}`}
                    >
                        Kho đồ
                    </button>
                </div>

                {activeTab === 'characters' && (
                    userCharacters.length > 0 ? (
                        <div className="py-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
                            {userCharacters.map(char => (
                                <div key={char.id} onClick={() => startChatWithCharacter(char)} className="flex flex-col items-center gap-2 cursor-pointer group">
                                    <img src={char.image} alt={char.name} className="w-20 h-20 rounded-lg object-cover bg-gray-100 group-hover:opacity-80 transition-opacity" />
                                    <span className="text-xs text-gray-600 text-center truncate w-full">{char.name}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-gray-500 mb-4">Chưa tạo char nào lun.</p>
                            <button 
                                onClick={() => setIsCreateCharacterModalOpen(true)}
                                className="border border-pink-400 text-pink-500 font-semibold px-8 py-2.5 rounded-full hover:bg-pink-50 transition-colors"
                            >
                                Tạo một cái
                            </button>
                        </div>
                    )
                )}
                {activeTab === 'collection' && <CollectionPanel />}
            </div>
            
            <NotificationsModal 
                isOpen={isNotificationsModalOpen} 
                onClose={() => setIsNotificationsModalOpen(false)}
            />
        </div>
    );
};

export default ProfileScreen;