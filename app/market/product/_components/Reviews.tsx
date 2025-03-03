"use client";

import React from "react";
import { StarIcon } from "lucide-react";

interface Comment {
  avatar: string;
  stars: number;
  name: string;
  time: string;
  body: string;
}

interface ProductReviewsProps {
  rating: number;
  totalReviews: number;
  comments: Comment[];
  product: any;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({
  comments,
  product,
  rating,
  totalReviews,
}) => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-md w-full max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Customer Reviews
          </h2>
          <div className="flex items-center gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`w-5 h-5 ${
                  i < product.rating ? "text-yellow-500" : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-gray-700 text-sm ml-2">10 reviews</span>
          </div>
        </div>
        <button className="bg-[#0073B4] px-4 py-2 text-white rounded-md shadow-md hover:bg-[#005f8f]">
          Write a Review
        </button>
      </div>

      <div className="space-y-4">
        {comments.map((comment, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg shadow-sm bg-gray-50"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-3">
                <img
                  src={comment.avatar}
                  alt={comment.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-800">{comment.name}</p>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`w-4 h-4 ${
                          i < comment.stars
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <span className="text-gray-500 text-sm">{comment.time}</span>
            </div>
            <p className="text-gray-700 text-sm">{comment.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductReviews;
