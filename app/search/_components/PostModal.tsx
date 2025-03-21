"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { X, Heart, MessageSquare, Share2, Bookmark, Eye } from "lucide-react";
import { baseUrl } from "@/utils/constant";
import Cookies from "js-cookie";
import VideoMedia from "@/components/post/ModalMedia";
import type { PostMediaType } from "@/context/PostContext";

type Media = {
  id: number;
  description: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  mimeType: string;
  metadata: any;
};

type Comment = {
    id?: number;
    body?: string;
    likesCount?: number;
    commentsCount?: number;
    interactableId?: number;
    interactableType?: string;
    commentId?: number | null;
    createdAt: string;
    updatedAt: string;
    user?: {
      id?: number;
      username?: string;
      avatar: string;
      firstName: string;
      lastName: string;
    };
  };
  

type PostDetails = {
  id: number;
  hashtag: string;
  body: string;
  userId: number;
  status: string;
  isPrivate: boolean;
  metadata: any;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  sharesCount: number;
  bookmarkCount: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  user_username: string;
  user_profile_firstName: string;
  user_profile_lastName: string;
  user_profile_avatar: string;
  media: Media[];
};

type PostResponse = {
  data: PostDetails;
  message: string;
  code: number;
  status: string;
  statusCode: number;
};

type CommentsResponse = {
  data: {
    comments: Comment[];
    meta: {
      totalCount: number;
      limit: number;
      totalPages: number;
      currentPage: number;
    };
  };
  message: string;
  code: number;
  status: string;
  statusCode: number;
};

interface PostModalProps {
  postId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function PostModal({ postId, isOpen, onClose }: PostModalProps) {
  const [post, setPost] = useState<PostDetails | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  useEffect(() => {
    if (!isOpen || !postId) return;

    const fetchPostDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = Cookies.get("token");
        const response = await fetch(`${baseUrl}/posts/${postId}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch post details");
        }

        const data: PostResponse = await response.json();
        setPost(data.data);
      } catch (err) {
        console.error("Error fetching post details:", err);
        setError("Failed to load post details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostDetails();
  }, [postId, isOpen]);


  useEffect(() => {
    if (!isOpen || !postId) return;

    const fetchComments = async () => {
        setIsLoadingComments(true);
      
        try {
          const token = Cookies.get("token");
          const response = await fetch(`${baseUrl}/posts/${postId}/comments`, {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
              "Content-Type": "application/json",
            },
          });
      
          if (!response.ok) {
            throw new Error("Failed to fetch comments");
          }
      
          const data: CommentsResponse = await response.json();
      
          const formattedComments = data.data.comments.map((comment: any) => ({
            ...comment,
            user: comment._user, 
          }));
      
          setComments(formattedComments || []);
        } catch (err) {
          console.error("Error fetching comments:", err);
        } finally {
          setIsLoadingComments(false);
        }
      };      
    fetchComments();
  }, [postId, isOpen]);
  

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !postId) return;
  
    try {
      const token = Cookies.get("accessToken"); // Use the same token key
      if (!token) {
        console.error("No access token found!");
        return;
      }
  
      const response = await fetch(`${baseUrl}/posts/${postId}/create-comment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, body: newComment }), // Ensure postId is included
      });
  
      if (!response.ok) {
        throw new Error("Failed to post comment");
      }
  
      // Refresh comments
      const commentsResponse = await fetch(`${baseUrl}/posts/${postId}/comments`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!commentsResponse.ok) {
        throw new Error("Failed to refresh comments");
      }
  
      const commentsData: CommentsResponse = await commentsResponse.json();
      setComments(commentsData.data.comments || []);
      setNewComment("");
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };
  

  const nextMedia = () => {
    if (post?.media && currentMediaIndex < post.media.length - 1) {
      setCurrentMediaIndex(currentMediaIndex + 1);
    }
  };

  const prevMedia = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(currentMediaIndex - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div ref={modalRef} className="bg-white rounded-2xl w-[60%] max-h-[90vh] overflow-hidden">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <p className="text-red-500">{error}</p>
          </div>
        ) : post ? (
          <div className="flex h-[90vh]">
            {/* Left side - Media */}
            <div className="flex-1 bg-black flex items-center justify-center relative">
              {post?.media && post?.media.length > 0 ? (
                <>
                  <VideoMedia
                    title={post?.media[currentMediaIndex]?.title || ""}
                    size="w-full h-full object-contain"
                    media={post?.media[currentMediaIndex]?.thumbnailUrl || ""}
                    postMedia={[post?.media[currentMediaIndex]] as unknown as PostMediaType[]}
                    postId={post?.id}
                  />
                  
                 
                </>
              ) : (
                <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                  <p className="text-gray-400">No media available</p>
                </div>
              )}

              {/* Media navigation */}
              {post?.media && post?.media.length > 1 && (
                <>
                  <button
                    onClick={prevMedia}
                    disabled={currentMediaIndex === 0}
                    className="absolute left-4 top-4 bg-white/80 rounded-full p-2 disabled:opacity-50 hover:bg-white"
                  >
                    <X className="h-6 w-6 transform rotate-45" />
                  </button>
                  <button
                    onClick={nextMedia}
                    disabled={currentMediaIndex === post?.media.length - 1}
                    className="absolute right-4 top-4 bg-white/80 rounded-full p-2 disabled:opacity-50 hover:bg-white"
                  >
                    <X className="h-6 w-6 transform rotate-[225deg]" />
                  </button>
                  <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1.5 rounded-full text-white text-sm">
                    {currentMediaIndex + 1}/{post?.media.length}
                  </div>
                </>
              )}
            </div>

            {/* Right side - Content */}
            <div className="w-[400px] relative flex flex-col bg-white">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-6 bg-white/50 p-3 rounded-full">
                    <button className=" text-black transition-colors">
                      <Heart className="h-6 w-6" />
                      <span className="text-xs mt-1 block">{post.likesCount || 0}</span>
                    </button>
                    <button className=" text-black transition-colors">
                      <MessageSquare className="h-6 w-6" />
                      <span className="text-xs mt-1 block">{post.commentsCount || 0}</span>
                    </button>
                    <button className=" text-black transition-colors">
                      <Share2 className="h-6 w-6" />
                      <span className="text-xs mt-1 block">{post.sharesCount || 0}</span>
                    </button>
                    <button className=" text-black transition-colors">
                      <Bookmark className="h-6 w-6" />
                      <span className="text-xs mt-1 block">{post.bookmarkCount || 0}</span>
                    </button>
                  </div>
              {/* Header */}
              <div className="p-4 border-b flex items-end justify-end">
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Comments section */}
              <div className="flex-1 overflow-y-auto">
                {/* Original post as first comment */}
                <div className="p-4 border-b">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-500 flex-shrink-0">
                      {post.user_profile_avatar ? (
                        <Image
                          src={post.user_profile_avatar}
                          alt={post.user_username}
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white">
                          <span className="text-lg font-semibold">
                            {post.user_profile_firstName?.charAt(0) || post.user_username?.charAt(0) || "U"}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold">
                        {post.user_profile_firstName && post.user_profile_lastName
                          ? `${post.user_profile_firstName} ${post.user_profile_lastName}`
                          : post.user_username || "Anonymous"}
                      </h4>
                      <p className="mt-1 text-sm">{post.body}</p>
                      {post.hashtag && (
                        <p className="mt-2 text-sm text-blue-500">
                          {post.hashtag.split(" ").map((tag, index) => (
                            <span key={index} className="mr-2">
                              {tag}
                            </span>
                          ))}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Comments */}
                {isLoadingComments ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="p-4 border-b">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                          {comment.user?.avatar ? (
                            <Image
                              src={comment.user.avatar}
                              alt={comment.user.firstName}
                              width={32}
                              height={32}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-sm font-semibold text-gray-500">
                                {comment.user?.firstName?.charAt(0) ||
                                  comment.user?.username?.charAt(0) ||
                                  "U"}
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-sm">
                              {comment.user?.firstName && comment.user?.lastName
                                ? `${comment.user.firstName} ${comment.user?.lastName}`
                                : comment.user?.username || "Anonymous"}
                            </h4>
                            <span className="text-xs text-gray-500">
                              {new Date(comment?.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="mt-1 text-sm">{comment.body}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">No comments yet</div>
                )}
              </div>

              {/* Comment input */}
              <div className="border-t p-4">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 text-sm border-none focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSubmitComment();
                      }
                    }}
                  />
                  <button
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim()}
                    className="text-blue-500 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <p className="text-gray-500">Post not found</p>
          </div>
        )}
      </div>
    </div>
  );
}