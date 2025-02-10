import React from 'react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: {
    id: string;
    user: {
      name: string;
      initials: string;
    };
    content: string;
    timestamp: string;
    isLocal?: boolean;
  };
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div className={cn(
      "flex gap-3",
      message.isLocal && "flex-row-reverse"
    )}>

      <div className={cn(
        "flex flex-col",
        message.isLocal && "items-end"
      )}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-white">
            {message.isLocal ? 'You' : message.user.name}
          </span>
          <span className="text-xs text-gray-400">{message.timestamp}</span>
        </div>
        <div className={cn(
          "w-full rounded-lg py-2 text-xs text-gray-400",
        )}>
          {message.content}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;