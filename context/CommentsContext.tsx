"use client"
export interface Comment {
  id: number;
  username: string;
  text: string;
}

interface Post {
  id: number;
  username: string;
  content: string;
  likes: number;
  comments: Comment[];
}

// context/CommentContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CommentContextType {
  showComments: boolean;
  activePostId: number | null;
  setShowComments: (show: boolean) => void;
  setActivePostId: (id: number | null) => void;
  activePost: Post | undefined;
  toggleComments: (postId: number) => void;
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

export function CommentProvider({ children, posts }: { children: ReactNode; posts: any }) {
  const [showComments, setShowComments] = useState(false);
  const [activePostId, setActivePostId] = useState<number | null>(null);

  const activePost = posts?.data?.posts.find((post: any) => post.id === activePostId);

  const toggleComments = (postId: number) => {
    setActivePostId(postId);
    setShowComments(!showComments);
  };
  console.log({ showComments })
  return (
    <CommentContext.Provider
      value={{
        showComments,
        activePostId,
        setShowComments,
        setActivePostId,
        activePost,
        toggleComments,
      }}
    >
      {children}
    </CommentContext.Provider>
  );
}

export const useComments = () => {
  const context = useContext(CommentContext);
  if (context === undefined) {
    throw new Error('useComments must be used within a CommentProvider');
  }
  return context;
};