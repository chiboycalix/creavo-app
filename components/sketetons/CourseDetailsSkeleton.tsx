import React from 'react'

const CourseDetailsSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="flex items-start justify-between gap-4">
        <div className="basis-5/12">
          <div className="bg-gray-200 rounded-md p-4">
            {/* Placeholder for Image */}
            <div className="bg-gray-300 rounded-md h-72 w-full"></div>
            <div className="mt-2">
              {/* Placeholder for Title */}
              <div className="bg-gray-300 h-6 w-3/4 rounded-md mt-2"></div>
              <div className="flex items-center justify-between mt-3">
                {/* Placeholder for Price */}
                <div className="bg-gray-300 h-4 w-1/4 rounded-md"></div>
                {/* Placeholder for Date */}
                <div className="bg-gray-300 h-4 w-1/4 rounded-md"></div>
              </div>
            </div>
            <hr className="my-4 border-gray-300" />
            {/* Placeholder for Details and Action */}
            <div className="bg-gray-300 h-4 w-1/2 rounded-md"></div>
            <div className="flex gap-2 mt-4">
              <div className="flex-1">
                {/* Placeholder for Edit Button */}
                <div className="bg-gray-300 h-10 rounded-md"></div>
              </div>
              {/* Placeholder for Share and Trash Icons */}
              <div className="bg-gray-300 basis-1/12 rounded-md"></div>
              <div className="bg-gray-300 basis-1/12 rounded-md"></div>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="bg-gray-200 rounded-md p-4">
            {/* Placeholder for Card Content */}
            <div className="bg-gray-300 h-20 w-full rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetailsSkeleton