import { useFetchComments } from "@/hooks/useFetchComments"
import MediaWrapper from "../post/MediaWrapper"
import CommentItem from "./CommentItem"
import { motion } from 'framer-motion';

export function Comments({ post }: { post: any }) {
  console.log({ post })
  const { data: comments } = useFetchComments(post?.id)
  console.log({ comments })

  const sampleData = {
    currentUser: {
      id: '1',
      name: 'Current User',
      avatar: "/assets/display.jpg"
    },
    comments: [
      {
        id: '1',
        user: {
          id: '2',
          name: 'Ralph Edwards',
          avatar: "/assets/display.jpg"
        },
        content: 'In mauris porttitor tincidunt mauris massa sit lorem e.',
        timestamp: 'Aug 19, 2024',
        likes: 50400,
        replies: [
          {
            id: '2',
            user: {
              id: '3',
              name: 'Ralph Edwards',
              avatar: "/assets/display.jpg"
            },
            content: 'In mauris porttitor tincidunt mauris massa sit lorem sed.',
            timestamp: 'Aug 19, 2021',
            likes: 5248,
            replies: []
          }
        ]
      }
    ]
  };

  return (
    <div className="flex items-start h-full gap-4 w-full">
      <div className="basis-5/12 bg-black/20 rounded-xl backdrop-blur-md">
        <MediaWrapper
          postId={post.id}
          title={post.title}
          size="object-cover"
          postMedia={post.media}
          isRenderedInComment
        />
      </div>
      <div className="flex-1 max-h-[75vh] overflow-y-auto">
        <div className="flex-1 overflow-y-auto">
          {sampleData?.comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>

        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <img
              src={sampleData?.currentUser.avatar}
              alt="Your avatar"
              className="w-8 h-8 rounded-full"
            />
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium"
            >
              Post
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}
