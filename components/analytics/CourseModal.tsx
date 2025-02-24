import React from "react";
import { X } from "lucide-react";

interface Course {
  id: number;
  title: string;
  image: string;
  difficulty: string;
  uploadDate: string;
  completions: number;
  totalEnrollment: number;
  enrollmentThisMonth: number;
  completionRate: {
    completed: number;
    incomplete: number;
  };
  totalMinutesWatched: number;
}

interface CourseModalProps {
  course: Course;
  onClose: () => void;
}

export function CourseModal({ course, onClose }: CourseModalProps) {
  return (
    <div className="fixed inset-0 top-20 left-20 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white mx-auto rounded-lg p-6 max-w-lg w-full ">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">More insight</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Total Enrollment</p>
              <p className="text-xl font-semibold">
                {course.totalEnrollment.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Enrollment this month</p>
              <p className="text-xl font-semibold">
                {course.enrollmentThisMonth}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-4">Completion Rate (%)</p>
            <div className="flex  gap-10 justify-center">
              <div className="relative w-32 h-32">
                {/* Background circle */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="60"
                    fill="none"
                    stroke="#DE2424"
                    strokeWidth="8"
                  />
                  {/* Completed progress */}
                  <circle
                    cx="64"
                    cy="64"
                    r="60"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="8"
                    strokeDasharray={`${
                      course.completionRate.completed * 3.77
                    } 377`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">
                    {course.completionRate.completed}%
                  </span>
                </div>
              </div>
              <div className=" flex items-center">
                <div className="flex items-center mr-10 flex-col">
                  <div className="flex">
                    <div className="w-4 h-4 rounded-sm bg-blue-500 mr-2"></div>
                    <span className="text-sm">Completed</span>
                  </div>

                  <span className="ml-2 text-sm font-semibold">
                    {course.completionRate.completed}%
                  </span>
                </div>
                <div className="flex items-center flex-col">
                  <div className=" flex">
                    <div className="w-4 h-4 rounded-sm bg-red-500 mr-2"></div>
                    <span className="text-sm">Incomplete</span>
                  </div>
                  <span className="ml-2 text-sm font-semibold">
                    {course.completionRate.incomplete}%
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-6 mt-4"></div>
          </div>

          <div>
            <p className="text-sm text-gray-500">Total Average mins watched</p>
            <p className="text-xl font-semibold">
              {course.totalMinutesWatched.toLocaleString()}mins
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
