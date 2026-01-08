/**
 * BurnoutTrendChart Component - INC-006
 *
 * Displays department burnout trends over time using Recharts LineChart.
 * Supports three questionnaire types: Stanford (1-5), CBI (0-100), OLBI (1-4).
 * Shows multiple department lines with color-coded risk levels.
 *
 * Reference: Based on MoodTrendChart.jsx pattern
 */

import React, { useMemo, useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";
import { TrendingUp } from "lucide-react";
import Card from "./Card";

/**
 * Color palette for department lines (distinct colors)
 */
const DEPARTMENT_COLORS = [
  "#f5222d", // Red - 護理部 (high stress)
  "#fa8c16", // Orange - 醫療部 (high stress)
  "#faad14", // Gold - 檢驗部 (medium stress)
  "#52c41a", // Green - 藥劑部 (medium stress)
  "#1890ff", // Blue - 行政部 (low stress)
  "#722ed1", // Purple - 資訊部 (low stress)
];

/**
 * Get color based on burnout score and questionnaire type
 */
const getScoreColor = (score, questionnaireType) => {
  if (questionnaireType === "stanford") {
    if (score >= 3.5) return "#f5222d"; // High risk - red
    if (score >= 2) return "#faad14"; // Moderate risk - orange
    return "#52c41a"; // Low risk - green
  } else if (questionnaireType === "cbi") {
    if (score >= 75) return "#f5222d";
    if (score >= 50) return "#faad14";
    return "#52c41a";
  } else if (questionnaireType === "olbi") {
    if (score >= 3.0) return "#f5222d";
    if (score >= 2.25) return "#faad14";
    return "#52c41a";
  }
  return "#1890ff";
};

/**
 * Custom Dot Component with Risk Level Color Coding
 */
const CustomDot = (props) => {
  const { cx, cy, payload, questionnaireType } = props;
  const score = payload.avgScore;

  const fill = getScoreColor(score, questionnaireType);

  return (
    <circle cx={cx} cy={cy} r={3} fill={fill} stroke="#fff" strokeWidth={1.5} />
  );
};

/**
 * Custom Tooltip with Department + Month + Score
 * Shows data for ALL departments at the hovered month
 */
const CustomTooltip = ({ active, payload, questionnaireType }) => {
  if (!active || !payload || !payload.length) return null;

  // Get month from the first payload item
  const monthData = payload[0].payload;
  const month = monthData.month;

  // Filter out entries with valid scores and sort by score (high to low)
  const validEntries = payload
    .filter(
      (entry) =>
        entry.value !== undefined &&
        entry.value !== null &&
        !isNaN(entry.value)
    )
    .sort((a, b) => b.value - a.value); // Sort descending by score

  if (validEntries.length === 0) return null;

  // Helper function to determine risk level
  const getRiskLevel = (score) => {
    if (questionnaireType === "stanford") {
      if (score >= 3.5) return { label: "高風險", color: "text-error-600" };
      if (score >= 2) return { label: "中度風險", color: "text-warning-600" };
      return { label: "低風險", color: "text-success-600" };
    } else if (questionnaireType === "cbi") {
      if (score >= 75) return { label: "高風險", color: "text-error-600" };
      if (score >= 50) return { label: "中度風險", color: "text-warning-600" };
      return { label: "低風險", color: "text-success-600" };
    } else if (questionnaireType === "olbi") {
      if (score >= 3.0) return { label: "高風險", color: "text-error-600" };
      if (score >= 2.25) return { label: "中度風險", color: "text-warning-600" };
      return { label: "低風險", color: "text-success-600" };
    }
    return { label: "正常", color: "text-slate-600 dark:text-slate-300" };
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-lg p-3 shadow-lg dark:shadow-slate-900/50 max-w-xs">
      <p className="text-xs text-slate-600 dark:text-slate-300 mb-2 font-semibold border-b border-neutral-200 dark:border-slate-700 pb-1">
        {month}
      </p>
      <div className="space-y-1.5">
        {validEntries.map((entry, index) => {
          const department = entry.dataKey;
          const score = entry.value;
          const risk = getRiskLevel(score);

          return (
            <div key={index} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.stroke }}
                ></div>
                <span className="text-xs text-slate-900 dark:text-slate-100">{department}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  {score.toFixed(2)}
                </span>
                <span className={`text-xs ${risk.color}`}>
                  {risk.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * BurnoutTrendChart Component
 *
 * @param {Array} data - Array of {department, month, avgScore, employeeCount}
 * @param {string} questionnaireType - 'stanford' | 'cbi' | 'olbi'
 */
export default function BurnoutTrendChart({ data, questionnaireType }) {
  // Detect dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if dark mode is enabled
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);

    // Watch for changes in dark mode
    const observer = new MutationObserver(() => {
      const isDarkNow = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDarkNow);
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  // Transform data for Recharts (group by month, separate lines per department)
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Get unique months
    const months = [...new Set(data.map((d) => d.month))].sort();

    // Get unique departments
    const departments = [...new Set(data.map((d) => d.department))];

    // Create data structure: [{month, dept1: score, dept2: score, ...}]
    return months.map((month) => {
      const monthData = { month };
      departments.forEach((dept) => {
        const entry = data.find(
          (d) => d.month === month && d.department === dept
        );
        if (entry) {
          monthData[dept] = entry.avgScore;
        }
      });
      return monthData;
    });
  }, [data]);

  // Get unique departments for lines
  const departments = useMemo(() => {
    if (!data || data.length === 0) return [];
    return [...new Set(data.map((d) => d.department))];
  }, [data]);

  // Calculate Y-axis domain based on questionnaire type
  const yAxisConfig = useMemo(() => {
    if (questionnaireType === "stanford") {
      return { domain: [1, 5], ticks: [1, 2, 3, 4, 5], label: "平均倦怠分數 (1-5)" };
    } else if (questionnaireType === "cbi") {
      return { domain: [0, 100], ticks: [0, 25, 50, 75, 100], label: "平均倦怠分數 (0-100)" };
    } else if (questionnaireType === "olbi") {
      return { domain: [1, 4], ticks: [1, 2, 3, 4], label: "平均倦怠分數 (1-4)" };
    }
    return { domain: [0, 10], ticks: [0, 2, 4, 6, 8, 10], label: "分數" };
  }, [questionnaireType]);

  // Calculate risk threshold for reference line
  const riskThreshold = useMemo(() => {
    if (questionnaireType === "stanford") return 3.5;
    if (questionnaireType === "cbi") return 75;
    if (questionnaireType === "olbi") return 3.0;
    return 5;
  }, [questionnaireType]);

  // Empty state
  if (!data || data.length === 0) {
    return (
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp
            size={18}
            className="text-slate-500 dark:text-slate-400"
            strokeWidth={2}
          />
          <h3 className="text-heading-3 text-slate-900 dark:text-slate-100 font-semibold">
            部門倦怠趨勢
          </h3>
        </div>
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          <p>無倦怠趨勢資料</p>
        </div>
      </Card>
    );
  }

  return (
    <Card animated={true}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp
            size={18}
            className="text-slate-500 dark:text-slate-400"
            strokeWidth={2}
          />
          <h3 className="text-heading-3 text-slate-900 dark:text-slate-100 font-semibold">
            部門倦怠趨勢分析
          </h3>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {questionnaireType === "stanford" && "Stanford 量表 (1-5)"}
          {questionnaireType === "cbi" && "CBI 量表 (0-100)"}
          {questionnaireType === "olbi" && "OLBI 量表 (1-4)"}
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={isDarkMode ? "#475569" : "#e8e8e8"}
            />
            <XAxis
              dataKey="month"
              stroke={isDarkMode ? "#475569" : "#d9d9d9"}
              tick={{ fontSize: 11, fill: isDarkMode ? "#94a3b8" : "rgba(0,0,0,0.45)" }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              domain={yAxisConfig.domain}
              ticks={yAxisConfig.ticks}
              stroke={isDarkMode ? "#475569" : "#d9d9d9"}
              tick={{ fontSize: 11, fill: isDarkMode ? "#94a3b8" : "rgba(0,0,0,0.45)" }}
              label={{
                value: yAxisConfig.label,
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 11, fill: isDarkMode ? "#94a3b8" : "rgba(0,0,0,0.45)" },
              }}
            />
            <Tooltip
              content={
                <CustomTooltip questionnaireType={questionnaireType} />
              }
            />
            <Legend
              wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
              iconType="line"
            />

            {/* Risk Threshold Reference Line */}
            <ReferenceLine
              y={riskThreshold}
              stroke="#f5222d"
              strokeDasharray="5 5"
              label={{
                value: "高風險線",
                position: "right",
                fontSize: 10,
                fill: "#f5222d",
              }}
            />

            {/* Department Lines */}
            {departments.map((dept, index) => (
              <Line
                key={dept}
                type="monotone"
                dataKey={dept}
                stroke={DEPARTMENT_COLORS[index % DEPARTMENT_COLORS.length]}
                strokeWidth={2}
                dot={<CustomDot questionnaireType={questionnaireType} />}
                activeDot={{ r: 5 }}
                name={dept}
                isAnimationActive={true}
                animationDuration={800}
                animationEasing="ease-in-out"
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Risk Level Legend */}
      <div className="mt-4 flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-success-500"></div>
          <span className="text-slate-600 dark:text-slate-300">低風險</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-warning-500"></div>
          <span className="text-slate-600 dark:text-slate-300">中度風險</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-error-500"></div>
          <span className="text-slate-600 dark:text-slate-300">高風險</span>
        </div>
      </div>
    </Card>
  );
}
