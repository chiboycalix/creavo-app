"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Search, X, User } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { baseUrl } from "@/utils/constant"

type SearchItem = {
  id: string
  type: "user" | "term"
  text: string
  username?: string
  email?: string
  following?: boolean
  avatar?: string
  firstName?: string
  lastName?: string
}

type SearchResponse = {
  data: {
    results: Array<{
      id: string
      index: string
      data: {
        id: number
        type: string
        email?: string
        username?: string
        avatar?: string
        firstName?: string
        lastName?: string
        [key: string]: any
      }
    }>
    meta: {
      totalCount: number
      limit: number
      totalPages: number
      currentPage: number
    }
  }
  message: string
  code: number
  status: string
  statusCode: number
}

export default function SearchInput() {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [recentSearches, setRecentSearches] = useState<SearchItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchItem[]>([])
  const [debouncedQuery, setDebouncedQuery] = useState("")

  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300) // 300ms delay

    return () => clearTimeout(timer)
  }, [query])

  // Fetch suggestions when debounced query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setSuggestions([])
        return
      }

      setIsLoading(true)
      try {
        const token = Cookies.get("token") || Cookies.get("accessToken")
        const response = await fetch(`${baseUrl}/search/?search_query=${encodeURIComponent(debouncedQuery)}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch suggestions")
        }

        const data: SearchResponse = await response.json()

        // Transform API response to SearchItem format
        const userSuggestions: SearchItem[] = []
        const termSuggestion: SearchItem = {
          id: `term-${Date.now()}`,
          type: "term",
          text: debouncedQuery,
        }

        // Extract users from the search results
        if (data.data && data.data.results) {
          data.data.results.forEach((item) => {
            if (item.data.type === "user") {
              userSuggestions.push({
                id: item.id,
                type: "user",
                text: item.data.username || "",
                username: item.data.username || "",
                email: item.data.email || "",
                avatar: item.data.avatar || "",
                firstName: item.data.firstName || "",
                lastName: item.data.lastName || "",
              })
            }
          })
        }

        setSuggestions([termSuggestion, ...userSuggestions])
      } catch (error) {
        console.error("Error fetching suggestions:", error)
        // Add just the term suggestion if API fails
        setSuggestions([
          {
            id: `term-${Date.now()}`,
            type: "term",
            text: debouncedQuery,
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchSuggestions()
  }, [debouncedQuery])

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches")
    if (savedSearches) {
      try {
        setRecentSearches(JSON.parse(savedSearches))
      } catch (e) {
        console.error("Error parsing saved searches", e)
        localStorage.removeItem("recentSearches")
      }
    }
  }, [])

  // Save recent searches to localStorage when they change
  useEffect(() => {
    if (recentSearches.length > 0) {
      localStorage.setItem("recentSearches", JSON.stringify(recentSearches))
    }
  }, [recentSearches])

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
    localStorage.removeItem("recentSearches")
  }

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return

    if (!recentSearches.some((item) => item.type === "term" && item.text === searchQuery.trim())) {
      const newSearches = [
        {
          id: Date.now().toString(),
          type: "term" as const,
          text: searchQuery.trim(),
        },
        ...recentSearches.slice(0, 9), 
      ]
      setRecentSearches(newSearches)
    }

    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    setIsOpen(false)
  }

  const handleSelectUser = (user: SearchItem) => {
    if (!recentSearches.some((item) => item.type === "user" && item.username === user.username)) {
      const newSearches = [
        {
          ...user,
          id: Date.now().toString(), 
        },
        ...recentSearches.slice(0, 9), 
      ]
      setRecentSearches(newSearches)
    }

    router.push(`/search?q=${encodeURIComponent(user.username || "")}`)
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(query)
    }
  }

  const renderSuggestions = () => {
    if (isLoading) {
      return (
        <div className="py-2 px-1">
          <div className="flex items-center justify-center py-2">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      )
    }

    if (suggestions.length === 0) {
      return null
    }

    return (
      <>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500 font-medium">Suggestions</span>
        </div>

        <div className="space-y-1 mb-3">
          {suggestions.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-2 px-1 hover:bg-gray-50 rounded-md cursor-pointer"
              onClick={() => {
                if (item.type === "term") {
                  setQuery(item.text)
                  handleSearch(item.text)
                } else if (item.type === "user" && item.username) {
                  setQuery(item.username)
                  handleSelectUser(item)
                }
              }}
            >
              <div className="flex items-center">
                {item.type === "user" ? (
                  <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden mr-2 flex items-center justify-center">
                    {item.avatar ? (
                      <Image
                        src={item.avatar || "/placeholder.svg"}
                        alt={item.username || "User"}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    ) : (
                      <User className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                ) : (
                  <div className="w-8 h-8 flex items-center justify-center mr-2">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{item.type === "user" ? item.username : item.text}</span>
                  {item.type === "user" && (
                    <div className="flex items-center">
                      {item.email && <span className="text-xs text-gray-500">{item.email}</span>}
                      {item.firstName && item.lastName && item.firstName !== "None" && item.lastName !== "None" && (
                        <span className="text-xs text-gray-500 ml-1">
                          • {item.firstName} {item.lastName}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    )
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
            {/* Show suggestions when typing */}
            {query && renderSuggestions()}

            {/* Show recent searches */}
            {recentSearches.length > 0 ? (
              <>
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
                          handleSearch(item.text)
                        } else if (item.type === "user" && item.username) {
                          setQuery(item.username)
                          handleSelectUser(item)
                        }
                      }}
                    >
                      <div className="flex items-center">
                        {item.type === "user" ? (
                          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden mr-2 flex items-center justify-center">
                            {item.avatar ? (
                              <Image
                                src={item.avatar || "/placeholder.svg"}
                                alt={item.username || "User"}
                                width={32}
                                height={32}
                                className="object-cover"
                              />
                            ) : (
                              <User className="h-4 w-4 text-gray-500" />
                            )}
                          </div>
                        ) : (
                          <div className="w-8 h-8 flex items-center justify-center mr-2">
                            <Search className="h-4 w-4 text-gray-400" />
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {item.type === "user" ? item.username : item.text}
                          </span>
                          {item.type === "user" && (
                            <div className="flex items-center">
                              {item.email && <span className="text-xs text-gray-500">{item.email}</span>}
                              {item.firstName &&
                                item.lastName &&
                                item.firstName !== "None" &&
                                item.lastName !== "None" && (
                                  <span className="text-xs text-gray-500 ml-1">
                                    • {item.firstName} {item.lastName}
                                  </span>
                                )}
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => removeSearchItem(item.id, e)}
                        className="p-1 hover:bg-gray-200 rounded-full"
                      >
                        <X className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="py-4 text-center text-gray-500">No recent searches</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

