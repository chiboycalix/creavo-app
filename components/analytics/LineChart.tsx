"use client";

import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";

interface LineChartProps {
  data: Array<{ x: number; value: number }>;
  highlightIndex?: number;
  highlightValue?: number;
  title: string;
}

export function LineChart({
  data,
  highlightIndex,
  highlightValue,
  title,
}: LineChartProps) {
  console.log("Chart Data:", data); // Debugging log to ensure correct data

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 50, bottom: 0 }} // Increased left margin
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* X-Axis */}
          <XAxis
            dataKey="x"
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            stroke="#6B7280"
          />

          {/* Y-Axis with improved formatting */}
          <YAxis
            domain={["auto", "auto"]} // Auto-scale Y-axis
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} // Converts numbers to 'K' format
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            stroke="#6B7280"
          />

          {/* Grid Lines */}
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

          {/* Tooltip */}
          <Tooltip
            cursor={{ stroke: "red", strokeDasharray: "3 3" }}
            content={({ active, payload }) => {
              if (active && payload?.length) {
                const xValue = payload[0]?.payload?.x; // Extract x value
                const yValue = payload[0]?.value; // Extract y-axis value

                return (
                  <div className="bg-white text-black px-3 py-2 rounded shadow">
                    <p className="text-gray-500 text-xs ">Amount earned</p>
                    <div className="text-base font-semibold">
                      {yValue?.toLocaleString()}K
                    </div>
                    <div className="text-xs text-gray-500 font-semibold">{xValue} subscribers</div>

                  </div>
                );
              }
              return null;
            }}
          />

          {/* Area Chart */}
          <Area
            type="monotone"
            dataKey="value"
            stroke="#00B5FF"
            fill="url(#colorValue)"
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 6,
              fill: "#0EA5E9",
              stroke: "white",
              strokeWidth: 2,
            }}
          />

          {/* Highlighted Reference Line & Point */}
          {highlightIndex !== undefined && highlightValue !== undefined && (
            <>
              <ReferenceLine
                x={data[highlightIndex].x}
                stroke="red"
                strokeDasharray="3 3"
              />
              <Line
                dataKey="value"
                stroke="none"
                dot={(props) => {
                  if (props.index === highlightIndex) {
                    return (
                      <g>
                        <circle
                          cx={props.cx}
                          cy={props.cy}
                          r={6}
                          fill="#0073B4"
                          stroke="white"
                          strokeWidth={2}
                        />
                        <foreignObject
                          x={props.cx - 35}
                          y={props.cy - 50}
                          width="70"
                          height="30"
                        >
                          <div className="flex items-center justify-center rounded px-2 py-1 text-sm text-white bg-blue-600">
                            {highlightValue?.toLocaleString()}
                          </div>
                        </foreignObject>
                      </g>
                    );
                  }
                  return <></>; // Empty fragment instead of null
                }}
              />
            </>
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
