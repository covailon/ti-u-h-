import React, { useContext, useRef, useEffect, useState } from 'react';
import { AppContext } from '../contexts/AppContext';
import Header from './Header';
import MessageBubble from './MessageBubble';
import InputBar from './InputBar';
import TypingIndicator from './TypingIndicator';
import { randomThoughts } from '../mockData';
import ThoughtBubble from './ThoughtBubble';

const ChatView: React.FC = () => {
  const context = useContext(AppContext);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentThought, setCurrentThought] = useState<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [context?.messages]);

  useEffect(() => {
    // FIX: Replaced NodeJS.Timeout with an inferred browser-compatible type and ensured the timer is only cleared if it was set.
    if (context && !context.isLoading) {
      // Show a thought bubble randomly between 5 and 15 seconds after AI responds
      const randomDelay = Math.random() * 10000 + 5000;
      const timer = setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * randomThoughts.length);
        setCurrentThought(randomThoughts[randomIndex]);
      }, randomDelay);
      return () => clearTimeout(timer);
    }
  }, [context?.isLoading, context?.messages.length]);


  if (!context) return null;

  const { messages, isLoading, sendMessage } = context;
  
  const handleThoughtSend = () => {
    if (currentThought) {
      sendMessage(currentThought);
      setCurrentThought(null);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto bg-[#FFF5F8]">
      <Header />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
      <div className="relative px-4">
         {currentThought && !isLoading && (
            <ThoughtBubble thought={currentThought} onClick={handleThoughtSend} />
         )}
      </div>
      <InputBar />
    </div>
  );
};

export default ChatView;