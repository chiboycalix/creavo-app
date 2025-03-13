"use client"

import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock data for search results - we'll keep this for the Posts tab only
const mockFoodResults = [
  {
    id: "1",
    type: "post",
    title: "Family dinner",
    imageUrl: "/assets/profilepix.png",
  },
  {
    id: "2",
    type: "post",
    title: "Homemade pizza",
    imageUrl: "/assets/profilepix.png",
  },
  {
    id: "3",
    type: "post",
    title: "Outdoor dining",
    imageUrl: "/assets/profilepix.png",
  },
  {
    id: "4",
    type: "post",
    title: "Fresh ingredients",
    imageUrl: "/assets/profilepix.png",

  },
  {
    id: "5",
    type: "post",
    title: "Burger time",
    imageUrl: "/assets/profilepix.png",
  },
  {
    id: "6",
    type: "post",
    title: "Cooking class",
    imageUrl: "/assets/profilepix.png",
  },
]

type ContentTab = {
  id: string
  label: string
}

export default function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  const [activeContentTab, setActiveContentTab] = useState<string>("post")

  const contentTabs: ContentTab[] = [
    { id: "post", label: "Post" },
    { id: "courses", label: "Courses" },
    { id: "account", label: "Account" },
  ]

  const renderContent = () => {
    switch (activeContentTab) {
      case "post":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockFoodResults.map((result) => (
              <div key={result.id} className="overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-square relative">
                  <Image src={result.imageUrl || "/placeholder.svg"} alt={result.title} fill className="object-cover" />
                </div>
              </div>
            ))}
          </div>
        )
      case "courses":
        return (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses available</h3>
              <p className="text-gray-500">We couldn&apos;t find any courses matching your search.</p>
            </div>
          </div>
        )
      case "account":
        return (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No accounts available</h3>
              <p className="text-gray-500">We couldn&apos;t find any accounts matching your search.</p>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Search query display */}
      <div className="max-w-7xl mx-auto px-4 pt-4 pb-2">
        <div className="flex items-center">
          {/* <div className="bg-gray-100 rounded-full py-2 px-4 flex items-center">
            <span className="text-gray-800">{query}</span>
            <Link href="/" className="ml-2">
              <X className="h-5 w-5 text-blue-500" />
            </Link>
          </div> */}
        </div>
      </div>

      {/* Content tabs */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {contentTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveContentTab(tab.id)}
                className={`py-4 px-2 relative ${
                  activeContentTab === tab.id ? "text-gray-900 font-medium" : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {tab.label}
                {activeContentTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-500 rounded-t-md"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search results content */}
      <div className="max-w-7xl mx-auto px-4 py-8">{renderContent()}</div>
    </div>
  )
}

