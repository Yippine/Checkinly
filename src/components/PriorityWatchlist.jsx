import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Card from './Card';
import EmployeeRiskCard from './EmployeeRiskCard';

/**
 * Priority Watchlist Component
 * Displays top 5 high-risk employees in a scrollable list
 */
const PriorityWatchlist = ({ topRiskEmployees }) => {
  // Count by risk level
  const criticalCount = topRiskEmployees.filter(e => e.riskLevel === 'critical').length;
  const warningCount = topRiskEmployees.filter(e => e.riskLevel === 'warning').length;

  return (
    <Card className="flex flex-col" animated={true}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-200 dark:border-slate-700 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <AlertTriangle size={18} className="text-warning-500 dark:text-warning-400" strokeWidth={2} />
          <h3 className="text-heading-3 text-slate-900 dark:text-slate-100 dark:text-slate-100 font-semibold">
            優先關注名單
          </h3>
        </div>
        <div className="flex gap-1">
          {criticalCount > 0 && (
            <span className="bg-error-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {criticalCount}
            </span>
          )}
          {warningCount > 0 && (
            <span className="bg-warning-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {warningCount}
            </span>
          )}
        </div>
      </div>

      {/* Employee List */}
      {topRiskEmployees.length > 0 ? (
        <div className="space-y-2 overflow-y-auto max-h-[600px] pr-1 custom-scrollbar">
          {topRiskEmployees.map((employee, index) => (
            <EmployeeRiskCard key={`${employee.empId}-${index}`} employee={employee} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-success-50 flex items-center justify-center mx-auto mb-3">
            <AlertTriangle size={28} className="text-success-500" strokeWidth={2} />
          </div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
            無高風險員工
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            目前所有員工狀態良好
          </p>
        </div>
      )}

      {/* Footer Note */}
      {topRiskEmployees.length > 0 && (
        <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
            顯示風險分數最高的 {Math.min(topRiskEmployees.length, 5)} 位員工
          </p>
        </div>
      )}
    </Card>
  );
};

export default PriorityWatchlist;
