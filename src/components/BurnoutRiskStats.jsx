/**
 * BurnoutRiskStats Component - INC-006
 *
 * Displays burnout risk level distribution statistics using StatCard components.
 * Shows three risk levels: Low, Moderate, High with employee counts and department lists.
 *
 * Reuses: StatCard component with semantic color schemes
 */

import React from "react";
import StatCard from "./StatCard";
import { CheckCircle, AlertCircle, AlertTriangle } from "lucide-react";

/**
 * BurnoutRiskStats Component
 *
 * @param {Object} statsData - Risk statistics object
 * @param {Object} statsData.low - Low risk data {count, percentage, departments}
 * @param {Object} statsData.moderate - Moderate risk data {count, percentage, departments}
 * @param {Object} statsData.high - High risk data {count, percentage, departments}
 * @param {string} questionnaireType - 'stanford' | 'cbi' | 'olbi' (for context)
 */
export default function BurnoutRiskStats({ statsData, questionnaireType }) {
  if (!statsData) {
    return (
      <div className="text-center py-12 text-slate-500 dark:text-slate-400">
        <p>無風險統計資料</p>
      </div>
    );
  }

  // Format department list for display (max 3 departments, add "等" if more)
  const formatDepartments = (departments) => {
    if (!departments || departments.length === 0) return "無";
    if (departments.length <= 3) return departments.join("、");
    return `${departments.slice(0, 3).join("、")} 等`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Low Risk Card */}
      <StatCard
        title="低風險人數"
        value={statsData.low.count}
        subtext={`${statsData.low.percentage}% · ${formatDepartments(statsData.low.departments)}`}
        icon={CheckCircle}
        colorScheme="success"
      />

      {/* Moderate Risk Card */}
      <StatCard
        title="中度風險人數"
        value={statsData.moderate.count}
        subtext={`${statsData.moderate.percentage}% · ${formatDepartments(statsData.moderate.departments)}`}
        icon={AlertCircle}
        colorScheme="warning"
      />

      {/* High Risk Card */}
      <StatCard
        title="高風險人數"
        value={statsData.high.count}
        subtext={`${statsData.high.percentage}% · ${formatDepartments(statsData.high.departments)}`}
        icon={AlertTriangle}
        colorScheme="error"
      />
    </div>
  );
}
