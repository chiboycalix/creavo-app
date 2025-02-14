import React from 'react';
import { motion } from 'framer-motion';
import { XIcon, Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface Comment {
  id: string;
  user: User;
  content: string;
  timestamp: string;
  likes: number;
  replies: Comment[];
}

interface CommentsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  comments: Comment[];
  currentUser: User;
}


const CommentItem = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => {
  const maxDepth = 2; // Maximum nesting level

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4">
      <div className={`flex gap-3 p-4 ${depth > 0 ? 'pl-12' : ''}`}>
        <img
          src={comment.user.avatar}
          alt={comment.user.name}
          className="w-10 h-10 rounded-full flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">{comment.user.name}</h3>
            <span className="text-xs text-gray-500">{comment.timestamp}</span>
          </div>
          <p className="text-sm mt-1 text-gray-800">{comment.content}</p>

          <div className="flex items-center gap-6 mt-2">
            <div className="flex items-center gap-1">
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="text-gray-500 hover:text-red-500"
              >
                <Heart className="w-5 h-5" />
              </motion.button>
              <span className="text-xs text-gray-500">{comment.likes}</span>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="text-gray-500 hover:text-gray-700"
            >
              <MessageCircle className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="text-gray-500 hover:text-gray-700"
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="text-gray-500 hover:text-gray-700"
            >
              <Bookmark className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Render nested replies if within max depth */}
      {depth < maxDepth && comment.replies?.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          depth={depth + 1}
        />
      ))}
    </div>
  );
};

export default CommentItem