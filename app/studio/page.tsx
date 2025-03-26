"use client";
import React, { useState, useEffect } from "react";
import RecentCourses from "@/components/studio/dashboard/RecentCourses";
import RevenueAndCompletionCharts from "@/components/studio/dashboard/RevenueAndCompletionCharts";
import DynamicTable from "@/components/table";
import { StatisticsCard } from "@/components/studio/dashboard/StatisticCard";
import { File, LayoutDashboard, PlusSquareIcon, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import CompletionRate from "@/components/studio/dashboard/CompletionRate";
import { LineChart } from "@/components/analytics/LineChart";
import { ChartHeader } from "@/components/analytics/ChatHeaders";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import PageTitle from "@/components/PageTitle";

const overviewData = [
  {
    id: 1,
    title: "Total Revenue",
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
  },
];

// const tableData = [

// ] as any;

const StudioDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { getCurrentUser } = useAuth();
  const currentUser = getCurrentUser();
  const {
    data: profileData,
    isLoading: profileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useUserProfile(currentUser?.id)
  const [userProfile, setUserProfile] = useState(profileData?.data)

  useEffect(() => {
    if (profileData?.data) {
      setUserProfile(profileData.data);
    }
  }, [profileData]);


  // console.log(currentUser)



  const revenueData = [42, 43, 60, 45, 55, 53, 52, 83, 48, 52, 68, 65, 60, 58];
  const subscribersData = [
    42, 43, 60, 45, 55, 53, 52, 83, 48, 52, 68, 65, 60, 58,
  ];
  const labels = [
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
  ];


  const transformToChartData = (data: number[], labels: string[]) =>
    data.map((value, index) => ({ x: Number(labels[index]), value }));

  const revenueChartData = transformToChartData(revenueData, labels);
  const subscribersChartData = transformToChartData(subscribersData, labels);

  const columns = [
    {
      header: "S/N",
      accessorKey: "id",
    },
    {
      header: "Name",
      accessorKey: "name",
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
      },
    },
  ] as any;

  return (
    <div className="w-full">
      <div className="w-full flex items-center justify-between">
        <PageTitle>
          {profileLoading ? (
            <span className="animate-pulse bg-gray-300 text-gray-300 px-3 rounded-md">
              Loading...
            </span>
          ) : (
            <><span>Hey, {userProfile?.profile?.firstName || "Guest"}</span></>
          )
          }{" "}  👋
        </PageTitle>

        <PageTitle>

        <Button>
          <Link href="/studio/course" className="flex items-center">
            <PlusSquareIcon /> Create Course
          </Link>
        </Button>
        </PageTitle>


      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-10 w-full mt-8">
        {overviewData.map((data) => {
          return <StatisticsCard key={data.id} {...data} />;
        })}
      </div>

      <div className="mt-10 flex gap-5 w-full ">
        {/* <RevenueAndCompletionCharts /> */}
        <div className="flex-1 bg-white py-3 px-2">
          <ChartHeader title="Revenue" />
          <LineChart
            data={subscribersChartData}
            highlightIndex={8}
            highlightValue={83234}
            title="Total Subscribers"
          />
        </div>
        <div className="w-[30%] ">
          <CompletionRate color="#82AFF3" />
        </div>
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
            <div className="flex flex-col w-full items-center justify-center h-[300px] mx-auto">
              <h2 className="text-center font-semibold flex justify-center text-md">
                No Information yet!
              </h2>
              <p className="text-center text-sm">
                You currently don’t have any Subscriber
              </p>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default StudioDashboard;
