import { StatCard } from '@/components/analytics/StatCard'
import React from 'react'

const StatisticsCardList = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-8">
      <StatCard title="Today Revenue" value="$2,868.99" color="text-green-500" />
      <StatCard title="Available to withdraw" value="1,567.99" />
      <StatCard title="Pending withdrawal" value="3,422" />
      <StatCard title="All withdrawal" value="156,400,303" />
    </div>
  )
}

export default StatisticsCardList