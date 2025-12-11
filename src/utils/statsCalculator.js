// --- Statistics Calculator ---
// 從 v1.jsx Lines 267-330 遷移

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

  return {
    totalEmployees,
    totalWorkHours: totalWorkHours.toFixed(1),
    totalOTHours: totalOTHours.toFixed(1),
    avgHoursPerEmp: (totalWorkHours / totalEmployees).toFixed(1),
    totalLate,
    deptChartData,
    trendChartData,
    pieData,
    suggestions
  };
};
