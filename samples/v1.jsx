import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import {
  Upload, FileText, AlertCircle, Clock, Users, TrendingUp,
  Briefcase, Calendar, ChevronDown, CheckCircle, XCircle
} from 'lucide-react';

// --- UI Components ---

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-100 p-6 ${className}`}>
    {children}
  </div>
);

const StatCard = ({ title, value, subtext, icon: Icon, colorClass }) => (
  <Card>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
      </div>
      <div className={`p-3 rounded-lg ${colorClass}`}>
        <Icon size={24} />
      </div>
    </div>
  </Card>
);

// --- Main Application ---

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [libsLoaded, setLibsLoaded] = useState(false);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  // 顏色配置
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  // --- Dynamic Script Loading ---
  useEffect(() => {
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    Promise.all([
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.0/papaparse.min.js'),
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js')
    ])
      .then(() => {
        setLibsLoaded(true);
      })
      .catch((err) => {
        console.error("Failed to load external libraries", err);
        setError("系統組件載入失敗，請檢查網路連線或重新整理頁面。");
      });
  }, []);

  // --- File Handling Logic ---

  const handleFileUpload = (event) => {
    if (!libsLoaded) {
      setError("系統正在初始化，請稍後再試...");
      return;
    }

    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setLoading(true);
    setError('');

    const fileExt = file.name.split('.').pop().toLowerCase();

    if (fileExt === 'csv') {
      parseCSV(file);
    } else if (['xlsx', 'xls'].includes(fileExt)) {
      parseExcel(file);
    } else {
      setError('不支援的檔案格式，請上傳 CSV 或 Excel 檔');
      setLoading(false);
    }
  };

  // 純函數：解析 Rows 並返回乾淨資料，若失敗則拋出錯誤
  const extractData = (rows) => {
    // 1. 尋找主標題列 (包含 "部門名稱")
    const headerRowIndex = rows.findIndex(row =>
      row.some(cell => cell && cell.toString().includes('部門名稱'))
    );

    if (headerRowIndex === -1) {
      throw new Error("無法識別檔案格式：找不到'部門名稱'欄位 (可能為編碼問題)");
    }

    const mainHeaders = rows[headerRowIndex].map(h => h ? h.toString().trim() : '');

    // 2. 檢查是否有子標題列 (例如 "遲到(分鐘)" 可能在下一行)
    // 您的檔案結構：Main Header 下一行可能是詳細欄位
    let subHeaders = [];
    if (rows[headerRowIndex + 1]) {
        subHeaders = rows[headerRowIndex + 1].map(h => h ? h.toString().trim() : '');
    }

    // 輔助函數：在多層標題中尋找欄位索引
    const getIndex = (keywords, searchRows = [mainHeaders]) => {
        for (const row of searchRows) {
            const idx = row.findIndex(h => h && keywords.some(k => h.includes(k)));
            if (idx !== -1) return idx;
        }
        return -1;
    };

    // 欄位映射
    // 注意：優先在子標題 (subHeaders) 中尋找 "遲到(分鐘)" 等精確欄位
    const mapIdx = {
      dept: getIndex(['部門名稱'], [mainHeaders]),
      empId: getIndex(['員工編號'], [mainHeaders]),
      date: getIndex(['日期'], [mainHeaders]),
      realHours: getIndex(['實到工時'], [mainHeaders]),
      otRecord: getIndex(['加班紀錄'], [mainHeaders]),
      // 異常欄位優先查子標題
      late: getIndex(['遲到(分鐘)', '遲到'], [subHeaders, mainHeaders]),
      early: getIndex(['早退(分鐘)', '早退'], [subHeaders, mainHeaders]),
      absent: getIndex(['曠職(時)', '曠職'], [subHeaders, mainHeaders]),
    };

    if (mapIdx.dept === -1 || mapIdx.realHours === -1) {
      throw new Error("缺少必要欄位：部門名稱或實到工時");
    }

    // 決定資料起始列：如果有子標題，從子標題下一行開始；否則從主標題下一行
    // 簡單判斷：如果下一行包含 "遲到(分鐘)" 這種標題字眼，那它就是標題列，資料從下下行開始
    const dataStartIndex = (subHeaders.length > 0 && subHeaders.some(h => h.includes('遲到') || h.includes('上班')))
                           ? headerRowIndex + 2
                           : headerRowIndex + 1;

    const dataRows = rows.slice(dataStartIndex);

    const cleanData = dataRows.map((row, index) => {
      // 略過空行或沒有部門/員工編號的行
      if (!row[mapIdx.dept] || !row[mapIdx.empId]) return null;

      // 解析加班時數 (從文字 "1H(13:00-14:00)" 中提取數字)
      let otHours = 0;
      const otText = mapIdx.otRecord !== -1 ? row[mapIdx.otRecord] : '';
      if (otText) {
          const match = otText.toString().match(/([\d\.]+)H/);
          if (match) otHours = parseFloat(match[1]);
      }

      // 解析數值 (處理空值或非數字)
      const parseNum = (val) => {
          const n = parseFloat(val);
          return isNaN(n) ? 0 : n;
      };

      return {
        id: index,
        dept: row[mapIdx.dept],
        empId: row[mapIdx.empId],
        date: row[mapIdx.date],
        workHours: parseNum(row[mapIdx.realHours]),
        otHours: otHours,
        isLate: parseNum(row[mapIdx.late]) > 0,
        isEarly: parseNum(row[mapIdx.early]) > 0,
        isAbsent: parseNum(row[mapIdx.absent]) > 0,
        lateMinutes: parseNum(row[mapIdx.late])
      };
    }).filter(Boolean);

    return cleanData;
  };

  const parseCSV = (file) => {
    if (!window.Papa) {
        setError("CSV 解析元件尚未載入完成");
        setLoading(false);
        return;
    }

    // 第一次嘗試：預設 (UTF-8)
    window.Papa.parse(file, {
      encoding: "UTF-8",
      complete: (results) => {
        try {
          // 嘗試解析資料
          const cleanData = extractData(results.data);
          setData(cleanData);
          setLoading(false);
        } catch (e) {
          // 如果 UTF-8 解析失敗 (例如找不到欄位)，嘗試 Big5
          console.log("UTF-8 解析失敗，嘗試 Big5...", e.message);

          window.Papa.parse(file, {
            encoding: "Big5", // 針對台灣繁體中文系統
            complete: (resultsBig5) => {
              try {
                const cleanDataBig5 = extractData(resultsBig5.data);
                setData(cleanDataBig5);
              } catch (e2) {
                // 兩次都失敗，顯示最後的錯誤
                setError(`解析失敗: ${e.message} (已嘗試 UTF-8 與 Big5 編碼)`);
              } finally {
                setLoading(false);
              }
            },
            error: (err) => {
              setError(`CSV 讀取錯誤: ${err.message}`);
              setLoading(false);
            }
          });
        }
      },
      error: (err) => {
        setError(`CSV 讀取錯誤: ${err.message}`);
        setLoading(false);
      }
    });
  };

  const parseExcel = (file) => {
    if (!window.XLSX) {
        setError("Excel 解析元件尚未載入完成");
        setLoading(false);
        return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const bstr = e.target.result;
        const wb = window.XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = window.XLSX.utils.sheet_to_json(ws, { header: 1 });
        const cleanData = extractData(data);
        setData(cleanData);
      } catch (err) {
        setError(`Excel 解析錯誤: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  // --- Statistics Calculation ---

  const stats = useMemo(() => {
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
  }, [data]);

  // --- Render ---

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-10">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Clock size={20} />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
              工時分析管理系統
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {!libsLoaded && <span className="text-xs text-orange-500 flex items-center gap-1"><AlertCircle size={12}/> 初始化組件中...</span>}
            <div className="text-sm text-slate-500">
              {fileName ? `當前檔案: ${fileName}` : '尚未載入資料'}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* File Upload Section */}
        {!data && (
          <div className="max-w-xl mx-auto mt-20 text-center">
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-12 bg-white hover:bg-slate-50 transition-colors">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload size={32} />
              </div>
              <h2 className="text-xl font-semibold text-slate-800 mb-2">上傳出勤明細表</h2>
              <p className="text-slate-500 mb-6">支援 CSV 或 Excel (.xlsx) 格式<br/>系統將自動識別部門、日期與工時資料</p>

              <label className={`inline-flex items-center px-6 py-3 rounded-lg transition-colors shadow-sm font-medium ${libsLoaded ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}>
                <FileText size={18} className="mr-2" />
                {libsLoaded ? '選擇檔案' : '載入中...'}
                <input type="file" className="hidden" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} disabled={!libsLoaded} />
              </label>

              {loading && <p className="mt-4 text-blue-600 animate-pulse">資料解析中...</p>}
              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center justify-center gap-2 text-sm">
                  <AlertCircle size={16} /> {error}
                </div>
              )}
            </div>
            <div className="mt-8 text-xs text-slate-400">
              範例格式支援: 部門名稱, 員工編號, 日期, 實到工時, 加班紀錄, 遲到早退
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        {data && stats && (
          <div className="space-y-6 animate-fade-in">

            {/* Top Controls */}
            <div className="flex justify-end">
              <button
                onClick={() => { setData(null); setFileName(''); }}
                className="text-sm text-slate-500 hover:text-red-600 flex items-center gap-1"
              >
                <XCircle size={14} /> 清除資料重選
              </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="本月總工時"
                value={`${stats.totalWorkHours} hr`}
                subtext={`人均 ${stats.avgHoursPerEmp} 小時`}
                icon={Briefcase}
                colorClass="bg-blue-100 text-blue-600"
              />
              <StatCard
                title="總加班時數"
                value={`${stats.totalOTHours} hr`}
                subtext="加班費成本指標"
                icon={TrendingUp}
                colorClass="bg-purple-100 text-purple-600"
              />
              <StatCard
                title="出勤異常"
                value={`${stats.totalLate} 次`}
                subtext="遲到/早退合計"
                icon={AlertCircle}
                colorClass="bg-orange-100 text-orange-600"
              />
              <StatCard
                title="在職人數"
                value={`${stats.totalEmployees} 人`}
                subtext="依出勤紀錄計算"
                icon={Users}
                colorClass="bg-emerald-100 text-emerald-600"
              />
            </div>

            {/* Analysis Section: Charts & Suggestions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Left Column: Charts */}
              <div className="lg:col-span-2 space-y-6">

                {/* Trend Chart */}
                <Card>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <Calendar size={18} className="text-slate-400" />
                      每日出勤趨勢分析
                    </h3>
                  </div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stats.trendChartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="date" stroke="#94a3b8" tick={{fontSize: 12}} />
                        <YAxis stroke="#94a3b8" tick={{fontSize: 12}} />
                        <RechartsTooltip
                          contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="hours" name="正常工時" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{r: 6}} />
                        <Line type="monotone" dataKey="ot" name="加班時數" stroke="#f59e0b" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* Department Bar Chart */}
                <Card>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <Users size={18} className="text-slate-400" />
                      部門工時與加班排行
                    </h3>
                  </div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.deptChartData} layout="vertical" margin={{ left: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                        <XAxis type="number" stroke="#94a3b8" tick={{fontSize: 12}} />
                        <YAxis dataKey="name" type="category" width={80} stroke="#94a3b8" tick={{fontSize: 12}} />
                        <RechartsTooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                        <Legend />
                        <Bar dataKey="hours" name="正常工時" stackId="a" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                        <Bar dataKey="ot" name="加班時數" stackId="a" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>

              {/* Right Column: Insights & Pie Chart */}
              <div className="space-y-6">

                {/* AI Suggestions */}
                <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
                  <h3 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
                    <CheckCircle size={20} className="text-indigo-600" />
                    智慧分析建議
                  </h3>
                  <div className="space-y-3">
                    {stats.suggestions.map((sugg, idx) => (
                      <div key={idx} className={`p-3 rounded-lg text-sm border flex items-start gap-3 ${
                        sugg.type === 'warning' ? 'bg-red-50 border-red-100 text-red-800' :
                        sugg.type === 'info' ? 'bg-blue-50 border-blue-100 text-blue-800' :
                        'bg-emerald-50 border-emerald-100 text-emerald-800'
                      }`}>
                        <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                           sugg.type === 'warning' ? 'bg-red-500' :
                           sugg.type === 'info' ? 'bg-blue-500' : 'bg-emerald-500'
                        }`} />
                        {sugg.text}
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Status Pie Chart */}
                <Card>
                  <h3 className="font-bold text-slate-800 mb-2">出勤狀態分佈</h3>
                  <div className="h-[250px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.pieData}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {stats.pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                        <Legend verticalAlign="bottom" height={36}/>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none pb-8">
                       <div className="text-2xl font-bold text-slate-800">{stats.pieData.reduce((a,b)=>a+b.value,0)}</div>
                       <div className="text-xs text-slate-400">總人次</div>
                    </div>
                  </div>
                </Card>

                {/* Top OT List (Mini Table) */}
                <Card>
                  <h3 className="font-bold text-slate-800 mb-4 text-sm">加班 Top 5 員工</h3>
                  <div className="overflow-hidden">
                    <table className="min-w-full text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="py-2 px-3 text-left font-medium text-slate-500">部門</th>
                          <th className="py-2 px-3 text-left font-medium text-slate-500">員工</th>
                          <th className="py-2 px-3 text-right font-medium text-slate-500">時數</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {data
                          .reduce((acc, curr) => {
                             // Group by employee for this table
                             const exist = acc.find(e => e.empId === curr.empId);
                             if (exist) { exist.ot += curr.otHours; }
                             else { acc.push({ dept: curr.dept, empId: curr.empId, ot: curr.otHours }); }
                             return acc;
                          }, [])
                          .sort((a, b) => b.ot - a.ot)
                          .slice(0, 5)
                          .map((row, i) => (
                          <tr key={i}>
                            <td className="py-2 px-3 text-slate-600 truncate max-w-[80px]">{row.dept}</td>
                            <td className="py-2 px-3 text-slate-800">{row.empId}</td>
                            <td className="py-2 px-3 text-right font-bold text-orange-600">{row.ot.toFixed(1)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
