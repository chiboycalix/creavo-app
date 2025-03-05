'use client'
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
  const { fetchPostById } = usePost();
  const { setIsGloballyPaused } = useVideoPlayback();
  const [postDetail, setPostDetail] = useState<PostType | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Added loading state
  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return; // Ensure id exists before fetching

      setLoading(true); // Set loading to true before the fetch request
      try {
        const res = await fetchPostById(Number(id)); 
        setPostDetail(res);
        console.log("Fetched post:", res);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false); // Set loading to false after the fetch request is done
      }
    };
    fetchPost();
    setIsGloballyPaused(true);
    return () => setIsGloballyPaused(false);
  }, [setIsGloballyPaused, id, fetchPostById]);

  const handleClose = () => {
    router.back();
  };

  const user = getCurrentUser();

  if (loading) {
    return <div>Loading...</div>; // Add a loading indicator while fetching data
  }

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
