'use client'
import { Button } from "@/components/ui/button";
import { HandIcon } from "lucide-react";
import { useParams } from 'next/navigation'

const EndCallScreen = () => {
  const params = useParams()

  return (
    <div className="fixed inset-0 z-[150] flex flex-col items-center justify-center h-full text-center px-4 bg-primary-950 bg-opacity-30">
      <HandIcon className="w-16 h-16 text-primary-400 mb-6" />
      <h2 className="text-3xl font-semibold mb-2 text-white">You left the meeting</h2>
      <div className='flex items-center justify-center gap-4 mt-8'>
        <Button
          onClick={() => window.location.href = `/studio/meeting/${params?.channelName}`}
          className="border font-semibold hover:bg-primary-700 border-primary-700 hover:text-white text-primary-700 px-6 py-2 rounded-lg flex items-center gap-2 bg-white"
          variant="outline"
        >
          Rejoin
        </Button>

        <Button
          onClick={() => window.location.href = "/studio/meeting"}
          className="bg-primary-700 font-semibold hover:bg-primary-800 text-white hover:text-white px-6 py-2 rounded-lg flex items-center gap-2 border-none"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};
export default EndCallScreen