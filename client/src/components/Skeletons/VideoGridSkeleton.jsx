import React from 'react';
import { useSelector } from 'react-redux';

export default function VideoGridSkeleton() {
  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === 'dark';

  return (
    <div className={`w-full max-w-[320px] mx-auto flex flex-col gap-3 rounded-2xl overflow-hidden animate-pulse ${isDark ? 'bg-transparent' : 'bg-transparent'}`}>
      {/* Thumbnail Skeleton */}
      <div className={`w-full aspect-video rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
      
      {/* Details Skeleton */}
      <div className="flex px-1 space-x-3 w-full mt-1">
        {/* Avatar */}
        <div className={`w-10 h-10 rounded-full shrink-0 ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
        
        {/* Text Rows */}
        <div className="flex flex-col gap-2 w-full mt-1 pb-4">
           {/* Title */}
           <div className={`h-4 w-[95%] rounded ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
           <div className={`h-4 w-[75%] rounded ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
           
           {/* Subtitle / Channel */}
           <div className={`h-3 w-[50%] rounded mt-1.5 ${isDark ? 'bg-gray-700/50' : 'bg-gray-300/50'}`}></div>
        </div>
      </div>
    </div>
  );
}
