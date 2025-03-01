"use client";
import React from "react";
import UploadShortCourseMedia from "./UploadShortCourse";
import { GripVertical, Trash, Video } from "lucide-react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/hooks/useStore.hook";
import { fetchShortCourseService } from "@/services/course.service";

const Content = () => {
  const { shortCourseData: courseDataStateValues } = useAppSelector((store) => store.courseStore);

  const { data: courseData } = useQuery({
    queryKey: ["shortcourseData"],
    queryFn: async () => {
      const courseData = await fetchShortCourseService({
        courseId: courseDataStateValues?.courseId,
      });
      return courseData as any;
    },
    enabled: !!courseDataStateValues?.courseId,
    refetchInterval: 300,
    placeholderData: keepPreviousData,
  });

  return (
    <div>
      {
        courseData?.course?.media.length === 0 ? (
          <div className="w-full mt-40 mx-auto flex flex-col items-center justify-center">
            <Video size={30} />
            <p className="text-xl tracking-wide">
              Add content to your course
            </p>
            <p className="text-sm mt-2">Add new video</p>
          </div>
        ) : (
          <>
            {courseData?.course?.media?.map((video: any) => {
              return (
                <div
                  key={video?.id}
                  className="flex items-center mb-4 gap-2"
                >
                  <div className="basis-[2%]">
                    <GripVertical />
                  </div>
                  <div className="flex-1 flex items-center border cursor-pointer rounded-sm px-2">
                    <div className="w-16 h-12 flex-shrink-0">
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
            <UploadShortCourseMedia
              description="Upload your existing content to automatically create a new lesson"
            />
          </>
        )}
    </div>
  )
}

export default Content