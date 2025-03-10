"use client";
import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Playlist from "@/components/studio/course-management/Playlist";
import { useAuth } from "@/context/AuthContext";
import { useFetchCourses } from "@/hooks/courses/useFetchCourses";
import { PlaylistSkeleton } from "@/components/sketetons/PlaylistSkeleton";

const CourseManagement = () => {
  const { getCurrentUser } = useAuth();
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
      <div className="grid grid-cols-3 gap-4">
        {courses?.data?.courses?.map((course: any, index: number) => (
          <Playlist key={course.id || index} value={34} course={course} />
        ))}
      </div>
    </ProtectedRoute>
  );
};

export default CourseManagement;