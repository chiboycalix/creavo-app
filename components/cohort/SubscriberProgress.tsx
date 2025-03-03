"use client";

import React, { useEffect, useState } from "react";
import { fetchLearnerEngagementDetails } from "@/services/course.service";
import { useAppSelector } from "@/hooks/useStore.hook";

interface LearnerEngagement {
  email: string;
  enrollmentDate: string;
  quizAttempt: boolean;
  percentageCompletion: number;
  totalWatchTime: number;
  lastUpdated: string;
}

export function SubscriberProgress() {
  const [learnerData, setLearnerData] = useState<LearnerEngagement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { shortCourseData: courseDataStateValues } = useAppSelector((store) => store.courseStore);
  const courseId = courseDataStateValues?.courseId;

  useEffect(() => {
    if (!courseId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchLearnerEngagementDetails(courseId);
        setLearnerData(response.data);
      } catch (err) {
        setError("Failed to load learner engagement details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]); 

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Learner Engagement</h1>
      </div>

      {loading && <p className="text-center text-gray-500">Loading data...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && learnerData && (
        <div className="bg-white rounded-lg border p-5">
          <table className="w-full border-collapse border border-gray-200">
            <thead className="bg-gray-50 text-sm">
              <tr>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Enrollment Date</th>
                <th className="p-4 text-left">Quiz Attempted</th>
                <th className="p-4 text-left">Completion (%)</th>
                <th className="p-4 text-left">Total Watch Time</th>
                <th className="p-4 text-left">Last Updated</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b hover:bg-gray-50">
                <td className="p-4">{learnerData.email}</td>
                <td className="p-4">{new Date(learnerData.enrollmentDate).toLocaleDateString()}</td>
                <td className="p-4">{learnerData.quizAttempt ? "Yes" : "No"}</td>
                <td className="p-4">{learnerData.percentageCompletion}%</td>
                <td className="p-4">{learnerData.totalWatchTime} mins</td>
                <td className="p-4">{new Date(learnerData.lastUpdated).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
