"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Message } from "@/types/chat"; // Adjust path to your types
import { useRouter } from "next/navigation";

interface ReplyContextType {
  replyingTo: Message | null;
  isReplyInputOpen: boolean;
  openReplyInput: (message: Message) => void;
  closeReplyInput: () => void;
  navigateToReplies: (messageId: string) => void;
}

const ReplyContext = createContext<ReplyContextType | undefined>(undefined);

export const ReplyProvider = ({ children }: { children: ReactNode }) => {
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [isReplyInputOpen, setIsReplyInputOpen] = useState(false);
  const router = useRouter();

  const openReplyInput = (message: Message) => {
    setReplyingTo(message);
    setIsReplyInputOpen(true);
  };

  const closeReplyInput = () => {
    setReplyingTo(null);
    setIsReplyInputOpen(false);
  };

  const navigateToReplies = (messageId: string) => {
    router.push(`/${messageId}/replies`);
    closeReplyInput();
  };

  return (
    <ReplyContext.Provider
      value={{
        replyingTo,
        isReplyInputOpen,
        openReplyInput,
        closeReplyInput,
        navigateToReplies,
      }}
    >
      {children}
    </ReplyContext.Provider>
  );
};

export const useReply = () => {
  const context = useContext(ReplyContext);
  if (!context) {
    throw new Error("useReply must be used within a ReplyProvider");
  }
  return context;
};