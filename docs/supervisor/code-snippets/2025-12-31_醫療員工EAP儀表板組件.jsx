import React, { useState } from 'react';
import { 
  Activity, 
  Users, 
  Sun, 
  AlertTriangle, 
  MessageCircle, 
  Calendar, 
  Heart, 
  MoreVertical, 
  Menu,
  Bell,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  UserCheck
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  BarChart,
  Bar
} from 'recharts';

// --- Mock Data ---

// Radar Chart Data: Burnout Dimensions
const radarData = [
  { subject: '工時長度', A: 120, fullMark: 150 },
  { subject: '休假赤字', A: 98, fullMark: 150 },
  { subject: '排班強度', A: 86, fullMark: 150 },
  { subject: '角色浮動', A: 65, fullMark: 150 },
  { subject: '視覺負荷', A: 130, fullMark: 150 }, // Critical
  { subject: '情緒壓力', A: 85, fullMark: 150 },
];

// Line Chart Data: VFLI vs Surgery Volume
const trendData = [
  { month: '1月', 手術量: 40, VFLI: 2400 },
  { month: '2月', 手術量: 30, VFLI: 1398 },
  { month: '3月', 手術量: 20, VFLI: 2000 },
  { month: '4月', 手術量: 27, VFLI: 3908 },
  { month: '5月', 手術量: 18, VFLI: 4800 },
  { month: '6月', 手術量: 23, VFLI: 3800 },
  { month: '7月', 手術量: 34, VFLI: 4300 },
];

// EAP ROI Data
const wellnessData = [
  { month: 'Q1', EAP使用率: 10, 留任率: 85 },
  { month: 'Q2', EAP使用率: 25, 留任率: 88 },
  { month: 'Q3', EAP使用率: 40, 留任率: 92 },
  { month: 'Q4', EAP使用率: 55, 留任率: 96 },
];

// Watchlist Data
const employees = [
  { 
    id: 1, 
    name: '王小美', 
    role: '護理師', 
    riskScore: 92, 
    bradford: 150, 
    status: 'critical',
    detail: 'Bradford Score 150 (頻繁病假) | PTI 高 (隱性加班)'
  },
  { 
    id: 2, 
    name: '陳大明', 
    role: '驗光師', 
    riskScore: 78, 
    bradford: 80, 
    status: 'warning',
    detail: '連續工作第 6 天 | 視覺負荷 VFLI 偏高'
  },
  { 
    id: 3, 
    name: '林醫師', 
    role: '醫師', 
    riskScore: 45, 
    bradford: 10, 
    status: 'normal',
    detail: '狀態穩定'
  },
];

// --- Components ---

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState<string | null>(null);

  // Colors from the spec
  const colors = {
    bg: '#121212', // Dark Iron Grey
    surface: '#1E1E1E', // Slightly lighter for cards
    surfaceHighlight: '#2D2D2D',
    textPrimary: '#E2E8F0',
    textSecondary: '#94A3B8',
    teal: '#00897B', // Normal
    amber: '#FFB300', // Warning
    coral: '#E53935', // Critical
    border: '#333333'
  };

  const handleActionClick = (employee: any) => {
    setSelectedEmployee(employee);
    setActionModalOpen(true);
    setActionType(null);
  };

  const handleActionConfirm = (type: string) => {
    setActionType(type);
    setTimeout(() => {
      setActionModalOpen(false);
      setActionType(null);
      setSelectedEmployee(null);
      // In a real app, this would trigger an API call
    }, 2000);
  };

  return (
    <div className="min-h-screen font-sans text-slate-200 selection:bg-teal-500 selection:text-white" style={{ backgroundColor: colors.bg }}>
      
      {/* 5.4 Top Navigation Bar (Health Weather Bar) */}
      <header className="border-b border-gray-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-90" style={{ backgroundColor: colors.bg }}>
        <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-teal-600 to-emerald-400 flex items-center justify-center font-bold text-white">C</div>
              <span className="font-bold text-lg tracking-wide text-white">Clarify Eye Center</span>
            </div>
            <div className="h-6 w-px bg-gray-700 mx-2"></div>
            
            {/* Weather Metrics */}
            <div className="hidden md:flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Users size={16} style={{ color: colors.teal }} />
                <span className="text-gray-400">全院出勤率:</span>
                <span className="font-mono font-bold text-white">98.5%</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart size={16} style={{ color: colors.amber }} />
                <span className="text-gray-400">今日 EAP 預約:</span>
                <span className="font-mono font-bold text-white">3</span>
              </div>
              <div className="flex items-center gap-2">
                <Sun size={16} className="text-yellow-400" />
                <span className="text-gray-400">平均心情指數:</span>
                <span className="font-mono font-bold text-white">7.8</span>
                <span className="text-xs text-gray-500">/ 10</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="text" 
                placeholder="搜尋員工或數據..." 
                className="bg-[#1A1A1A] border border-gray-700 rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:border-teal-500 w-64 transition-colors"
              />
            </div>
            <button className="p-2 hover:bg-gray-800 rounded-full relative">
              <Bell size={20} className="text-gray-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-700 border border-gray-600 overflow-hidden">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 py-6">
        
        {/* Role Based Title */}
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">總院長戰略儀表板 (Executive View)</h1>
            <p className="text-sm text-gray-500">數據更新時間: 2025-10-24 08:30 AM</p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-xs font-medium rounded border border-gray-700 hover:bg-gray-800 text-gray-300 transition-colors">匯出報告</button>
            <button className="px-3 py-1.5 text-xs font-medium rounded bg-teal-700 hover:bg-teal-600 text-white transition-colors flex items-center gap-1">
              <Activity size={14} /> 沙盤推演 (What-If)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          
          {/* LEFT MAIN AREA - 8 Cols */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
            
            {/* 5.1 & 5.4 Risk Radar & Trends */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card: Burnout Radar */}
              <div className="rounded-xl border border-gray-800 p-5 shadow-lg" style={{ backgroundColor: colors.surface }}>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg text-gray-200">全院倦怠風險雷達</h3>
                  <span className="px-2 py-0.5 rounded text-xs bg-red-900/30 text-red-400 border border-red-900/50">高風險區域: 視覺負荷</span>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid stroke="#333" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 12 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                      <Radar
                        name="目前狀態"
                        dataKey="A"
                        stroke={colors.coral}
                        strokeWidth={2}
                        fill={colors.coral}
                        fillOpacity={0.2}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', color: '#fff' }}
                        itemStyle={{ color: colors.coral }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 text-xs text-gray-500 text-center">
                  * 數據來源：工時系統、VFLI 監測、HR 訪談
                </div>
              </div>

              {/* Card: VFLI Trend */}
              <div className="rounded-xl border border-gray-800 p-5 shadow-lg" style={{ backgroundColor: colors.surface }}>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg text-gray-200">視覺負荷 vs 手術量</h3>
                  <div className="flex gap-2 text-xs">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-500"></span>手術量</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span>VFLI</span>
                  </div>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                      <XAxis dataKey="month" stroke="#666" fontSize={12} tickLine={false} />
                      <YAxis yAxisId="left" stroke="#666" fontSize={12} tickLine={false} />
                      <YAxis yAxisId="right" orientation="right" stroke="#666" fontSize={12} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333' }}
                        labelStyle={{ color: '#fff' }}
                      />
                      <Line yAxisId="left" type="monotone" dataKey="手術量" stroke={colors.teal} strokeWidth={2} dot={{r: 4, fill: colors.teal}} activeDot={{ r: 6 }} />
                      <Line yAxisId="right" type="monotone" dataKey="VFLI" stroke={colors.amber} strokeWidth={2} dot={{r: 4, fill: colors.amber}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-amber-400 bg-amber-900/20 p-2 rounded">
                  <AlertTriangle size={12} />
                  <span>洞察：5月 VFLI 飆升與手術量高峰並未完全同步，疑因人力短缺。</span>
                </div>
              </div>
            </div>

            {/* Bottom: Wellness Metrics (EAP ROI) */}
            <div className="rounded-xl border border-gray-800 p-5 shadow-lg flex-1" style={{ backgroundColor: colors.surface }}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg text-gray-200">EAP 投資效益分析 (ROI)</h3>
                  <select className="bg-black/20 border border-gray-700 text-xs rounded px-2 py-1 text-gray-400">
                    <option>近四季度</option>
                  </select>
                </div>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={wellnessData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                      <XAxis type="number" stroke="#666" fontSize={12} />
                      <YAxis dataKey="month" type="category" stroke="#666" fontSize={12} width={30} />
                      <Tooltip cursor={{fill: '#ffffff05'}} contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333' }} />
                      <Legend />
                      <Bar dataKey="EAP使用率" stackId="a" fill={colors.teal} barSize={20} radius={[0, 4, 4, 0]} />
                      <Bar dataKey="留任率" stackId="a" fill="#3B82F6" barSize={20} radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR - 4 Cols */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            
            {/* 5.3 & 5.4 Priority Watchlist */}
            <div className="rounded-xl border border-gray-800 shadow-lg flex-1 overflow-hidden flex flex-col" style={{ backgroundColor: colors.surface }}>
              <div className="p-5 border-b border-gray-800 flex justify-between items-center">
                <h3 className="font-bold text-lg text-white">優先關注名單</h3>
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">3</span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {employees.map((emp) => (
                  <div key={emp.id} className="group p-3 rounded-lg hover:bg-[#252525] transition-all border border-transparent hover:border-gray-700 relative">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                          emp.status === 'critical' ? 'bg-red-900/50 text-red-200' :
                          emp.status === 'warning' ? 'bg-amber-900/50 text-amber-200' :
                          'bg-teal-900/50 text-teal-200'
                        }`}>
                          {emp.name[0]}
                        </div>
                        <div>
                          <div className="font-bold text-gray-200 flex items-center gap-2">
                            {emp.name}
                            <span className="text-xs font-normal text-gray-500 bg-black/30 px-1.5 rounded">{emp.role}</span>
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5">Risk Score: <span className={
                            emp.status === 'critical' ? 'text-red-400 font-bold' : 'text-amber-400'
                          }>{emp.riskScore}</span></div>
                        </div>
                      </div>
                      
                      {/* Action Button - 5.3 A */}
                      <button 
                        onClick={() => handleActionClick(emp)}
                        className={`text-xs px-3 py-1.5 rounded font-medium transition-colors ${
                          emp.status === 'critical' 
                            ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/20 shadow-lg animate-pulse' 
                            : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                        }`}
                      >
                        Take Action
                      </button>
                    </div>
                    
                    {/* Detail Metric */}
                    <div className="mt-2 text-xs p-2 rounded bg-black/20 text-gray-400 border border-gray-800/50">
                      {emp.detail}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t border-gray-800 bg-[#161616]">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-amber-900/20 text-amber-500 mt-1">
                     <AlertTriangle size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-300">排班合規預警</h4>
                    <p className="text-xs text-gray-500 mt-1">下週有 <span className="text-white font-bold">2</span> 位員工可能違反勞基法第36條 (七休一)。</p>
                    <button className="text-xs text-teal-400 mt-2 hover:underline">立即修正排班 &rarr;</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions / What-if Teaser */}
            <div className="rounded-xl border border-gray-800 p-5 shadow-lg bg-gradient-to-br from-[#1E1E1E] to-[#161616]">
              <h3 className="font-bold text-gray-200 mb-3 flex items-center gap-2">
                <Activity size={18} className="text-teal-500"/> 
                人力資源沙盤推演
              </h3>
              <p className="text-xs text-gray-500 mb-4">預測業務擴張對團隊疲勞度的影響。</p>
              
              <div className="space-y-3">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>門診量預估增加</span>
                  <span className="text-teal-400">+20%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-600 w-[20%]"></div>
                </div>
                
                <div className="p-3 bg-black/30 rounded border border-gray-800 mt-2">
                   <div className="flex justify-between items-center text-xs mb-1">
                     <span className="text-gray-400">預估加班費</span>
                     <span className="text-red-400 flex items-center gap-1"><ArrowUpRight size={12}/> 15%</span>
                   </div>
                   <div className="flex justify-between items-center text-xs">
                     <span className="text-gray-400">VFLI 超標人數</span>
                     <span className="text-red-400 flex items-center gap-1"><ArrowUpRight size={12}/> +3 人</span>
                   </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* 5.3 A - Action Modal */}
      {actionModalOpen && selectedEmployee && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#1E1E1E] border border-gray-700 rounded-xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all scale-100">
            
            {actionType ? (
               // Success State
               <div className="p-8 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
                 <div className="w-16 h-16 bg-teal-900/30 text-teal-400 rounded-full flex items-center justify-center mb-4 border border-teal-900">
                   <UserCheck size={32} />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2">行動已執行</h3>
                 <p className="text-gray-400 text-sm">已對 {selectedEmployee.name} 執行「{
                    actionType === 'message' ? '發送關懷訊息' : 
                    actionType === 'schedule' ? '鎖定排班限制' : '推薦 EAP 資源'
                 }」。</p>
               </div>
            ) : (
              // Selection State
              <>
                <div className="p-6 border-b border-gray-800">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    對 {selectedEmployee.name} 採取行動
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">偵測到 {selectedEmployee.riskScore} 分的高風險指標，建議立即干預。</p>
                </div>
                <div className="p-4 space-y-3">
                  
                  <button 
                    onClick={() => handleActionConfirm('message')}
                    className="w-full text-left p-4 rounded-lg bg-[#252525] hover:bg-[#2D2D2D] border border-gray-700 hover:border-teal-500/50 group transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-full bg-blue-900/30 text-blue-400 group-hover:bg-blue-900/50">
                        <MessageCircle size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-gray-200 group-hover:text-white">發送關懷訊息</div>
                        <div className="text-xs text-gray-500 mt-1">自動帶入非指責性範本，可透過 LINE 發送。</div>
                      </div>
                    </div>
                  </button>

                  <button 
                    onClick={() => handleActionConfirm('schedule')}
                    className="w-full text-left p-4 rounded-lg bg-[#252525] hover:bg-[#2D2D2D] border border-gray-700 hover:border-amber-500/50 group transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-full bg-amber-900/30 text-amber-400 group-hover:bg-amber-900/50">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-gray-200 group-hover:text-white">調整排班 & 鎖定工時</div>
                        <div className="text-xs text-gray-500 mt-1">跳轉至排班表，並強制鎖定下週加班功能。</div>
                      </div>
                    </div>
                  </button>

                  <button 
                    onClick={() => handleActionConfirm('eap')}
                    className="w-full text-left p-4 rounded-lg bg-[#252525] hover:bg-[#2D2D2D] border border-gray-700 hover:border-pink-500/50 group transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-full bg-pink-900/30 text-pink-400 group-hover:bg-pink-900/50">
                        <Heart size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-gray-200 group-hover:text-white">推薦 EAP 資源</div>
                        <div className="text-xs text-gray-500 mt-1">匿名寄送心理諮商預約連結。</div>
                      </div>
                    </div>
                  </button>

                </div>
                <div className="p-4 border-t border-gray-800 flex justify-end">
                  <button 
                    onClick={() => setActionModalOpen(false)}
                    className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    取消
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;