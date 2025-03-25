import React from 'react'
import { CommunitySidebarSkeleton } from './CommunitySidebarSkeleton'
import { Card } from '../ui/card'
import SpacePageSkeleton from './SpacePageSkeleton'

const CommunityPageSkeleton = () => {
  return (
    <div className="flex gap-4">
      <CommunitySidebarSkeleton />
      <Card className='w-full'>
        <SpacePageSkeleton />
      </Card>
    </div>
  )
}

export default CommunityPageSkeleton