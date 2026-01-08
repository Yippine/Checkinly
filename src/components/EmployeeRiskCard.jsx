import React from 'react';

/**
 * Employee Risk Card Component
 * Displays individual employee risk information with color-coded avatar
 */
const EmployeeRiskCard = ({ employee }) => {
  const { empId, dept, riskScore, riskLevel, reasons } = employee;

  // Get color scheme based on risk level
  const getColorScheme = () => {
    switch (riskLevel) {
      case 'critical':
        return {
          avatar: 'bg-error-100 text-error-700 border-error-200',
          score: 'text-error-600 dark:text-error-400',
          border: 'border-error-200 dark:border-error-800',
          hover: 'hover:bg-error-50 dark:hover:bg-error-900/20'
        };
      case 'warning':
        return {
          avatar: 'bg-warning-100 text-warning-700 border-warning-200',
          score: 'text-warning-600 dark:text-warning-400',
          border: 'border-warning-200 dark:border-warning-800',
          hover: 'hover:bg-warning-50 dark:hover:bg-warning-900/20'
        };
      default:
        return {
          avatar: 'bg-success-100 text-success-700 border-success-200',
          score: 'text-success-600 dark:text-success-400',
          border: 'border-success-200 dark:border-success-800',
          hover: 'hover:bg-success-50 dark:hover:bg-success-900/20'
        };
    }
  };

  const colors = getColorScheme();

  // Get initial letter for avatar
  const initial = empId ? empId[0].toUpperCase() : '?';

  return (
    <div
      className={`p-3 rounded-lg border ${colors.border} ${colors.hover} transition-all duration-200 hover:shadow-sm`}
    >
      <div className="flex items-start gap-3 mb-2">
        {/* Avatar with initial */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 ${colors.avatar} flex-shrink-0`}>
          {initial}
        </div>

        {/* Employee Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
              {empId}
            </h4>
            <span className={`text-sm font-bold ${colors.score} flex-shrink-0`}>
              {riskScore}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
            {dept}
          </p>
        </div>
      </div>

      {/* Risk Reasons */}
      <div className="mt-2 space-y-1">
        {reasons.map((reason, index) => (
          <div
            key={index}
            className="text-xs text-slate-600 dark:text-slate-300 bg-neutral-50 dark:bg-slate-700 px-2 py-1 rounded"
          >
            {reason}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeRiskCard;
