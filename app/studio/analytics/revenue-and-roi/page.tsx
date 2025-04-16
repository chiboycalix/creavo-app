import ConnectAccount from '@/components/studio/analytics/revenue/ConnectAccount'
import RevenueTable from '@/components/studio/analytics/revenue/RevenueTable'
import StatisticsCardList from '@/components/studio/analytics/revenue/StatisticsCardList'
import WithdrawFunds from '@/components/studio/analytics/revenue/WithdrawFunds'
import React from 'react'

const RevenueAndRoi = () => {
  return (
    <div>
      <ConnectAccount />
      <div className='mt-8'>
        <WithdrawFunds />
      </div>
      <div className='mt-8'>
        <StatisticsCardList />
      </div>
      <div className='mt-8'>
        <h1 className='text-2xl mb-4'>Payout history</h1>
        <RevenueTable />
      </div>
    </div>
  )
}

export default RevenueAndRoi