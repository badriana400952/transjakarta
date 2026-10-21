import React from 'react'

interface LoadingSkeletonProps {
  count?: number
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={`skeleton-${idx}`}
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs animate-pulse space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-200 rounded-xl" />
              <div className="space-y-1.5">
                <div className="w-24 h-4 bg-slate-200 rounded" />
                <div className="w-16 h-3 bg-slate-100 rounded" />
              </div>
            </div>
            <div className="w-12 h-6 bg-slate-200 rounded-md" />
          </div>

          <div className="w-36 h-6 bg-slate-200 rounded-full" />

          <div className="space-y-3 pt-2">
            <div className="h-9 bg-slate-100 rounded-lg" />
            <div className="h-4 bg-slate-100 rounded w-3/4" />
            <div className="h-4 bg-slate-100 rounded w-1/2" />
          </div>

          <div className="pt-2">
            <div className="h-9 bg-slate-200 rounded-lg w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}
