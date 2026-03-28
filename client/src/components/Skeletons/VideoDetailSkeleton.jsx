import React from 'react';
import { useSelector } from 'react-redux';

export default function VideoDetailSkeleton() {
  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === 'dark';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mt-6 mx-auto w-full max-w-[1600px] animate-pulse">
      {/* 🎥 Video stage Skeleton */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        {/* Player Block */}
        <div className={`relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl ml-0 lg:ml-10 ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
      </div>

      {/* 📦 Details Skeleton */}
      <div className="lg:col-span-1 flex flex-col gap-4 w-full lg:w-[450px]">
        {/* Title & Stats */}
        <div className="flex flex-col gap-3 p-2">
           <div className={`h-8 w-full rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
           <div className={`h-8 w-2/3 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
           <div className={`h-4 w-1/3 rounded mt-2 ${isDark ? 'bg-gray-700/50' : 'bg-gray-300/50'}`}></div>
        </div>

        {/* Channel Row */}
        <div className="flex items-center gap-4 p-2 mt-4">
           <div className={`w-14 h-14 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
           <div className="flex flex-col gap-2 w-full">
             <div className={`h-5 w-[60%] rounded ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
             <div className={`h-3 w-[40%] rounded ${isDark ? 'bg-gray-700/50' : 'bg-gray-300/50'}`}></div>
           </div>
           {/* Subscribe Button Skeleton */}
           <div className={`w-32 h-12 rounded-full shrink-0 ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
        </div>

        {/* Actions Row */}
        <div className="flex items-center gap-4 p-2 mt-2">
           <div className={`w-28 h-10 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
           <div className={`w-10 h-10 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
        </div>

        {/* Description Box */}
        <div className={`mt-4 p-5 rounded-2xl flex flex-col gap-3 ${isDark ? 'bg-gray-900/50 border border-gray-800' : 'bg-gray-100 border border-gray-200'}`}>
           <div className={`h-4 w-full rounded ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
           <div className={`h-4 w-[90%] rounded ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
           <div className={`h-4 w-[80%] rounded ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
           <div className={`h-4 w-[85%] rounded mt-4 ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
           <div className={`h-4 w-[60%] rounded ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
        </div>
      </div>
    </div>
  );
}
