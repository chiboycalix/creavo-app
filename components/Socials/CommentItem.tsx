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
    <div className="animate-in fade-in slide-in-from-bottom-4">
      <div className={`basis-11/12 flex gap-3 p-4 ${depth > 0 ? 'pl-12' : ''}`}>
        <div className='basis-1/12'>
          <img
            src={comment._user.avatar}
            alt={comment._user.firstName}
            className="w-10 h-10 rounded-full flex-shrink-0"
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <h3 className="font-semibold text-sm">{comment._user.firstName} {comment._user.lastName}</h3>
            <p className="text-xs text-gray-500">{moment(comment.createdAt).format('MMM DD, YYYY')}</p>
          </div>
          <p className="text-sm text-gray-800 text-justify">{comment?.body}</p>
          {/* <p className="text-sm text-gray-800 text-justify">In mauris porttitor tincidunt mauris massa sit lorem e. Fringilla pharetra vel massa enim sollicitudin cras. At pulvinar eget sociis adipiscing eget donec ultricies nibh tristique. </p> */}
          <div className="flex gap-6 mt-3 justify-end">
            <div className="flex gap-1">
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="text-gray-500 hover:text-red-500"
              >
                <BiLike className="w-4 h-4" />
              </motion.button>
              <span className="text-xs text-gray-500">5</span>
            </div>
            <div className="flex gap-1">
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

export default CommentItem