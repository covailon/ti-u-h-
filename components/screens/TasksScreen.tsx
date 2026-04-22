
import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Video, CheckCircle, Share2, Play } from 'lucide-react';

const TaskItem = ({ 
    icon, 
    title, 
    description, 
    reward, 
    onComplete, 
    isCompleted,
    isLoading,
    countdown
}: { 
    icon: React.ReactNode, 
    title: string, 
    description: string, 
    reward: number, 
    onComplete: () => void,
    isCompleted?: boolean,
    isLoading?: boolean,
    countdown?: number
}) => (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 mb-3 relative overflow-hidden">
        <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500">
            {icon}
        </div>
        <div className="flex-1">
            <h3 className="font-bold text-gray-800">{title}</h3>
            <p className="text-xs text-gray-500">{description}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-1 bg-pink-100 px-2 py-1 rounded-full text-pink-600 font-bold text-xs">
                +{reward} <Heart size={10} fill="currentColor" />
            </div>
            <button 
                onClick={onComplete}
                disabled={isCompleted || isLoading}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    isCompleted 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : isLoading
                    ? 'bg-pink-300 text-white cursor-wait'
                    : 'bg-pink-500 text-white active:scale-95 shadow-md shadow-pink-100'
                }`}
            >
                {isCompleted ? 'Đã xong' : isLoading ? `Chờ ${countdown}s` : 'Nhận'}
            </button>
        </div>
        
        {/* Ad Progress Bar */}
        {isLoading && countdown !== undefined && (
            <motion.div 
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 15, ease: "linear" }}
                className="absolute bottom-0 left-0 h-1 bg-pink-500/30"
            />
        )}
    </div>
);

const TasksScreen: React.FC = () => {
    const context = useContext(AppContext);
    const [isWatchingAd, setIsWatchingAd] = useState(false);
    const [adCountdown, setAdCountdown] = useState(0);
    const [dailyClaimed, setDailyClaimed] = useState(false);

    if (!context) return null;
    const { userProfile, addCoins } = context;

    useEffect(() => {
        let timer: any;
        if (isWatchingAd && adCountdown > 0) {
            timer = setInterval(() => {
                setAdCountdown(prev => prev - 1);
            }, 1000);
        } else if (isWatchingAd && adCountdown === 0) {
            handleAdFinish();
        }
        return () => clearInterval(timer);
    }, [isWatchingAd, adCountdown]);

    const handleDailyClaim = () => {
        if (dailyClaimed) return;
        addCoins(5);
        setDailyClaimed(true);
    };

    const handleWatchAd = () => {
        if (isWatchingAd) return;
        setIsWatchingAd(true);
        setAdCountdown(15);
    };

    const handleAdFinish = () => {
        addCoins(10);
        setIsWatchingAd(false);
        alert("Bạn đã nhận được 10 Tim từ việc xem quảng cáo!");
    };

    const handleShareApp = () => {
        // In a real app, this would use the Web Share API
        if (navigator.share) {
            navigator.share({
                title: 'HeartChat AI',
                text: 'Hãy tham gia cùng mình trên HeartChat AI!',
                url: window.location.href,
            }).then(() => {
                addCoins(20);
                alert("Cảm ơn bạn đã chia sẻ! Nhận ngay 20 Tim.");
            }).catch(() => {
                // Fallback for cancel
            });
        } else {
            // Mock share
            setTimeout(() => {
                addCoins(20);
                alert("Cảm ơn bạn đã chia sẻ! Nhận ngay 20 Tim.");
            }, 1000);
        }
    };

    return (
        <div className="p-4 pt-16 h-full flex flex-col bg-gray-50">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Nhiệm vụ</h1>
                    <p className="text-gray-500 text-sm">Kiếm thêm Tim để trò chuyện</p>
                </div>
                <div className="flex items-center bg-white rounded-2xl px-4 py-2 shadow-sm border border-gray-100">
                    <span className="font-bold text-lg text-pink-600 mr-1">{userProfile.coins || 0}</span>
                    <Heart size={20} className="text-pink-500 fill-current" />
                </div>
            </div>

            <AnimatePresence>
                {isWatchingAd && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black z-[60] flex flex-col items-center justify-center p-6 text-center"
                    >
                        <div className="w-full max-w-sm aspect-video bg-gray-900 rounded-2xl flex items-center justify-center mb-6 overflow-hidden relative border border-white/10 shadow-2xl">
                            <motion.div 
                                animate={{ scale: [1, 1.1, 1] }} 
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="text-pink-500"
                            >
                                <Play size={64} fill="currentColor" />
                            </motion.div>
                            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white font-bold text-sm">
                                {adCountdown}s
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                <p className="text-white text-xs font-medium">Đang phát quảng cáo tài trợ...</p>
                            </div>
                        </div>
                        <h2 className="text-white font-bold text-xl mb-2">Đang xử lý quà tặng</h2>
                        <p className="text-gray-400 text-sm mb-8">Bạn sẽ nhận được điểm sau khi quảng cáo kết thúc.</p>
                        
                        <div className="w-full max-w-sm h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: '0%' }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 15, ease: "linear" }}
                                className="h-full bg-pink-500"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex-1 overflow-y-auto">
                <section className="mb-6">
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Danh sách nhiệm vụ</h2>
                    <TaskItem 
                        icon={<CheckCircle size={24} />}
                        title="Điểm danh hằng ngày"
                        description="Nhận Tim miễn phí mỗi ngày"
                        reward={5}
                        onComplete={handleDailyClaim}
                        isCompleted={dailyClaimed}
                    />
                    <TaskItem 
                        icon={<Video size={24} />}
                        title="Xem quảng cáo"
                        description="Xem Video ngắn để nhận Tim thưởng"
                        reward={10}
                        onComplete={handleWatchAd}
                        isLoading={isWatchingAd}
                        countdown={adCountdown}
                    />
                    <TaskItem 
                        icon={<Share2 size={24} />}
                        title="Chia sẻ app"
                        description="Lan tỏa HeartChat với bạn bè"
                        reward={20}
                        onComplete={handleShareApp}
                    />
                </section>
            </div>
        </div>
    );
};

export default TasksScreen;
