import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import {
  LayoutDashboard, FileText, Activity, Upload, AlertCircle,
  CheckCircle, Users, Clock, TrendingUp, Search, Menu, X, RefreshCw
} from 'lucide-react';

// --- 模擬數據 (當使用者未上傳檔案時顯示) ---
const SAMPLE_DATA = [
  { department: "小港護理部", id: "N094002", date: "2025-01-01", weekday: "(三)", type: "國定假日", shift: "排休", time_range: "", check_in: "", check_out: "", ot_record: "", actual_hours: 0 },
  { department: "小港護理部", id: "N094002", date: "2025-01-02", weekday: "(四)", type: "", shift: "護-ALL班", time_range: "09:00~12:00...", check_in: "08:33", check_out: "21:00", ot_record: "", actual_hours: 9 },
  { department: "小港護理部", id: "N094002", date: "2025-01-03", weekday: "(五)", type: "", shift: "護-午晚", time_range: "14:00~21:00", check_in: "13:48", check_out: "21:05", ot_record: "0.5H", actual_hours: 7.5 },
  { department: "驗光部", id: "O113001", date: "2025-01-20", weekday: "(一)", type: "", shift: "藥眼屈-ALL班", time_range: "09:00~21:00", check_in: "08:57", check_out: "21:08", ot_record: "", actual_hours: 9 },
  { department: "驗光部", id: "O113001", date: "2025-01-21", weekday: "(二)", type: "", shift: "五甲眼10:00-17:00", time_range: "10:00~17:00", check_in: "09:37", check_out: "17:02", ot_record: "1H(13:00-14:00)", actual_hours: 6 },
  { department: "驗光部", id: "O113001", date: "2025-01-22", weekday: "(三)", type: "休息日", shift: "排休", time_range: "", check_in: "", check_out: "", ot_record: "", actual_hours: 0 },
  { department: "驗光部", id: "O113001", date: "2025-01-23", weekday: "(四)", type: "", shift: "藥眼屈-ALL班", time_range: "09:00~21:00", check_in: "08:54", check_out: "21:50", ot_record: "0.75H", actual_hours: 9.75 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

// --- CSV 解析器 (處理引號內的換行符號) ---
const parseCSV = (text) => {
  // 移除 BOM (Byte Order Mark) 防止第一欄位名稱錯誤
  const cleanText = text.replace(/^\uFEFF/, '');

  const rows = [];
  let currentRow = [];
  let currentCell = '';
  let inQuotes = false;

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentCell += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentCell += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentCell.trim());
        currentCell = '';
      } else if (char === '\n' || (char === '\r' && nextChar === '\n')) {
        currentRow.push(currentCell.trim());
        if (currentRow.length > 0) rows.push(currentRow);
        currentRow = [];
        currentCell = '';
        if (char === '\r') i++;
      } else {
        currentCell += char;
      }
    }
  }
  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    rows.push(currentRow);
  }
  return rows;
};

// --- 組件：KPI 卡片 ---
const KpiCard = ({ title, value, subtext, icon: Icon, colorClass }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      {subtext && <p className={`text-xs mt-2 ${colorClass}`}>{subtext}</p>}
    </div>
    <div className={`p-3 rounded-lg ${colorClass.replace('text-', 'bg-').replace('600', '100')}`}>
      <Icon size={24} className={colorClass} />
    </div>
  </div>
);

// --- 組件：EAP 問卷 ---
const EapSurvey = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center animate-fade-in">
        <div className="flex justify-center mb-4">
          <CheckCircle className="text-green-600 w-16 h-16" />
        </div>
        <h3 className="text-2xl font-bold text-green-800 mb-2">感謝您的回饋</h3>
        <p className="text-green-700">您的意見將協助我們改善工時制度與提升職場健康環境。</p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          填寫另一份
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-3xl mx-auto">
      <div className="mb-6 border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Activity className="text-teal-600" />
          EAP 員工協助方案滿意度與工時感受調查
        </h2>
        <p className="text-slate-500 text-sm mt-1">此問卷為匿名填寫，旨在了解您對目前工時安排與身心健康的感受。</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">1. 您認為目前的加班頻率是否合理？ (1-5分)</label>
          <div className="flex justify-between gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <label key={num} className="flex-1 text-center cursor-pointer">
                <input type="radio" name="q1" className="peer sr-only" required />
                <div className="py-3 rounded-lg border border-slate-200 peer-checked:bg-teal-50 peer-checked:border-teal-500 peer-checked:text-teal-700 transition-all hover:bg-slate-50">
                  {num}
                  <div className="text-xs text-slate-400 mt-1">
                    {num === 1 ? '非常不合理' : num === 5 ? '非常合理' : ''}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">2. 公司目前的排班制度是否影響您的生活作息？</label>
          <select className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none">
            <option>完全沒有影響</option>
            <option>輕微影響，可自行調整</option>
            <option>有影響，感到些許疲勞</option>
            <option>嚴重影響，造成身心負擔</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">3. 您對於 EAP (心理諮商/健康講座) 的需求程度？</label>
          <div className="flex gap-4">
            {['非常需要', '偶爾需要', '不需要'].map((opt) => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="q3" className="w-4 h-4 text-teal-600 focus:ring-teal-500" />
                <span className="text-slate-700">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">4. 對於改善加班狀況，您的建議是？</label>
          <textarea
            className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none h-24"
            placeholder="例如：增加人力、調整排班區間、優化工作流程..."
          ></textarea>
        </div>

        <div className="pt-4">
          <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-all shadow-sm hover:shadow-md">
            提交問卷
          </button>
        </div>
      </form>
    </div>
  );
};

// --- 主應用程式 ---
const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [rawData, setRawData] = useState(SAMPLE_DATA);
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState({
    totalOT: 0,
    avgOT: 0,
    deptStats: [],
    dailyTrend: [],
    abnormalCount: 0
  });

  // 核心解析邏輯
  const processCSVContent = (text) => {
    try {
      const rawRows = parseCSV(text);
      const parsed = [];

      rawRows.forEach((row, idx) => {
        // 過濾掉非數據行：檢查 Index 2 (日期) 是否符合 YYYY-MM-DD 或 YYYY/MM/DD
        if (row.length < 5) return;

        const dateStr = row[2];
        const isDate = /^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/.test(dateStr);
        if (!isDate) return;

        // 根據最新提供之 11401出勤明細 結構
        // Index 19: 實到工時
        // Index 15: 加班紀錄
        // Index 14: 差勤紀錄 (備用)

        const actualHoursIdx = 19;
        const otIdx = 15;
        const noteIdx = 14;

        const actualHours = parseFloat(row[actualHoursIdx]) || 0;
        const otText = (row[otIdx] || "") + (row[noteIdx] || "");

        parsed.push({
          department: (row[0] || "未分類").trim(),
          id: row[1],
          date: dateStr.replace(/\//g, '-'),
          weekday: row[3],
          type: row[4],
          shift: row[5],
          ot_record: otText,
          actual_hours: actualHours,
          check_in: row[8],
          check_out: row[13] || row[11] || row[9] || "-"
        });
      });

      return parsed;
    } catch (error) {
      console.error("Parse Error:", error);
      return [];
    }
  };

  // 處理檔案上傳 (增強編碼偵測)
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);

    const reader = new FileReader();

    reader.onload = (e) => {
      const buffer = e.target.result;
      let text = '';
      let encodingUsed = 'UTF-8';

      // 策略 1: 嘗試 UTF-8 (strict)
      try {
        const decoder = new TextDecoder('utf-8', { fatal: true });
        text = decoder.decode(buffer);
      } catch (e) {
        // 策略 2: 如果 UTF-8 失敗，切換 Big5
        console.warn('UTF-8 decoding failed, trying Big5');
        try {
          const decoder = new TextDecoder('big5');
          text = decoder.decode(buffer);
          encodingUsed = 'Big5';
        } catch (e2) {
          alert("無法識別檔案編碼，請確認檔案格式。");
          setLoading(false);
          return;
        }
      }

      // 策略 3: 驗證解析結果
      // 有時候 Big5 檔案在 UTF-8 下不會報錯但會變亂碼
      // 我們先試著解析，如果解析不出資料，且是用 UTF-8 解的，就強制改用 Big5 再試一次
      let parsedData = processCSVContent(text);

      if (parsedData.length === 0 && encodingUsed === 'UTF-8') {
        console.warn('Parsed 0 rows with UTF-8, forcing Big5 retry');
        try {
           const decoder = new TextDecoder('big5');
           text = decoder.decode(buffer);
           parsedData = processCSVContent(text);
           if (parsedData.length > 0) encodingUsed = 'Big5 (Retry)';
        } catch (e3) {
           console.error('Big5 retry failed');
        }
      }

      if (parsedData.length > 0) {
        setRawData(parsedData);
        setLoading(false);
        // 隱藏成功提示，直接顯示數據即可
      } else {
        setLoading(false);
        alert(`無法讀取資料。目前嘗試編碼：${encodingUsed}\n請確認檔案是否為標準出勤 CSV 格式。`);
      }
    };

    reader.onerror = () => {
      setLoading(false);
      alert("檔案讀取發生錯誤");
    };

    // 關鍵：使用 ArrayBuffer 讀取原始二進位資料，以便手動控制解碼
    reader.readAsArrayBuffer(file);
  };

  // 數據統計計算
  useEffect(() => {
    let totalOT = 0;
    let abnormal = 0;
    const deptMap = {};
    const dateMap = {};

    rawData.forEach(row => {
      // 計算加班時數：
      // 1. 優先解析 ot_record
      let otHours = 0;
      if (row.ot_record) {
        const match = row.ot_record.match(/([\d\.]+)\s*H/i);
        if (match) {
          otHours = parseFloat(match[1]);
        }
      }

      // 2. 輔助判斷：若無文字紀錄，但工時超過 9
      if (otHours === 0 && row.actual_hours > 9) {
        otHours = row.actual_hours - 9;
      }

      if (isNaN(otHours) || otHours < 0) otHours = 0;

      if (otHours > 0) totalOT += otHours;
      if (otHours > 4) abnormal++;

      // 部門統計
      const deptName = row.department || "未分類";
      if (!deptMap[deptName]) deptMap[deptName] = 0;
      deptMap[deptName] += otHours;

      // 日期趨勢
      const dateKey = row.date ? row.date.substring(5) : '未知';
      if (!dateMap[dateKey]) dateMap[dateKey] = 0;
      dateMap[dateKey] += otHours;
    });

    const deptStats = Object.keys(deptMap)
      .map(dept => ({
        name: dept,
        value: parseFloat(deptMap[dept].toFixed(1))
      }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);

    const dailyTrend = Object.keys(dateMap).sort().map(date => ({
      name: date,
      ot: parseFloat(dateMap[date].toFixed(1))
    }));

    const uniqueStaffCount = new Set(rawData.map(r => r.id)).size || 1;

    setMetrics({
      totalOT: parseFloat(totalOT.toFixed(1)),
      avgOT: parseFloat((totalOT / uniqueStaffCount).toFixed(1)),
      deptStats,
      dailyTrend,
      abnormalCount: abnormal
    });

  }, [rawData]);

  // --- 視圖組件 ---

  const DashboardView = () => (
    <div className="space-y-6 animate-fade-in">
      {/* KPI 區塊 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard
          title="總加班時數"
          value={`${metrics.totalOT} 小時`}
          subtext="統計區間：114/01"
          icon={Clock}
          colorClass="text-blue-600"
        />
        <KpiCard
          title="人均加班"
          value={`${metrics.avgOT} 小時/人`}
          subtext={metrics.avgOT > 10 ? "⚠️ 超出建議值" : "✅ 範圍內"}
          icon={Users}
          colorClass={metrics.avgOT > 10 ? "text-red-600" : "text-green-600"}
        />
        <KpiCard
          title="加班異常頻次"
          value={`${metrics.abnormalCount} 次`}
          subtext="單日 > 4H"
          icon={AlertCircle}
          colorClass="text-orange-600"
        />
        <KpiCard
          title="最高加班部門"
          value={metrics.deptStats[0]?.name || "無"}
          subtext={`共 ${metrics.deptStats[0]?.value || 0} 小時`}
          icon={TrendingUp}
          colorClass="text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 圖表 1: 部門加班排行 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <LayoutDashboard size={20} className="text-blue-500"/> 部門加班時數分佈
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.deptStats} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                <RechartsTooltip />
                <Bar dataKey="value" fill="#3b82f6" name="加班時數" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 圖表 2: 圓餅圖 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Activity size={20} className="text-green-500"/> 加班佔比分析
          </h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.deptStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {metrics.deptStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 分析建議區塊 (依照工時分析格式1) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">工時合理性與改進方向分析</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <CheckCircle size={16} /> 合理性評估
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 list-disc pl-5">
              <li>
                <strong>部門差異：</strong> {metrics.deptStats[0]?.name || "無資料"} 加班時數顯著高於其他部門，佔總加班量的 {metrics.totalOT > 0 ? ((metrics.deptStats[0]?.value || 0) / metrics.totalOT * 100).toFixed(0) : 0}%。
              </li>
              <li>
                <strong>異常排班：</strong> 偵測到 {metrics.abnormalCount} 筆單日工時過長的紀錄，需確認是否為突發性事件或常態性人力短缺。
              </li>
              <li>
                <strong>週末出勤：</strong> 部分員工於休息日（週六/週日）仍有打卡紀錄，可能影響員工 Work-Life Balance。
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
              <TrendingUp size={16} /> 改進與行動方向
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 list-disc pl-5">
              <li>
                <strong>人力調度：</strong> 建議針對 {metrics.deptStats[0]?.name || "相關部門"} 進行工作量盤點，評估是否增補兼職人力或調整尖峰時段排班。
              </li>
              <li>
                <strong>制度優化：</strong> 落實「變形工時」管理，確保長工時後有足夠的休息間隔 (至少 11 小時)。
              </li>
              <li>
                <strong>EAP 介入：</strong> 針對高頻率加班人員（Top 5），主動發送關懷問卷或安排主管面談。
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const ReportView = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h3 className="font-bold text-slate-700">出勤明細總表</h3>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1.5 text-slate-400" size={16} />
            <input type="text" placeholder="搜尋姓名/編號" className="pl-8 py-1 pr-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-blue-500" />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-100">
            <tr>
              <th className="px-4 py-3 min-w-[100px]">部門</th>
              <th className="px-4 py-3 min-w-[80px]">員工編號</th>
              <th className="px-4 py-3 min-w-[90px]">日期</th>
              <th className="px-4 py-3 min-w-[60px]">星期</th>
              <th className="px-4 py-3 min-w-[120px]">班別</th>
              <th className="px-4 py-3 min-w-[120px]">打卡時間</th>
              <th className="px-4 py-3 text-right min-w-[80px]">實到工時</th>
              <th className="px-4 py-3 min-w-[100px]">加班註記</th>
            </tr>
          </thead>
          <tbody>
            {rawData.map((row, idx) => (
              <tr key={idx} className="border-b hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{row.department}</td>
                <td className="px-4 py-3">{row.id}</td>
                <td className="px-4 py-3">{row.date}</td>
                <td className={`px-4 py-3 ${['(六)', '(日)'].includes(row.weekday) ? 'text-red-500' : ''}`}>{row.weekday}</td>
                <td className="px-4 py-3 text-slate-600 truncate max-w-[150px]">{row.shift}</td>
                <td className="px-4 py-3 font-mono text-xs">
                  {row.check_in && row.check_out ? `${row.check_in} - ${row.check_out}` : '-'}
                </td>
                <td className={`px-4 py-3 text-right font-bold ${row.actual_hours > 9 ? 'text-orange-600' : 'text-slate-700'}`}>
                  {row.actual_hours}
                </td>
                <td className="px-4 py-3">
                  {row.ot_record ? (
                    <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-medium">
                      {row.ot_record}
                    </span>
                  ) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* 頂部導航 */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10 px-4 md:px-8 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <LayoutDashboard size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 leading-tight">工時分析管理系統</h1>
            <p className="text-xs text-slate-500">114年度 人力資源部</p>
          </div>
        </div>

        <div className="hidden md:flex gap-1 bg-slate-100 p-1 rounded-lg">
          {['dashboard', 'report', 'survey'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab === 'dashboard' && '數據儀表板'}
              {tab === 'report' && '出勤明細表'}
              {tab === 'survey' && 'EAP 滿意度調查'}
            </button>
          ))}
        </div>

        <label className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors text-sm font-medium ${loading ? 'bg-slate-200 text-slate-500 cursor-wait' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}>
          <Upload size={16} />
          <span className="hidden sm:inline">{loading ? '讀取中...' : '匯入 CSV'}</span>
          <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} disabled={loading} />
        </label>
      </nav>

      {/* 主要內容區 */}
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'report' && <ReportView />}
        {activeTab === 'survey' && <EapSurvey />}
      </main>

      {/* 手機版底部導航 */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-3 z-20">
         <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center text-xs ${activeTab === 'dashboard' ? 'text-blue-600' : 'text-slate-400'}`}>
           <LayoutDashboard size={20} className="mb-1" /> 儀表板
         </button>
         <button onClick={() => setActiveTab('report')} className={`flex flex-col items-center text-xs ${activeTab === 'report' ? 'text-blue-600' : 'text-slate-400'}`}>
           <FileText size={20} className="mb-1" /> 明細
         </button>
         <button onClick={() => setActiveTab('survey')} className={`flex flex-col items-center text-xs ${activeTab === 'survey' ? 'text-blue-600' : 'text-slate-400'}`}>
           <Activity size={20} className="mb-1" /> 調查
         </button>
      </div>

      <style>{`
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default App;
