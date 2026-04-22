import React, { useState, useMemo, useContext } from 'react';
import { Search, Award, Heart, X } from 'lucide-react';
import { AppContext } from '../../contexts/AppContext';
import { DiscoverCharacter } from '../../types';

type CharacterCardProps = {
    char: DiscoverCharacter;
    onClick: () => void;
};

const CharacterCard: React.FC<CharacterCardProps> = ({ char, onClick }) => (
    <div onClick={onClick} className="rounded-lg overflow-hidden shadow-sm relative bg-gray-800 text-white cursor-pointer group character-card aspect-[3/4]">
        <img src={char.image} alt={char.name} className="w-full h-full object-cover transform transition-transform duration-300 character-card-image" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-3 w-full">
            <div className="flex justify-between items-center mb-1">
                <h3 className="text-lg font-bold transition-colors character-card-name">{char.name}</h3>
                <div className="flex items-center text-xs bg-black/50 px-2 py-1 rounded-full">
                    <Heart size={12} className="mr-1" /> {char.views}
                </div>
            </div>
            {char.description && <p className="text-xs text-gray-300 mb-2 truncate">{char.description}</p>}
            <div className="flex flex-wrap gap-1">
                {char.tags.map(tag => (
                    <span key={tag} className="text-xs bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">{tag}</span>
                ))}
            </div>
        </div>
    </div>
);


const DiscoverScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState('For You');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const tabs = ['Following', 'For You', 'Trending'];
    const context = useContext(AppContext);
    if (!context) return null;

    const { startChatWithCharacter, setIsRewardsModalOpen, allCharacters, userProfile } = context;

    const filteredCharacters = useMemo(() => {
        let characters = allCharacters;

        if (searchQuery.trim() === '') {
            return characters;
        }
        return characters.filter(char => char.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [searchQuery, allCharacters]);

    return (
        <div className="bg-white h-full overflow-y-auto">
            <header className="p-3 border-b border-gray-200 sticky top-0 bg-white z-10">
                {isSearchVisible ? (
                    <div className="flex items-center gap-2">
                        <Search size={20} className="text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Tìm kiếm nhân vật..."
                            className="w-full bg-transparent outline-none"
                            autoFocus
                        />
                        <button onClick={() => { setIsSearchVisible(false); setSearchQuery(''); }} className="text-gray-500">
                            <X size={22} />
                        </button>
                    </div>
                ) : (
                    <div className="flex justify-between items-center">
                        <h1 className="text-xl font-bold text-gray-800">Nhân vật</h1>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center bg-pink-50 rounded-full px-3 py-1 text-pink-600 border border-pink-100">
                                <span className="font-bold text-sm mr-1">{userProfile.coins || 0}</span>
                                <Heart size={14} className="fill-current" />
                            </div>
                            <button onClick={() => setIsSearchVisible(true)} className="text-gray-500"><Search size={22} /></button>
                        </div>
                    </div>
                )}
            </header>
            
            <div className="p-3 grid grid-cols-2 gap-3">
                {filteredCharacters.map(char => <CharacterCard key={char.id} char={char} onClick={() => startChatWithCharacter(char)} />)}
            </div>
        </div>
    );
};

export default DiscoverScreen;