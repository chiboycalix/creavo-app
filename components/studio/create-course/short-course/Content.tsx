"use client";
import React, { FormEvent, useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import { Clipboard, GripVertical, PenBox, Plus, Trash, Video } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/Input";
import { addModuleService, fetchModuleDetailsService } from "@/services/module.service";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { resetCreateModuleForm, updatCreateModuleForm, updateSelectedModuleData } from "@/redux/slices/module.slice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore.hook";
import { CreateModuleForm } from "@/types";
import { useCreateModuleFormValidator } from "@/helpers/validators/useCreateModule.validator";
import { useRouter, useSearchParams } from "next/navigation";
import { generalHelpers } from "@/helpers";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { fetctCourseService } from "@/services/course.service";
import { toast } from "sonner";
import UploadMedia from "../curriculum/UploadMedia";

const courses = {
  videos: [
    {
      id: 1,
      url: "",
      mimeType: "",
      title: "Video one",
      description: "description of videos"
    }
  ]
}
const Content = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  return (
    <div>
      {
        courses?.videos.length === 0 ? (
          <div className="w-full mt-40 mx-auto flex flex-col items-center justify-center">
            <Video size={30} />
            <p className="text-xl tracking-wide">
              Add content to your course
            </p>
            <p className="text-sm mt-2">Add new video</p>
          </div>
        ) : (
          <>
            {courses?.videos?.map((video: any) => {
              return (
                <div
                  key={video?.id}
                  className="flex items-center mb-4 gap-2"
                >
                  <div className="basis-[2%]">
                    <GripVertical />
                  </div>
                  <div className="flex-1 flex items-center border cursor-pointer rounded-sm px-2">
                    <div className="w-16 h-14 flex-shrink-0">
                      {video?.mimeType === "image/*" ? (
                        <img
                          src={video?.url || video?.previewUrl}
                          alt={video?.file?.name}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <video
                          src={video?.url || video?.previewUrl}
                          controls
                          className="w-full h-full object-cover rounded"
                        />
                      )}
                    </div>
                    <div
                      className={`w-full flex justify-between items-center p-3`}
                    >
                      <div>
                        <p className="text-sm font-semibold">
                          {video?.title}
                        </p>
                        <p className="text-xs">
                          {video?.description}
                        </p>
                      </div>
                      <Video size={30} />
                    </div>
                  </div>
                  <div className="basis-1/12 ml-1">
                    <Trash />
                  </div>
                </div>
              );
            }
            )}
            <UploadMedia
              description="Upload your existing content to automatically create a new lesson"
            />
          </>
        )}
    </div>
  )
}

export default Content