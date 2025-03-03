"use client";
import React, { useState, useEffect, useCallback, FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/Input";
import { TextareaInput } from "@/components/Input/TextareaInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreatePostPayload, createPostService } from "@/services/post.service";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { getMimeTypeFromCloudinaryUrl } from "@/utils";
import { TagsInput } from "@/components/Input/TagsInput";
import { toast } from "sonner";

const PostEditPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [urls, setUrls] = useState<string[]>([]);
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState<any>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [deviceId, setDeviceId] = useState(null);
  const [location, setLocation] = useState<object | null>(null);

  useEffect(() => {
    const urlsParam = searchParams.get("urls");
    if (urlsParam) {
      const parsedUrls = urlsParam.split(",").filter(Boolean);
      setUrls(parsedUrls);
    }
  }, [searchParams]);

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };


  const handleGetDeviceId = async () => {
    const res = await fetch("https://api.ipify.org/?format=json");
    const data = await res.json();
    setDeviceId(data.ip);
  };

  const handleGetLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        () => console.log("Unable to retrieve location")
      );
    } else {
      console.log("Geolocation not supported");
    }
  }, []);

  useEffect(() => {
    handleGetLocation();
    handleGetDeviceId();
  }, [handleGetLocation]);

  const { mutate: handleCreatePosts, isPending: isCreatingPosts } = useMutation({
    mutationFn: (payload: CreatePostPayload) => createPostService(payload),
    onSuccess: async (data) => {
      toast.success("Post created successfully")
      router.push("/socials")
    },
    onError: (error: any) => {
      toast.error("Error creating post")
    },
  });
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const media = urls?.map((mediaItem: any) => {
      const mimeType = getMimeTypeFromCloudinaryUrl(mediaItem);
      return {
        url: mediaItem,
        title: title,
        description: caption,
        mimeType: mimeType!
      }
    });
    await handleCreatePosts({
      title: title,
      body: caption,
      thumbnailUrl: "None",
      tags: hashtags,
      media: media,
      status: "ACTIVE",
      location: JSON.stringify(location),
      deviceId: deviceId
    })
  }

  return (
    <Card className="mt-20 border-none">
      <CardHeader>
        <CardTitle className="text-base"></CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full mx-auto p-4 flex gap-6">
          {/* Left: Media Display */}
          <div className="w-1/2">
            {urls.length > 0 ? (
              <div className="relative bg-gray-50 rounded-xl border p-4 overflow-hidden">
                {/* Media Container */}
                <div className="relative w-full h-[30rem]">
                  {urls.map((url, index) => (
                    <div
                      key={index}
                      className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0"
                        }`}
                    >
                      {url.includes(".mp4") || url.includes(".mov") || url.includes(".flv") ? (
                        <video
                          src={url}
                          controls
                          className="w-full h-full object-contain rounded-lg"
                        />
                      ) : (
                        <img
                          src={url}
                          alt={`Media ${index}`}
                          className="w-full h-full object-contain rounded-lg"
                        />
                      )}
                    </div>
                  ))}
                </div>

                {urls.length > 1 && (
                  <div className="flex justify-center mt-4 space-x-2">
                    {urls.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                          ? "bg-primary scale-125"
                          : "bg-gray-300 hover:bg-gray-400"
                          }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-10">No media loaded</p>
            )}
          </div>

          {/* Right: Inputs */}
          <form className="w-1/2 flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Input
                label="Title"
                variant="text"
                id="title"
                name="title"
                placeholder="Post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white"
              />
            </div>

            <div>
              <TextareaInput
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 p-3 shadow-sm focus:ring-primary focus:border-primary"
                rows={4}
                placeholder="Write a caption..."
                label="Write caption"
              />
            </div>

            <div className="w-full">
              <TagsInput
                label="Tags"
                value={hashtags}
                onChange={(newTags) => setHashtags(newTags)}
                placeholder="#fun #tiktok #post"
                errorMessage={hashtags.length === 0 ? "Please add at least one tag" : false}
                className="w-full"
              />
            </div>
            <Button
              className="mt-4 bg-primary text-white px-6 py-2 rounded-md shadow hover:bg-primary-600 transition-colors duration-200"
            >
              {
                isCreatingPosts ? <Loader2 className="text-white" /> : "Create Post"
              }

            </Button>
          </form>
        </div>
      </CardContent>
    </Card>

  );
};

export default PostEditPage;