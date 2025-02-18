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
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="x"
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            stroke="#6B7280"
          />
          <YAxis
            tickFormatter={(value) => `${value}K`}
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            stroke="#6B7280"
          />
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <Tooltip
            cursor={{ stroke: "red", strokeDasharray: "3 3" }}
            content={({ active, payload }) => {
                if (active && payload?.length) {
                  const value = payload[0]?.value;
                  return (
                    <div className="bg-blue-600 text-white px-3 py-2 rounded shadow">
                      {value?.toLocaleString?.() ?? 'N/A'}
                    </div>
                  );
                }
                return null;
              }}
              
          />
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
                          fill="#00B5FF"
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
