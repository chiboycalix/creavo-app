"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const CircularProgress = ({
  value,
  total,
  color = "#6366f1", // Default color
}: {
  value: number;
  total: number;
  color?: string;
}) => {
  const percentage = (value / total) * 100;
  const radius = 100;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        <circle
          stroke="#F4F3FF"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color} // Corrected this line
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeLinecap="round"
          style={{ strokeDashoffset, transition: "stroke-dashoffset 0.35s" }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl font-semibold">{value}%</span>
        <span className="text-xl">of</span>
        <span className="text-3xl font-semibold">{total}</span>
      </div>
    </div>
  );
};

const CompletionRate = ({ color = "#6366f1" }: { color?: string }) => {
  return (
    <Card className="flex-1 border-none">
      <CardHeader>
        <CardTitle className="text-base font-normal">Completion Rate</CardTitle>
        <p className="text-sm text-gray-500">The percentage of students who complete the course.</p>
      </CardHeader>
      <CardContent className="flex flex-col items-center h-[275px]">
        <CircularProgress value={50} total={100} color={color} /> {/* Color now dynamic */}
        <div className="flex justify-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} /> {/* Color applied */}
            <span className="text-sm">Completion Rate</span>
            <span className="font-semibold">50</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-purple-100" />
            <span className="text-sm">Drop-off</span>
            <span className="font-semibold">50</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompletionRate;
