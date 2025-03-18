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
import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"

const CreateCommunityDialog = () => {
  const router = useRouter()
  const [space, setspace] = useState("")
  const maxFiles = 1;
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    router.push(`/studio/community/${space}`)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='w-full'>
          Create Community
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-sm">Basic Settings</DialogTitle>
          <form onSubmit={handleSubmit}>
            <div className='mb-8'>
              <Input
                variant="text"
                label="Community name"
                maxLength={54}
                placeholder="Enter Community name"
                value={space}
                onChange={(e) => {
                  setspace(e.target.value)
                }}
              />
              <p className='text-sm mt-1'>You can always change this later</p>
            </div>

            <div className='mb-8'>
              <Input
                variant="textarea"
                label="Course Description"
                maxLength={365}
                placeholder="Enter your course description"
                value={"desc"}
                onChange={(e) => {
                }}
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
                }}
                className="py-10"
              />
            </div>

            <div className='w-full mt-12'>
              <Button
                disabled={!space}
                className="bg-primary h-[50px] border-0 p-2.5 text-sm cursor-pointer rounded-lg text-white w-full font-medium leading-6"
              >
                <ButtonLoader
                  isLoading={false}
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