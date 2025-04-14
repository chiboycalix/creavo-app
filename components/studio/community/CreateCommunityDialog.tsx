"use client"
import ButtonLoader from "@/components/ButtonLoader"
import { UploadInput } from "@/components/Input/UploadInput"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/Input'
import { FormEvent } from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { createCommunityService } from "@/services/community.service"
import { toast } from "sonner"
import { useAppDispatch, useAppSelector } from "@/hooks/useStore.hook"
import { useCreateCommunityValidator } from "@/helpers/validators/useCreateCommunity.validator"
import { CreateCommunityForm } from "@/types"
import { resetCreateCommunityForm, updatCreateCommunityForm } from "@/redux/slices/community.slice"

const CreateCommunityDialog = () => {
  const router = useRouter()
  const maxFiles = 1;
  const dispatch = useAppDispatch();
  const { createCommunityForm: createCommunityStateValues } = useAppSelector((store) => store.communityStore);
  const { validate, errors, validateField } = useCreateCommunityValidator({ store: createCommunityStateValues });
  const updateCreateCommunity = (payload: Partial<CreateCommunityForm>) => dispatch(updatCreateCommunityForm(payload));

  const { mutate: handleCreateCommunity, isPending: isCreatingCommunity } = useMutation({
    mutationFn: (payload: any) => createCommunityService(payload),
    onSuccess: async (data) => {
      toast.success("Community created successfully")
      router.push(`/studio/community/${data?.id}`)
      dispatch(resetCreateCommunityForm())
    },
    onError: (error: any) => {
      console.log({ error })
      toast.error("Failed to create")
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    validate(() => handleCreateCommunity(createCommunityStateValues))
  }

  const isDisabled = !createCommunityStateValues?.name || !createCommunityStateValues?.description || isCreatingCommunity

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='w-full'>
          Create Community
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm">Basic Settings</DialogTitle>
          <form onSubmit={handleSubmit}>
            <div className='mb-8'>
              <Input
                variant="text"
                label="Community name"
                maxLength={54}
                placeholder="Enter Community name"
                value={createCommunityStateValues?.name}
                onChange={(e) => {
                  validateField("name", e.target.value)
                  updateCreateCommunity({ name: e.target.value });
                }}
                errorMessage={errors.name}
              />
              <p className='text-xs mt-1'>You can always change this later</p>
            </div>

            <div className='mb-8'>
              <Input
                variant="textarea"
                label="Community Description"
                maxLength={365}
                placeholder="Enter your community description"
                value={createCommunityStateValues?.description}
                onChange={(e) => {
                  validateField("description", e.target.value)
                  updateCreateCommunity({ description: e.target.value });
                }}
                errorMessage={errors.description}
                rows={5}
              />
            </div>
            <div>
              <UploadInput
                label="Upload community banner image"
                accept="image/*"
                maxFiles={maxFiles}
                placeholder={`Max 10 MB files are allowed`}

                onChange={(uploads: any) => {
                  updateCreateCommunity({ logo: uploads[0] })
                }}
                className="py-10"
                footerText="Supports common image formats"
              />
            </div>

            <div className='w-full mt-12'>
              <Button
                disabled={isDisabled}
                className="bg-primary h-[50px] border-0 p-2.5 text-sm cursor-pointer rounded-lg text-white w-full font-medium leading-6"
              >
                <ButtonLoader
                  isLoading={isCreatingCommunity}
                  caption="Continue"
                />
              </Button>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default CreateCommunityDialog