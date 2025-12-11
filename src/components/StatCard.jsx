// --- StatCard Component ---
// Professional KPI Card with Ant Design Pro styling
// Enhanced with semantic colors, trend indicators, and gradient icons

import Card from './Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({
  title,
  value,
  subtext,
  icon: IconComponent, // eslint-disable-line no-unused-vars
  colorScheme = 'primary',  // 'primary' | 'success' | 'warning' | 'error'
  trend = null  // { direction: 'up' | 'down', percentage: '12.5', label: '較上月' }
}) => {
  // Semantic color mappings based on design system
  const colorMap = {
    primary: {
      iconBg: 'bg-primary-50',
      iconText: 'text-primary-500',
      valueText: 'text-primary-600'
    },
    success: {
      iconBg: 'bg-success-50',
      iconText: 'text-success-500',
      valueText: 'text-success-600'
    },
    warning: {
      iconBg: 'bg-warning-50',
      iconText: 'text-warning-500',
      valueText: 'text-warning-600'
    },
    error: {
      iconBg: 'bg-error-50',
      iconText: 'text-error-500',
      valueText: 'text-error-600'
    }
  };

  const colors = colorMap[colorScheme] || colorMap.primary;

  return (
    <Card
      className="hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 ease-out"
      animated={true}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-heading-4 text-text-tertiary mb-2">{title}</p>
          <h3 className={`text-display ${colors.valueText} mb-1 font-bold transition-all duration-300`}>{value}</h3>
          {subtext && <p className="text-body-small text-neutral-500 mt-1">{subtext}</p>}

          {/* Trend Indicator */}
          {trend && (
            <div className="flex items-center gap-1 mt-2 animate-fade-in">
              {trend.direction === 'up' ? (
                <TrendingUp size={16} className="text-success-500" strokeWidth={2} />
              ) : (
                <TrendingDown size={16} className="text-error-500" strokeWidth={2} />
              )}
              <span className={`text-xs font-medium ${trend.direction === 'up' ? 'text-success-600' : 'text-error-600'}`}>
                {trend.percentage}%
              </span>
              {trend.label && (
                <span className="text-xs text-neutral-500">{trend.label}</span>
              )}
            </div>
          )}
        </div>

        {/* Icon Container with semantic background */}
        <div className={`p-3 rounded-lg ${colors.iconBg} ${colors.iconText} shadow-sm transition-transform duration-200 hover:scale-110`}>
          <IconComponent size={24} strokeWidth={2} />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
