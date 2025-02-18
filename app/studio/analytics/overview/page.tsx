import React from "react";
import { StatCard } from "@/components/analytics/StatCard";
import { LineChart } from "@/components/analytics/LineChart";
import { ChartHeader } from "@/components/analytics/ChatHeaders";
import CompletionRate from "@/components/studio/CompletionRate";

function OverviewPage() {
  const revenueData = [42, 43, 60, 45, 55, 53, 52, 83, 48, 52, 68, 65, 60, 58];
  const subscribersData = [42, 43, 60, 45, 55, 53, 52, 83, 48, 52, 68, 65, 60, 58];
  const labels = ["10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];

  const transformToChartData = (data: number[], labels: string[]) =>
    data.map((value, index) => ({ x: Number(labels[index]), value }));

  const revenueChartData = transformToChartData(revenueData, labels);
  const subscribersChartData = transformToChartData(subscribersData, labels);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
          <select className="border rounded-md px-4 py-2">
            <option>This Year</option>
            <option>Last Year</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-8">
          <StatCard title="Today Revenue" value="$2,868.99" subtitle="143 Subscription" />
          <StatCard title="Available to withdraw" value="$1,567.99" subtitle="Wed, Jul 20" />
          <StatCard title="Subscribers" value="3,422" subtitle="34 This month" trend={{ value: 3.2, isPositive: true }} />
          <StatCard title="Video Conference Participant" value="156k" subtitle="32k visitors" trend={{ value: 3.2, isPositive: true }} />
        </div>

        <div className="my-10">
          <ChartHeader title="Revenue" />
          <LineChart data={revenueChartData} highlightIndex={6} highlightValue={83234} title="Revenue" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CompletionRate color="#82AFF3" />
          <div>
            <ChartHeader title="Total Subscribers" showCourseFilter />
            <LineChart data={subscribersChartData} highlightIndex={8} highlightValue={83234} title="Total Subscribers" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default OverviewPage;
