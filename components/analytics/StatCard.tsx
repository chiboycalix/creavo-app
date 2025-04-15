import { color } from 'framer-motion';
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isLast?: boolean;
  color?: string;
}

export function StatCard({ title, value, subtitle, trend, color }: StatCardProps) {
  return (
    <div className={`bg-white flex flex-col items-start justify-start  px-6 py-4  w-full }`}>
      <div className='flex items-start justify-start gap-5'>
        <h3 className="text-xs text-gray-500 font-medium mb-1">{title}</h3>
        {trend && (
          <span className={`flex items-center text-xs font-semibold ${trend.isPositive ? 'text-emerald-500 bg-green-100 px-1 py-1 rounded-md' : 'text-red-500 bg-red-100 px-1 py-1 rounded-md'}`}>
            <p> {trend.isPositive ? '↑' : '↓'} </p>
            {trend.value}%
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <p className={`text-2xl font-bold ${color}`}>
          {value}
        </p>

      </div>
      {
        subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      }
    </div>
  );
} 