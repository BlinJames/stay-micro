'use client';

import { TrendingUp } from 'lucide-react';
import { formatCurrency, getMonthName, type StatusColor } from '@/lib/calculations';

interface RevenueChartProps {
  earnedCA: number;
  monthlyLimit: number;
  monthsRemaining: number;
  statusColor: StatusColor;
}

export function RevenueChart({
  earnedCA,
  monthlyLimit,
  monthsRemaining,
  statusColor,
}: RevenueChartProps) {
  const currentMonth = new Date().getMonth();
  const elapsedMonths = currentMonth + 1; // Months that have passed (including current)

  // Calculate average monthly earnings for past months
  const avgMonthlyEarned = elapsedMonths > 0 ? earnedCA / elapsedMonths : 0;

  // Build data for all 12 months
  const monthsData = Array.from({ length: 12 }, (_, i) => {
    const isPast = i < currentMonth;
    const isCurrent = i === currentMonth;
    const isFuture = i > currentMonth;

    let value: number;
    if (isPast || isCurrent) {
      // Past/current months: show average of what was earned
      value = avgMonthlyEarned;
    } else {
      // Future months: show recommended monthly limit
      value = monthlyLimit;
    }

    return {
      month: getMonthName(i).substring(0, 3),
      value,
      isPast,
      isCurrent,
      isFuture,
    };
  });

  // Find max value for scaling
  const maxValue = Math.max(...monthsData.map(d => d.value), 1);

  // SVG dimensions
  const width = 100;
  const height = 50;
  const padding = { top: 5, bottom: 5, left: 0, right: 0 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Generate points for the curve
  const points = monthsData.map((d, i) => {
    const x = padding.left + (i / 11) * chartWidth;
    const y = padding.top + chartHeight - (d.value / maxValue) * chartHeight;
    return { x, y, ...d };
  });

  // Create smooth curve path using cardinal spline
  const createSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length < 2) return '';

    let path = `M ${pts[0].x},${pts[0].y}`;

    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(pts.length - 1, i + 2)];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }

    return path;
  };

  // Create area path (curve + bottom)
  const createAreaPath = (pts: { x: number; y: number }[]) => {
    const curvePath = createSmoothPath(pts);
    const bottomY = padding.top + chartHeight;
    return `${curvePath} L ${pts[pts.length - 1].x},${bottomY} L ${pts[0].x},${bottomY} Z`;
  };

  const linePath = createSmoothPath(points);
  const areaPath = createAreaPath(points);

  // Gradient colors based on status
  const gradientColors = {
    safe: { start: 'rgb(34, 197, 94)', end: 'rgba(34, 197, 94, 0)' },
    caution: { start: 'rgb(249, 115, 22)', end: 'rgba(249, 115, 22, 0)' },
    danger: { start: 'rgb(239, 68, 68)', end: 'rgba(239, 68, 68, 0)' },
  };

  const strokeColors = {
    safe: '#22c55e',
    caution: '#f97316',
    danger: '#ef4444',
  };

  // Current month indicator position
  const currentMonthX = padding.left + (currentMonth / 11) * chartWidth;

  return (
    <div className="card animate-slide-up">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-accent" />
        <h3 className="section-title mb-0">Projection annuelle</h3>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-500" />
          <span className="text-gray-400">Réalisé ({formatCurrency(avgMonthlyEarned)}/mois)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: strokeColors[statusColor] }} />
          <span className="text-gray-400">Objectif ({formatCurrency(monthlyLimit)}/mois)</span>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-40"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={`gradient-${statusColor}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={gradientColors[statusColor].start} stopOpacity="0.3" />
              <stop offset="100%" stopColor={gradientColors[statusColor].end} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Area fill with gradient */}
          <path
            d={areaPath}
            fill={`url(#gradient-${statusColor})`}
          />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke={strokeColors[statusColor]}
            strokeWidth="0.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Current month vertical line */}
          <line
            x1={currentMonthX}
            y1={padding.top}
            x2={currentMonthX}
            y2={padding.top + chartHeight}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="0.3"
            strokeDasharray="1,1"
          />

          {/* Data points */}
          {points.map((point, i) => (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r={point.isCurrent ? 1.2 : 0.6}
              fill={point.isCurrent ? strokeColors[statusColor] : 'rgba(255,255,255,0.5)'}
            />
          ))}
        </svg>

        {/* Month labels */}
        <div className="flex justify-between mt-2 px-1">
          {monthsData.map((d, i) => (
            <span
              key={i}
              className={`text-xs ${
                d.isCurrent
                  ? 'text-white font-medium'
                  : d.isPast
                  ? 'text-gray-500'
                  : 'text-gray-600'
              }`}
            >
              {d.month}
            </span>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-gray-800 grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-400">Déjà encaissé</span>
          <p className="text-white font-semibold text-lg">{formatCurrency(earnedCA)}</p>
          <span className="text-gray-500 text-xs">sur {elapsedMonths} mois</span>
        </div>
        <div>
          <span className="text-gray-400">Objectif restant</span>
          <p className={`font-semibold text-lg text-status-${statusColor}`}>
            {formatCurrency(monthlyLimit * monthsRemaining)}
          </p>
          <span className="text-gray-500 text-xs">sur {monthsRemaining} mois</span>
        </div>
      </div>
    </div>
  );
}
