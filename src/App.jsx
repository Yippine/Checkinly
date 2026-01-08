import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import {
  Upload, FileText, AlertCircle, Clock, Users, TrendingUp,
  Briefcase, Calendar, CheckCircle, XCircle, Lightbulb, CheckCircle2, AlertTriangle
} from 'lucide-react';

// Import utilities and components
import { initLibraries, parseCSV, parseExcel } from './utils/fileParser';
import { calculateStats } from './utils/statsCalculator';
import Card from './components/Card';
import StatCard from './components/StatCard';
import ComplianceAlert from './components/ComplianceAlert';
import PriorityWatchlist from './components/PriorityWatchlist';
import HealthWeatherBar from './components/HealthWeatherBar';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import GlobalLoader from './components/GlobalLoader';
import { KPISkeleton, ChartSkeleton } from './components/Skeleton';
import AttendanceTable from './components/AttendanceTable';
import DemoEAP from './pages/DemoEAP';
// INC-004: Mood Index Components
import MoodTrendChart from './components/MoodTrendChart';
import DepartmentMoodChart from './components/DepartmentMoodChart';
// INC-005: Burnout Assessment
import BurnoutAssessment from './components/BurnoutAssessment';

// --- Main Application ---

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [libsLoaded, setLibsLoaded] = useState(false);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); // RouteSystem: State(activeTab)
  const [darkMode, setDarkMode] = useState(false); // DarkMode: State(darkMode)

  // Ant Design Pro Color Palette
  const COLORS = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#eb2f96'];

  // --- Dynamic Script Loading ---
  useEffect(() => {
    initLibraries()
      .then(() => {
        setLibsLoaded(true);
      })
      .catch((err) => {
        console.error("Failed to load external libraries", err);
        setError("系統組件載入失敗，請檢查網路連線或重新整理頁面。");
      });
  }, []);

  // --- Dark Mode Initialization ---
  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDark = savedTheme === 'dark' || (savedTheme === null && prefersDark);

    setDarkMode(initialDark);
    document.documentElement.classList.toggle('dark', initialDark);
  }, []);

  // --- Dark Mode Toggle Handler ---
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

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
      parseCSV(file, setData, setLoading, setError);
    } else if (['xlsx', 'xls'].includes(fileExt)) {
      parseExcel(file, setData, setLoading, setError);
    } else {
      setError('不支援的檔案格式，請上傳 CSV 或 Excel 檔');
      setLoading(false);
    }
  };

  // --- Statistics Calculation ---

  const stats = useMemo(() => calculateStats(data), [data]);

  // --- Render ---

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-slate-900 font-sans transition-colors duration-200">
      <GlobalLoader isLoading={loading} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activeTab={activeTab} setActiveTab={setActiveTab} />
      <Header fileName={fileName} onMenuClick={() => setSidebarOpen(!sidebarOpen)} darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />

      {/* Health Weather Bar - Only show when data is available and in dashboard view */}
      {data && stats && activeTab === 'dashboard' && (
        <HealthWeatherBar
          avgBradfordScore={stats.avgBradfordScore || 0}
          violationCount={stats.violationCount || 0}
          highOTCount={stats.highOTCount || 0}
        />
      )}

      {/* Main Content */}
      <main
        className="lg:ml-64 mt-16 p-4 sm:p-6 lg:p-8 min-h-screen transition-all duration-300"
        role="main"
      >
        {/* Top Controls & Upload - Always Visible */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-heading-1 text-slate-900 dark:text-slate-100 font-bold mb-2">工時分析儀表板</h1>
              <p className="text-body text-slate-600 dark:text-slate-300">
                {fileName ? `當前資料：${fileName}` : '請上傳出勤明細表開始分析'}
              </p>
            </div>
            <div className="flex gap-3">
              <label className={`inline-flex items-center px-5 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm shadow-sm ${
                libsLoaded && !loading
                  ? 'bg-primary-500 hover:bg-primary-600 text-white cursor-pointer hover:shadow-md hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2'
                  : 'bg-neutral-200 dark:bg-slate-700 text-neutral-400 dark:text-slate-500 cursor-not-allowed opacity-50'
              }`}>
                <Upload size={18} className="mr-2" strokeWidth={2.5} />
                {loading ? '解析中...' : data ? '重新上傳' : '上傳資料'}
                <input
                  type="file"
                  className="hidden"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  disabled={!libsLoaded || loading}
                  aria-label="上傳出勤明細表"
                />
              </label>
              {data && (
                <button
                  onClick={() => { setData(null); setFileName(''); }}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-error-600 dark:text-error-400 bg-error-50 dark:bg-error-900/20 hover:bg-error-100 dark:hover:bg-error-900/30 border border-error-200 dark:border-error-800 hover:border-error-300 dark:hover:border-error-700 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                >
                  <XCircle size={18} strokeWidth={2.5} /> 清除
                </button>
              )}
            </div>
          </div>
          {error && (
            <div className="p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 text-error-700 dark:text-error-400 rounded-lg flex items-center gap-3 text-sm shadow-sm animate-fade-in">
              <AlertCircle size={20} strokeWidth={2.5} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* RouteSystem: View(Dashboard | AttendanceDetail | BurnoutAssessment | DemoEAP) + Animation(fade_in) */}
        {activeTab === 'burnout-assessment' ? (
          /* Burnout Assessment View */
          <BurnoutAssessment />
        ) : activeTab === 'demo-eap' ? (
          /* Demo EAP View */
          <DemoEAP />
        ) : activeTab === 'dashboard' ? (
          /* Dashboard View */
          !data ? (
            /* Empty State with Skeleton */
            <div className="space-y-6 animate-fade-in">
            {/* KPI Cards Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <KPISkeleton />
              <KPISkeleton />
              <KPISkeleton />
              <KPISkeleton />
            </div>

            {/* Charts Section Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <ChartSkeleton title="每日出勤趨勢分析" />
                <ChartSkeleton title="部門工時排行" />
              </div>
              <div className="space-y-6">
                <ChartSkeleton title="出勤狀態分布" height="h-64" />
                <Card>
                  <div className="space-y-4">
                    <h3 className="text-heading-3 text-slate-900 dark:text-slate-100 font-semibold flex items-center gap-2">
                      <Lightbulb size={20} className="text-warning-500" strokeWidth={2.5} />
                      智慧建議
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-neutral-200 dark:bg-slate-700 animate-pulse flex-shrink-0 mt-0.5"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-neutral-200 dark:bg-slate-700 rounded animate-pulse w-full"></div>
                          <div className="h-4 bg-neutral-200 dark:bg-slate-700 rounded animate-pulse w-3/4"></div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-neutral-200 dark:bg-slate-700 animate-pulse flex-shrink-0 mt-0.5"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-neutral-200 dark:bg-slate-700 rounded animate-pulse w-full"></div>
                          <div className="h-4 bg-neutral-200 dark:bg-slate-700 rounded animate-pulse w-2/3"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Empty State Message */}
            <Card>
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-800/20 flex items-center justify-center mx-auto mb-6 shadow-lg dark:shadow-slate-900/50">
                  <FileText size={36} className="text-primary-500 dark:text-primary-400" strokeWidth={2.5} />
                </div>
                <h3 className="text-heading-2 text-slate-900 dark:text-slate-100 font-bold mb-3">準備開始分析</h3>
                <p className="text-body text-slate-600 dark:text-slate-300 mb-6 max-w-md mx-auto leading-relaxed">
                  請點擊上方「上傳資料」按鈕，選擇 CSV 或 Excel (.xlsx) 格式的出勤明細表。<br/>
                  系統將自動識別部門、員工、日期與工時資料。
                </p>
                <div className="inline-block px-6 py-3 bg-neutral-50 dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-lg">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    💡 支援格式：部門名稱、員工編號、日期、實到工時、加班紀錄、遲到早退
                  </p>
                </div>
              </div>
            </Card>
          </div>
          ) : stats ? (
            <div className="space-y-6 animate-fade-in">
            {/* KPI Cards - Enhanced with semantic colors and trend indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <StatCard
                title="本月總工時"
                value={`${stats.totalWorkHours}`}
                subtext={`人均 ${stats.avgHoursPerEmp} 小時`}
                icon={Briefcase}
                colorScheme="primary"
                trend={{ direction: 'up', percentage: '8.5', label: '較上月' }}
              />
              <StatCard
                title="總加班時數"
                value={`${stats.totalOTHours}`}
                subtext="加班費成本指標"
                icon={Clock}
                colorScheme="warning"
                trend={{ direction: 'up', percentage: '12.3', label: '較上月' }}
              />
              <StatCard
                title="出勤異常"
                value={`${stats.totalLate}`}
                subtext="遲到/早退合計"
                icon={AlertCircle}
                colorScheme="error"
                trend={{ direction: 'down', percentage: '5.2', label: '較上月' }}
              />
              <StatCard
                title="在職人數"
                value={`${stats.totalEmployees}`}
                subtext="依出勤紀錄計算"
                icon={Users}
                colorScheme="success"
              />
              <StatCard
                title="平均 Bradford Score"
                value={stats.avgBradfordScore?.toFixed(1) || '0.0'}
                subtext="缺勤風險指數"
                icon={AlertTriangle}
                colorScheme={stats.avgBradfordScore > 100 ? 'warning' : 'success'}
              />
              <StatCard
                title="排班違規人數"
                value={stats.violationCount || 0}
                subtext="七休一 + 連續12天"
                icon={Calendar}
                colorScheme={stats.violationCount > 0 ? 'error' : 'success'}
              />
            </div>

            {/* Analysis Section: Charts & Suggestions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Left Column: Charts */}
              <div className="lg:col-span-2 space-y-6">

                {/* Trend Chart - Enhanced with design system colors */}
                <Card animated={true}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-heading-3 text-slate-900 dark:text-slate-100 dark:text-slate-100 flex items-center gap-2 font-semibold">
                      <Calendar size={18} className="text-slate-500 dark:text-slate-400 dark:text-slate-400" strokeWidth={2} />
                      每日出勤趨勢分析
                    </h3>
                  </div>
                  <div className="h-64 sm:h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stats.trendChartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#334155' : '#e8e8e8'} />
                        <XAxis
                          dataKey="date"
                          stroke={darkMode ? '#475569' : '#d9d9d9'}
                          tick={{fontSize: 11, fill: darkMode ? '#94a3b8' : 'rgba(0,0,0,0.45)'}}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis stroke={darkMode ? '#475569' : '#d9d9d9'} tick={{fontSize: 11, fill: darkMode ? '#94a3b8' : 'rgba(0,0,0,0.45)'}} />
                        <RechartsTooltip
                          contentStyle={{
                            borderRadius: '6px',
                            border: darkMode ? '1px solid #475569' : '1px solid #e8e8e8',
                            boxShadow: '0 3px 6px -4px rgba(0,0,0,0.12), 0 6px 16px 0 rgba(0,0,0,0.08)',
                            backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                            padding: '12px',
                            color: darkMode ? '#f1f5f9' : 'rgba(0,0,0,0.85)'
                          }}
                        />
                        <Legend wrapperStyle={{fontSize: '12px', color: darkMode ? '#cbd5e1' : 'rgba(0,0,0,0.65)'}} />
                        <Line
                          type="monotone"
                          dataKey="hours"
                          name="正常工時"
                          stroke="#1890ff"
                          strokeWidth={2}
                          dot={{r: 3, fill: '#1890ff'}}
                          activeDot={{r: 5, fill: '#1890ff'}}
                          isAnimationActive={true}
                          animationDuration={800}
                          animationEasing="ease-in-out"
                        />
                        <Line
                          type="monotone"
                          dataKey="ot"
                          name="加班時數"
                          stroke="#faad14"
                          strokeWidth={2}
                          dot={{r: 3, fill: '#faad14'}}
                          activeDot={{r: 5, fill: '#faad14'}}
                          isAnimationActive={true}
                          animationDuration={800}
                          animationEasing="ease-in-out"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* Department Bar Chart - Enhanced with design system colors */}
                <Card animated={true}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-heading-3 text-slate-900 dark:text-slate-100 dark:text-slate-100 flex items-center gap-2 font-semibold">
                      <Users size={18} className="text-slate-500 dark:text-slate-400 dark:text-slate-400" strokeWidth={2} />
                      部門工時與加班排行
                    </h3>
                  </div>
                  <div className="h-64 sm:h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.deptChartData} layout="vertical" margin={{ left: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={darkMode ? '#334155' : '#e8e8e8'} />
                        <XAxis type="number" stroke={darkMode ? '#475569' : '#d9d9d9'} tick={{fontSize: 11, fill: darkMode ? '#94a3b8' : 'rgba(0,0,0,0.45)'}} />
                        <YAxis dataKey="name" type="category" width={80} stroke={darkMode ? '#475569' : '#d9d9d9'} tick={{fontSize: 11, fill: darkMode ? '#cbd5e1' : 'rgba(0,0,0,0.65)'}} />
                        <RechartsTooltip
                          cursor={{fill: 'rgba(24,144,255,0.05)'}}
                          contentStyle={{
                            borderRadius: '6px',
                            border: darkMode ? '1px solid #475569' : '1px solid #e8e8e8',
                            boxShadow: '0 3px 6px -4px rgba(0,0,0,0.12), 0 6px 16px 0 rgba(0,0,0,0.08)',
                            backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                            padding: '12px',
                            color: darkMode ? '#f1f5f9' : 'rgba(0,0,0,0.85)'
                          }}
                        />
                        <Legend wrapperStyle={{fontSize: '12px', color: darkMode ? '#cbd5e1' : 'rgba(0,0,0,0.65)'}} />
                        <Bar
                          dataKey="hours"
                          name="正常工時"
                          stackId="a"
                          fill="#1890ff"
                          radius={[0, 4, 4, 0]}
                          barSize={20}
                          isAnimationActive={true}
                          animationDuration={800}
                          animationEasing="ease-in-out"
                        />
                        <Bar
                          dataKey="ot"
                          name="加班時數"
                          stackId="a"
                          fill="#f5222d"
                          radius={[0, 4, 4, 0]}
                          barSize={20}
                          isAnimationActive={true}
                          animationDuration={800}
                          animationEasing="ease-in-out"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* INC-004: Mood Index Charts - Only show when mood data is available */}
                {stats.hasMoodData && (
                  <>
                    <MoodTrendChart data={stats.moodTrendData} darkMode={darkMode} />
                    <DepartmentMoodChart data={stats.deptMoodData} darkMode={darkMode} />
                  </>
                )}
              </div>

              {/* Right Column: Insights & Pie Chart */}
              <div className="space-y-6">

                {/* Priority Watchlist - New Component */}
                {stats.topRiskEmployees && stats.topRiskEmployees.length > 0 && (
                  <PriorityWatchlist topRiskEmployees={stats.topRiskEmployees} />
                )}

                {/* Smart Suggestion Card - Enhanced with gradient background and icons */}
                <Card className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-primary-200 dark:border-primary-800" animated={true}>
                  <h3 className="text-heading-3 text-slate-900 dark:text-slate-100 dark:text-slate-100 mb-4 flex items-center gap-2 font-semibold">
                    <Lightbulb size={20} className="text-warning-500 dark:text-warning-400" strokeWidth={2} />
                    智慧分析建議
                  </h3>
                  <div className="space-y-2">
                    {stats.suggestions.map((sugg, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2 rounded transition-colors duration-200 hover:bg-white/50 dark:hover:bg-slate-700/50">
                        <CheckCircle2 size={16} className="text-success-500 dark:text-success-400 mt-0.5 shrink-0" strokeWidth={2} />
                        <span className="text-body text-slate-600 dark:text-slate-300 dark:text-slate-300 leading-relaxed">{sugg.text}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Compliance Alert - New Component */}
                {stats.violationList && stats.violationList.length > 0 && (
                  <ComplianceAlert violations={stats.violationList} />
                )}

                {/* Status Pie Chart - Enhanced with design system colors */}
                <Card animated={true}>
                  <h3 className="text-heading-3 text-slate-900 dark:text-slate-100 dark:text-slate-100 mb-4 font-semibold">出勤狀態分佈</h3>
                  <div className="h-64 sm:h-72 w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.pieData}
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={4}
                          dataKey="value"
                          isAnimationActive={true}
                          animationDuration={800}
                          animationEasing="ease-in-out"
                        >
                          {stats.pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          contentStyle={{
                            borderRadius: '6px',
                            border: darkMode ? '1px solid #475569' : '1px solid #e8e8e8',
                            boxShadow: '0 3px 6px -4px rgba(0,0,0,0.12), 0 6px 16px 0 rgba(0,0,0,0.08)',
                            backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                            padding: '12px',
                            color: darkMode ? '#f1f5f9' : 'rgba(0,0,0,0.85)'
                          }}
                        />
                        <Legend verticalAlign="bottom" height={40} wrapperStyle={{fontSize: '11px', color: darkMode ? '#cbd5e1' : 'rgba(0,0,0,0.65)'}} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none pb-10">
                       <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 dark:text-slate-100">{stats.pieData.reduce((a,b)=>a+b.value,0)}</div>
                       <div className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-400 mt-1">總人次</div>
                    </div>
                  </div>
                </Card>

                {/* Top OT List (Mini Table) - Enhanced with design system styles */}
                <Card animated={true}>
                  <h3 className="text-heading-3 text-slate-900 dark:text-slate-100 dark:text-slate-100 mb-4 font-semibold">加班 Top 5 員工</h3>
                  <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-slate-700 dark:border-slate-700">
                    <table className="min-w-full">
                      <thead className="bg-neutral-50 dark:bg-slate-700">
                        <tr>
                          <th className="py-3 px-4 text-left text-heading-4 text-slate-600 dark:text-slate-300 dark:text-slate-300 border-b-2 border-neutral-200 dark:border-slate-700 dark:border-slate-600">#</th>
                          <th className="py-3 px-4 text-left text-heading-4 text-slate-600 dark:text-slate-300 dark:text-slate-300 border-b-2 border-neutral-200 dark:border-slate-700 dark:border-slate-600">部門</th>
                          <th className="py-3 px-4 text-left text-heading-4 text-slate-600 dark:text-slate-300 dark:text-slate-300 border-b-2 border-neutral-200 dark:border-slate-700 dark:border-slate-600">員工</th>
                          <th className="py-3 px-4 text-right text-heading-4 text-slate-600 dark:text-slate-300 dark:text-slate-300 border-b-2 border-neutral-200 dark:border-slate-700 dark:border-slate-600">時數</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-slate-800 divide-y divide-neutral-100 dark:divide-slate-700">
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
                          <tr key={i} className="hover:bg-neutral-50 dark:hover:bg-slate-700 transition-colors duration-150">
                            <td className="py-2.5 px-4 text-body-small text-neutral-500 dark:text-slate-400 w-12">{i + 1}</td>
                            <td className="py-2.5 px-4 text-body-small text-neutral-600 dark:text-slate-300 truncate max-w-[80px]">{row.dept}</td>
                            <td className="py-2.5 px-4 text-body text-primary-600 dark:text-primary-400 font-medium cursor-pointer hover:text-primary-500 dark:hover:text-primary-300">{row.empId}</td>
                            <td className="py-2.5 px-4 text-right text-body font-semibold text-warning-600 dark:text-warning-400">{row.ot.toFixed(1)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

              </div>
            </div>
          </div>
          ) : null
        ) : (
          /* AttendanceTable View */
          <AttendanceTable data={data || []} />
        )}

        {/* Loading Indicator */}
        {!libsLoaded && (
          <div className="fixed bottom-4 right-4 bg-white dark:bg-slate-800 border border-warning-200 dark:border-warning-800 rounded-lg shadow-card dark:shadow-slate-900/50 p-3 flex items-center gap-2 text-warning-600 dark:text-warning-400">
            <AlertCircle size={16} />
            <span className="text-body-small">系統組件載入中...</span>
          </div>
        )}
      </main>
    </div>
  );
}
