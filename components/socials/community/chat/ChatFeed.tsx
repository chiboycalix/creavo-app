import React from "react";
import ChatMessage from "./ChatMessage";
import { Message } from "@/types/chat";

interface ChatFeedProps {
  messages: Message[];
  communityId?: string;
  spaceId?: string;
}

const ChatFeed: React.FC<ChatFeedProps> = ({ messages, communityId, spaceId }) => {
  return (
    <div className="p-4 flex flex-col gap-2 overflow-y-auto h-full max-h-[80vh] bg-gray-50">
      {messages.map((message, index) => (
        <ChatMessage key={index} message={message} communityId={communityId} spaceId={spaceId} />
      ))}
    </div>
  );
};

export default ChatFeed;
