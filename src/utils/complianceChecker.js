// --- Compliance Checker ---
// Pure function to check schedule compliance
// Rules:
// 1. Seven Day Rule: 連續工作 ≤ 6 天 (勞基法第36條)
// 2. Medical Twelve Day Rule: 連續工作 ≤ 12 天 (醫療業4週變形工時)

/**
 * Check schedule compliance for an employee
 * @param {Array} employeeRecords - Array of attendance records for one employee (sorted by date)
 * @returns {Object} { isViolation, consecutiveDays, violationType, details }
 */
export const checkScheduleCompliance = (employeeRecords) => {
  if (!employeeRecords || employeeRecords.length === 0) {
    return {
      isViolation: false,
      consecutiveDays: 0,
      violationType: null,
      details: null
    };
  }

  // Filter work days (workHours > 0 and not scheduled off)
  const workDays = employeeRecords.filter(record => isWorkDay(record));

  if (workDays.length === 0) {
    return {
      isViolation: false,
      consecutiveDays: 0,
      violationType: null,
      details: null
    };
  }

  // Sort by date
  const sortedWorkDays = [...workDays].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA - dateB;
  });

  // Detect consecutive work days
  const consecutiveSequences = detectConsecutiveWorkDays(sortedWorkDays);

  // Find maximum consecutive days
  const maxConsecutiveDays = Math.max(...consecutiveSequences.map(seq => seq.length), 0);

  // Check violations
  let isViolation = false;
  let violationType = null;

  if (maxConsecutiveDays > 12) {
    isViolation = true;
    violationType = '連續12天';
  } else if (maxConsecutiveDays > 6) {
    isViolation = true;
    violationType = '七休一';
  }

  return {
    isViolation,
    consecutiveDays: maxConsecutiveDays,
    violationType,
    details: isViolation ? `連續工作 ${maxConsecutiveDays} 天` : null
  };
};

/**
 * Check if a record is a work day
 * @param {Object} record - Attendance record
 * @returns {boolean}
 */
const isWorkDay = (record) => {
  // Work day criteria:
  // 1. workHours > 0
  // 2. Not scheduled off (排休)
  // 3. Not on leave (留職停薪, 病假, etc.)

  if (record.workHours <= 0) {
    return false;
  }

  // Check status field for leave markers
  if (record.status) {
    const status = record.status.toString();
    const leaveMarkers = ['排休', '留職停薪', '病假', '事假', '特休', '產假', '陪產假', '喪假'];

    for (const marker of leaveMarkers) {
      if (status.includes(marker)) {
        return false;
      }
    }
  }

  return true;
};

/**
 * Detect consecutive work day sequences
 * @param {Array} sortedWorkDays - Sorted array of work day records
 * @returns {Array} Array of consecutive sequences, each sequence is an array of records
 */
const detectConsecutiveWorkDays = (sortedWorkDays) => {
  if (sortedWorkDays.length === 0) {
    return [];
  }

  const sequences = [];
  let currentSequence = [sortedWorkDays[0]];

  for (let i = 1; i < sortedWorkDays.length; i++) {
    const currentDate = new Date(sortedWorkDays[i].date);
    const previousDate = new Date(sortedWorkDays[i - 1].date);

    // Calculate day difference
    const dayDiff = Math.floor((currentDate - previousDate) / (1000 * 60 * 60 * 24));

    if (dayDiff === 1) {
      // Consecutive day
      currentSequence.push(sortedWorkDays[i]);
    } else {
      // Break in sequence
      sequences.push(currentSequence);
      currentSequence = [sortedWorkDays[i]];
    }
  }

  // Add last sequence
  sequences.push(currentSequence);

  return sequences;
};

/**
 * Get all employees with violations
 * @param {Array} data - All attendance data
 * @returns {Array} Array of violations with employee info
 */
export const getAllViolations = (data) => {
  if (!data || data.length === 0) {
    return [];
  }

  // Group by employee
  const employeeGroups = groupByEmployee(data);

  // Check compliance for each employee
  const violations = [];

  employeeGroups.forEach((records, empId) => {
    const complianceResult = checkScheduleCompliance(records);

    if (complianceResult.isViolation) {
      violations.push({
        empId,
        name: records[0].empId, // Use empId as name if no name field
        dept: records[0].dept,
        consecutiveDays: complianceResult.consecutiveDays,
        violationType: complianceResult.violationType,
        details: complianceResult.details
      });
    }
  });

  return violations;
};

/**
 * Group records by employee ID
 * @param {Array} data - All attendance data
 * @returns {Map} Map of empId -> records array
 */
const groupByEmployee = (data) => {
  const groups = new Map();

  data.forEach(record => {
    const empId = record.empId;

    if (!groups.has(empId)) {
      groups.set(empId, []);
    }

    groups.get(empId).push(record);
  });

  return groups;
};
