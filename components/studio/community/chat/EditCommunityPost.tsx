import React, { FormEvent, useState } from 'react'
import ButtonLoader from '@/components/ButtonLoader';
import { Input } from '@/components/Input'
import { UploadInput } from '@/components/Input/UploadInput'
import { Button } from '@/components/ui/button';
import { editPostService, EditPostsPayload } from '@/services/community.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

type EditCommunityPostProps = {
  spaceId: string,
  communityId: string,
  setIsInputDialogOpen: any;
  message: any;
}

const EditCommunityPost = ({ spaceId, communityId, setIsInputDialogOpen, message }: EditCommunityPostProps) => {
  const maxFiles = 1;
  const queryClient = useQueryClient();
  const [post, setPost] = useState("")
  const [postImage, setPostImage] = useState("")

  const { mutate: handleEditPost, isPending: isEditingPost } = useMutation({
    mutationFn: (payload: EditPostsPayload) => {
      return editPostService(payload)
    },
    onSuccess: async (data) => {
      toast.success("Message updated successfully")
      setIsInputDialogOpen(false)
      await queryClient.invalidateQueries({ queryKey: ["listMessages"] });
    },
    onError: (error: any) => {
      toast.error(error?.data[0] || "Something went wrong, contact admin")
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    handleEditPost({
      text: post || message?.content,
      imageUrl: postImage || message?.image,
      spaceId,
      communityId,
      messageId: message?.id,
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
          value={post || message?.content}
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
          disabled={isEditingPost}
          className="bg-primary h-[50px] border-0 p-2.5 text-sm cursor-pointer rounded-lg text-white w-full font-medium leading-6"
        >
          <ButtonLoader
            isLoading={isEditingPost}
            caption="Post"
          />
        </Button>
      </div>
    </form>
  )
}

export default EditCommunityPost