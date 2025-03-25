"use client";
import React from "react";
import PageTitle from "@/components/PageTitle";
import ProtectedRoute from "@/components/ProtectedRoute";
import Playlist from "@/components/studio/course-management/Playlist";
import { useAuth } from "@/context/AuthContext";
import { useFetchCourses } from "@/hooks/courses/useFetchCourses";
import { PlaylistSkeleton } from "@/components/sketetons/PlaylistSkeleton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const CourseManagement = () => {
  const { getCurrentUser } = useAuth();
  const router = useRouter()
  const currentUser = getCurrentUser();
  const { data: courses, isFetching } = useFetchCourses(currentUser?.id);
  if (isFetching) {
    return <div className="grid grid-cols-3 gap-4">
      {[...Array(6)].map((_, index) => (
        <PlaylistSkeleton key={index} />
      ))}
    </div>
  }


  return (
    <ProtectedRoute
      requireAuth={true}
      requireVerification={true}
      requireProfileSetup={false}
    >
      <PageTitle>Course Management</PageTitle>
      {
        courses?.data?.courses?.length === 0 && (
          <div className="text-center mt-24 border mx-auto w-8/12 p-14 rounded-xl bg-[#F8F8FC]">
            <h2 className="text-lg font-semibold">No Courses Yet? Let’s Fix That! 🚀</h2>
            <p className="text-sm mt-4">Looks like things are a little empty here! Start uploading your first course and bring this space to life. Your journey begins now—let’s get started! 🎉</p>
            <Button
              onClick={() => router.push("/studio/course")}
              className="mt-8 w-4/12"
            >
              Create course
            </Button>
          </div>
        )
      }
      <div className="grid grid-cols-3 gap-4 mt-4">
        {courses?.data?.courses?.map((course: any, index: number) => (
          <Playlist key={course.id || index} value={34} course={course} />
        ))}
      </div>
    </ProtectedRoute>
  );
};

export default CourseManagement;