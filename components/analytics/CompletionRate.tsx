import * as React from "react";
import { StatCard } from "./StatCard";
import { ChartHeader } from "./ChatHeaders";
import { LineChart } from "./LineChart";

// interface ICompletionRateProps {}

const CompletionRate: React.FunctionComponent = (props) => {
  const completionData = [
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
  const completionChartData = transformToChartData(completionData, labels);
  return (
    <div>
      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-8 ">
        <StatCard
          title="Overall Completion Rate(%)"
          value={80}
          subtitle="This month"
          color="text-green-500"
        />
        <StatCard
          title="Drop-off"
          value={20}
          subtitle="This month"
          color="text-red-500"
        />
        {/* <StatCard title="Overall Completion Rate(%)" value={80} subtitle="This month"/> */}
      </div>
      <div>
        <ChartHeader title="Completion over time  " showCourseFilter />
        <LineChart
          data={completionChartData}
          highlightIndex={8}
          highlightValue={83234}
          title="Total Subscribers"
        />
      </div>
    </div>
  );
};

export default CompletionRate;
