import React from 'react';

export default function AnalysisLoadingSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Score hero skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1 rounded-2xl bg-zinc-900 border border-zinc-800 p-6 flex flex-col items-center gap-4">
          <div className="shimmer rounded-lg h-5 w-32" />
          <div className="shimmer rounded-full w-36 h-36" />
          <div className="shimmer rounded-lg h-8 w-20" />
          <div className="shimmer rounded-full h-6 w-24" />
        </div>

        <div className="lg:col-span-2 rounded-2xl bg-zinc-900 border border-zinc-800 p-6 flex flex-col gap-4">
          <div className="shimmer rounded-lg h-5 w-40" />
          <div className="grid grid-cols-2 gap-4 flex-1">
            {Array.from({ length: 4 })?.map((_, i) => (
              <div key={`skel-stat-${i + 1}`} className="rounded-xl bg-zinc-800/60 p-4 flex flex-col gap-2">
                <div className="shimmer rounded h-3 w-20" />
                <div className="shimmer rounded h-7 w-16" />
                <div className="shimmer rounded h-2 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Keywords skeleton */}
      <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 flex flex-col gap-4">
        <div className="shimmer rounded-lg h-5 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-3">
            <div className="shimmer rounded h-4 w-28" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 8 })?.map((_, i) => (
                <div key={`skel-kw-found-${i + 1}`} className="shimmer rounded-full h-6 w-16" />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="shimmer rounded h-4 w-28" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 })?.map((_, i) => (
                <div key={`skel-kw-miss-${i + 1}`} className="shimmer rounded-full h-6 w-16" />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Cards skeleton row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {Array.from({ length: 2 })?.map((_, i) => (
          <div key={`skel-card-${i + 1}`} className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 flex flex-col gap-4">
            <div className="shimmer rounded-lg h-5 w-36" />
            {Array.from({ length: 3 })?.map((_, j) => (
              <div key={`skel-card-${i + 1}-row-${j + 1}`} className="rounded-xl bg-zinc-800/50 p-4 flex flex-col gap-2">
                <div className="shimmer rounded h-4 w-40" />
                <div className="shimmer rounded h-3 w-full" />
                <div className="shimmer rounded h-3 w-3/4" />
              </div>
            ))}
          </div>
        ))}
      </div>
      {/* Rewrites skeleton */}
      <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 flex flex-col gap-4">
        <div className="shimmer rounded-lg h-5 w-52" />
        {Array.from({ length: 2 })?.map((_, i) => (
          <div key={`skel-rewrite-${i + 1}`} className="rounded-xl bg-zinc-800/50 p-5 flex flex-col gap-3">
            <div className="shimmer rounded h-4 w-24" />
            <div className="shimmer rounded h-3 w-full" />
            <div className="shimmer rounded h-4 w-24" />
            <div className="shimmer rounded h-3 w-full" />
            <div className="shimmer rounded h-3 w-4/5" />
          </div>
        ))}
      </div>
    </div>
  );
}