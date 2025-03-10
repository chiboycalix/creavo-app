"use client";
import React, { FormEvent, useCallback, useState } from "react";
import VideoPlayer from "./VideoDuration";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/Input";
import { UploadInput } from "@/components/Input/UploadInput";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore.hook";
import { AddMediaToModule } from "@/types";
import { addMediaToModuleService } from "@/services/module.service";
import { useMutation, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { resetAddMediaToModuleForm, updateAddMediaToModuleForm } from "@/redux/slices/module.slice";
import { getMimeTypeFromCloudinaryUrl } from "@/utils";

interface UploadMediaProps {
  description: string;
  queryClient: QueryClient;
  moduleId?: string;
  courseId: string | number;
}

interface ModuleData {
  module: {
    id: string;
    media: any[];
  };
}

const UploadMedia = ({ description, queryClient, moduleId, courseId }: UploadMediaProps) => {
  const dispatch = useAppDispatch();
  const { longCourseData: courseDataStateValues } = useAppSelector((store) => store.courseStore);
  const { selectedModuleData, addMediaToModuleForm: addMediaToModuleStateValues } = useAppSelector((store) => store.moduleStore);
  const [duration, setDuration] = useState(0);
  const [open, setOpen] = useState<boolean>(false);

  const updateAddMediaToModule = useCallback(
    (payload: Partial<any["media"][0]>) => dispatch(updateAddMediaToModuleForm(payload)),
    [dispatch]
  );

  const { mutate: handleAddMediaToModule, isPending: isAddingMediaToModule } = useMutation({
    mutationFn: (payload: AddMediaToModule) => addMediaToModuleService(payload),
    onSuccess: (data) => {
      setOpen(false);
      dispatch(resetAddMediaToModuleForm());
      toast.success("Media added to module");

      // Optimistically update the courseModulesData cache
      const newMedia = {
        id: data?.id || Date.now().toString(),
        url: addMediaToModuleStateValues.url,
        mimeType: getMimeTypeFromCloudinaryUrl(addMediaToModuleStateValues.url) ?? "",
        title: addMediaToModuleStateValues.title,
        description: addMediaToModuleStateValues.description,
        mediaLength: duration,
      };

      queryClient.setQueryData<ModuleData>(["courseModulesData", moduleId], (oldData) => {
        if (!oldData?.module) return oldData;
        return {
          ...oldData,
          module: {
            ...oldData.module,
            media: [...oldData.module.media, newMedia],
          },
        };
      });
    },
    onError: (error: any) => {
      toast.error(error?.data?.[0] || "Failed to add media");
    },
  });

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!addMediaToModuleStateValues.url || !moduleId) return;

      const mimeType = getMimeTypeFromCloudinaryUrl(addMediaToModuleStateValues.url);
      handleAddMediaToModule({
        courseId: courseDataStateValues?.courseId || courseId,
        moduleId: selectedModuleData?.id,
        media: [
          {
            url: addMediaToModuleStateValues.url,
            mimeType: mimeType ?? "",
            title: addMediaToModuleStateValues.title,
            description: addMediaToModuleStateValues.description,
            mediaLength: duration,
          },
        ],
      });
    },
    [
      addMediaToModuleStateValues.url,
      addMediaToModuleStateValues.title,
      addMediaToModuleStateValues.description,
      courseDataStateValues?.courseId,
      selectedModuleData?.id,
      duration,
      handleAddMediaToModule,
      moduleId,
    ]
  );

  return (
    <div className="bg-primary-100 mt-5 p-4 rounded-sm flex items-start justify-between">
      <p className="text-xs basis-6/12 leading-5">{description}</p>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="bg-primary border-0 p-2 text-sm cursor-pointer rounded-lg text-white basis-3/12 font-medium leading-6">
          Upload content
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <form onSubmit={handleSubmit}>
              <div className="mb-8">
                <Input
                  variant="text"
                  label="Video Title"
                  maxLength={54}
                  placeholder="Enter video title"
                  value={addMediaToModuleStateValues.title}
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
                  value={addMediaToModuleStateValues.description}
                  onChange={(e) => updateAddMediaToModule({ description: e.target.value })}
                  rows={10}
                />
              </div>
              <div className="">
                <UploadInput
                  label="Upload Videos"
                  accept="video/*"
                  maxFiles={1}
                  onChange={(uploads) => updateAddMediaToModule({ url: uploads })}
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
                  disabled={isAddingMediaToModule || !addMediaToModuleStateValues.url}
                >
                  {isAddingMediaToModule ? <Loader2 /> : "Continue"}
                </Button>
              </div>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UploadMedia;