import { cn } from '@/lib/utils';
import React from 'react'

const Item = ({ icon, title, description, className }: { icon: any, title: string; description: string, className?: string }) => {
  return (
    <div className={cn(`flex items-start space-x-4`, className)}>
      <div className='p-1.5 bg-gray-200 rounded-full'>{icon}</div>
      <div>
        <h2 className='text-sm font-semibold text-gray-700'>{title}</h2>
        <p className='text-sm text-gray-600'>{description}</p>
      </div>
    </div>
  )
}

export default Item