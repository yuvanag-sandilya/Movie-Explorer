import React from 'react';

export const SkeletonLoader: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex flex-col gap-3">
          <div className="w-full aspect-[2/3] rounded-xl skeleton-shimmer" />
          <div className="w-3/4 h-4 rounded skeleton-shimmer" />
          <div className="w-1/2 h-3 rounded skeleton-shimmer" />
        </div>
      ))}
    </div>
  );
};
