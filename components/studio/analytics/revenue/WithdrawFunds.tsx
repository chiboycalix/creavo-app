import { Button } from '@/components/ui/button'
import React from 'react'

const WithdrawFunds = () => {
  return (
    <div className='w-full'>
      <h2>Revenue</h2>
      <div className='flex items-center justify-between w-full'>
        <p className='text-sm'>Manage all your earnings and withdrawal</p>
        <Button>
          Withdraw funds
        </Button>
      </div>
    </div>
  )
}

export default WithdrawFunds