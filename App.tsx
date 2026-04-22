
import React, { useContext, useState } from 'react';
import { AppProvider, AppContext } from './contexts/AppContext';
import ChatView from './components/ChatView';
import DiscoverScreen from './components/screens/DiscoverScreen';
import ChatsScreen from './components/screens/ChatsScreen';
import FeedScreen from './components/screens/FeedScreen';
import ProfileScreen from './components/screens/ProfileScreen';
import TasksScreen from './components/screens/TasksScreen';
import BottomNavBar from './components/layout/BottomNavBar';
import SettingsModal from './components/SettingsModal';
import PhoneWrapper from './components/VirtualPhone/PhoneWrapper';
import DiaryModal from './components/DiaryModal';
import CreateCharacterModal from './components/CreateCharacterModal';
import ComingSoonModal from './components/ComingSoonModal';
import GiftModal from './components/GiftModal';
import CallModal from './components/CallModal';
import ConfirmationModal from './components/ConfirmationModal';
import SplashScreen from './components/SplashScreen';
import RedeemCodeModal from './components/RedeemCodeModal';

const MainAppContent: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext must be used within an AppProvider");
  }

  const { activeScreen, isChatting, isAuthLoading } = context;

  if (isAuthLoading) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center mb-4 animate-pulse">
            <span className="text-xl font-bold text-pink-500">H</span>
        </div>
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-pink-500"></div>
        <p className="mt-4 text-xs text-gray-400 font-medium tracking-widest uppercase">Đang khởi tạo...</p>
      </div>
    );
  }

  if (isChatting) {
    return <ChatView />;
  }

  const renderScreen = () => {
    switch (activeScreen) {
      case 'discover':
        return <DiscoverScreen />;
      case 'chats':
        return <ChatsScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'tasks':
        return <TasksScreen />;
      default:
        return <DiscoverScreen />;
    }
  };

  return (
    <div className="w-screen h-screen bg-gray-50 flex flex-col max-w-3xl mx-auto shadow-lg animate-fade-in-up">
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        {renderScreen()}
      </main>
      <BottomNavBar />
    </div>
  );
};

const GlobalModals: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;

    const { 
        isSettingsOpen, 
        isPhoneOpen,
        isDiaryModalOpen, setIsDiaryModalOpen,
        isCreateCharacterModalOpen, setIsCreateCharacterModalOpen,
        isComingSoonModalOpen, setIsComingSoonModalOpen,
        comingSoonModalContent,
        isCalling,
        isConfirmationModalOpen, setIsConfirmationModalOpen,
        confirmationModalConfig,
        isRedeemCodeModalOpen // Ensure this is destructured
    } = context;

    return (
        <>
            {isSettingsOpen && <SettingsModal />}
            {isPhoneOpen && <PhoneWrapper />}
            {isCalling && <CallModal />}
            <DiaryModal isOpen={isDiaryModalOpen} onClose={() => setIsDiaryModalOpen(false)} />
            <CreateCharacterModal isOpen={isCreateCharacterModalOpen} onClose={() => setIsCreateCharacterModalOpen(false)} />
            <GiftModal />
            <ComingSoonModal 
                isOpen={isComingSoonModalOpen} 
                onClose={() => setIsComingSoonModalOpen(false)}
                title={comingSoonModalContent.title}
                message={comingSoonModalContent.message}
            />
            <ConfirmationModal
                isOpen={isConfirmationModalOpen}
                onClose={() => setIsConfirmationModalOpen(false)}
                onConfirm={confirmationModalConfig.onConfirm}
                title={confirmationModalConfig.title}
                message={confirmationModalConfig.message}
            />
            {isRedeemCodeModalOpen && <RedeemCodeModal />}
        </>
    )
}

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <AppProvider>
        {showSplash ? (
            <SplashScreen onFinish={() => setShowSplash(false)} />
        ) : (
            <div className="bg-gray-200 text-gray-800 w-screen h-screen overflow-hidden">
                <MainAppContent />
                <GlobalModals />
            </div>
        )}
    </AppProvider>
  );
};


export default App;