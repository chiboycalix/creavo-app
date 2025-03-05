"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import Playlist from "@/components/studio/course-management/Playlist";
import { useAuth } from "@/context/AuthContext";
import { useFetchCourses } from "@/hooks/courses/useFetchCourses";
import React from "react";

const ModuleManagement = () => {
  const { getCurrentUser } = useAuth();
  const currentUser = getCurrentUser();
  const { data: courses, isFetching } = useFetchCourses(currentUser?.id);

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

export default ModuleManagement;