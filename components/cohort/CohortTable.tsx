"use client"

import { useEffect, useState } from "react"
import { Mail, Users, Share, Search, ChevronLeft, ChevronRight, Filter, ChevronDown } from "lucide-react"
import { fetchLearnerEngagement, fetchUserCourses } from "@/services/course.service"
import { apiClient } from "@/lib/apiClient"
import { LearnerDetails } from "./LearnerDetails"

export interface QuizAttempt {
  id: number
  title: string
  score: number
  totalScore: number
  duration: number
  completedAt: string
}

export interface Learner {
  userId: number
  name: string
  email: string
  enrolledCourse: string
  demographic: string
  enrollmentDate: string
  lastActive: string
  quizAttempt: number
  quizAttempts: QuizAttempt[]
  percentageCompletion: number
  totalWatchTime: number
  lastUpdated: string
}

interface Course {
  id: number
  title: string
  category: string
  difficultyLevel: string
  tags: string[]
  isPublished: boolean
  userId: number
  currency: string
  amount: string
  isPaid: boolean
  promotionalUrl: string
  promote: boolean
  description: string
  metadata: any
  likesCount: number
  commentsCount: number
  viewsCount: number
  sharesCount: number
  bookmarkCount: number
  totalWatchTime: number
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

interface PaginationMeta {
  totalCount: number
  limit: number
  currentPage: number
  totalPages: number
}

export function CohortTable() {
  const [userId, setUserId] = useState<number | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [coursesLoading, setCoursesLoading] = useState(false)
  const [coursesError, setCoursesError] = useState<string | null>(null)
  const [showCourseDropdown, setShowCourseDropdown] = useState(false)

  const [learners, setLearners] = useState<Learner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(12)
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    totalCount: 0,
    limit: 10,
    currentPage: 1,
    totalPages: 1,
  })
  const [selectedLearner, setSelectedLearner] = useState<Learner | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const fetchLearnerData = async (courseId: number) => {
    setLoading(true)
    try {
      console.log("Fetching learner engagement data for course:", courseId)
      const response = await fetchLearnerEngagement(courseId)
      console.log("Learner Engagement Data:", response)

      const trainees = response?.trainees || []
      if (!response?.trainees) {
        setLoading(false)
      }

      const learnersWithQuizAttempts = trainees.map((learner: any) => ({
        ...learner,
        quizAttempts: [],
      }))

      setLearners(learnersWithQuizAttempts)

      setPaginationMeta(
        response?.meta || {
          totalCount: 0,
          limit: 10,
          currentPage: 1,
          totalPages: 1,
        },
      )
    } catch (err) {
      console.error("Error fetching learner engagement details:", err)
      setError("Failed to fetch learner engagement data.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await apiClient.get("/auth/me")
        if (response.data?.id) {
          setUserId(response.data.id)
          console.log("User ID:", response.data.id)
        } else {
          throw new Error("Invalid user data response")
        }
      } catch (err) {
        console.error("Error fetching user ID:", err)
        setError("Failed to load user data.")
      }
    }

    fetchUserId()
  }, [])

  useEffect(() => {
    if (!userId) return

    const fetchCourses = async () => {
      setCoursesLoading(true)
      try {
        const response = await fetchUserCourses(userId)
        console.log("Processed courses response:", response)

        const coursesList = response?.courses || []
        console.log("Courses list:", coursesList)

        setCourses(coursesList)

        if (coursesList.length > 0) {
          const firstCourse = coursesList[0]
          console.log("Automatically selecting first course:", firstCourse.title, "ID:", firstCourse.id)
          setSelectedCourse(firstCourse)

          // Fetch learner data for the first course
          await fetchLearnerData(firstCourse.id)
        }
      } catch (err) {
        console.error("Error fetching courses:", err)
        setCoursesError("Failed to load courses.")
      } finally {
        setCoursesLoading(false)
        setLoading(false)
      }
    }

    fetchCourses()
  }, [userId])

  useEffect(() => {
    if (!selectedCourse) return

    // Only fetch data if this is not the initial load of the first course
    if (!(courses.length > 0 && selectedCourse.id === courses[0]?.id && learners.length > 0)) {
      console.log("Fetching learner data for selected course:", selectedCourse.id)
      fetchLearnerData(selectedCourse.id)
    } else {
      console.log("Skipping duplicate fetch for first course")
    }
  }, [selectedCourse])

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([])
    } else {
      setSelectedRows(learners.map((learner) => learner.userId))
    }
    setSelectAll(!selectAll)
  }

  const handleSelectRow = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id))
    } else {
      setSelectedRows([...selectedRows, id])
    }
  }

  const handleCourseSelect = (course: Course) => {
    if (course.id !== selectedCourse?.id) {
      console.log("User selected course:", course.title, "ID:", course.id)
      setSelectedCourse(course)
      fetchLearnerData(course.id) // Add this line to fetch data when course changes
    }
    setShowCourseDropdown(false)
  }

  const filteredLearners = learners.filter(
    (learner) =>
      learner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      learner.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      learner.demographic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      learner.enrolledCourse?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const paginatedLearners = filteredLearners.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
  const totalPages = paginationMeta.totalPages || Math.ceil(filteredLearners.length / rowsPerPage)

  const displayCourses = courses

  const handleViewMore = (learner: Learner) => {
    const learnerWithQuizAttempts = {
      ...learner,
      quizAttempts: learner.quizAttempts ?? [],
    }

    setSelectedLearner(learnerWithQuizAttempts)
    setIsDetailsOpen(true)
  }

  return (
    <div className="w-full flex flex-col relative justify-start">
      <div className="flex items-center w-full justify-between mb-4">
        <h1 className="text-lg font-semibold">All Trainee</h1>
        <div className="flex items-center gap-2">
          <div className="relative text-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative text-sm">
            <button
              className="flex items-center gap-2 px-3 py-2 border rounded-md bg-white"
              onClick={() => setShowCourseDropdown(!showCourseDropdown)}
            >
              <Filter className="h-3 w-3" />
              <span>{selectedCourse ? selectedCourse.title : "Select Course"}</span>
              <ChevronDown className="h-3 w-3" />
            </button>

            {showCourseDropdown && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border rounded-md shadow-lg z-10">
                {coursesLoading ? (
                  <div className="p-2 text-center text-sm text-gray-500">Loading courses...</div>
                ) : coursesError ? (
                  <div className="p-2 text-center text-sm text-red-500">{coursesError}</div>
                ) : displayCourses.length === 0 ? (
                  <div className="p-2 text-center text-sm text-gray-500">No courses available</div>
                ) : (
                  <ul className="py-1">
                    {displayCourses.map((course) => (
                      <li
                        key={course.id}
                        className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                          selectedCourse?.id === course.id ? "bg-gray-100 font-medium" : ""
                        }`}
                        onClick={() => handleCourseSelect(course)}
                      >
                        {course.title}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
          <div className="relative text-sm">
            <button className="flex items-center gap-2 px-3 py-2 border rounded-md bg-white">
              <span>Status</span>
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex ml-3 items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <input type="checkbox" className="rounded  border-gray-300" checked={selectAll} onChange={handleSelectAll} />
        </div>
        <Mail className="h-3 w-3 text-gray-600 cursor-pointer" />
        <Users className="h-3 w-3 text-gray-600 cursor-pointer" />
        <Share className="h-3 w-3 text-gray-600 cursor-pointer" />
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="rounded-lg overflow-hidden border border-gray-200">
          <table className=" w-full text-sm border-collapse">
            <thead className="bg-gray-50 text-xs">
              <tr>
                <th className="p-3 text-left">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="p-3 text-left">S/N</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email Address</th>
                <th className="p-3 text-left">Date Enrolled</th>
                <th className="p-3 text-left">Demographic</th>
                <th className="p-3 text-left">Progress</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {paginatedLearners.length && courses.length > 0 ? (
                paginatedLearners.map((learner, index) => (
                  <tr key={learner.userId} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selectedRows.includes(learner.userId)}
                        onChange={() => handleSelectRow(learner.userId)}
                      />
                    </td>
                    <td className="p-3">{index + 1 + (currentPage - 1) * rowsPerPage}.</td>
                    <td className="p-3">{learner.name}</td>
                    <td className="p-3">{learner.email}</td>
                    <td className="p-3">{new Date(learner.enrollmentDate).toLocaleDateString()}</td>
                    <td className="p-3">{learner.demographic}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span>{learner.percentageCompletion}%</span>
                        {learner.percentageCompletion < 100 && <span className="text-yellow-600">In complete</span>}
                      </div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleViewMore(learner)}
                        className="text-gray-500 py-2 px-5 bg-gray-200 rounded-xl"
                      >
                        View more
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-10 text-center text-gray-500">
                    <h2 className="text-lg font-semibold">No Information yet!</h2>
                    <p className="text-sm">You currently dont have any Subscribers</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex items-center justify-between p-4 bg-white border-t">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rows per page</span>
              <select
                className="border rounded p-1 text-sm"
                value={rowsPerPage}
                onChange={(e) => {
                  const newLimit = Number(e.target.value)
                  setRowsPerPage(newLimit)
                }}
              >
                <option value={10}>10</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={48}>48</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
                disabled={paginationMeta.currentPage === 1}
                onClick={() => {
                  const newPage = Math.max(paginationMeta.currentPage - 1, 1)
                  setCurrentPage(newPage)
                }}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {Array.from({ length: Math.min(paginationMeta.totalPages, 5) }, (_, i) => {
                const pageNum = i + 1
                return (
                  <button
                    key={pageNum}
                    className={`w-8 h-8 rounded-full ${
                      paginationMeta.currentPage === pageNum ? "bg-blue-500 text-white" : "hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      setCurrentPage(pageNum)
                    }}
                  >
                    {pageNum}
                  </button>
                )
              })}

              {paginationMeta.totalPages > 5 && <span>...</span>}

              {paginationMeta.totalPages > 5 && (
                <button
                  className={`w-8 h-8 rounded-full hover:bg-gray-100`}
                  onClick={() => {
                    setCurrentPage(paginationMeta.totalPages)
                  }}
                >
                  {paginationMeta.totalPages}
                </button>
              )}

              <button
                className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
                disabled={paginationMeta.currentPage === paginationMeta.totalPages}
                onClick={() => {
                  const newPage = Math.min(paginationMeta.currentPage + 1, paginationMeta.totalPages)
                  setCurrentPage(newPage)
                }}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
      <LearnerDetails
        learner={selectedLearner}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false)
          setSelectedLearner(null)
        }}
      />
    </div>
  )
}

