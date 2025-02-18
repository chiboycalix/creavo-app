"use client";

import React, { useEffect, useState } from "react";
import PostModal from "@/components/post/post-modal";
import { useParams, useRouter } from "next/navigation";
import { PostType, usePost } from "@/context/PostContext";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useVideoPlayback } from "@/context/VideoPlaybackContext";

export default function PostModalWrapper() {
  const router = useRouter();
  const { getCurrentUser } = useAuth();
  const { fetchPostDetail } = usePost();
  const { setIsGloballyPaused } = useVideoPlayback();
  const [postDetail, setPostDetail] = useState<PostType | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      if (id && typeof id === "string") {
        const parsedId = parseInt(id, 10);

        if (!isNaN(parsedId)) {
          const res = await fetchPostDetail(parsedId);
          setPostDetail(res);
        } else {
        }
      }
    };

    fetchPost();
    setIsGloballyPaused(true);
    return () => setIsGloballyPaused(false);
  }, [setIsGloballyPaused, id, fetchPostDetail]);

  // if (!postDetail) {
  //   router.push("/");
  // }

  const handleClose = () => {
    router.back();
  };

  const user = getCurrentUser();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center"
      >
        {postDetail && (
          <PostModal
            isOpen={true}
            onClose={handleClose}
            post={postDetail}
            currentUser={user}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}