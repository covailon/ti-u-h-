
import React, { useContext } from 'react';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { AppScreen } from '../../types';
import { AppContext } from '../../contexts/AppContext';

interface AppProps {
  setCurrentApp: (app: AppScreen) => void;
}

const BankApp: React.FC<AppProps> = ({ setCurrentApp }) => {
  const context = useContext(AppContext);
  if (!context || !context.characterProfile) return null;

  const bankData = context.characterProfile.appContent.bank;

  if (!bankData) return (
      <div className="bg-gray-900 h-full w-full text-white flex flex-col items-center justify-center">
          <p>Dịch vụ không khả dụng.</p>
          <button onClick={() => setCurrentApp(AppScreen.HOME)} className="mt-4 text-blue-400">Quay lại</button>
      </div>
  );

  return (
    <div className="bg-gray-900 h-full w-full text-white flex flex-col">
      <header className="flex items-center justify-between p-2 sticky top-0 z-10 bg-gray-900/80 backdrop-blur-sm">
        <button onClick={() => setCurrentApp(AppScreen.HOME)}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-semibold mx-auto">Tài khoản</h1>
        <button>
          <MoreVertical size={24} />
        </button>
      </header>
      <div className="p-4 overflow-y-auto flex-1">
        <p className="text-gray-400">Số dư khả dụng</p>
        <p className="text-4xl font-bold">¥ {bankData.balance.toLocaleString()}</p>

        <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20">
                 <svg width="64" height="64" viewBox="0 0 24 24" fill="white"><path d="M2 10h20v10H2V10zm0-2h20V4H2v4zm0 12h20v2H2v-2z"/></svg>
            </div>
            <p className="text-sm text-indigo-200">{bankData.bankName}</p>
            <p className="text-lg font-mono tracking-widest mt-8">{bankData.accountNumber}</p>
            <div className="flex justify-between items-end mt-2">
                <p className="font-semibold uppercase">{context.characterProfile.name}</p>
                <p className="text-sm">12/28</p>
            </div>
        </div>

        <h2 className="font-semibold mt-6 mb-2">Giao dịch gần đây</h2>
        <div className="space-y-3 pb-4">
            {bankData.transactions.map(tx => (
                <div key={tx.id} className="flex justify-between items-center bg-gray-800 p-3 rounded-lg">
                    <div>
                        <p className="font-medium">{tx.merchant}</p>
                        <p className="text-xs text-gray-400">{tx.date}</p>
                    </div>
                    <p className={`font-semibold ${tx.type === 'credit' ? 'text-green-400' : 'text-white'}`}>
                        {tx.type === 'credit' ? '+' : '-'} ¥ {tx.amount.toLocaleString()}
                    </p>
                </div>
            ))}
            {bankData.transactions.length === 0 && (
                <p className="text-gray-500 text-center py-4">Không có giao dịch nào.</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default BankApp;
