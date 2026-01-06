#!/usr/bin/env node

/**
 * Mood Data Generation Script for INC-004
 *
 * Workflow Formula: DirectorySetup -> DataMigration -> TestDataGeneration -> Validation
 * Implementation Formula: TechStack(Node.js + xlsx 0.18.5) × SystemDesign × CodeStructure(8_functions)
 *
 * Purpose:
 * - Load original attendance Excel file (11401-10.xlsx)
 * - Calculate risk factors (overtime hours, sick leave days, consecutive work days)
 * - Generate intelligent mood scores (1-10) based on risk levels
 * - Add ±1 random fluctuation for realism
 * - Export enhanced file with mood index column
 *
 * Architecture:
 * 8 Functions: loadExcel -> calculateStats -> assessRisk -> mapScore -> addNoise -> clamp -> injectColumn -> saveExcel
 */

import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration Constants
const CONFIG = {
  INPUT_FILE: path.join(__dirname, '../data/attendance/11401-10.xlsx'),
  OUTPUT_FILE: path.join(__dirname, '../data/attendance/11401-10-with-mood.xlsx'),
  MOOD_COLUMN_NAME: '心情指數',
  MOOD_COLUMN_EN: 'Mood Score',

  // Risk Assessment Thresholds
  RISK_THRESHOLDS: {
    HIGH_OT_HOURS: 80,      // > 80h = high risk
    MEDIUM_OT_HOURS: 40,    // 40-80h = medium risk
    HIGH_SICK_DAYS: 5,      // > 5 days = high risk
    MEDIUM_SICK_DAYS: 2,    // 2-5 days = medium risk
    HIGH_CONSECUTIVE: 10,   // > 10 days = high risk
    MEDIUM_CONSECUTIVE: 7   // 7-10 days = medium risk
  },

  // Mood Score Ranges
  MOOD_RANGES: {
    HIGH_RISK: { min: 3, max: 5 },      // Red zone
    MEDIUM_RISK: { min: 5, max: 7 },    // Yellow zone
    NORMAL: { min: 7, max: 9 }          // Green zone
  },

  // Noise parameters
  NOISE_AMPLITUDE: 1  // ±1 random fluctuation
};

/**
 * Function 1: Load Excel File
 * Formula: loadExcel(filePath) -> workbook
 */
function loadExcel(filePath) {
  try {
    console.log(`[loadExcel] Reading file: ${filePath}`);
    const workbook = XLSX.readFile(filePath);
    console.log(`[loadExcel] Success. Sheets: ${workbook.SheetNames.join(', ')}`);
    return workbook;
  } catch (error) {
    console.error(`[loadExcel] ERROR: ${error.message}`);
    throw new Error(`Failed to load Excel file: ${error.message}`);
  }
}

/**
 * Function 2: Calculate Employee Statistics
 * Formula: calculateStats(records) -> {overtimeHours, sickDays, consecutiveWorkDays}
 */
function calculateStats(records) {
  console.log(`[calculateStats] Processing ${records.length} records`);

  const employeeStats = new Map();

  records.forEach((record, index) => {
    const empId = record['員工編號'];
    if (!empId) return; // Skip empty rows

    if (!employeeStats.has(empId)) {
      employeeStats.set(empId, {
        empId,
        overtimeHours: 0,
        sickDays: 0,
        workDates: [],
        records: []
      });
    }

    const stats = employeeStats.get(empId);
    stats.records.push(record);

    // Parse overtime hours from "加班紀錄" field
    const otRecord = record['加班紀錄'];
    if (otRecord) {
      const match = otRecord.toString().match(/([0-9.]+)H/);
      if (match) {
        stats.overtimeHours += parseFloat(match[1]);
      }
    }

    // Detect sick leave from "狀態" field
    const status = record['狀態'];
    if (status && status.includes('病假')) {
      stats.sickDays += 1;
    }

    // Collect work dates for consecutive day calculation
    const date = record['日期'];
    if (date && record['實到工時'] > 0) {
      stats.workDates.push(date);
    }
  });

  // Calculate consecutive work days for each employee
  employeeStats.forEach((stats, empId) => {
    stats.consecutiveWorkDays = calculateConsecutiveWorkDays(stats.workDates);
  });

  console.log(`[calculateStats] Processed ${employeeStats.size} employees`);
  return employeeStats;
}

/**
 * Helper: Calculate Consecutive Work Days
 * Formula: calculateConsecutiveWorkDays(dates) -> maxConsecutiveDays
 */
function calculateConsecutiveWorkDays(dates) {
  if (dates.length === 0) return 0;

  // Sort dates
  const sortedDates = dates.map(d => new Date(d)).sort((a, b) => a - b);

  let maxConsecutive = 1;
  let currentConsecutive = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const diffDays = (sortedDates[i] - sortedDates[i - 1]) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      currentConsecutive++;
      maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
    } else if (diffDays > 1) {
      currentConsecutive = 1;
    }
  }

  return maxConsecutive;
}

/**
 * Function 3: Assess Risk Level
 * Formula: assessRisk({overtimeHours, sickDays, consecutiveWorkDays}) -> ('high' | 'medium' | 'normal')
 */
function assessRisk(stats) {
  const { overtimeHours, sickDays, consecutiveWorkDays } = stats;
  const { RISK_THRESHOLDS } = CONFIG;

  // High risk conditions (any one triggers high risk)
  if (
    overtimeHours > RISK_THRESHOLDS.HIGH_OT_HOURS ||
    sickDays > RISK_THRESHOLDS.HIGH_SICK_DAYS ||
    consecutiveWorkDays > RISK_THRESHOLDS.HIGH_CONSECUTIVE
  ) {
    return 'high';
  }

  // Medium risk conditions
  if (
    overtimeHours > RISK_THRESHOLDS.MEDIUM_OT_HOURS ||
    sickDays > RISK_THRESHOLDS.MEDIUM_SICK_DAYS ||
    consecutiveWorkDays > RISK_THRESHOLDS.MEDIUM_CONSECUTIVE
  ) {
    return 'medium';
  }

  return 'normal';
}

/**
 * Function 4: Map Risk to Mood Score
 * Formula: mapScore(riskLevel) -> baseMoodScore
 */
function mapScore(riskLevel) {
  const { MOOD_RANGES } = CONFIG;

  const range = MOOD_RANGES[riskLevel.toUpperCase()] || MOOD_RANGES.NORMAL;

  // Generate random score within range
  const score = range.min + Math.random() * (range.max - range.min);

  return score;
}

/**
 * Function 5: Add Random Noise
 * Formula: addNoise(score, amplitude) -> noisyScore
 */
function addNoise(score, amplitude = CONFIG.NOISE_AMPLITUDE) {
  const noise = (Math.random() - 0.5) * 2 * amplitude; // Range: [-amplitude, +amplitude]
  return score + noise;
}

/**
 * Function 6: Clamp Score to Valid Range
 * Formula: clamp(score, min, max) -> clampedScore
 */
function clamp(score, min = 1, max = 10) {
  return Math.max(min, Math.min(max, score));
}

/**
 * Function 7: Inject Mood Column into Records
 * Formula: injectColumn(records, employeeStats) -> recordsWithMood
 */
function injectColumn(records, employeeStats) {
  console.log(`[injectColumn] Injecting mood scores into ${records.length} records`);

  let injectedCount = 0;

  const enhancedRecords = records.map(record => {
    const empId = record['員工編號'];

    if (!empId) {
      // Empty row, no mood score
      return { ...record, [CONFIG.MOOD_COLUMN_NAME]: '' };
    }

    const stats = employeeStats.get(empId);
    if (!stats) {
      console.warn(`[injectColumn] WARNING: No stats found for employee ${empId}`);
      return { ...record, [CONFIG.MOOD_COLUMN_NAME]: '' };
    }

    // Generate mood score pipeline:
    // assessRisk -> mapScore -> addNoise -> clamp
    const riskLevel = assessRisk(stats);
    const baseScore = mapScore(riskLevel);
    const noisyScore = addNoise(baseScore);
    const finalScore = clamp(noisyScore);

    // Round to 1 decimal place
    const roundedScore = Math.round(finalScore * 10) / 10;

    injectedCount++;

    return {
      ...record,
      [CONFIG.MOOD_COLUMN_NAME]: roundedScore
    };
  });

  console.log(`[injectColumn] Successfully injected ${injectedCount} mood scores`);
  return enhancedRecords;
}

/**
 * Function 8: Save Enhanced Excel File
 * Formula: saveExcel(records, filePath) -> success
 */
function saveExcel(records, filePath) {
  try {
    console.log(`[saveExcel] Creating new workbook with ${records.length} records`);

    // Create new workbook
    const newWorkbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(records);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(newWorkbook, worksheet, 'Sheet1');

    // Write to file
    XLSX.writeFile(newWorkbook, filePath);

    console.log(`[saveExcel] Success! File saved to: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`[saveExcel] ERROR: ${error.message}`);
    throw new Error(`Failed to save Excel file: ${error.message}`);
  }
}

/**
 * Main Execution Pipeline
 * Formula: loadExcel -> calculateStats -> injectColumn -> saveExcel
 */
function main() {
  console.log('='.repeat(80));
  console.log('Mood Data Generation Script - INC-004');
  console.log('Formula-Contract Method: TechStack × SystemDesign × CodeStructure');
  console.log('='.repeat(80));
  console.log('');

  try {
    // Step 1: Load original Excel file
    console.log('[Step 1/4] Loading original Excel file...');
    const workbook = loadExcel(CONFIG.INPUT_FILE);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Get raw data with header at first row
    const allData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Find the header row (contains "部門名稱")
    const headerRowIndex = allData.findIndex(row =>
      row.some(cell => cell && cell.toString().includes('部門名稱'))
    );

    if (headerRowIndex === -1) {
      throw new Error('Cannot find header row with "部門名稱"');
    }

    console.log(`  -> Found header row at index: ${headerRowIndex}`);

    // Extract headers and data rows
    const headers = allData[headerRowIndex];
    const dataRows = allData.slice(headerRowIndex + 1);

    // Convert to objects
    const rawData = dataRows.map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        if (header) {
          obj[header] = row[index];
        }
      });
      return obj;
    }).filter(obj => obj['員工編號']); // Filter out empty rows

    console.log(`  -> Loaded ${rawData.length} data rows from sheet: ${sheetName}`);
    console.log('');

    // Step 2: Calculate employee statistics
    console.log('[Step 2/4] Calculating employee statistics (OT, sick leave, consecutive days)...');
    const employeeStats = calculateStats(rawData);
    console.log(`  -> Statistics calculated for ${employeeStats.size} employees`);

    // Print sample statistics
    const sampleEmp = Array.from(employeeStats.values())[0];
    if (sampleEmp) {
      console.log(`  -> Sample (${sampleEmp.empId}): OT=${sampleEmp.overtimeHours}h, SickDays=${sampleEmp.sickDays}, ConsecutiveDays=${sampleEmp.consecutiveWorkDays}`);
      console.log(`  -> Risk Level: ${assessRisk(sampleEmp)}`);
    }
    console.log('');

    // Step 3: Inject mood scores
    console.log('[Step 3/4] Generating and injecting mood scores...');
    const enhancedData = injectColumn(rawData, employeeStats);
    console.log(`  -> Mood scores injected successfully`);
    console.log('');

    // Step 4: Save enhanced file
    console.log('[Step 4/4] Saving enhanced Excel file...');
    saveExcel(enhancedData, CONFIG.OUTPUT_FILE);
    console.log('');

    // Success summary
    console.log('='.repeat(80));
    console.log('SUCCESS! Mood data generation complete.');
    console.log(`Input:  ${CONFIG.INPUT_FILE}`);
    console.log(`Output: ${CONFIG.OUTPUT_FILE}`);
    console.log(`Mood Column: "${CONFIG.MOOD_COLUMN_NAME}"`);
    console.log('='.repeat(80));

  } catch (error) {
    console.error('');
    console.error('='.repeat(80));
    console.error('FATAL ERROR during execution:');
    console.error(error.message);
    console.error('='.repeat(80));
    process.exit(1);
  }
}

// Execute main function
main();

// Export functions for testing (ES module syntax)
export {
  loadExcel,
  calculateStats,
  assessRisk,
  mapScore,
  addNoise,
  clamp,
  injectColumn,
  saveExcel,
  CONFIG
};
