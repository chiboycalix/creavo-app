import React from 'react';

const QuizSkeletonLoader: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Skeleton for Question 1 */}
      <div className="border rounded-lg p-4">
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
        <div className="h-4 bg-gray-300 rounded w-1/4 mt-4"></div>
      </div>

      {/* Skeleton for Question 2 */}
      <div className="border rounded-lg p-4">
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
        <div className="h-4 bg-gray-300 rounded w-1/4 mt-4"></div>
      </div>

      {/* Skeleton for Question 3 */}
      <div className="border rounded-lg p-4">
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
        <div className="h-4 bg-gray-300 rounded w-1/4 mt-4"></div>
      </div>
    </div>
  );
};

export default QuizSkeletonLoader;