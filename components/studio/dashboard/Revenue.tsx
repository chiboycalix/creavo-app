"use client"
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const data = [
  { day: '10', revenue: 0 },
  { day: '11', revenue: 0 },
  { day: '12', revenue: 0 },
  { day: '13', revenue: 0 },
  { day: '14', revenue: 0 },
  { day: '15', revenue: 0 },
  { day: '16', revenue: 85000 },
  { day: '17', revenue: 0 },
  { day: '18', revenue: 0 },
  { day: '19', revenue: 0 },
  { day: '20', revenue: 0 },
  { day: '21', revenue: 0 },
  { day: '22', revenue: 0 },
  { day: '23', revenue: 0 },
];

const Revenue = () => {
  return (
    <Card className='basis-8/12 border-none'>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-base font-normal">Revenue</CardTitle>
      <Select defaultValue="this-month">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="this-month">This Month</SelectItem>
          <SelectItem value="last-month">Last Month</SelectItem>
          <SelectItem value="this-year">This Year</SelectItem>
        </SelectContent>
      </Select>
    </CardHeader>
    <CardContent className='border-none'>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" axisLine={false} tickLine={false} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value / 1000}K`}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#6366F1"
              dot={{ stroke: '#6366F1', strokeWidth: 2, r: 4, fill: 'white' }}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>

  )
}

export default Revenue