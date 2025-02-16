import React from 'react';
import moment from "moment"
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { BiLike } from 'react-icons/bi';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

interface Comment {
  id: string;
  _user: User;
  body: string;
  createdAt: string;
  likes: number;
  replies: Comment[];
}

const CommentItem = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => {
  const maxDepth = 2;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 mb-4">
      <div className={`flex items-start gap-3 px-4 ${depth > 0 ? 'pl-12' : ''}`}>
        {/* Avatar */}
        <img
          src={comment._user?.avatar}
          alt={comment._user.firstName}
          className="w-10 h-10 rounded-full flex-shrink-0"
        />

        {/* Comment content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm">{comment._user.firstName} {comment._user.lastName}</h3>
            <span className="text-xs text-gray-500">{moment(comment.createdAt).format('MMM DD, YYYY')}</span>
          </div>
          <p className="text-sm text-gray-800 mt-1">{comment?.body}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-4 flex-shrink-0">
          <div className="flex items-center gap-1">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="text-gray-500 hover:text-red-500"
            >
              <BiLike className="w-4 h-4" />
            </motion.button>
            <span className="text-xs text-gray-500">5</span>
          </div>
          <div className="flex items-center gap-1">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="text-gray-500 hover:text-gray-700"
            >
              <MessageSquare className="w-4 h-4" />
            </motion.button>
            <span className="text-xs text-gray-500">15</span>
          </div>
        </div>
      </div>

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

export default CommentItem;