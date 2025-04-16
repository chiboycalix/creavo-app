import { Button } from '@/components/ui/button'
import React from 'react'

const ConnectAccount = () => {
  return (
    <div className='border border-primary-500 px-4 py-2 rounded-lg bg-primary-50 flex items-center justify-between w-8/12'>
      <p className='text-sm'>Set up your payout info so you can start getting paid!</p>
      <Button>Connect Account</Button>
    </div>
  )
}

export default ConnectAccount