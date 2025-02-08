"use client"
import React from 'react';

const YouTubePlayer = ({ videoId, title = 'YouTube video player' }: { videoId: string, title: string }) => {
  const [isLoading, setIsLoading] = React.useState(true);

  return (
    <div className="relative w-full h-full object-cover">
      {/* 16:9 aspect ratio wrapper */}
      <div className="relative bg-slate-100 rounded-lg overflow-hidden h-full w-full">
        {/* Loading skeleton */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse space-y-2">
              <div className="w-12 h-12 bg-slate-200 rounded-full" />
              <div className="h-4 w-24 bg-slate-200 rounded mx-auto" />
            </div>
          </div>
        )}

        <iframe
          className="absolute inset-0 w-full h-full object-cover"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </div>
  );
};

export default YouTubePlayer