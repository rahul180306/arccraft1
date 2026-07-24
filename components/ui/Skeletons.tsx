'use client';

import React from 'react';
import PremiumCard from './PremiumCard';

export function GeneralCardSkeleton({ title = 'Loading Section...' }: { title?: string }) {
  return (
    <PremiumCard className="animate-pulse flex flex-col gap-4 min-h-[220px] justify-between">
      <div className="flex items-center justify-between">
        <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-800 rounded-md" />
        <div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-3 w-5/6 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-3 w-4/6 bg-gray-200 dark:bg-gray-800 rounded" />
      </div>
      <div className="flex justify-end pt-2">
        <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 rounded-xl" />
      </div>
    </PremiumCard>
  );
}

export function EvidenceTimelineSkeleton() {
  return (
    <PremiumCard className="animate-pulse flex flex-col justify-between min-h-[340px] gap-4">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
        <div className="h-5 w-20 bg-gray-200 dark:bg-gray-800 rounded-full" />
      </div>
      <div className="space-y-4 py-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3 items-start">
            <div className="w-3 h-3 bg-gray-200 dark:bg-gray-800 rounded-full mt-1 shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 w-1/2 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-800 rounded" />
            </div>
          </div>
        ))}
      </div>
      <div className="h-9 w-full bg-gray-200 dark:bg-gray-800 rounded-2xl" />
    </PremiumCard>
  );
}

export function VideoAnalysisSkeleton() {
  return (
    <PremiumCard className="animate-pulse flex flex-col justify-between min-h-[340px] gap-4">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-4 w-40 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
        <div className="h-5 w-16 bg-gray-200 dark:bg-gray-800 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-3 my-2">
        <div className="h-28 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
        <div className="h-28 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
      </div>
      <div className="h-9 w-full bg-gray-200 dark:bg-gray-800 rounded-2xl" />
    </PremiumCard>
  );
}

export function RelationshipGraphSkeleton() {
  return (
    <PremiumCard className="animate-pulse flex flex-col justify-between min-h-[340px] gap-4">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-4 w-44 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
        <div className="h-5 w-24 bg-gray-200 dark:bg-gray-800 rounded-full" />
      </div>
      <div className="h-36 bg-gray-200 dark:bg-gray-800 rounded-2xl my-2 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-gray-300 dark:border-gray-700" />
      </div>
      <div className="h-9 w-full bg-gray-200 dark:bg-gray-800 rounded-2xl" />
    </PremiumCard>
  );
}
