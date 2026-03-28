import React from 'react';
import { useSelector } from 'react-redux';
import VideoGridSkeleton from './VideoGridSkeleton';

export default function SubscriptionSkeleton() {
  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === "dark";

  return (
    <div className="w-full animate-pulse">
      {/* Subscribed Channels Skeleton row */}
      <div className="mt-2 text-left">
        <div className={`h-4 w-48 rounded mb-4 ml-6 ${isDark ? "bg-gray-800" : "bg-gray-200"}`}></div>
        <div className="h-40 mt-2 flex flex-row flex-nowrap pl-6 overflow-hidden gap-6 pb-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 flex flex-col items-center">
              <div className={`w-24 h-24 rounded-full ${isDark ? "bg-gray-800" : "bg-gray-200"}`}></div>
              <div className={`h-3 w-16 mt-3 rounded ${isDark ? "bg-gray-800" : "bg-gray-200"}`}></div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="mt-8 mb-6 flex justify-center">
        <div className="flex gap-12">
          <div className={`w-32 h-[50px] rounded-full ${isDark ? "bg-gray-800" : "bg-gray-200"}`}></div>
          <div className={`w-32 h-[50px] rounded-full ${isDark ? "bg-gray-800" : "bg-gray-200"}`}></div>
        </div>
      </div>

      <div className="px-3">
        <hr className={isDark ? "border-gray-800" : "border-gray-300"} />
      </div>

      {/* Grid Skeleton */}
      <div className="px-6 mt-10 grid gap-8 min-h-full w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <VideoGridSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
