"use client";
import React from "react";
import Spinner from "@/components/Spinner";
import UploadShortCourseMedia from "./UploadShortCourse";
import { GripVertical, Trash, Video } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useFetchCourseData } from "@/hooks/courses/useFetchCourseData";
import { useQueryClient } from "@tanstack/react-query";

const Content = ({ courseId: id }: any) => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("edit") || id;
  const { data: courseData, isFetching: isFetchingCourse } = useFetchCourseData(courseId);

  const handleVideoUploadSuccess = (newVideo: any) => {
    queryClient.setQueryData(["useFetchCourseData", courseId], (oldData: any) => {
      if (!oldData?.data?.course) return oldData;
      return {
        ...oldData,
        data: {
          ...oldData.data,
          course: {
            ...oldData.data.course,
            media: [...(oldData.data.course.media || []), newVideo],
          },
        },
      };
    });

    queryClient.invalidateQueries({
      queryKey: ["useFetchCourseData", courseId],
      exact: true,
    });
  };

  if (isFetchingCourse) {
    return (
      <div className="h-[50vh] flex flex-col items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      {courseData?.data?.course?.media?.length === 0 ? (
        <div className="w-full mt-20 mx-auto flex flex-col items-center justify-center">
          <Video size={30} />
          <p className="text-xl tracking-wide">Add content to your course</p>
          <p className="text-sm mt-2">Add new video</p>
          <UploadShortCourseMedia
            description="Upload your existing content to automatically create a new lesson"
            onUploadSuccess={handleVideoUploadSuccess}
            courseId={courseId || id}
          />
        </div>
      ) : (
        <>
          {courseData?.data?.course?.media?.map((video: any) => (
            <div key={video?.id} className="flex items-center mb-4 gap-2">
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
                <div className="w-full flex justify-between items-center p-3">
                  <div>
                    <p className="text-sm font-semibold">{video?.title}</p>
                    <p className="text-xs">{video?.description}</p>
                  </div>
                  <Video size={30} />
                </div>
              </div>
              <div className="basis-1/12 ml-1">
                <Trash />
              </div>
            </div>
          ))}
          <UploadShortCourseMedia
            description="Upload your existing content to automatically create a new lesson"
            onUploadSuccess={handleVideoUploadSuccess}
            courseId={courseId}
          />
        </>
      )}
    </div>
  );
};

export default Content;