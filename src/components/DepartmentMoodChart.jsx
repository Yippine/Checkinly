/**
 * DepartmentMoodChart Component - INC-004
 *
 * Displays department-level mood scores using Recharts BarChart.
 * Uses color coding (red/yellow/green) based on mood ranges.
 */

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users } from 'lucide-react';
import Card from './Card';
import { getMoodColorScheme } from '../utils/colorHelpers';

/**
 * Get bar color based on mood score
 */
const getMoodColor = (mood) => {
  const score = parseFloat(mood);
  const colorScheme = getMoodColorScheme(score);

  const colorMap = {
    error: '#f5222d',    // Red - Low mood
    warning: '#faad14',  // Orange - Medium mood
    success: '#52c41a'   // Green - High mood
  };

  return colorMap[colorScheme];
};

/**
 * Custom Tooltip with Color-Coded Mood Indicator
 */
const CustomTooltip = ({ active, payload, darkMode }) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  const mood = parseFloat(data.avgMood);
  const colorScheme = getMoodColorScheme(mood);

  const bgColorMap = {
    error: 'bg-error-50 dark:bg-error-900/30',
    warning: 'bg-warning-50 dark:bg-warning-900/30',
    success: 'bg-success-50 dark:bg-success-900/30'
  };

  const textColorMap = {
    error: 'text-error-600 dark:text-error-400',
    warning: 'text-warning-600 dark:text-warning-400',
    success: 'text-success-600 dark:text-success-400'
  };

  const borderColorMap = {
    error: 'border-error-200',
    warning: 'border-warning-200',
    success: 'border-success-200'
  };

  return (
    <div className={`${bgColorMap[colorScheme]} ${borderColorMap[colorScheme]} border ${darkMode ? 'dark:border-slate-600' : ''} rounded-lg p-3 shadow-lg`}>
      <p className={`text-xs ${darkMode ? 'text-slate-300' : 'text-slate-600 dark:text-slate-300'} mb-1`}>{data.name}</p>
      <p className={`text-sm font-semibold ${textColorMap[colorScheme]}`}>
        平均心情分數: {mood.toFixed(1)}
      </p>
    </div>
  );
};

/**
 * DepartmentMoodChart Component
 *
 * @param {Array} data - Array of {name: string, avgMood: string}
 */
export default function DepartmentMoodChart({ data, darkMode }) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Users size={18} className="text-slate-500 dark:text-slate-400" strokeWidth={2} />
          <h3 className="text-heading-3 text-slate-900 dark:text-slate-100 font-semibold">部門心情分析</h3>
        </div>
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          <p>無部門心情資料</p>
        </div>
      </Card>
    );
  }

  // Calculate overall statistics
  const avgMood = data.reduce((sum, d) => sum + parseFloat(d.avgMood), 0) / data.length;
  const lowestDept = data[0]; // Data is already sorted ascending
  const highestDept = data[data.length - 1];

  // Dynamic colors based on dark mode
  const chartColors = {
    grid: darkMode ? '#334155' : '#e8e8e8',
    axis: darkMode ? '#475569' : '#d9d9d9',
    axisText: darkMode ? '#94a3b8' : 'rgba(0,0,0,0.45)',
    axisLabel: darkMode ? '#cbd5e1' : 'rgba(0,0,0,0.65)'
  };

  return (
    <Card animated={true}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users size={18} className="text-slate-500 dark:text-slate-400 dark:text-slate-400" strokeWidth={2} />
          <h3 className="text-heading-3 text-slate-900 dark:text-slate-100 dark:text-slate-100 font-semibold">部門心情分析</h3>
        </div>
        <div className="text-xs text-slate-600 dark:text-slate-300 dark:text-slate-400">
          共 {data.length} 個部門
        </div>
      </div>

      <div className="h-80 sm:h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 100, right: 20, top: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={chartColors.grid} />
            <XAxis
              type="number"
              domain={[0, 10]}
              ticks={[0, 2, 4, 6, 8, 10]}
              stroke={chartColors.axis}
              tick={{ fontSize: 11, fill: chartColors.axisText }}
              label={{ value: '平均心情分數', position: 'insideBottom', offset: -5, fontSize: 11, fill: chartColors.axisText }}
            />
            <YAxis
              dataKey="name"
              type="category"
              width={90}
              stroke={chartColors.axis}
              tick={{ fontSize: 10, fill: chartColors.axisLabel }}
            />
            <Tooltip content={<CustomTooltip darkMode={darkMode} />} cursor={{ fill: 'rgba(24,144,255,0.05)' }} />
            <Bar
              dataKey="avgMood"
              radius={[0, 4, 4, 0]}
              barSize={20}
              isAnimationActive={true}
              animationDuration={800}
              animationEasing="ease-in-out"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getMoodColor(entry.avgMood)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Statistics Summary */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-neutral-50 dark:bg-slate-700 rounded-lg border border-neutral-200 dark:border-slate-700 dark:border-slate-600">
          <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-400 mb-1">整體平均</p>
          <p className={`text-lg font-bold ${
            avgMood < 5 ? 'text-error-600 dark:text-error-400' :
            avgMood < 7 ? 'text-warning-600 dark:text-warning-400' :
            'text-success-600 dark:text-success-400'
          }`}>
            {avgMood.toFixed(1)}
          </p>
        </div>
        <div className="p-3 bg-error-50 dark:bg-error-900/30 rounded-lg border border-error-200 dark:border-error-800">
          <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-400 mb-1">最需關注</p>
          <p className="text-sm font-semibold text-error-600 dark:text-error-400 truncate" title={lowestDept.name}>
            {lowestDept.name}
          </p>
          <p className="text-xs text-error-500 dark:text-error-400 mt-1">{lowestDept.avgMood}</p>
        </div>
        <div className="p-3 bg-success-50 dark:bg-success-900/30 rounded-lg border border-success-200 dark:border-success-800">
          <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-400 mb-1">表現最佳</p>
          <p className="text-sm font-semibold text-success-600 dark:text-success-400 truncate" title={highestDept.name}>
            {highestDept.name}
          </p>
          <p className="text-xs text-success-500 dark:text-success-400 mt-1">{highestDept.avgMood}</p>
        </div>
      </div>

      {/* Color Legend */}
      <div className="mt-4 flex items-center justify-center gap-6 text-xs border-t border-neutral-100 dark:border-slate-700 pt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-error-500"></div>
          <span className="text-slate-600 dark:text-slate-300 dark:text-slate-400">低分 (1-3) - 需立即關注</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-warning-500"></div>
          <span className="text-slate-600 dark:text-slate-300 dark:text-slate-400">中等 (4-6) - 需持續觀察</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-success-500"></div>
          <span className="text-slate-600 dark:text-slate-300 dark:text-slate-400">良好 (7-10) - 維持現狀</span>
        </div>
      </div>
    </Card>
  );
}
