/**
 * Mock Burnout Data Generator - INC-006
 *
 * Generates realistic mock burnout assessment data based on actual department structure.
 * Supports three questionnaire types: Stanford, CBI, and OLBI.
 *
 * Data Source: Based on department structure from 11401-10.xlsx
 * Time Range: 2025-01 ~ 2025-10 (10 months)
 *
 * Future Extension: Can be replaced with realBurnoutData.js to read from localStorage
 */

/**
 * Department list from actual organization structure (11401-10.xlsx)
 * 6 departments with varying stress levels
 */
const DEPARTMENTS = [
  { name: "護理部", stress: "high", baseScore: 3.5 },
  { name: "醫療部", stress: "high", baseScore: 3.3 },
  { name: "檢驗部", stress: "medium", baseScore: 2.8 },
  { name: "藥劑部", stress: "medium", baseScore: 2.5 },
  { name: "行政部", stress: "low", baseScore: 2.0 },
  { name: "資訊部", stress: "low", baseScore: 1.8 },
];

/**
 * Generate month labels from 2025-01 to 2025-10
 */
const MONTHS = Array.from({ length: 10 }, (_, i) => {
  const month = (i + 1).toString().padStart(2, "0");
  return `2025-${month}`;
});

/**
 * Risk level thresholds for different questionnaires
 */
const RISK_THRESHOLDS = {
  stanford: {
    low: { max: 2, label: "低風險" },
    moderate: { min: 2.01, max: 3.5, label: "中度風險" },
    high: { min: 3.51, label: "高風險" },
  },
  cbi: {
    low: { max: 50, label: "低風險" },
    moderate: { min: 50.01, max: 74, label: "中度風險" },
    high: { min: 74.01, label: "高風險" },
  },
  olbi: {
    low: { max: 2.25, label: "低風險" },
    moderate: { min: 2.26, max: 2.99, label: "中度風險" },
    high: { min: 3.0, label: "高風險" },
  },
};

/**
 * Generate random number within range
 */
function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Generate Stanford scores (1-5 scale) with slight upward trend
 */
function generateStanfordScores(department, monthIndex) {
  const { baseScore } = department;
  const trend = monthIndex * 0.02; // Slight increase over time (seasonal burnout)
  const noise = randomInRange(-0.3, 0.3); // Random variation
  const score = baseScore + trend + noise;

  // Clamp to valid range [1, 5]
  return Math.max(1, Math.min(5, score));
}

/**
 * Generate CBI scores (0-100 scale) for three subscales
 */
function generateCBIScores(department, monthIndex) {
  const { baseScore } = department;
  // Convert Stanford 1-5 scale to CBI 0-100 scale
  const baseCBI = (baseScore / 5) * 100;
  const trend = monthIndex * 0.5;
  const noise = randomInRange(-5, 5);

  const personalBurnout = Math.max(0, Math.min(100, baseCBI + trend + noise));
  const workBurnout = Math.max(
    0,
    Math.min(100, baseCBI + trend + randomInRange(-8, 8))
  );
  const clientBurnout = Math.max(
    0,
    Math.min(100, baseCBI * 0.9 + trend + randomInRange(-10, 10))
  );

  return {
    personalBurnout: parseFloat(personalBurnout.toFixed(1)),
    workBurnout: parseFloat(workBurnout.toFixed(1)),
    clientBurnout: parseFloat(clientBurnout.toFixed(1)),
  };
}

/**
 * Generate OLBI scores (1-4 scale) for two dimensions
 */
function generateOLBIScores(department, monthIndex) {
  const { baseScore } = department;
  // Convert Stanford 1-5 scale to OLBI 1-4 scale
  const baseOLBI = (baseScore / 5) * 4;
  const trend = monthIndex * 0.015;
  const noise = randomInRange(-0.2, 0.2);

  const exhaustion = Math.max(1, Math.min(4, baseOLBI + trend + noise));
  const disengagement = Math.max(
    1,
    Math.min(4, baseOLBI + trend + randomInRange(-0.3, 0.3))
  );

  return {
    exhaustion: parseFloat(exhaustion.toFixed(2)),
    disengagement: parseFloat(disengagement.toFixed(2)),
  };
}

/**
 * Calculate risk level based on score and questionnaire type
 */
function calculateRiskLevel(score, questionnaireType) {
  const thresholds = RISK_THRESHOLDS[questionnaireType];

  if (score <= thresholds.low.max) return "low";
  if (score <= thresholds.moderate.max) return "moderate";
  return "high";
}

/**
 * Calculate average score for CBI (average of three subscales)
 */
function calculateCBIAverage(scores) {
  return (
    (scores.personalBurnout + scores.workBurnout + scores.clientBurnout) / 3
  );
}

/**
 * Calculate average score for OLBI (average of two dimensions)
 */
function calculateOLBIAverage(scores) {
  return (scores.exhaustion + scores.disengagement) / 2;
}

/**
 * Generate trend data for all departments across all months
 */
function generateTrendData(questionnaireType) {
  const trendData = [];

  DEPARTMENTS.forEach((department) => {
    MONTHS.forEach((month, monthIndex) => {
      let dataPoint = {
        department: department.name,
        month,
        employeeCount: Math.floor(randomInRange(15, 50)), // Random employee count
      };

      if (questionnaireType === "stanford") {
        dataPoint.avgScore = parseFloat(
          generateStanfordScores(department, monthIndex).toFixed(2)
        );
      } else if (questionnaireType === "cbi") {
        const cbiScores = generateCBIScores(department, monthIndex);
        dataPoint = { ...dataPoint, ...cbiScores };
        dataPoint.avgScore = parseFloat(
          calculateCBIAverage(cbiScores).toFixed(1)
        );
      } else if (questionnaireType === "olbi") {
        const olbiScores = generateOLBIScores(department, monthIndex);
        dataPoint = { ...dataPoint, ...olbiScores };
        dataPoint.avgScore = parseFloat(
          calculateOLBIAverage(olbiScores).toFixed(2)
        );
      }

      trendData.push(dataPoint);
    });
  });

  return trendData;
}

/**
 * Calculate risk statistics from trend data (latest month data)
 */
function calculateRiskStats(trendData, questionnaireType) {
  // Get latest month data for each department
  const latestMonth = MONTHS[MONTHS.length - 1];
  const latestData = trendData.filter((d) => d.month === latestMonth);

  // Initialize risk counters
  const riskStats = {
    low: { count: 0, departments: [], totalEmployees: 0 },
    moderate: { count: 0, departments: [], totalEmployees: 0 },
    high: { count: 0, departments: [], totalEmployees: 0 },
  };

  // Calculate risk levels for each department
  latestData.forEach((data) => {
    const riskLevel = calculateRiskLevel(data.avgScore, questionnaireType);
    riskStats[riskLevel].count += data.employeeCount;
    riskStats[riskLevel].departments.push(data.department);
    riskStats[riskLevel].totalEmployees += data.employeeCount;
  });

  // Calculate total employees
  const totalEmployees = latestData.reduce(
    (sum, d) => sum + d.employeeCount,
    0
  );

  // Calculate percentages
  Object.keys(riskStats).forEach((level) => {
    riskStats[level].percentage = Math.round(
      (riskStats[level].count / totalEmployees) * 100
    );
  });

  return riskStats;
}

/**
 * Main function: Generate complete mock burnout data
 *
 * @param {string} questionnaireType - 'stanford' | 'cbi' | 'olbi'
 * @returns {Object} { trendData: Array, statsData: Object }
 *
 * @example
 * const mockData = generateMockBurnoutData('stanford');
 * // Returns:
 * // {
 * //   trendData: [
 * //     { department: "護理部", month: "2025-01", avgScore: 3.2, employeeCount: 45 },
 * //     ...
 * //   ],
 * //   statsData: {
 * //     low: { count: 50, percentage: 20, departments: ["行政部", "資訊部"] },
 * //     moderate: { count: 100, percentage: 40, departments: ["藥劑部", "檢驗部"] },
 * //     high: { count: 100, percentage: 40, departments: ["護理部", "醫療部"] }
 * //   }
 * // }
 */
export function generateMockBurnoutData(questionnaireType = "stanford") {
  // Validate questionnaire type
  const validTypes = ["stanford", "cbi", "olbi"];
  if (!validTypes.includes(questionnaireType)) {
    console.warn(
      `[mockBurnoutData] Invalid questionnaire type: ${questionnaireType}. Defaulting to 'stanford'.`
    );
    questionnaireType = "stanford";
  }

  // Generate trend data
  const trendData = generateTrendData(questionnaireType);

  // Calculate risk statistics
  const statsData = calculateRiskStats(trendData, questionnaireType);

  return {
    trendData,
    statsData,
    metadata: {
      questionnaireType,
      generatedAt: new Date().toISOString(),
      departmentCount: DEPARTMENTS.length,
      monthCount: MONTHS.length,
      dataSource: "mock",
    },
  };
}

/**
 * Future Extension Interface: Real Data Reader
 *
 * Replace this function with the following implementation to read from localStorage:
 *
 * export function getRealBurnoutData(questionnaireType) {
 *   const storageKey = `burnout_${questionnaireType}`;
 *   const responses = JSON.parse(localStorage.getItem(storageKey)) || [];
 *
 *   // Calculate department averages from real responses
 *   const trendData = calculateDepartmentTrends(responses);
 *   const statsData = calculateRiskStats(responses);
 *
 *   return { trendData, statsData };
 * }
 *
 * Then update BurnoutAssessment.jsx:
 * import { getRealBurnoutData } from '../utils/realBurnoutData';
 * const data = getRealBurnoutData(activeQuestionnaire);
 */
