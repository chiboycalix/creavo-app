"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Search, X } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

type SearchItem = {
  id: string
  type: "user" | "term"
  text: string
  username?: string
  following?: boolean
}

export default function SearchInput() {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [recentSearches, setRecentSearches] = useState<SearchItem[]>([
    {
      id: "1",
      type: "user",
      text: "kambeani",
      username: "@Kimberly",
      following: true,
    },
    {
      id: "2",
      type: "user",
      text: "kambeani",
      username: "@Kimberly",
    },
    {
      id: "3",
      type: "term",
      text: "food",
    },
    {
      id: "4",
      type: "user",
      text: "kambeani",
      username: "@Kimberly",
      following: true,
    },
    {
      id: "5",
      type: "term",
      text: "product management",
    },
    {
      id: "6",
      type: "term",
      text: "ui/ux",
    },
    {
      id: "7",
      type: "user",
      text: "kambeani",
      username: "@Kimberly",
      following: true,
    },
    {
      id: "8",
      type: "user",
      text: "kambeani",
      username: "@Kimberly",
    },
  ])

  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleInputFocus = () => {
    setIsOpen(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    if (!isOpen) setIsOpen(true)
  }

  const clearSearch = () => {
    setQuery("")
    inputRef.current?.focus()
  }

  const removeSearchItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setRecentSearches(recentSearches.filter((item) => item.id !== id))
  }

  const clearAllSearches = (e: React.MouseEvent) => {
    e.stopPropagation()
    setRecentSearches([])
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      // Add to recent searches if not already there
      if (!recentSearches.some((item) => item.type === "term" && item.text === query.trim())) {
        setRecentSearches([
          {
            id: Date.now().toString(),
            type: "term",
            text: query.trim(),
          },
          ...recentSearches,
        ])
      }

      // Navigate to search results page
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setIsOpen(false)
    }
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder="Search"
          className="w-full h-10 pl-10 pr-10 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        {query && (
          <button onClick={clearSearch} className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <X className="h-5 w-5 text-blue-500" />
          </button>
        )}
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 z-50"
        >
          <div className="p-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500 font-medium">Recently searched</span>
              <button onClick={clearAllSearches} className="text-xs text-blue-500 hover:text-blue-700">
                Clear all
              </button>
            </div>

            <div className="space-y-1">
              {recentSearches.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2 px-1 hover:bg-gray-50 rounded-md cursor-pointer"
                  onClick={() => {
                    if (item.type === "term") {
                      setQuery(item.text)
                      router.push(`/search?q=${encodeURIComponent(item.text)}`)
                      setIsOpen(false)
                    }
                  }}
                >
                  <div className="flex items-center">
                    {item.type === "user" ? (
                      <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden mr-2">
                        <Image
                          src="/placeholder.svg?height=32&width=32"
                          alt={item.text}
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 flex items-center justify-center mr-2">
                        <Search className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{item.text}</span>
                      {item.type === "user" && (
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500">{item.username}</span>
                          {item.following && <span className="text-xs text-gray-500 ml-1">• Following</span>}
                        </div>
                      )}
                    </div>
                  </div>
                  <button onClick={(e) => removeSearchItem(item.id, e)} className="p-1 hover:bg-gray-200 rounded-full">
                    <X className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

