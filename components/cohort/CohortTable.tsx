"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Mail,
  Share,
  Users
} from "lucide-react";

interface Trainee {
  id: number;
  name: string;
  email: string;
  course: string;
  demographic: string;
  dateEnrolled: string;
  lastActive: string;
}

const cohort: Trainee[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: "Adarabioyo Joseph",
  email: "johnadeyo@crevoe.com",
  course: "Javascript Foundation",
  demographic: "Nigeria",
  dateEnrolled: "12/03/2023",
  lastActive: "12/03/2023",
}));

export function CohortTable() {
  const [selectedTrainees, setSelectedTrainees] = useState<number[]>([]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedTrainees(cohort.map((t) => t.id));
    } else {
      setSelectedTrainees([]);
    }
  };

  const handleSelectTrainee = (id: number) => {
    setSelectedTrainees((prev) =>
      prev.includes(id) ? prev.filter((traineeId) => traineeId !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Subscribers</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
          <select className="border text-sm rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Javascript</option>
            <option>PHP</option>
            <option>Motion Design</option>
            <option>After Effect</option>
          </select>
        </div>
      </div>

      <div className="rounded-lg">
        <div className="flex items-center gap-4 p-4 border-b bg-gray-50">
          <input
            type="checkbox"
            className="rounded"
            checked={selectedTrainees.length === cohort.length}
            onChange={handleSelectAll}
          />

          {[
            { icon: Mail, label: "Send Email" },
            { icon: Users, label: "Community" },
            { icon: Share, label: "Export Data" },
          ].map(({ icon: Icon, label }, index) => (
            <div key={index} className="relative group">
              <Icon className="w-5 h-5 text-gray-600 cursor-pointer" />
              <div className="absolute  left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {label}
              </div>
            </div>
          ))}
        </div>

        <table className="w-full">
          <thead className="bg-gray-50 text-sm ">
            <tr>
              <th className="w-12 p-4">
                <input
                  type="checkbox"
                  className="rounded"
                  checked={selectedTrainees.length === cohort.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="p-4 text-left">S/N</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email Address</th>
              <th className="p-4 text-left">Enrolled Course</th>
              <th className="p-4 text-left">Demographic</th>
              <th className="p-4 text-left">Date Enrolled</th>
              <th className="p-4 text-left">Last Active</th>
            </tr>
          </thead>
          <tbody className=" text-sm">
            {cohort.map((trainee) => (
              <tr key={trainee.id} className="border-b hover:bg-gray-50">
                <td className="p-4">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={selectedTrainees.includes(trainee.id)}
                    onChange={() => handleSelectTrainee(trainee.id)}
                  />
                </td>
                <td className="p-4">{trainee.id}.</td>
                <td className="p-4">{trainee.name}</td>
                <td className="p-4">{trainee.email}</td>
                <td className="p-4">{trainee.course}</td>
                <td className="p-4">{trainee.demographic}</td>
                <td className="p-4">{trainee.dateEnrolled}</td>
                <td className="p-4">{trainee.lastActive}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between p-4 bg-white border-t">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rows per page</span>
            <select className="border rounded px-2 py-1 text-sm">
              <option>12</option>
              <option>24</option>
              <option>36</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-1 rounded hover:bg-gray-100">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1">
              <button className="px-3 py-1 rounded bg-blue-50 text-blue-600">
                1
              </button>
              <button className="px-3 py-1 rounded hover:bg-gray-100">2</button>
              <button className="px-3 py-1 rounded hover:bg-gray-100">3</button>
              <span>...</span>
              <button className="px-3 py-1 rounded hover:bg-gray-100">8</button>
            </div>
            <button className="p-1 rounded hover:bg-gray-100">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
