import React from 'react';
import type { ChatMessage as ChatMessageType } from '../types';
import { Bot, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isAi = message.role === 'assistant';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`flex gap-2.5 ${isAi ? 'justify-start' : 'justify-end'}`}
    >
      {isAi && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
          <Bot size={14} className="text-white" />
        </div>
      )}

      <div className={isAi ? 'chat-bubble-ai' : 'chat-bubble-user'}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
      </div>

      {!isAi && (
        <div className="w-7 h-7 rounded-full bg-surface-600 flex items-center justify-center flex-shrink-0 mt-1">
          <User size={14} className="text-surface-300" />
        </div>
      )}
    </motion.div>
  );
};

export default ChatMessage;
