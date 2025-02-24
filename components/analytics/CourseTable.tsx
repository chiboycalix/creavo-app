import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, ChevronLeft, ChevronRight, Calendar, ChevronDown } from 'lucide-react';

interface Course {
  id: number;
  title: string;
  uploadDate: string;
  enrolledSubscriber: number;
  activeUser: number;
  avgMinsWatched: number;
  completionRate: number;
  likes: number;
}

interface CourseTableProps {
  onViewSubscribers: (courseId: number) => void;
}

const courses: Course[] = [
  {
    id: 1,
    title: "Introduction to React",
    uploadDate: "2024-03-15",
    enrolledSubscriber: 604,
    activeUser: 211,
    avgMinsWatched: 500,
    completionRate: 80,
    likes: 211
  },
  {
    id: 2,
    title: "Advanced JavaScript Concepts",
    uploadDate: "2025-02-17",
    enrolledSubscriber: 506,
    activeUser: 112,
    avgMinsWatched: 500,
    completionRate: 60,
    likes: 112
  },
  {
    id: 3,
    title: "Web Development Fundamentals",
    uploadDate: "2025-01-10",
    enrolledSubscriber: 403,
    activeUser: 68,
    avgMinsWatched: 500,
    completionRate: 50,
    likes: 68
  },
  {
    id: 4,
    title: "UI/UX Design Principles",
    uploadDate: "2025-02-10",
    enrolledSubscriber: 312,
    activeUser: 89,
    avgMinsWatched: 450,
    completionRate: 75,
    likes: 95
  },
  {
    id: 5,
    title: "Node.js Backend Development",
    uploadDate: "2024-02-15",
    enrolledSubscriber: 428,
    activeUser: 156,
    avgMinsWatched: 480,
    completionRate: 65,
    likes: 142
  },
  {
    id: 6,
    title: "Database Design Mastery",
    uploadDate: "2024-01-25",
    enrolledSubscriber: 385,
    activeUser: 98,
    avgMinsWatched: 520,
    completionRate: 70,
    likes: 88
  },
  {
    id: 7,
    title: "TypeScript for Beginners",
    uploadDate: "2024-03-10",
    enrolledSubscriber: 289,
    activeUser: 145,
    avgMinsWatched: 460,
    completionRate: 85,
    likes: 134
  },
  {
    id: 8,
    title: "React Native Mobile Apps",
    uploadDate: "2024-02-28",
    enrolledSubscriber: 356,
    activeUser: 178,
    avgMinsWatched: 490,
    completionRate: 55,
    likes: 167
  },
  
];

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20">
    <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Information yet!</h3>
    <p className="text-gray-500">You currently don&apost have any Subscriber</p>
  </div>
);

const DateRangeFilter = ({ onFilter }: { onFilter: (range: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const ranges = [
    { label: 'All Time', value: 'all' },
    { label: 'Last 7 Days', value: '7days' },
    { label: 'Last 30 Days', value: '30days' },
    { label: 'Last 90 Days', value: '90days' },
    { label: 'Custom Range', value: 'custom' }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 text-gray-600 hover:text-gray-800"
      >
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 py-1">
          {ranges.map((range) => (
            <button
              key={range.value}
              onClick={() => {
                onFilter(range.value);
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {range.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const CourseTable: React.FC<CourseTableProps> = ({ onViewSubscribers }) => {
  const [sortedCourses, setSortedCourses] = useState<Course[]>(courses);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Course;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [showMenu, setShowMenu] = useState<number | null>(null);

  const handleSort = (key: keyof Course) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sorted = [...sortedCourses].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setSortedCourses(sorted);
  };

  const handleDateRangeFilter = (range: string) => {
    const now = new Date();
    let filtered = [...courses];

    switch (range) {
      case '7days': {
        const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
        filtered = courses.filter(course => new Date(course.uploadDate) >= sevenDaysAgo);
        break;
      }
      case '30days': {
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
        filtered = courses.filter(course => new Date(course.uploadDate) >= thirtyDaysAgo);
        break;
      }
      case '90days': {
        const ninetyDaysAgo = new Date(now.setDate(now.getDate() - 90));
        filtered = courses.filter(course => new Date(course.uploadDate) >= ninetyDaysAgo);
        break;
      }
      case 'custom':
        // Handle custom date range (could open a modal or additional inputs)
        break;
      default:
        filtered = courses;
    }

    setSortedCourses(filtered);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(sortedCourses.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentCourses = sortedCourses.slice(startIndex, endIndex);

  return (
    <div className="w-full px-4 py-6">
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  S/N
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('title')}>
                  Course Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center justify-between">
                    <span className="cursor-pointer"
                          onClick={() => handleSort('uploadDate')}>
                      Upload Date
                    </span>
                    <DateRangeFilter onFilter={handleDateRangeFilter} />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('enrolledSubscriber')}>
                  Enrolled Subscriber
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('activeUser')}>
                  Active User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg. mins watched
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('completionRate')}>
                  Completion Rate(%)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('likes')}>
                  Likes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentCourses.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <EmptyState />
                  </td>
                </tr>
              ) : (
                currentCourses.map((course, index) => (
                  <tr key={course.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {course.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(course.uploadDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.enrolledSubscriber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.activeUser}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.avgMinsWatched}min
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.completionRate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.likes}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 relative">
                      <button 
                        className="text-gray-400 hover:text-gray-600"
                        onClick={() => setShowMenu(showMenu === course.id ? null : course.id)}
                      >
                        <MoreVertical size={20} />
                      </button>
                      {showMenu === course.id && (
                        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                          <div className="py-1" role="menu" aria-orientation="vertical">
                            <button
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              role="menuitem"
                              onClick={() => {
                                setShowMenu(null);
                              }}
                            >
                              View course
                            </button>
                            <button
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              role="menuitem"
                              onClick={() => {
                                onViewSubscribers(course.id);
                                setShowMenu(null);
                              }}
                            >
                              View subscribers
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {currentCourses.length > 0 && (
          <div className="flex items-center justify-between px-6 py-3 border-t">
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-600">Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={36}>36</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronLeft size={20} />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded ${
                    currentPage === page
                      ? 'bg-blue-500 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseTable;