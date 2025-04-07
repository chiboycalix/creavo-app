
import React from 'react';
import ChatMessage from './ChatMessage';
import { Message } from '@/types/chat';

interface ChatFeedProps {
  messages: Message[];
}

const ChatFeed: React.FC<ChatFeedProps> = ({ messages }) => {
  return (
    <div className="p-4 flex flex-col gap-2 overflow-y-auto">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
    </div>
  );
};

export default ChatFeed;
