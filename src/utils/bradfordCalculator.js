// --- Bradford Factor Calculator ---
// Pure function to calculate Bradford Factor Score
// Formula: S² × D (S = sick leave spells, D = total sick days)
// Reference: UK HR Standard (Bradford University Research)

/**
 * Calculate Bradford Factor for an employee
 * @param {Array} employeeRecords - Array of attendance records for one employee (sorted by date)
 * @returns {Object} { bradfordScore, spellCount, totalDays, riskLevel }
 */
export const calculateBradfordFactor = (employeeRecords) => {
  if (!employeeRecords || employeeRecords.length === 0) {
    return {
      bradfordScore: 0,
      spellCount: 0,
      totalDays: 0,
      riskLevel: 'normal'
    };
  }

  // Extract sick leave records
  const sickLeaveRecords = employeeRecords.filter(record => isSickLeave(record));

  if (sickLeaveRecords.length === 0) {
    return {
      bradfordScore: 0,
      spellCount: 0,
      totalDays: 0,
      riskLevel: 'normal'
    };
  }

  // Sort by date to detect consecutive spells
  const sortedRecords = [...sickLeaveRecords].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA - dateB;
  });

  // Calculate spells (consecutive sick leave days count as 1 spell)
  let spellCount = 0;
  let totalDays = 0;
  let previousDate = null;

  sortedRecords.forEach((record) => {
    totalDays++;

    const currentDate = new Date(record.date);

    if (!previousDate) {
      // First sick leave record
      spellCount = 1;
    } else {
      // Check if consecutive (within 1 day difference)
      const dayDiff = Math.floor((currentDate - previousDate) / (1000 * 60 * 60 * 24));

      if (dayDiff > 1) {
        // New spell
        spellCount++;
      }
      // If dayDiff === 1, it's consecutive, don't increment spellCount
    }

    previousDate = currentDate;
  });

  // Calculate Bradford Score: S² × D
  const bradfordScore = Math.pow(spellCount, 2) * totalDays;

  // Classify risk level
  const riskLevel = classifyRiskLevel(bradfordScore);

  return {
    bradfordScore,
    spellCount,
    totalDays,
    riskLevel
  };
};

/**
 * Check if a record is sick leave
 * @param {Object} record - Attendance record
 * @returns {boolean}
 */
const isSickLeave = (record) => {
  // Check if status field contains "病假"
  if (record.status && record.status.includes('病假')) {
    return true;
  }

  // Alternative: check if explicitly marked
  if (record.isSickLeave === true) {
    return true;
  }

  return false;
};

/**
 * Classify risk level based on Bradford Score
 * @param {number} score - Bradford Factor Score
 * @returns {string} 'normal' | 'monitor' | 'high_risk' | 'critical'
 */
const classifyRiskLevel = (score) => {
  if (score <= 50) return 'normal';
  if (score <= 200) return 'monitor';
  if (score <= 500) return 'high_risk';
  return 'critical';
};

/**
 * Get risk level display text
 * @param {string} riskLevel
 * @returns {string}
 */
export const getRiskLevelText = (riskLevel) => {
  const textMap = {
    normal: '正常',
    monitor: '需監控',
    high_risk: '高風險',
    critical: '極高風險'
  };
  return textMap[riskLevel] || '未知';
};

/**
 * Get risk level color scheme
 * @param {string} riskLevel
 * @returns {string}
 */
export const getRiskLevelColor = (riskLevel) => {
  const colorMap = {
    normal: 'success',
    monitor: 'warning',
    high_risk: 'error',
    critical: 'error'
  };
  return colorMap[riskLevel] || 'neutral';
};
