import { Card } from '@/components/ui/card';
import Image from 'next/image';

export default function Sidebar() {
  return (
    <Card className='rounded-md h-[88vh] bg-white'>
      <div className="w-64 p-4">
        <div className="flex items-center space-x-2 pt-2 pb-4 mb-6 border-b">
          <Image src="/assets/community.svg" alt="Community Avatar" width={40} height={40} className="rounded-full" />
          <span className="text-sm font-semibold">Unlimited Community</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center bg-primary-100 p-2 rounded-md">
            General
          </div>
        </div>
      </div>
    </Card>
  );
}