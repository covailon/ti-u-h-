
import React, { useContext, useState, useRef } from 'react';
import { Message } from '../types';
import { AppContext } from '../contexts/AppContext';
import { RefreshCw, ChevronsRight, Volume2, Trash2, Play, Pause, Loader2, Image as ImageIcon } from 'lucide-react';
import { decode } from '../utils/audioUtils';

interface MessageBubbleProps {
  message: Message;
}

const FormattedText: React.FC<{ text: string }> = ({ text }) => {
    const html = text.replace(/"([^"]+)"/g, '<b>"$1"</b>');
    return <p className="whitespace-pre-wrap break-words" dangerouslySetInnerHTML={{ __html: html }} />;
};

const GiftBubble: React.FC<{ message: Message }> = ({ message }) => {
    if (!message.gift) return null;
    return (
        <div className="p-4 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl shadow-lg animate-pop-in text-white flex flex-col items-center gap-2 w-48">
            <span className="text-5xl">{message.gift.icon}</span>
            <p className="font-bold">{message.gift.name}</p>
            {message.text && <p className="text-sm text-center italic">"{message.text}"</p>}
        </div>
    );
};

const AudioBubble: React.FC<{ message: Message }> = ({ message }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceRef = useRef<AudioBufferSourceNode | null>(null);

    const handlePlay = async () => {
        if (!message.audioData) return;
        
        if (isPlaying) {
            if (sourceRef.current) {
                sourceRef.current.stop();
                sourceRef.current = null;
            }
            setIsPlaying(false);
            return;
        }

        try {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            }
            const audioContext = audioContextRef.current;
            
            // Resume context if it was suspended (browser policy)
            if (audioContext.state === 'suspended') {
                await audioContext.resume();
            }

            const decodedData = decode(message.audioData);
            const dataInt16 = new Int16Array(decodedData.buffer);
            const frameCount = dataInt16.length;
            const buffer = audioContext.createBuffer(1, frameCount, 24000);
            const channelData = buffer.getChannelData(0);
            for (let i = 0; i < frameCount; i++) {
                channelData[i] = dataInt16[i] / 32768.0;
            }

            const source = audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContext.destination);
            source.onended = () => setIsPlaying(false);
            
            source.start();
            sourceRef.current = source;
            setIsPlaying(true);
        } catch (error) {
            console.error("Error playing PCM audio:", error);
            setIsPlaying(false);
        }
    };

    return (
        <div className="flex items-center gap-3 bg-white border border-pink-200 rounded-2xl rounded-bl-none p-3 shadow-sm w-48">
            <button 
                onClick={handlePlay}
                className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white hover:bg-pink-600 transition-colors"
            >
                {isPlaying ? <Pause size={16} fill="currentColor"/> : <Play size={16} fill="currentColor" className="ml-1"/>}
            </button>
            <div className="flex-1 flex flex-col justify-center">
                <div className="h-1 bg-gray-200 rounded-full w-full overflow-hidden">
                    <div className={`h-full bg-pink-500 ${isPlaying ? 'animate-pulse' : 'w-0'}`} style={{width: isPlaying ? '100%' : '0%'}}></div>
                </div>
                <span className="text-xs text-gray-500 mt-1">Tin nhắn thoại</span>
            </div>
        </div>
    )
}

const ImageBubble: React.FC<{ message: Message }> = ({ message }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    if (!message.imageUrl) return null;

    return (
        <div className="relative rounded-2xl overflow-hidden shadow-md max-w-xs border border-gray-200 bg-white">
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <Loader2 className="animate-spin text-gray-400" />
                </div>
            )}
            <img 
                src={message.imageUrl} 
                alt="Sent by AI" 
                className={`w-full h-auto min-h-[150px] object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setIsLoaded(true)}
            />
             <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm flex items-center gap-1">
                 <ImageIcon size={10} />
                 <span>AI Generated</span>
             </div>
        </div>
    )
}


const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const context = useContext(AppContext);
  const [showDelete, setShowDelete] = useState(false);
  
  if (!context || !context.characterProfile) return null;
  const { characterProfile, regenerateLastResponse, isLoading, playAudio, isAudioPlaying, deleteMessage } = context;
  
  const isUser = message.sender === 'user';
  const isLastMessageFromAI = context.messages[context.messages.length - 1].id === message.id && !isUser;

  const handleRegenerate = () => {
    if (!isLoading) {
      regenerateLastResponse();
    }
  }
  
  const handleDelete = () => {
    deleteMessage(message.id);
  }
  
  // RENDER GIFT
  if (message.gift) {
    return (
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
            <div className={`flex items-start gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
                {!isUser && (
                    <img src={characterProfile.image} alt={characterProfile.name} className="w-8 h-8 rounded-full object-cover" />
                )}
                <GiftBubble message={message} />
             </div>
        </div>
    )
  }

  // RENDER CONTENT (Text, Audio, or Image)
  const renderContent = () => {
      if (message.imageUrl) {
          return <ImageBubble message={message} />;
      }
      if (message.audioData) {
          return <AudioBubble message={message} />;
      }
      return (
        <div className={`px-4 py-2 rounded-2xl cursor-pointer ${isUser ? 'bg-white text-gray-800 border border-pink-200 rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow-sm'}`}>
            <FormattedText text={message.text} />
        </div>
      );
  };

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
      <div className={`flex items-center gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {!isUser && (
          <img src={characterProfile.image} alt={characterProfile.name} className="w-8 h-8 rounded-full object-cover self-start" />
        )}

        <div onClick={() => setShowDelete(prev => !prev)} className="max-w-[calc(100%-4rem)]">
            {renderContent()}
        </div>
        
        {showDelete && (
            <button 
                onClick={handleDelete}
                className="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-100 transition-colors animate-pop-in self-center"
                aria-label="Delete message"
            >
                <Trash2 size={16} />
            </button>
        )}
      </div>
      
      {!isUser && message.text && !message.audioData && !message.imageUrl && (
        <div className="flex items-center gap-2 ml-10 mt-1">
            <button 
              onClick={() => playAudio(message.text)} 
              disabled={isAudioPlaying}
              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Play message audio"
            >
              <Volume2 size={16} />
            </button>
            {isLastMessageFromAI && (
              <>
                <button 
                  onClick={handleRegenerate} 
                  disabled={isLoading}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw size={16} />
                </button>
                <button 
                  onClick={handleRegenerate} 
                  disabled={isLoading}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronsRight size={16} />
                </button>
              </>
            )}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
