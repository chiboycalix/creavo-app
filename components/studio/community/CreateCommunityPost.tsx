import React, { FormEvent, useState } from 'react'
import ButtonLoader from '@/components/ButtonLoader';
import { Input } from '@/components/Input'
import { UploadInput } from '@/components/Input/UploadInput'
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/hooks/useStore.hook';
import { createPostService, CreatePostsPayload } from '@/services/community.service';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const CreateCommunityPost = ({ spaceId, communityId }: { spaceId: string, communityId: string }) => {
  const maxFiles = 1;
  const router = useRouter()
  const dispatch = useAppDispatch();
  const [post, setPost] = useState("")
  const [postImage, setPostImage] = useState("")

  const { mutate: handleCreatePost, isPending: isCreatingPost } = useMutation({
    mutationFn: (payload: CreatePostsPayload) => {
      return createPostService(payload)
    },
    onSuccess: async (data) => {
      console.log({ data })
      toast.success("Message sent successfully")
      // router.push(`/studio/community/${communityId}/${data?.id}`)
    },
    onError: (error: any) => {
      toast.error(error?.data[0] || "Something went wrong, contact admin")
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    handleCreatePost({
      text: post,
      imageUrl: postImage,
      spaceId,
      communityId
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className='mb-8'>
        <Input
          variant="text"
          label="Post header"
          maxLength={54}
          placeholder="Enter post text"
          value={post}
          onChange={(e) => {
            setPost(e.target.value)
          }}
        />
      </div>

      <div>
        <UploadInput
          label="Upload post image"
          accept="image/*"
          maxFiles={maxFiles}
          placeholder={`Max 10 MB files are allowed`}
          onChange={(uploads: any) => {
            setPostImage(uploads[0])
          }}
          className="py-10"
          footerText="Supports common image formats"
        />
      </div>

      <div className='w-full mt-12'>
        <Button
          disabled={isCreatingPost || !post || !postImage}
          className="bg-primary h-[50px] border-0 p-2.5 text-sm cursor-pointer rounded-lg text-white w-full font-medium leading-6"
        >
          <ButtonLoader
            isLoading={isCreatingPost}
            caption="Post"
          />
        </Button>
      </div>
    </form>
  )
}

export default CreateCommunityPost