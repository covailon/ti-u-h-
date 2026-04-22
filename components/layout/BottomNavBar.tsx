
import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { Home, MessageCircle, PlusCircle, Compass, User, CheckCircle } from 'lucide-react';

const NavItem = ({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 w-16 transition-colors ${isActive ? 'text-pink-500' : 'text-gray-500'}`}>
    {icon}
    <span className="text-xs">{label}</span>
  </button>
);

const BottomNavBar: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("BottomNavBar must be used within an AppProvider");
  }

  const { activeScreen, setActiveScreen, setIsCreateCharacterModalOpen } = context;

  const navItems = [
    { id: 'discover', label: 'Nhân vật', icon: <Home size={24} /> },
    { id: 'chats', label: 'Trò chuyện', icon: <MessageCircle size={24} /> },
    { id: 'add', label: 'Tạo', icon: <PlusCircle size={28} className="absolute -top-3 bg-white rounded-full p-1 border-4 border-gray-50" /> },
    { id: 'tasks', label: 'Nhiệm vụ', icon: <CheckCircle size={24} /> },
    { id: 'profile', label: 'Cá nhân', icon: <User size={24} /> },
  ];

  const handleNavClick = (id: string) => {
    if (id === 'add') {
      setIsCreateCharacterModalOpen(true);
    } else {
      setActiveScreen(id);
    }
  };

  return (
    <nav className="relative bg-white border-t border-gray-200 flex justify-around items-center pt-2 pb-1 shadow-t-md">
      {navItems.map((item, index) => (
        <div key={item.id} className={`relative flex justify-center ${index === 2 ? 'w-20' : 'w-16'}`}>
           <NavItem
              icon={item.icon}
              label={item.label}
              isActive={activeScreen === item.id}
              onClick={() => handleNavClick(item.id)}
            />
        </div>
      ))}
    </nav>
  );
};

export default BottomNavBar;
