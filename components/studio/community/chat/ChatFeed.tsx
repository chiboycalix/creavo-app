import React from "react";
import ChatMessage from "./ChatMessage";
import { Message } from "@/types/chat";
import ChatMessageSkeleton from "@/components/sketetons/ChatMessageSkeleton";

interface ChatFeedProps {
  messages: Message[];
}

const ChatFeed: React.FC<ChatFeedProps> = ({ messages }) => {

  return (
    <div className="p-4 flex flex-col gap-2 overflow-y-auto h-full max-h-[80vh] bg-gray-50">
      {messages.map((message, index) => (
        <ChatMessage key={index} message={message} />
      ))}
    </div>
  );
};

export default ChatFeed;
