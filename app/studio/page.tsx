"use client"
import React, { useState } from "react";
import RecentCourses from "@/components/studio/dashboard/RecentCourses";
import RevenueAndCompletionCharts from "@/components/studio/dashboard/RevenueAndCompletionCharts";
import DynamicTable from "@/components/table";
import { StatisticsCard } from "@/components/studio/dashboard/StatisticCard";
import { File, LayoutDashboard, PlusSquareIcon, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const overviewData = [
  {
    id: 1,
    title: "Total Sales",
    count: 2,
    icon: <LayoutDashboard />,
  },
  {
    id: 2,
    title: "Total Enrollment",
    count: 5,
    icon: <Users />,
  },
  {
    id: 3,
    title: "Certification",
    count: 8,
    icon: <File />,
  },
];

const tableData = [
  {
    id: 1,
    name: "Adarabioyo Joseph",
    attemptDate: "12/03/2023",
    status: "Submitted",
    gradingStatus: "1 attempt",
    grade: 4,
  },
  {
    id: 2,
    name: "Emma Wilson",
    attemptDate: "12/03/2023",
    status: "Submitted",
    gradingStatus: "2 attempts",
    grade: 7,
  },
  {
    id: 3,
    name: "Michael Brown",
    attemptDate: "12/04/2023",
    status: "Pending",
    gradingStatus: "No attempt",
    grade: null,
  },
  {
    id: 4,
    name: "Sarah Chen",
    attemptDate: "12/04/2023",
    status: "Submitted",
    gradingStatus: "1 attempt",
    grade: 8,
  },
  {
    id: 5,
    name: "John Smith",
    attemptDate: "12/05/2023",
    status: "Submitted",
    gradingStatus: "3 attempts",
    grade: 3,
  },
  {
    id: 6,
    name: "Lisa Anderson",
    attemptDate: "12/05/2023",
    status: "Pending",
    gradingStatus: "No attempt",
    grade: null,
  },
  {
    id: 7,
    name: "David Lee",
    attemptDate: "12/06/2023",
    status: "Submitted",
    gradingStatus: "1 attempt",
    grade: 9,
  },
  {
    id: 8,
    name: "Rachel Green",
    attemptDate: "12/06/2023",
    status: "Submitted",
    gradingStatus: "2 attempts",
    grade: 5,
  },
  {
    id: 9,
    name: "Tom Wilson",
    attemptDate: "12/07/2023",
    status: "Submitted",
    gradingStatus: "1 attempt",
    grade: 6,
  },
  {
    id: 10,
    name: "Sofia Garcia",
    attemptDate: "12/07/2023",
    status: "Submitted",
    gradingStatus: "1 attempt",
    grade: 8,
  }
];

// const tableData = [

// ] as any;

const StudioDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const columns = [
    {
      header: "S/N",
      accessorKey: "id",
    },
    {
      header: "Name", accessorKey: "name",
    },
    { header: "Attempt Date", accessorKey: "attemptDate" },
    { header: "Status", accessorKey: "status", sortable: true },
    { header: "Grading Status", accessorKey: "gradingStatus", sortable: true },
    {
      header: "Grade",
      accessorKey: "grade",
      cell: (row: any) => {
        const grade = row.grade;

        if (!grade) {
          return (
            <div className="w-fit px-3 py-1 rounded-full bg-gray-100 text-gray-600">
              -/10
            </div>
          );
        }

        return (
          <div
            className={`w-fit px-3 py-1 rounded-full ${grade >= 6
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
              }`}
          >
            {grade}/10
          </div>
        );
      }
    }

  ] as any;

  return (
    <div className="w-full py-8">
      <div className="w-full flex items-center justify-between">
        <h2 className="font-bold text-2xl">Hello Chinonso 👋</h2>

        <Button><PlusSquareIcon /> Create Course</Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-10 w-full mt-6 sm:mt-8 lg:mt-10">
        {overviewData.map((data) => {
          return <StatisticsCard key={data.id} {...data} />;
        })}
      </div>

      <div className="mt-10">
        <RevenueAndCompletionCharts />
      </div>
      <div className="mt-10">
        <RecentCourses />
      </div>

      <div className="mt-10">
        <DynamicTable
          columns={columns}
          data={tableData}
          setCurrentPage={setCurrentPage}
          setRowsPerPage={setRowsPerPage}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          renderEmptyRecords={
            (<div className="flex flex-col w-full items-center justify-center h-[300px] mx-auto">
              <h2 className='text-center font-semibold flex justify-center text-md'>No Information yet!</h2>
              <p className='text-center text-sm'>You currently don’t have any Subscriber</p>
            </div>)
          }
        />
      </div>
    </div>
  );
};

export default StudioDashboard;
