import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

export default function TableSkeleton({
  rowsCount = 5,
}: {
  rowsCount?: number
}) {
  return (
    <div className="flex flex-col">
      <Skeleton className="mb-4 mt-4 h-10 w-full max-w-sm" />
      <div className="flex w-full flex-col gap-1">
        <Skeleton className="h-12 w-full" />
        {Array.from({ length: rowsCount }).map((_, index) => (
          <Skeleton key={index} className="h-14 w-full" />
        ))}
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  )
}
