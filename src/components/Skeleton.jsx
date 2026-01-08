// --- Skeleton Component ---
// Loading skeleton screens for various UI elements
// Provides visual feedback during data loading

import React from 'react';

// KPI Card Skeleton
export const KPISkeleton = () => (
  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-card dark:shadow-slate-900/50 border border-border-light dark:border-slate-700 p-6 animate-pulse">
    <div className="flex items-start justify-between">
      <div className="flex-1 space-y-3">
        {/* Title */}
        <div className="w-24 h-4 bg-neutral-200 dark:bg-slate-700 rounded"></div>
        {/* Value */}
        <div className="w-32 h-10 bg-neutral-200 dark:bg-slate-700 rounded"></div>
        {/* Subtext */}
        <div className="w-28 h-3 bg-neutral-100 dark:bg-slate-700 rounded"></div>
      </div>
      {/* Icon */}
      <div className="w-12 h-12 bg-neutral-200 dark:bg-slate-700 rounded-lg"></div>
    </div>
  </div>
);

// Chart Skeleton
export const ChartSkeleton = () => (
  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-card dark:shadow-slate-900/50 border border-border-light dark:border-slate-700 p-6 animate-pulse">
    {/* Title */}
    <div className="w-40 h-5 bg-neutral-200 dark:bg-slate-700 rounded mb-6"></div>
    {/* Chart Area */}
    <div className="w-full h-64 sm:h-80 bg-neutral-100 dark:bg-slate-700 rounded-lg"></div>
  </div>
);

// Table Skeleton
export const TableSkeleton = ({ rows = 5 }) => (
  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-card dark:shadow-slate-900/50 border border-border-light dark:border-slate-700 overflow-hidden animate-pulse">
    {/* Table Header */}
    <div className="bg-neutral-50 dark:bg-slate-700 h-12 border-b-2 border-neutral-200 dark:border-slate-600"></div>
    {/* Table Rows */}
    <div className="divide-y divide-neutral-100 dark:divide-slate-700">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-neutral-50/50 dark:bg-slate-700/50"></div>
      ))}
    </div>
  </div>
);

// Card Skeleton
export const CardSkeleton = () => (
  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-card dark:shadow-slate-900/50 border border-border-light dark:border-slate-700 p-6 animate-pulse">
    <div className="space-y-4">
      <div className="w-3/4 h-5 bg-neutral-200 dark:bg-slate-700 rounded"></div>
      <div className="w-full h-4 bg-neutral-100 dark:bg-slate-700 rounded"></div>
      <div className="w-5/6 h-4 bg-neutral-100 dark:bg-slate-700 rounded"></div>
      <div className="w-4/5 h-4 bg-neutral-100 dark:bg-slate-700 rounded"></div>
    </div>
  </div>
);

// List Skeleton
export const ListSkeleton = ({ items = 3 }) => (
  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-card dark:shadow-slate-900/50 border border-border-light dark:border-slate-700 p-6 animate-pulse">
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-4 h-4 bg-neutral-200 dark:bg-slate-700 rounded-full"></div>
          <div className="flex-1 h-4 bg-neutral-100 dark:bg-slate-700 rounded"></div>
        </div>
      ))}
    </div>
  </div>
);

export default {
  KPISkeleton,
  ChartSkeleton,
  TableSkeleton,
  CardSkeleton,
  ListSkeleton,
};
