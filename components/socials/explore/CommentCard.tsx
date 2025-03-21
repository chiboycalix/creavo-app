"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { Comments } from "@/components/socials/explore/Comments";
import { useComments } from "@/context/CommentsContext";
import { useFetchComments } from "@/hooks/comments/useFetchComments";
import { motion, AnimatePresence } from 'framer-motion';

type CommentCardProps = {
  isOpen: boolean;
  onClose: () => void;
  anchorRect?: DOMRect | null;
};

const CommentCard = ({ isOpen, onClose, anchorRect }: CommentCardProps) => {
  const { showComments, setShowComments, activePostId } =
    useComments();
  const { data: comments, isPending: isFetchingComments } = useFetchComments(
    activePostId as any
  );
  if (!showComments) return null;
  if (!anchorRect) return null;

  const menuPosition = {
    top: 100,
    right: 320,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            style={{
              position: 'fixed',
              top: menuPosition.top,
              right: menuPosition.right,
              transformOrigin: 'bottom right'
            }}
            className="z-50 w-64"
          >
            <Card className="border-none fixed w-full md:w-[37.5%]">
              <CardHeader className="flex flex-row justify-between items-center">
                {isFetchingComments ? (
                  <div className="w-full py-2 animate-pulse rounded-md bg-neutral-100 dark:bg-neutral-800"></div>
                ) : (
                  <>
                    <CardTitle className="text-md">
                      Comments {`(${comments?.data?.meta?.totalCount})`}
                    </CardTitle>
                    <X
                      size={20}
                      className="cursor-pointer"
                      onClick={() => setShowComments(false)}
                    />
                  </>
                )}
              </CardHeader>
              <CardContent className="border-none">
                <Comments postId={activePostId as any} />
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommentCard;
