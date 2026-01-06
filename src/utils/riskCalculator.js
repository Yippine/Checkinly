// --- Risk Score Calculator ---
// Calculates employee risk score based on Bradford Factor, OT hours, and consecutive work days
// Formula: RiskScore = Bradford×0.3 + OT×0.3 + ConsecutiveDays×0.4

/**
 * Calculate risk score for an employee
 * @param {Object} params - Employee risk parameters
 * @param {number} params.bradfordScore - Bradford Factor score
 * @param {number} params.totalOTHours - Total overtime hours
 * @param {number} params.consecutiveDays - Number of consecutive work days
 * @returns {Object} Risk score and level
 */
export const calculateEmployeeRiskScore = ({ bradfordScore, totalOTHours, consecutiveDays }) => {
  // Normalize values for weighted calculation
  // Bradford: 0-200 range (normalized to 0-100)
  // OT: 0-40 hours (normalized to 0-100)
  // ConsecutiveDays: 0-14 days (normalized to 0-100)

  const normalizedBradford = Math.min((bradfordScore / 200) * 100, 100);
  const normalizedOT = Math.min((totalOTHours / 40) * 100, 100);
  const normalizedConsecutiveDays = Math.min((consecutiveDays / 14) * 100, 100);

  // Weighted calculation: Bradford×0.3 + OT×0.3 + ConsecutiveDays×0.4
  const riskScore = (
    normalizedBradford * 0.3 +
    normalizedOT * 0.3 +
    normalizedConsecutiveDays * 0.4
  );

  // Determine risk level
  let riskLevel = 'normal';
  if (riskScore > 60) {
    riskLevel = 'critical';
  } else if (riskScore > 30) {
    riskLevel = 'warning';
  }

  // Generate risk reasons
  const reasons = [];
  if (bradfordScore > 100) {
    reasons.push(`Bradford Score ${bradfordScore.toFixed(0)} (頻繁缺勤)`);
  }
  if (totalOTHours > 20) {
    reasons.push(`加班時數 ${totalOTHours.toFixed(1)} 小時 (過度加班)`);
  }
  if (consecutiveDays > 6) {
    reasons.push(`連續工作 ${consecutiveDays} 天 (需休息)`);
  }
  if (reasons.length === 0) {
    reasons.push('狀態穩定');
  }

  return {
    riskScore: Math.round(riskScore),
    riskLevel,
    reasons,
    breakdown: {
      bradfordComponent: normalizedBradford * 0.3,
      otComponent: normalizedOT * 0.3,
      consecutiveDaysComponent: normalizedConsecutiveDays * 0.4
    }
  };
};

/**
 * Get top N high-risk employees
 * @param {Array} employeeRisks - Array of employee risk objects
 * @param {number} limit - Number of top employees to return
 * @returns {Array} Top N high-risk employees
 */
export const getTopRiskEmployees = (employeeRisks, limit = 5) => {
  return employeeRisks
    .filter(emp => emp.riskScore > 0)
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, limit);
};
