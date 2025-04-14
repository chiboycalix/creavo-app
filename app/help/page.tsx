import Image from "next/image"
import { User, Upload, Store, Info, Flag } from "lucide-react"
import { RiUserSettingsFill } from "react-icons/ri";
import { Navigation } from "lucide-react";
export default function HelpCenterPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Full-width Hero Section */}
      <div className="relative w-screen h-[400px] left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <Image
          src="/assets/group.png"
          alt="Team collaborating"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white px-4">
          <h1 className="text-6xl font-bold mb-4">Help Center</h1>
          <p className="text-2xl">Explore our Help Center for step-by-step guides on:</p>
        </div>
      </div>

      {/* Help Topics Grid */}
      <div className="max-w-7xl mx-auto w-full px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <HelpItem icon={<RiUserSettingsFill size={24}/>} text="Setting up your Crevoe profile" />
          <HelpItem icon={<Upload size={24} />} text="Uploading and managing content" />
          <HelpItem icon={<Store size={24} />} text="Navigating the Crevoe marketplace" />
          <HelpItem icon={<Info size={24} />} text="Handling disputes and refunds" />
          <HelpItem icon={<Navigation size={24} />} text="Navigating the Crevoe marketplace" />
        </div>
      </div>
    </div>
  )
}

function HelpItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg flex items-center">
      <div className="mr-4 text-blue-500">{icon}</div>
      <h2 className="text-xl font-medium">{text}</h2>
    </div>
  )
}
