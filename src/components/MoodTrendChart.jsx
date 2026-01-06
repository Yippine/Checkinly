/**
 * MoodTrendChart Component - INC-004
 *
 * Displays daily mood score trends using Recharts LineChart.
 * Uses getMoodColorScheme() for semantic color mapping.
 * Highlights low mood scores (< 5) with warning colors.
 */

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Activity } from 'lucide-react';
import Card from './Card';
import { getMoodColorScheme } from '../utils/colorHelpers';

/**
 * Custom Dot Component with Color Coding
 * - Low mood (< 5): Error color (red)
 * - Medium mood (5-7): Warning color (orange)
 * - High mood (> 7): Success color (green)
 */
const CustomDot = (props) => {
  const { cx, cy, payload } = props;
  const mood = payload.avgMood;

  // Map mood score to color
  const colorScheme = getMoodColorScheme(mood);
  const colorMap = {
    error: '#f5222d',    // Red
    warning: '#faad14',  // Orange
    success: '#52c41a'   // Green
  };

  const fill = colorMap[colorScheme];

  return (
    <circle cx={cx} cy={cy} r={4} fill={fill} stroke="#fff" strokeWidth={2} />
  );
};

/**
 * Custom Tooltip with Color-Coded Mood Indicator
 */
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  const mood = data.avgMood;
  const colorScheme = getMoodColorScheme(mood);

  const bgColorMap = {
    error: 'bg-error-50',
    warning: 'bg-warning-50',
    success: 'bg-success-50'
  };

  const textColorMap = {
    error: 'text-error-600',
    warning: 'text-warning-600',
    success: 'text-success-600'
  };

  return (
    <div className={`${bgColorMap[colorScheme]} border border-neutral-200 rounded-lg p-3 shadow-lg`}>
      <p className="text-xs text-text-secondary mb-1">{data.date}</p>
      <p className={`text-sm font-semibold ${textColorMap[colorScheme]}`}>
        心情分數: {mood.toFixed(1)}
      </p>
    </div>
  );
};

/**
 * MoodTrendChart Component
 *
 * @param {Array} data - Array of {date: string, avgMood: number}
 */
export default function MoodTrendChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Activity size={18} className="text-text-tertiary" strokeWidth={2} />
          <h3 className="text-heading-3 text-text-primary font-semibold">心情指數趨勢</h3>
        </div>
        <div className="text-center py-12 text-text-tertiary">
          <p>無心情指數資料</p>
        </div>
      </Card>
    );
  }

  // Calculate average mood for reference line
  const avgMood = data.reduce((sum, d) => sum + d.avgMood, 0) / data.length;

  return (
    <Card animated={true}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-text-tertiary" strokeWidth={2} />
          <h3 className="text-heading-3 text-text-primary font-semibold">心情指數趨勢分析</h3>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-text-secondary">平均:</span>
          <span className={`font-semibold ${
            avgMood < 5 ? 'text-error-600' :
            avgMood < 7 ? 'text-warning-600' :
            'text-success-600'
          }`}>
            {avgMood.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="h-64 sm:h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8e8e8" />
            <XAxis
              dataKey="date"
              stroke="#d9d9d9"
              tick={{ fontSize: 11, fill: 'rgba(0,0,0,0.45)' }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              domain={[0, 10]}
              ticks={[0, 2, 4, 6, 8, 10]}
              stroke="#d9d9d9"
              tick={{ fontSize: 11, fill: 'rgba(0,0,0,0.45)' }}
              label={{ value: '心情分數', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: 'rgba(0,0,0,0.45)' } }}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Reference line for critical threshold (mood < 5) */}
            <ReferenceLine
              y={5}
              stroke="#faad14"
              strokeDasharray="5 5"
              label={{ value: '警示線', position: 'right', fontSize: 10, fill: '#faad14' }}
            />

            {/* Average line */}
            <ReferenceLine
              y={avgMood}
              stroke="#1890ff"
              strokeDasharray="3 3"
              label={{ value: '平均', position: 'right', fontSize: 10, fill: '#1890ff' }}
            />

            <Line
              type="monotone"
              dataKey="avgMood"
              stroke="#1890ff"
              strokeWidth={2}
              dot={<CustomDot />}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
              animationDuration={800}
              animationEasing="ease-in-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Color Legend */}
      <div className="mt-4 flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-error-500"></div>
          <span className="text-text-secondary">低分 (1-3)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-warning-500"></div>
          <span className="text-text-secondary">中等 (4-6)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-success-500"></div>
          <span className="text-text-secondary">良好 (7-10)</span>
        </div>
      </div>
    </Card>
  );
}
