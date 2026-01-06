/**
 * Color Helpers for Checkinly Design System
 *
 * This module provides utility functions for mapping dynamic values (e.g., mood scores, risk levels)
 * to semantic color schemes defined in Tailwind CSS configuration.
 *
 * Design System Reference:
 * - Success Palette: Green (#52c41a) - Positive indicators, high mood scores
 * - Warning Palette: Orange (#faad14) - Cautionary states, medium mood scores
 * - Error Palette: Red (#f5222d) - Critical alerts, low mood scores
 *
 * All color schemes align with Ant Design Pro semantics.
 */

/**
 * Get color scheme based on mood score (1-10)
 *
 * Mapping Logic:
 * - Low mood (1-3): Error palette (red) - Indicates concern, requires attention
 * - Medium mood (4-6): Warning palette (orange) - Neutral/moderate state
 * - High mood (7-10): Success palette (green) - Positive, healthy state
 *
 * @param {number} score - Mood score from 1 to 10
 * @returns {'error' | 'warning' | 'success'} Semantic color scheme name
 *
 * @example
 * // Low mood score
 * getMoodColorScheme(2); // Returns 'error'
 *
 * @example
 * // Medium mood score
 * getMoodColorScheme(5); // Returns 'warning'
 *
 * @example
 * // High mood score
 * getMoodColorScheme(8); // Returns 'success'
 *
 * @example
 * // Usage with StatCard component
 * import { getMoodColorScheme } from '@/utils/colorHelpers';
 *
 * const averageMood = 7.8;
 * <StatCard
 *   title="Average Mood"
 *   value={averageMood}
 *   colorScheme={getMoodColorScheme(averageMood)}
 * />
 */
export const getMoodColorScheme = (score) => {
  // Validate input
  if (typeof score !== 'number' || isNaN(score)) {
    console.warn(`[colorHelpers] Invalid mood score: ${score}. Defaulting to 'warning'.`);
    return 'warning';
  }

  // Clamp score to valid range [1, 10]
  const clampedScore = Math.max(1, Math.min(10, score));

  // Apply mapping logic
  if (clampedScore <= 3) {
    return 'error';   // Low mood: bg-error-50, text-error-600, border-error-200
  }
  if (clampedScore <= 6) {
    return 'warning'; // Medium mood: bg-warning-50, text-warning-600, border-warning-200
  }
  return 'success';   // High mood: bg-success-50, text-success-600, border-success-200
};

/**
 * Get detailed color configuration for a mood score
 *
 * Returns Tailwind CSS class names for background, text, and border
 * based on the mood score's color scheme.
 *
 * @param {number} score - Mood score from 1 to 10
 * @returns {Object} Color configuration with Tailwind class names
 * @property {string} bg - Background color class (e.g., 'bg-success-50')
 * @property {string} text - Text color class (e.g., 'text-success-600')
 * @property {string} border - Border color class (e.g., 'border-success-200')
 * @property {string} scheme - Semantic scheme name ('error' | 'warning' | 'success')
 *
 * @example
 * const colorConfig = getMoodColorClasses(8);
 * // Returns:
 * // {
 * //   bg: 'bg-success-50',
 * //   text: 'text-success-600',
 * //   border: 'border-success-200',
 * //   scheme: 'success'
 * // }
 *
 * @example
 * // Usage with custom components
 * const { bg, text, border } = getMoodColorClasses(moodScore);
 * <div className={`${bg} ${text} ${border} rounded-lg p-4`}>
 *   Mood indicator content
 * </div>
 */
export const getMoodColorClasses = (score) => {
  const scheme = getMoodColorScheme(score);

  const classMap = {
    error: {
      bg: 'bg-error-50',
      text: 'text-error-600',
      border: 'border-error-200',
      scheme: 'error'
    },
    warning: {
      bg: 'bg-warning-50',
      text: 'text-warning-600',
      border: 'border-warning-200',
      scheme: 'warning'
    },
    success: {
      bg: 'bg-success-50',
      text: 'text-success-600',
      border: 'border-success-200',
      scheme: 'success'
    }
  };

  return classMap[scheme];
};

/**
 * Get risk level color scheme
 *
 * Maps risk levels to semantic color schemes for consistent visualization
 * across the application.
 *
 * @param {'normal' | 'warning' | 'critical'} riskLevel - Risk assessment level
 * @returns {'success' | 'warning' | 'error'} Semantic color scheme name
 *
 * @example
 * getRiskColorScheme('normal'); // Returns 'success'
 * getRiskColorScheme('warning'); // Returns 'warning'
 * getRiskColorScheme('critical'); // Returns 'error'
 *
 * @example
 * // Usage with risk indicators
 * <Badge colorScheme={getRiskColorScheme(employee.riskLevel)}>
 *   {employee.riskLevel}
 * </Badge>
 */
export const getRiskColorScheme = (riskLevel) => {
  const riskMap = {
    normal: 'success',
    warning: 'warning',
    critical: 'error'
  };

  return riskMap[riskLevel] || 'warning';
};

/**
 * Color Scheme Reference Table
 *
 * Use this reference when building custom components:
 *
 * | Scheme  | Hex Code | Use Cases                           | Tailwind Classes                                |
 * |---------|----------|-------------------------------------|-------------------------------------------------|
 * | success | #52c41a  | High mood, normal risk, positive KPI| bg-success-50, text-success-600, border-success-200 |
 * | warning | #faad14  | Medium mood, warnings, neutral state| bg-warning-50, text-warning-600, border-warning-200 |
 * | error   | #f5222d  | Low mood, critical risk, alerts     | bg-error-50, text-error-600, border-error-200   |
 *
 * Dark Mode Variants (when enabled):
 * - Add `dark:` prefix to classes
 * - Example: `bg-success-50 dark:bg-success-900/20`
 * - Example: `text-success-600 dark:text-success-400`
 * - Example: `border-success-200 dark:border-success-800`
 *
 * Icon Library:
 * - Always use Lucide React icons (https://lucide.dev/icons)
 * - Common icons: Activity, Users, AlertTriangle, Heart, Calendar, TrendingUp, TrendingDown
 *
 * Best Practices:
 * 1. Always use semantic color names (success/warning/error) instead of color names (green/orange/red)
 * 2. Ensure sufficient contrast for WCAG AA compliance
 * 3. Use the `colorScheme` prop with StatCard for consistent styling
 * 4. Apply hover states with transition-all for smooth animations
 */
