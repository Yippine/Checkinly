import React from 'react';
import { Activity, AlertTriangle, Clock } from 'lucide-react';

/**
 * Health Weather Bar Component
 * Displays key health metrics in a horizontal bar
 */
const HealthWeatherBar = ({ avgBradfordScore, violationCount, highOTCount }) => {
  // Determine status color for Bradford Score
  const getBradfordColor = () => {
    if (avgBradfordScore > 100) return 'text-error-600 dark:text-error-400';
    if (avgBradfordScore > 50) return 'text-warning-600 dark:text-warning-400';
    return 'text-success-600 dark:text-success-400';
  };

  // Determine status color for violations
  const getViolationColor = () => {
    if (violationCount > 5) return 'text-error-600 dark:text-error-400';
    if (violationCount > 0) return 'text-warning-600 dark:text-warning-400';
    return 'text-success-600 dark:text-success-400';
  };

  // Determine status color for high OT
  const getOTColor = () => {
    if (highOTCount > 10) return 'text-error-600 dark:text-error-400';
    if (highOTCount > 5) return 'text-warning-600 dark:text-warning-400';
    return 'text-success-600 dark:text-success-400';
  };

  return (
    <div className="bg-white dark:bg-slate-800 border-b border-neutral-200 dark:border-slate-700 shadow-sm dark:shadow-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8">
          {/* Metric 1: Average Bradford Score */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
              <Activity size={16} className="text-primary-600 dark:text-primary-400" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 dark:text-slate-400">平均 Bradford Score</span>
              <span className={`text-sm font-bold ${getBradfordColor()}`}>
                {avgBradfordScore?.toFixed(1) || '0.0'}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-8 bg-neutral-200 dark:bg-slate-700"></div>

          {/* Metric 2: Violation Count */}
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              violationCount > 0 ? 'bg-warning-50 dark:bg-warning-900/30' : 'bg-success-50 dark:bg-success-900/30'
            }`}>
              <AlertTriangle
                size={16}
                className={violationCount > 0 ? 'text-warning-600 dark:text-warning-400' : 'text-success-600 dark:text-success-400'}
                strokeWidth={2.5}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 dark:text-slate-400">排班違規人數</span>
              <span className={`text-sm font-bold ${getViolationColor()}`}>
                {violationCount || 0}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-8 bg-neutral-200 dark:bg-slate-700"></div>

          {/* Metric 3: High OT Count */}
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              highOTCount > 5 ? 'bg-error-50 dark:bg-error-900/30' : 'bg-success-50 dark:bg-success-900/30'
            }`}>
              <Clock
                size={16}
                className={highOTCount > 5 ? 'text-error-600 dark:text-error-400' : 'text-success-600 dark:text-success-400'}
                strokeWidth={2.5}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 dark:text-slate-400">高加班人數 (&gt;20h)</span>
              <span className={`text-sm font-bold ${getOTColor()}`}>
                {highOTCount || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthWeatherBar;
