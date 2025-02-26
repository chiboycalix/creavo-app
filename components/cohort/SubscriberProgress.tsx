'use client'
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';

interface Trainee {
  id: number;
  name: string;
  email: string;
  course: string;
  quizScore: number;
  totalQuizzes: number;
  progress: number;
  status: 'completed' | 'incomplete';
}

const trainees: Trainee[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: "Adarabioyo Joseph",
  email: "johnadeyo@crevoe.com",
  course: i % 2 === 0 ? "Javascript Foundation" : "React Basics",
  quizScore: i % 3 === 0 ? 10 : 3,
  totalQuizzes: 10,
  progress: i % 3 === 0 ? 100 : 60,
  status: i % 3 === 0 ? 'completed' : 'incomplete'
}));

const courses = ["All Courses", ...new Set(trainees.map(t => t.course))];

export function SubscriberProgress() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'incomplete'>('all');
  const [courseFilter, setCourseFilter] = useState('All Courses');

  const filteredTrainees = trainees.filter(trainee => {
    const matchesSearch = trainee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          trainee.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || trainee.status === statusFilter;
    const matchesCourse = courseFilter === "All Courses" || trainee.course === courseFilter;
    return matchesSearch && matchesStatus && matchesCourse;
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Learners Progress</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-4 text-sm pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="px-4 text-sm py-2 border rounded-lg"
          >
            {courses.map(course => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'completed' | 'incomplete')}
            className="px-4 py-2 border text-sm rounded-lg"
          >
            <option value="all">Status</option>
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="incomplete">Incomplete</option>
          </select>
        </div>
      </div>

      <div className="bg-white  rounded-lg border">
        <table className="w-full">
          <thead className="bg-gray-50 px-10 text-sm">
            <tr>
              <th className="p-4 text-left">S/N</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email Address</th>
              <th className="p-4 text-left">Enrolled Course</th>
              <th className="p-4 text-left">Quiz</th>
              <th className="p-4 text-left">Progress (%)</th>
            </tr>
          </thead>
          <tbody className="text-sm px-10">
            {filteredTrainees.map((trainee) => (
              <tr key={trainee.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{trainee.id}.</td>
                <td className="p-4">{trainee.name}</td>
                <td className="p-4">{trainee.email}</td>
                <td className="p-4">{trainee.course}</td>
                <td className="p-4">
                  <span className={trainee.quizScore === 10 ? 'text-green-600' : 'text-gray-600'}>
                    {trainee.quizScore}/{trainee.totalQuizzes}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <span className="w-16 flex items-center gap-2">
                      {trainee.progress}%
                      <span 
                        className={`text-xs px-2 py-0.5 rounded ${
                          trainee.status === 'completed' 
                            ? 'bg-green-50 text-green-600' 
                            : 'bg-yellow-50 text-yellow-600'
                        }`}
                      >
                        {trainee.status === 'completed' ? 'Completed' : 'Incomplete'}
                      </span>
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
