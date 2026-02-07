'use client';

import { getMonthName, type StatusColor } from '@/lib/calculations';

interface TimelineProps {
  progressPercentage: number;
  statusColor: StatusColor;
}

export function Timeline({ progressPercentage, statusColor }: TimelineProps) {
  const currentMonth = new Date().getMonth();
  const months = Array.from({ length: 12 }, (_, i) => ({
    index: i,
    name: getMonthName(i).substring(0, 3),
    isPast: i < currentMonth,
    isCurrent: i === currentMonth,
    isFuture: i > currentMonth,
  }));

  const statusClasses = {
    safe: 'bg-status-safe',
    caution: 'bg-status-caution',
    danger: 'bg-status-danger',
  };

  return (
    <div className="card animate-slide-up">
      <h3 className="section-title">Calendrier annuel</h3>

      <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
        {months.map((month) => (
          <div
            key={month.index}
            className={`relative flex flex-col items-center p-2 rounded-lg transition-colors ${
              month.isCurrent
                ? `${statusClasses[statusColor]} bg-opacity-20 ring-2 ring-offset-2 ring-offset-background-card ${
                    statusColor === 'safe'
                      ? 'ring-status-safe'
                      : statusColor === 'caution'
                      ? 'ring-status-caution'
                      : 'ring-status-danger'
                  }`
                : month.isPast
                ? 'bg-gray-800/50'
                : 'bg-background'
            }`}
          >
            <span
              className={`text-xs font-medium ${
                month.isCurrent
                  ? 'text-white'
                  : month.isPast
                  ? 'text-gray-500'
                  : 'text-gray-400'
              }`}
            >
              {month.name}
            </span>
            {month.isPast && (
              <div className="w-2 h-2 rounded-full bg-gray-600 mt-1" />
            )}
            {month.isCurrent && (
              <div
                className={`w-2 h-2 rounded-full mt-1 ${statusClasses[statusColor]}`}
              />
            )}
            {month.isFuture && (
              <div className="w-2 h-2 rounded-full bg-gray-700 mt-1" />
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-600" />
          <span>Passé</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${statusClasses[statusColor]}`} />
          <span>Actuel</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-700" />
          <span>À venir</span>
        </div>
      </div>
    </div>
  );
}
