import React from 'react';
import { cn } from '../../utils/cn';

export function Skeleton({ className }: {className?: string;}) {
  return (
    <span
      aria-hidden
      className={cn('relative block overflow-hidden rounded bg-subtle', className)}>
      
      <span className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-border/60 to-transparent" />
    </span>);

}

export function SkeletonRows({ rows = 5, className }: {rows?: number;className?: string;}) {
  return (
    <div className={cn('space-y-3 p-5', className)} role="status" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) =>
      <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-2.5 w-1/2" />
          </div>
          <Skeleton className="h-5 w-16 rounded" />
        </div>
      )}
      <span className="sr-only">Loading content</span>
    </div>);

}

export function SkeletonCard({ className }: {className?: string;}) {
  return (
    <div className={cn('rounded-xl border border-border bg-surface p-4', className)} role="status" aria-label="Loading">
      <Skeleton className="h-2.5 w-20" />
      <Skeleton className="mt-3 h-7 w-24" />
      <Skeleton className="mt-3 h-2.5 w-32" />
    </div>);

}