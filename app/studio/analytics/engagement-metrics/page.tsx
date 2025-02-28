'use client'
import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { CourseModal } from '@/components/analytics/CourseModal';
import { getUserCourses } from '@/services/course.service';

export interface Course {
  id: number;
  title: string;
  image: string;
  difficulty: string;
  uploadDate: string;
  completions: number;
  totalEnrollment: number;
  enrollmentThisMonth: number;
  completionRate: {
    completed: number;
    incomplete: number;
  };
  totalMinutesWatched: number;
  promotionalUrl: string;
}

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [courses, setCourses] = useState<Course[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await getUserCourses(10001, rowsPerPage, currentPage);
        const courseData = response.data.courses.map((course: any) => ({
          id: course.id,
          title: course.title || 'Untitled Course',
          image: course?.promotionalUrl || '/assets/thumbnail.png',
          difficulty: course.difficultyLevel || 'Unknown',
          uploadDate: course.createdAt || new Date().toISOString(),
          completions: course.completions || 0,
          totalEnrollment: course.totalEnrollment || 0,
          enrollmentThisMonth: course.enrollmentThisMonth || 0,
          completionRate: course.completionRate || { completed: 0, incomplete: 0 },
          totalMinutesWatched: course.totalMinutesWatched || 0,
        }));

        setCourses(courseData);
        setTotalPages(response.data.meta.totalPages || 1);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [currentPage, rowsPerPage]);

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);
  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">User Courses</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search courses..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 text-sm py-10">Loading courses...</p>
        ) : filteredCourses.length === 0 ? (
          <div className='flex  items-center justify-center flex-col my-20 '>
            <p className="text-center text-black font-semibold text-lg ">No courses available yet.</p>
            <p>Once you publish your course, come here to learn about your course engagement.</p>
          </div>
        ) : (
          <div className="bg-gray-50 gap-2 flex flex-col rounded-lg shadow overflow-hidden">
            {filteredCourses.map((course, i) => (
              <div key={course.id} className="p-6 hover:bg-white shadow transition-colors">
                <div className="flex items-center space-x-6">
                  <div className="flex w-8 text-gray-400 font-medium">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="grid grid-cols-4 items-start space-x-4">
                    <div className='flex items-center gap-5'>
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={course?.image}
                          alt={course?.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex flex-col w-10/12">
                        <h3 className="font-semibold text-xs text-gray-900">{course.title}</h3>
                        <span className="text-xs text-gray-500">Difficulty: {course.difficulty}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-3 flex-col">
                      <p className="font-semibold text-xs text-gray-900">{new Date(course.uploadDate).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500">Date uploaded</p>
                    </div>
                    <div className="text-start flex gap-3 flex-col items-start">
                      <p className="font-semibold text-xs text-gray-900">{course.completions}</p>
                      <p className="text-xs text-gray-500">Completions Count</p>
                    </div>
                    <button
                      onClick={() => setSelectedCourse(course)}
                      className="px-2 py-3 text-xs font-medium bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
                    >
                      View more details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredCourses.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-2">Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                className="border border-gray-300 rounded-md text-sm p-1"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`p-2 rounded-full ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200'}`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="text-sm font-medium text-gray-700">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-full ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200'}`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedCourse && (
        <CourseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
      )}
    </div>
  );
}

export default App;
