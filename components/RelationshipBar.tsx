
import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { RELATIONSHIP_LEVELS } from '../constants';
import { Heart } from 'lucide-react';

const levelEmojis: { [key: string]: string } = {
    'Chán ghét': '😡',
    'Khó chịu': '😠',
    'Xa cách': '😒',
    'Người lạ': '😐',
    'Quen biết': '🙂',
    'Bạn bè': '😊',
    'Cảm nắng': '😍',
    'Người yêu': '🥰',
    'Đối tác': '💖',
};

const RelationshipBar: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { relationshipScore } = context;

  const getCurrentLevel = () => {
    return [...RELATIONSHIP_LEVELS].reverse().find(level => relationshipScore >= level.minPoints) || RELATIONSHIP_LEVELS[3]; // Default to Người lạ
  };

  const currentLevel = getCurrentLevel();
  const nextLevel = RELATIONSHIP_LEVELS.find(level => level.level === currentLevel.level + 1);

  const getProgress = () => {
    if (currentLevel.minPoints < 0) {
        const nextMin = nextLevel?.minPoints ?? 0;
        const range = nextMin - currentLevel.minPoints;
        if (range <= 0) return 100;
        const currentProgress = relationshipScore - currentLevel.minPoints;
        return Math.max(0, Math.min(100, (currentProgress / range) * 100));
    }
    
    if (!nextLevel) return 100;

    const range = nextLevel.minPoints - currentLevel.minPoints;
    if (range <= 0) return 100;
    const currentProgress = relationshipScore - currentLevel.minPoints;
    return Math.max(0, Math.min(100, (currentProgress / range) * 100));
  };
  
  const progress = getProgress();

  const scoreDenominator = currentLevel.minPoints < 0 ? currentLevel.minPoints : nextLevel?.minPoints ?? currentLevel.minPoints;

  return (
    <div className="px-4 py-2 bg-pink-100 border-b border-pink-200">
      <div className="flex items-center gap-2">
        <span className="text-xl">{levelEmojis[currentLevel.name] || '😐'}</span>
        <span className="text-sm font-semibold text-gray-700">{currentLevel.name}</span>
        <div className="flex-1 relative flex items-center mx-2">
            <div className="w-full h-1.5 bg-gray-300 rounded-full">
                <div className="h-1.5 bg-pink-400 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            <div 
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2" 
                style={{ left: `${progress}%` }}
            >
                <Heart size={18} className="text-white stroke-pink-600 stroke-2 fill-pink-500" />
            </div>
        </div>
        <span className="text-xs font-mono text-gray-500">{relationshipScore}/{scoreDenominator}</span>
      </div>
    </div>
  );
};

export default RelationshipBar;
