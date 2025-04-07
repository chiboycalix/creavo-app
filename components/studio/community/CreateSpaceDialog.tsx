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
import { createSpaceService, SpacePayload } from "@/services/community.service"
import { toast } from "sonner"
import { useAppDispatch, useAppSelector } from "@/hooks/useStore.hook"
import { useCreateSpaceValidator } from "@/helpers/validators/useCreateSpace.validator"
import { CreateSpaceForm } from "@/types"
import { resetCreateSpaceForm, updateCreateSpaceForm } from "@/redux/slices/space.slice"
import { Plus } from "lucide-react"

const CreateSpaceDialog = ({ communityId }: { communityId: string }) => {
  const maxFiles = 1;
  const router = useRouter()
  const dispatch = useAppDispatch();
  const { createSpaceForm: createSpaceStateValues } = useAppSelector((store) => store.spaceStore);
  const { validate, errors, validateField } = useCreateSpaceValidator({ store: createSpaceStateValues });
  const updateCreateSpace = (payload: Partial<CreateSpaceForm>) => dispatch(updateCreateSpaceForm(payload));

  const { mutate: handleCreateSpace, isPending: isCreatingSpace } = useMutation({
    mutationFn: (payload: SpacePayload) => {
      return createSpaceService(payload)
    },
    onSuccess: async (data) => {
      console.log({ data })
      toast.success("Space created successfully")
      router.push(`/studio/community/${communityId}/${data?.id}`)
      dispatch(resetCreateSpaceForm())
    },
    onError: (error: any) => {
      toast.error(error?.data[0] || "Something went wrong, contact admin")
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    validate(() => handleCreateSpace({
      name: createSpaceStateValues?.name,
      description: createSpaceStateValues?.description,
      logo: createSpaceStateValues?.logo,
      communityId: communityId
    }))
  }

  const isDisabled = !createSpaceStateValues?.name || !createSpaceStateValues?.description || isCreatingSpace;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Plus className="h-4 w-4 bg-primary-700 text-white rounded cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm">Basic Settings</DialogTitle>
          <form onSubmit={handleSubmit}>
            <div className='mb-8'>
              <Input
                variant="text"
                label="Space name"
                maxLength={54}
                placeholder="Enter Community name"
                value={createSpaceStateValues?.name}
                onChange={(e) => {
                  validateField("name", e.target.value)
                  updateCreateSpace({ name: e.target.value });
                }}
                errorMessage={errors.name}
              />
              <p className='text-xs mt-1'>You can always change this later</p>
            </div>

            <div className='mb-8'>
              <Input
                variant="textarea"
                label="Space Description"
                maxLength={365}
                placeholder="Enter your space description"
                value={createSpaceStateValues?.description}
                onChange={(e) => {
                  validateField("description", e.target.value)
                  updateCreateSpace({ description: e.target.value });
                }}
                errorMessage={errors.description}
                rows={5}
              />
            </div>
            <div>
              <UploadInput
                label="Upload space banner image"
                accept="image/*"
                maxFiles={maxFiles}
                placeholder={`Max 10 MB files are allowed`}

                onChange={(uploads: any) => {
                  updateCreateSpace({ logo: uploads[0] })
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
                  isLoading={isCreatingSpace}
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

export default CreateSpaceDialog