import { Progress } from '@/components/ui/progress'
import { Thumbnail } from '@/public/assets'
import { Clock } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Playlist = ({ value }: { value: number }) => {
  return (
    <div className='w-52 relative'>
      <Image src={Thumbnail} alt="Thumbnail" />

      <div>
        <h2 className='text-sm'>Build it in Figma: Create a design system — Components</h2>
        <div className='my-2'>
          <Progress value={value} className={`${value > 50 ? "[&>*]:bg-green-600" : "[&>*]:bg-red-600"} h-1.5`} max={100} />
        </div>
        <p className='mb-2 text-sm text-gray-500'>{value}% complete</p>
        <div className='flex items-center gap-2'>
          <Clock size={14} />
          <p>45:00mins</p>
        </div>
        <Link href='/socials/watchlist/playlist' className='text-sm hover:underline'>
          View
        </Link>
      </div>
    </div>
  )
}

export default Playlist