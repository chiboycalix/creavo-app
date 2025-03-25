import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react'

const Item = ({ icon, title, description, className, link }: { icon: any, title: string; description: string, className?: string, link: string }) => {
  return (
    <Link href={link} className={cn(`flex items-start space-x-4 p-0.5 hover:shadow px-2 py-2`, className)}>
      <div className='p-1.5 bg-gray-100  rounded-full'>{icon}</div>
      <div>
        <h2 className='text-sm font-semibold text-gray-700'>{title}</h2>
        <p className='text-sm text-gray-600'>{description}</p>
      </div>
    </Link>
  )
}

export default Item