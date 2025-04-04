"use client";
import React, { FormEvent, useState } from "react";
import VideoPlayer from "../long-course/VideoDuration";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/Input";
import { UploadInput } from "@/components/Input/UploadInput";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore.hook";
import { AddMediaToModule } from "@/types";
import { addMediaToCourseService } from "@/services/module.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { resetAddMediaToModuleForm, updateAddMediaToModuleForm } from "@/redux/slices/module.slice";
import { getMimeTypeFromCloudinaryUrl } from "@/utils";
import ButtonLoader from "@/components/ButtonLoader";

interface UploadShortCourseMediaProps {
  description: string;
  onUploadSuccess?: (newVideo: any) => void;
  courseId?: string;
}

const UploadShortCourseMedia = ({ description, onUploadSuccess, courseId }: UploadShortCourseMediaProps) => {
  const dispatch = useAppDispatch();
  const { shortCourseData: courseDataStateValues } = useAppSelector((store) => store.courseStore);
  const { addMediaToModuleForm: addMediaToModuleStateValues } = useAppSelector((store) => store.moduleStore);
  const updateAddMediaToModule = (payload: Partial<any>) => dispatch(updateAddMediaToModuleForm(payload));
  const [duration, setDuration] = useState(0);
  const [open, setOpen] = useState<boolean>(false);

  const { mutate: handleAddMediaToShortCourse, isPending: isAddingMediaToModule } = useMutation({
    mutationFn: (payload: Partial<AddMediaToModule>) => addMediaToCourseService(payload),
    onSuccess: async (data) => {
      setOpen(false);
      dispatch(resetAddMediaToModuleForm());
      toast.success("Media added to module");

      if (onUploadSuccess && data?.media?.[0]) {
        onUploadSuccess(data.media[0]);
      }
    },
    onError: (error: any) => {
      toast.error(error?.data?.[0] || "Failed to add media");
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const mimeType = getMimeTypeFromCloudinaryUrl(addMediaToModuleStateValues.url);
    const effectiveCourseId = courseId || courseDataStateValues?.courseId;

    if (!effectiveCourseId) {
      toast.error("Course ID is missing");
      return;
    }

    handleAddMediaToShortCourse({
      courseId: Number(effectiveCourseId),
      media: [
        {
          url: addMediaToModuleStateValues.url,
          mimeType: mimeType ?? "",
          title: addMediaToModuleStateValues.title,
          description: addMediaToModuleStateValues.description,
          mediaLength: duration
        }
      ]
    });
  };

  return (
    <div className="bg-primary-100 mt-5 p-4 rounded-sm flex items-start justify-between">
      <p className="text-xs basis-6/12 leading-5">{description}</p>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="bg-primary border-0 p-2 text-sm cursor-pointer rounded-lg text-white basis-3/12 font-medium leading-6">
          Upload content
        </DialogTrigger>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <form onSubmit={handleSubmit}>
              <div className="mb-8">
                <Input
                  variant="text"
                  label="Title"
                  maxLength={54}
                  placeholder="Enter video title"
                  value={addMediaToModuleStateValues.title || ""}
                  onChange={(e) => updateAddMediaToModule({ title: e.target.value })}
                />
              </div>
              <br />
              <div className="mb-8">
                <Input
                  variant="textarea"
                  label="Video Description"
                  maxLength={365}
                  placeholder="Enter your video description"
                  value={addMediaToModuleStateValues.description || ""}
                  onChange={(e) => updateAddMediaToModule({ description: e.target.value })}
                  rows={5}
                />
              </div>
              <div className="">
                <UploadInput
                  label="Upload Videos"
                  accept="video/*"
                  maxFiles={1}
                  className="py-10"
                  onChange={(uploads: any) => updateAddMediaToModule({ url: uploads[0] })}
                />
              </div>
              <br />
              <br />
              <VideoPlayer
                src={addMediaToModuleStateValues.url}
                setDuration={setDuration}
                duration={duration}
              />
              <div className="mt-8">
                <Button
                  type="submit"
                  className="bg-primary h-[50px] border-0 p-2.5 text-sm cursor-pointer rounded-lg text-white w-full font-medium leading-6"
                  disabled={isAddingMediaToModule}
                >
                  <ButtonLoader
                    caption="Continue"
                    isLoading={isAddingMediaToModule}
                  />
                </Button>
              </div>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UploadShortCourseMedia;