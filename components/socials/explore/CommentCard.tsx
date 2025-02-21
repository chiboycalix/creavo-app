"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { Comments } from "@/components/socials/explore/Comments";
import { useComments } from "@/context/CommentsContext";
import { useFetchComments } from "@/hooks/useFetchComments";

const CommentCard = () => {
  const { showComments, setShowComments, activePostId } =
    useComments();
  const { data: comments, isPending: isFetchingComments } = useFetchComments(
    activePostId as any
  );
  if (!showComments) return null;

  return (
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
  );
};

export default CommentCard;
