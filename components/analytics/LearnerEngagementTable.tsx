import React, { useState } from 'react';
import { ChevronLeft,FileStack , ChevronRight, ArrowDownUp, MoreVertical, ChevronDown, Search, Filter } from 'lucide-react';

interface Learner {
  id: number;
  name: string;
  enrollmentDate: string;
  timeSpent: number;
  progress: number;
  quiz: string;
  completionStatus: 'Completed' | 'In Progress';
}

const learners: Learner[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: "Adarabioyo Joseph",
  enrollmentDate: "14/10/2024",
  timeSpent: 604,
  progress: i % 3 === 0 ? 100 : i % 3 === 1 ? 50 : 40,
  quiz: `${Math.floor(Math.random() * 7)}/10`,
  completionStatus: i % 3 === 0 ? 'Completed' : 'In Progress'
}));

const LearnerEngagementTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [showMenu, setShowMenu] = useState<number | null>(null);
  const [selectedCourse, setSelectedCourse] = useState('Javascript');
  const [searchQuery, setSearchQuery] = useState('');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const totalPages = Math.ceil(learners.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentLearners = learners.slice(startIndex, endIndex);

  const courses = ['Javascript', 'Python', 'React', 'Node.js'];
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative ">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowCourseDropdown(!showCourseDropdown)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50"
          >
            <span className="text-sm">{selectedCourse}</span>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </button>
          {showCourseDropdown && (
            <div className="absolute mt-2 w-48 bg-white rounded-lg shadow-lg z-20 border border-gray-200">
              {courses.map((course) => (
                <button
                  key={course}
                  onClick={() => {
                    setSelectedCourse(course);
                    setShowCourseDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  {course}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50"
          >
            {/* <Filter className="h-4 w-4 text-gray-500" /> */}
            <ArrowDownUp className="h-4 w-4 text-gray-500"/>
            <span className="text-sm">Status</span>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </button>
          {/* {showStatusDropdown && (
            <div className="absolute mt-2 w-48 bg-white rounded-lg shadow-lg z-20 border border-gray-200">
              <button
                onClick={() => setShowStatusDropdown(false)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                All
              </button>
              <button
                onClick={() => setShowStatusDropdown(false)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Completed
              </button>
              <button
                onClick={() => setShowStatusDropdown(false)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                In Progress
              </button>
            </div>
          )} */}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  S/N
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enrollment Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time Spent (mins)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress (%)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quiz
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentLearners.map((learner, index) => (
                <tr key={learner.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {learner.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {learner.enrollmentDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {learner.timeSpent}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {learner.progress}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {learner.quiz}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      learner.completionStatus === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {learner.completionStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 relative">
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => setShowMenu(showMenu === learner.id ? null : learner.id)}
                    >
                      <MoreVertical size={20} />
                    </button>
                    {showMenu === learner.id && (
                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                        <div className="py-1" role="menu" aria-orientation="vertical">
                          <button
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            role="menuitem"
                            onClick={() => setShowMenu(null)}
                          >
                            View profile
                          </button>
                          <button
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            role="menuitem"
                            onClick={() => setShowMenu(null)}
                          >
                            Send message
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
      </div>
    </div>
  );
};

export default LearnerEngagementTable;