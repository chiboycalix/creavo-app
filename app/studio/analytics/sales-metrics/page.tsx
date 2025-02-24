import React from 'react';
import { LineChart } from '@/components/analytics/LineChart';
import { StatCard } from '@/components/analytics/StatCard';
import { ChartHeader } from '@/components/analytics/ChatHeaders';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
function App() {
  const completionData = [
    { x: 10, value: 42000, enrollment: 15 },
    { x: 11, value: 43000, enrollment: 18 },
    { x: 12, value: 60000, enrollment: 22 }, 
    { x: 13, value: 45000, enrollment: 19 },
    { x: 14, value: 55000, enrollment: 23 },
    { x: 15, value: 53000, enrollment: 24 },
    { x: 16, value: 52000, enrollment: 28 },
    { x: 17, value: 83000, enrollment: 32 },
    { x: 18, value: 48000, enrollment: 29 },
    { x: 19, value: 52000, enrollment: 31 },
    { x: 20, value: 68000, enrollment: 35 },
    { x: 21, value: 65000, enrollment: 38 },
    { x: 22, value: 60000, enrollment: 36 },
    { x: 23, value: 58000, enrollment: 34 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col items-start mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Sales Metrics</h1>
        <div className="flex items-center gap-4 mt-2">
          <p className="text-gray-600">Get top insights about your performance</p>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              <SelectItem value="react">React Fundamentals</SelectItem>
              <SelectItem value="nextjs">Next.js Masters</SelectItem>
              <SelectItem value="typescript">TypeScript Pro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Revenue"
          value="$500.80"
          subtitle="$34.00 this month"
          color="text-green-500"
        />
        <StatCard
          title="Total Enrollments"
          value="120,91"
          subtitle="24 this month"
        />
      </div>

      <div className="bg-white px-10 py-5 rounded-lg shadow-sm border border-gray-100">
        <ChartHeader title="Revenue & Enrollment over time" showCourseFilter />
        <LineChart
          data={completionData}
          highlightIndex={7}
          highlightValue={83000}
          title="Total Revenue"
        />
      </div>
    </div>
  );
}

export default App;