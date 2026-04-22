
import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { LogIn } from 'lucide-react';

const LoginScreen: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;

    const { login, isAuthLoading } = context;

    return (
        <div className="flex flex-col items-center justify-center h-full bg-white px-6">
            <div className="mb-8 text-center">
                <div className="w-24 h-24 bg-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-pink-100">
                    <span className="text-4xl font-bold text-pink-500">H</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">HeartChat AI</h1>
                <p className="text-gray-500">Kết nối với thế giới nhân vật ảo</p>
            </div>

            <button 
                onClick={login}
                disabled={isAuthLoading}
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                <span>Tiếp tục với Google</span>
            </button>

            <p className="mt-8 text-xs text-gray-400 text-center leading-relaxed">
                Bằng cách tiếp tục, bạn đồng ý với Điều khoản dịch vụ và <br/> Chính sách bảo mật của chúng tôi.
            </p>
        </div>
    );
};

export default LoginScreen;
