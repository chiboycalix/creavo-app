import { Button } from "@/components/ui/button";
import { Plus, Settings } from "lucide-react";

export default async function SpacePage({ params }: any) {

  return (
    <div className="w-full">
      <div className="border-b p-4 shadow-md shadow-primary-50 flex justify-between items-center">
        <div>
          <p className="font-semibold text-sm">General</p>
          <p className="text-xs">Description field</p>
        </div>
        <div className="flex gap-2 items-center">
          <span className="bg-gray-100 p-1 rounded-full cursor-pointer"> <Plus /></span>
          <span className="bg-gray-100 p-1 rounded-full cursor-pointer"><Settings className="cursor-pointer" /></span>
        </div>
      </div>

      <div className="p-4 py-10 bg-gray-100 w-[50%] mx-auto mt-20 rounded-md flex items-center flex-col">
        <p>Looks like you&apos;re leading the way</p>
        <p>Start a discussion by creating a new post</p>

        <div className="mt-8 w-6/12">
          <Button className="w-full">
            <Plus />
            Add member</Button>
        </div>
      </div>
    </div>
  );
}