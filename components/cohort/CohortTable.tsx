"use client";

import React, { useEffect, useState } from "react";
import { fetchLearnerEngagement } from "@/services/course.service";
import { useAppSelector } from "@/hooks/useStore.hook";
import { Mail, Users, Share } from "lucide-react";

interface Learner {
  id: string;
  name: string;
  email: string;
  course: string;
  demographic: string;
  dateEnrolled: string;
  lastActive: string;
}

export function CohortTable() {
  const [learnerEngagementData, setLearnerEngagementData] = useState<{ learners: Learner[] } | null>(null);
  const [selectedTrainees, setSelectedTrainees] = useState<string[]>([]);

  const { shortCourseData: courseDataStateValues } = useAppSelector(
    (store) => store.courseStore
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!courseDataStateValues?.courseId) return;
      try {
        const data = await fetchLearnerEngagement(courseDataStateValues.courseId);
        console.log("Learner Engagement Data:", data);
        setLearnerEngagementData(data);
      } catch (error) {
        console.error("Error fetching learner engagement details:", error);
      }
    };

    fetchData();
  }, [courseDataStateValues?.courseId]);

  // Ensure learners is always an array (to prevent 'undefined' errors)
  const learners = learnerEngagementData?.learners ?? [];

  const handleSelectAll = () => {
    if (learners.length > 0) {
      setSelectedTrainees((prevSelected) =>
        prevSelected.length === learners.length ? [] : learners.map((learner) => learner.id)
      );
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Learners</h1>
      </div>

      <div className="rounded-lg overflow-hidden">
        <div className="flex items-center gap-4 pt-7 pb-3 border-b bg-gray-50">
          <input
            type="checkbox"
            className="rounded"
            checked={learners.length > 0 && selectedTrainees.length === learners.length}
            onChange={handleSelectAll}
          />

          {[{ icon: Mail, label: "Send Email" }, { icon: Users, label: "Community" }, { icon: Share, label: "Export Data" }].map(
            ({ icon: Icon, label }, index) => (
              <div key={index} className="relative group">
                <Icon className="w-4 h-4 text-gray-600 cursor-pointer" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded z-10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {label}
                </div>
              </div>
            )
          )}
        </div>
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-50 text-xs">
            <tr>
              <th className="p-4 text-left">S/N</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email Address</th>
              <th className="p-4 text-left">Enrolled Course</th>
              <th className="p-4 text-left">Demographic</th>
              <th className="p-4 text-left">Date Enrolled</th>
              <th className="p-4 text-left">Last Active</th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {learners.length > 0 ? (
              learners.map((learner, index) => (
                <tr key={learner.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{index + 1}.</td>
                  <td className="p-4">{learner.name}</td>
                  <td className="p-4">{learner.email}</td>
                  <td className="p-4">{learner.course}</td>
                  <td className="p-4">{learner.demographic}</td>
                  <td className="p-4">{learner.dateEnrolled}</td>
                  <td className="p-4">{learner.lastActive}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-10 text-center text-gray-500">
                  <h2 className="text-lg font-semibold">No Information yet!</h2>
                  <p className="text-sm">You currently don’t have any Subscribers</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
