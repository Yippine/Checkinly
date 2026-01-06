// --- Statistics Calculator ---
// 從 v1.jsx Lines 267-330 遷移

import { calculateBradfordFactor } from './bradfordCalculator';
import { checkScheduleCompliance } from './complianceChecker';
import { calculateEmployeeRiskScore, getTopRiskEmployees } from './riskCalculator';

export const calculateStats = (data) => {
  if (!data) return null;

  const totalEmployees = new Set(data.map(d => d.empId)).size;
  const totalWorkHours = data.reduce((acc, curr) => acc + curr.workHours, 0);
  const totalOTHours = data.reduce((acc, curr) => acc + curr.otHours, 0);
  const totalLate = data.filter(d => d.isLate).length;
  const totalAbsent = data.filter(d => d.isAbsent).length;

  // 部門分析
  const deptStats = {};
  data.forEach(d => {
    if (!deptStats[d.dept]) {
      deptStats[d.dept] = { name: d.dept, hours: 0, ot: 0, late: 0, count: 0 };
    }
    deptStats[d.dept].hours += d.workHours;
    deptStats[d.dept].ot += d.otHours;
    deptStats[d.dept].late += d.isLate ? 1 : 0;
    deptStats[d.dept].count += 1;
  });
  const deptChartData = Object.values(deptStats).sort((a, b) => b.hours - a.hours);

  // 日期趨勢
  const dateStats = {};
  data.forEach(d => {
    // 簡單處理日期格式，取後五碼 MM-DD 以節省空間
    const dateKey = d.date ? d.date.slice(5) : 'Unknown';
    if (!dateStats[dateKey]) {
      dateStats[dateKey] = { date: dateKey, hours: 0, ot: 0 };
    }
    dateStats[dateKey].hours += d.workHours;
    dateStats[dateKey].ot += d.otHours;
  });
  // 根據日期排序
  const trendChartData = Object.values(dateStats).sort((a, b) => a.date.localeCompare(b.date));

  // 異常分佈
  const pieData = [
    { name: '正常出勤', value: data.length - totalLate - totalAbsent },
    { name: '遲到/早退', value: totalLate },
    { name: '曠職', value: totalAbsent },
  ].filter(d => d.value > 0);

  // AI 建議生成邏輯
  const suggestions = [];
  if (totalOTHours / totalWorkHours > 0.15) suggestions.push({ type: 'warning', text: '整體加班比例超過 15%，建議檢視人力配置或工作流程。' });
  const topLateDept = deptChartData.sort((a, b) => b.late - a.late)[0];
  if (topLateDept && topLateDept.late > 5) suggestions.push({ type: 'info', text: `${topLateDept.name} 本月遲到次數達 ${topLateDept.late} 次，建議加強宣導出勤規範。` });
  const topOtDept = deptChartData.sort((a, b) => b.ot - a.ot)[0];
  if (topOtDept && topOtDept.ot > 20) suggestions.push({ type: 'warning', text: `${topOtDept.name} 加班時數顯著偏高 (${topOtDept.ot.toFixed(1)}小時)，需關注員工過勞風險。` });
  if (suggestions.length === 0) suggestions.push({ type: 'success', text: '本月出勤狀況大致良好，無顯著異常趨勢。' });

  // --- New Calculations: Bradford Factor + Compliance Check ---

  // Group by employee
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

  const employeeGroups = groupByEmployee(data);

  // Calculate Bradford Factor for each employee
  const bradfordResults = [];
  employeeGroups.forEach((records, empId) => {
    const result = calculateBradfordFactor(records);
    bradfordResults.push({
      empId,
      ...result
    });
  });

  // Calculate average Bradford Score
  const avgBradfordScore = bradfordResults.length > 0
    ? bradfordResults.reduce((sum, r) => sum + r.bradfordScore, 0) / bradfordResults.length
    : 0;

  // Check compliance for each employee
  const complianceResults = [];
  employeeGroups.forEach((records, empId) => {
    const result = checkScheduleCompliance(records);
    if (result.isViolation) {
      complianceResults.push({
        empId,
        name: records[0].empId, // Use empId as name if no name field
        dept: records[0].dept,
        consecutiveDays: result.consecutiveDays,
        violationType: result.violationType
      });
    }
  });

  // Violation count and list
  const violationCount = complianceResults.length;
  const violationList = complianceResults;

  // --- New Calculations: Risk Score + Top Risk Employees + High OT Count ---

  // Calculate risk score for each employee
  const employeeRiskScores = [];
  employeeGroups.forEach((records, empId) => {
    // Get Bradford score for this employee
    const bradfordData = bradfordResults.find(b => b.empId === empId);
    const bradfordScore = bradfordData?.bradfordScore || 0;

    // Get consecutive days for this employee
    const complianceData = checkScheduleCompliance(records);
    const consecutiveDays = complianceData.consecutiveDays || 0;

    // Calculate total OT hours
    const totalOTHours = records.reduce((sum, r) => sum + (r.otHours || 0), 0);

    // Calculate risk score
    const riskData = calculateEmployeeRiskScore({
      bradfordScore,
      totalOTHours,
      consecutiveDays
    });

    employeeRiskScores.push({
      empId,
      dept: records[0].dept,
      ...riskData
    });
  });

  // Get top 5 high-risk employees
  const topRiskEmployees = getTopRiskEmployees(employeeRiskScores, 5);

  // Calculate high OT count (> 20 hours)
  const highOTCount = employeeRiskScores.filter(emp => {
    const empRecords = employeeGroups.get(emp.empId);
    const totalOT = empRecords.reduce((sum, r) => sum + (r.otHours || 0), 0);
    return totalOT > 20;
  }).length;

  // --- INC-004: Mood Score Calculations ---

  // Filter records with mood scores
  const recordsWithMood = data.filter(r => r.moodScore !== null && r.moodScore !== undefined);

  // Calculate average mood score (overall)
  const avgMoodScore = recordsWithMood.length > 0
    ? recordsWithMood.reduce((sum, r) => sum + r.moodScore, 0) / recordsWithMood.length
    : null;

  // Calculate department-level mood statistics
  const deptMoodStats = {};
  data.forEach(d => {
    if (d.moodScore !== null && d.moodScore !== undefined) {
      if (!deptMoodStats[d.dept]) {
        deptMoodStats[d.dept] = { name: d.dept, totalMood: 0, count: 0 };
      }
      deptMoodStats[d.dept].totalMood += d.moodScore;
      deptMoodStats[d.dept].count += 1;
    }
  });

  // Calculate average mood per department
  const deptMoodData = Object.values(deptMoodStats).map(dept => ({
    name: dept.name,
    avgMood: dept.count > 0 ? (dept.totalMood / dept.count).toFixed(1) : null
  })).filter(d => d.avgMood !== null)
    .sort((a, b) => parseFloat(a.avgMood) - parseFloat(b.avgMood)); // Sort by mood (ascending)

  // Generate mood trend chart data (daily average)
  const dateMoodStats = {};
  data.forEach(d => {
    if (d.moodScore !== null && d.moodScore !== undefined && d.date) {
      const dateKey = d.date.slice(5); // MM-DD format
      if (!dateMoodStats[dateKey]) {
        dateMoodStats[dateKey] = { date: dateKey, totalMood: 0, count: 0 };
      }
      dateMoodStats[dateKey].totalMood += d.moodScore;
      dateMoodStats[dateKey].count += 1;
    }
  });

  const moodTrendData = Object.values(dateMoodStats)
    .map(d => ({
      date: d.date,
      avgMood: d.count > 0 ? parseFloat((d.totalMood / d.count).toFixed(1)) : null
    }))
    .filter(d => d.avgMood !== null)
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    totalEmployees,
    totalWorkHours: totalWorkHours.toFixed(1),
    totalOTHours: totalOTHours.toFixed(1),
    avgHoursPerEmp: (totalWorkHours / totalEmployees).toFixed(1),
    totalLate,
    deptChartData,
    trendChartData,
    pieData,
    suggestions,
    avgBradfordScore,
    violationCount,
    violationList,
    topRiskEmployees,
    highOTCount,
    // INC-004: Mood score statistics
    avgMoodScore: avgMoodScore !== null ? parseFloat(avgMoodScore.toFixed(1)) : null,
    deptMoodData,
    moodTrendData,
    hasMoodData: recordsWithMood.length > 0  // Flag to indicate if mood data is available
  };
};
