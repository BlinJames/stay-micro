'use client';

import { formatCurrency, THRESHOLD, type StatusColor } from '@/lib/calculations';

interface ProgressBarProps {
  percentage: number;
  totalEngaged: number;
  statusColor: StatusColor;
}

export function ProgressBar({
  percentage,
  totalEngaged,
  statusColor,
}: ProgressBarProps) {
  const statusClasses = {
    safe: 'bg-status-safe',
    caution: 'bg-status-caution',
    danger: 'bg-status-danger',
  };

  const statusTextClasses = {
    safe: 'text-status-safe',
    caution: 'text-status-caution',
    danger: 'text-status-danger',
  };

  return (
    <div className="card animate-slide-up">
      <div className="flex justify-between items-center mb-3">
        <span className="text-gray-400">Progression vers le plafond</span>
        <span className={`font-bold text-lg ${statusTextClasses[statusColor]}`}>
          {percentage.toFixed(1)}%
        </span>
      </div>

      <div className="h-4 bg-background rounded-full overflow-hidden mb-3">
        <div
          className={`h-full ${statusClasses[statusColor]} transition-all duration-1000 ease-out rounded-full`}
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-gray-500">
          {formatCurrency(totalEngaged)}
        </span>
        <span className="text-gray-500">
          {formatCurrency(THRESHOLD)}
        </span>
      </div>

      {/* Threshold markers */}
      <div className="relative h-6 mt-2">
        <div className="absolute left-[70%] top-0 w-0.5 h-3 bg-status-caution/50" />
        <div className="absolute left-[90%] top-0 w-0.5 h-3 bg-status-danger/50" />
        <span className="absolute left-[70%] top-3 -translate-x-1/2 text-xs text-status-caution/70">
          70%
        </span>
        <span className="absolute left-[90%] top-3 -translate-x-1/2 text-xs text-status-danger/70">
          90%
        </span>
      </div>
    </div>
  );
}
