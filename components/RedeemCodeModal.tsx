
import React, { useState, useContext } from 'react';
import { X, Gift } from 'lucide-react';
import { AppContext } from '../contexts/AppContext';

const RedeemCodeModal: React.FC = () => {
    const context = useContext(AppContext);
    const [code, setCode] = useState('');
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

    if (!context) return null;
    const { isRedeemCodeModalOpen, setIsRedeemCodeModalOpen, redeemCode } = context;

    if (!isRedeemCodeModalOpen) return null;

    const handleSubmit = () => {
        if (!code.trim()) return;
        
        const result = redeemCode(code);
        if (result.success) {
            setStatus({ type: 'success', message: result.message });
            setTimeout(() => {
                setIsRedeemCodeModalOpen(false);
                setCode('');
                setStatus({ type: null, message: '' });
            }, 1500);
        } else {
            setStatus({ type: 'error', message: result.message });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]" onClick={() => setIsRedeemCodeModalOpen(false)}>
            <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4 animate-pop-in" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Gift className="text-pink-500" />
                        Nhập mã quà tặng
                    </h2>
                    <button onClick={() => setIsRedeemCodeModalOpen(false)} className="p-1 rounded-full hover:bg-gray-200 text-gray-500">
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-4">
                    <input 
                        type="text" 
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Nhập mã code tại đây..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 uppercase tracking-widest text-center"
                    />
                    
                    {status.message && (
                        <p className={`text-sm text-center ${status.type === 'success' ? 'text-green-600 font-bold' : 'text-red-500'}`}>
                            {status.message}
                        </p>
                    )}

                    <button 
                        onClick={handleSubmit}
                        className="w-full bg-pink-500 text-white font-bold py-3 rounded-lg hover:bg-pink-600 transition-colors shadow-md"
                    >
                        Đổi quà
                    </button>
                </div>
                
                <p className="text-xs text-center text-gray-400 mt-4">Theo dõi fanpage để nhận mã quà tặng mới nhất nhé!</p>
            </div>
        </div>
    );
};

export default RedeemCodeModal;