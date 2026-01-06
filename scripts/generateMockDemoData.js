/**
 * Generate mock-demo-with-violations.xlsx
 * Purpose: Create test data with Bradford scores, violations, mood scores, and risk levels
 *
 * Formula: DataGeneration = EmployeePool × RiskDistribution × MetricsCalculation
 * where:
 *   EmployeePool = 25 employees
 *   RiskDistribution = green(10) + yellow(10) + red(5)
 *   MetricsCalculation = BradfordScore × ViolationCount × MoodScore × RiskScore
 */

import xlsx from 'xlsx';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Employee pool configuration
const DEPARTMENTS = ['急診室', '內科', '外科', '兒科', '護理部'];
const STATUS_TYPES = ['正常出勤', '遲到', '早退', '病假', '事假', '休假'];

// Risk distribution according to plan
const EMPLOYEES = {
  green: Array.from({ length: 10 }, (_, i) => ({
    id: `E${String(i + 1).padStart(3, '0')}`,
    name: `員工${String(i + 1).padStart(3, '0')}`,
    dept: DEPARTMENTS[i % 5],
    bradfordTarget: Math.floor(Math.random() * 20), // 0-20
    violationTarget: 0,
    moodRange: [8, 10]
  })),
  yellow: Array.from({ length: 10 }, (_, i) => ({
    id: `E${String(i + 11).padStart(3, '0')}`,
    name: `員工${String(i + 11).padStart(3, '0')}`,
    dept: DEPARTMENTS[i % 5],
    bradfordTarget: 30 + Math.floor(Math.random() * 50), // 30-80
    violationTarget: i % 3 === 0 ? 1 : 0, // 部分員工有違規
    moodRange: [5, 7]
  })),
  red: Array.from({ length: 5 }, (_, i) => ({
    id: `E${String(i + 21).padStart(3, '0')}`,
    name: `員工${String(i + 21).padStart(3, '0')}`,
    dept: DEPARTMENTS[i % 5],
    bradfordTarget: 100 + Math.floor(Math.random() * 200), // 100-300
    violationTarget: 1 + Math.floor(Math.random() * 2), // 1-2
    moodRange: [1, 4]
  }))
};

const ALL_EMPLOYEES = [...EMPLOYEES.green, ...EMPLOYEES.yellow, ...EMPLOYEES.red];

// Date range: 6 months (2025-07-01 to 2025-12-31)
const START_DATE = new Date('2025-07-01');
const END_DATE = new Date('2025-12-31');

function getDatesBetween(start, end) {
  const dates = [];
  const current = new Date(start);
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

function calculateBradfordScenario(targetScore) {
  // Bradford = S² × D
  // Calculate reasonable S and D values
  if (targetScore === 0) return { spells: 0, days: 0 };

  // Try to find reasonable S and D
  for (let s = 1; s <= 10; s++) {
    const d = Math.round(targetScore / (s * s));
    if (d > 0 && d <= 20 && Math.abs(s * s * d - targetScore) < 20) {
      return { spells: s, days: d };
    }
  }

  // Fallback
  const s = Math.ceil(Math.sqrt(targetScore / 5));
  const d = Math.round(targetScore / (s * s));
  return { spells: s, days: Math.max(1, d) };
}

function generateAttendanceData() {
  const dates = getDatesBetween(START_DATE, END_DATE);
  const records = [];

  for (const employee of ALL_EMPLOYEES) {
    const bradford = calculateBradfordScenario(employee.bradfordTarget);
    const sickLeaveDates = [];

    // Distribute sick leaves across the period
    if (bradford.spells > 0) {
      const daysPerSpell = Math.floor(bradford.days / bradford.spells);
      const remainingDays = bradford.days % bradford.spells;

      for (let spell = 0; spell < bradford.spells; spell++) {
        const spellDays = daysPerSpell + (spell < remainingDays ? 1 : 0);
        const startIndex = Math.floor(dates.length / bradford.spells) * spell;

        for (let d = 0; d < spellDays; d++) {
          if (startIndex + d < dates.length) {
            sickLeaveDates.push(dates[startIndex + d].toISOString().split('T')[0]);
          }
        }
      }
    }

    // Generate violation dates (consecutive work days)
    const violationDates = [];
    if (employee.violationTarget > 0) {
      const violationLength = employee.violationTarget === 1 ? 8 : (employee.violationTarget === 2 ? 13 : 9);
      const startIndex = Math.floor(dates.length * 0.6); // Start violations in later months

      for (let d = 0; d < violationLength && startIndex + d < dates.length; d++) {
        violationDates.push(dates[startIndex + d].toISOString().split('T')[0]);
      }
    }

    // Generate daily records
    let consecutiveWorkDays = 0;

    for (const date of dates) {
      const dateStr = date.toISOString().split('T')[0];
      const dayOfWeek = date.getDay();

      let status = '正常出勤';
      let workHours = 8;
      let otHours = 0;
      let isLate = 0;
      let isEarly = 0;
      let mood = Math.floor(Math.random() * (employee.moodRange[1] - employee.moodRange[0] + 1)) + employee.moodRange[0];

      // Weekend (default rest day unless violation)
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        if (!violationDates.includes(dateStr)) {
          status = '休假';
          workHours = 0;
          consecutiveWorkDays = 0;
        } else {
          consecutiveWorkDays++;
          // High OT for violation days
          otHours = Math.floor(Math.random() * 4) + 2;
        }
      }
      // Sick leave
      else if (sickLeaveDates.includes(dateStr)) {
        status = '病假';
        workHours = 0;
        consecutiveWorkDays = 0;
        mood = Math.max(1, mood - 2); // Lower mood on sick days
      }
      // Normal work day
      else {
        consecutiveWorkDays++;

        // Random variations
        if (Math.random() < 0.1) {
          isLate = Math.floor(Math.random() * 30) + 5;
        }
        if (Math.random() < 0.05) {
          isEarly = Math.floor(Math.random() * 30) + 5;
        }

        // OT based on risk level
        if (employee.bradfordTarget > 100) {
          // Red zone: high OT
          otHours = Math.random() < 0.5 ? Math.floor(Math.random() * 4) + 2 : 0;
        } else if (employee.bradfordTarget > 30) {
          // Yellow zone: moderate OT
          otHours = Math.random() < 0.3 ? Math.floor(Math.random() * 3) + 1 : 0;
        } else {
          // Green zone: minimal OT
          otHours = Math.random() < 0.1 ? Math.floor(Math.random() * 2) + 1 : 0;
        }
      }

      records.push({
        '部門名稱': employee.dept,
        '員工編號': employee.id,
        '員工姓名': employee.name,
        '日期': dateStr,
        '狀態': status,
        '實到工時': workHours,
        '加班時數': otHours,
        '遲到': isLate,
        '早退': isEarly,
        '心情指數': mood
      });
    }
  }

  return records;
}

function main() {
  console.log('🚀 Generating mock-demo-with-violations.xlsx...\n');

  console.log('📊 Employee Distribution:');
  console.log(`   Green Zone: ${EMPLOYEES.green.length} employees (Bradford 0-20, No violations, Mood 8-10)`);
  console.log(`   Yellow Zone: ${EMPLOYEES.yellow.length} employees (Bradford 30-80, Some violations, Mood 5-7)`);
  console.log(`   Red Zone: ${EMPLOYEES.red.length} employees (Bradford 100-300, 1-2 violations, Mood 1-4)`);
  console.log(`   Total: ${ALL_EMPLOYEES.length} employees\n`);

  console.log('📅 Date Range: 2025-07-01 to 2025-12-31 (6 months)\n');

  console.log('⚙️  Generating attendance data...');
  const records = generateAttendanceData();

  console.log(`✅ Generated ${records.length} records\n`);

  // Create workbook
  const ws = xlsx.utils.json_to_sheet(records);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, '出勤記錄');

  // Save file
  const outputPath = join(__dirname, '..', 'data', 'attendance', 'mock-demo-with-violations.xlsx');
  xlsx.writeFile(wb, outputPath);

  console.log(`💾 Saved to: ${outputPath}\n`);

  // Summary statistics
  console.log('📈 Summary:');
  const employeesWithViolations = ALL_EMPLOYEES.filter(e => e.violationTarget > 0);
  console.log(`   Employees with violations: ${employeesWithViolations.length}`);
  console.log(`   Total sick leave spells: ${ALL_EMPLOYEES.reduce((sum, e) => {
    const bradford = calculateBradfordScenario(e.bradfordTarget);
    return sum + bradford.spells;
  }, 0)}`);
  console.log(`   Average Bradford target: ${(ALL_EMPLOYEES.reduce((sum, e) => sum + e.bradfordTarget, 0) / ALL_EMPLOYEES.length).toFixed(1)}\n`);

  console.log('✨ Data generation complete!');
  console.log('📝 Next steps:');
  console.log('   1. Upload this file to Checkinly');
  console.log('   2. Verify avgBradfordScore > 0');
  console.log('   3. Verify violationCount > 0');
  console.log('   4. Verify HealthWeatherBar displays correctly');
}

main();
