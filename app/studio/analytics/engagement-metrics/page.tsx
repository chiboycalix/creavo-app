'use client'
import React, { useState } from 'react';
import { Search,  } from 'lucide-react';
import { CourseModal } from '@/components/analytics/CourseModal';
// types.ts
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
}



const courses: Course[] = [
  {
    id: 1,
    title: "Advanced Web Development",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&q=80&w=300",
    difficulty: "Advanced",
    uploadDate: "2024-02-15",
    completions: 328,
    totalEnrollment: 500,       
    enrollmentThisMonth: 120,   
    completionRate: { completed: 85.4, incomplete: 14.6 }, 
    totalMinutesWatched: 10240,
  },
  {
    id: 2,
    title: "UI/UX Design Fundamentals",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=300",
    difficulty: "Intermediate",
    uploadDate: "2024-02-10",
    completions: 245,
    totalEnrollment: 400,
    enrollmentThisMonth: 90,
    completionRate: { completed: 78.3, incomplete: 21.7 },
    totalMinutesWatched: 8400,
  },
  {
    id: 3,
    title: "Machine Learning Basics",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=300",
    difficulty: "Intermediate",
    uploadDate: "2024-02-08",
    completions: 412, 
    totalEnrollment: 600,
    enrollmentThisMonth: 150,
    completionRate: { completed: 78.3, incomplete: 21.7 },
    totalMinutesWatched: 8400,
  },
  {
    id: 4,
    title: "Digital Marketing Essentials",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=300",
    difficulty: "Beginner",
    uploadDate: "2024-02-12",
    completions: 567,
    totalEnrollment: 700,
    enrollmentThisMonth: 180,
    completionRate: { completed: 40.3, incomplete: 21.7 },
    totalMinutesWatched: 8400,
  }
];


function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Engagement Metrics</h1>
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

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredCourses.map((course) => (
              <div key={course.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-6">
                  <div className="flex-shrink-0 w-8 text-gray-400 font-medium">
                    {String(course.id).padStart(2, '0')}
                  </div>
                  <div className="grid grid-cols-4 items-start  space-x-4">

                    <div className='flex items-center gap-5 '>

                    <div className="relative w-16 h-16 rounded-lg  overflow-hidden flex-shrink-0">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="object-cover w-full h-full"
                      />
                      
                    </div>
                    <div className="flex flex-col w-10/12 ">
                      <h3 className="text-lg font-medium text-gray-900 truncate">{course.title}</h3>
                      <div className="flex items-center mt-1 space-x-4">
                        <span className="text-sm text-gray-500">
                          Difficulty: {course.difficulty}
                        </span>
                       
                      </div>
                    </div>
                    </div>

                 
                    <div className=" flex items-center flex-col ">
                    <p className=" font-semibold text-gray-900"> {new Date(course.uploadDate).toLocaleDateString()} </p>
                          <p className="text-sm text-gray-500">Date uploaded</p>
                        </div>
                      <div className="text-start">
                        <p className=" font-semibold text-gray-900">{course.completions}</p>
                        <p className="text-sm text-gray-500">Completions Count</p>
                      </div>
                    
                      <button 
                      onClick={() => setSelectedCourse(course)}
                      className="px-2 py-3 text-sm font-medium bg-gray-100 text-gray-700 rounded-xl  hover:bg-gray-200"
                    >
                      View more details
                    </button>
                    </div>
                  </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {selectedCourse && (
        <CourseModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </div>
  );
}

export default App;