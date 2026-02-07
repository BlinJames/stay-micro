'use client';

import { TrendingUp, TrendingDown, Calendar, Briefcase, Euro } from 'lucide-react';
import { formatCurrency, type StatusColor } from '@/lib/calculations';

interface ResultsCardProps {
  totalEngaged: number;
  remainingCA: number;
  monthlyLimit: number;
  monthsRemaining: number;
  statusColor: StatusColor;
  defaultTJM: number;
  remainingDays: number | null;
  onTJMChange: (value: number) => void;
}

export function ResultsCard({
  totalEngaged,
  remainingCA,
  monthlyLimit,
  monthsRemaining,
  statusColor,
  defaultTJM,
  remainingDays,
  onTJMChange,
}: ResultsCardProps) {
  const statusClasses = {
    safe: 'text-status-safe',
    caution: 'text-status-caution',
    danger: 'text-status-danger',
  };

  return (
    <div className="card animate-slide-up">
      <h3 className="section-title">Votre situation</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-background rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">CA engagé</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {formatCurrency(totalEngaged)}
          </p>
        </div>

        <div className="bg-background rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className={`w-4 h-4 ${statusClasses[statusColor]}`} />
            <span className="text-sm text-gray-400">CA restant</span>
          </div>
          <p className={`text-2xl font-bold ${statusClasses[statusColor]}`}>
            {formatCurrency(remainingCA)}
          </p>
        </div>

        <div className="bg-background rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Max conseillé/mois</span>
          </div>
          <p className="text-xl font-bold text-white">
            {monthsRemaining > 0 ? formatCurrency(monthlyLimit) : '-'}
          </p>
        </div>

        <div className="bg-background rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Mois restants</span>
          </div>
          <p className="text-xl font-bold text-white">
            {monthsRemaining} mois
          </p>
        </div>
      </div>

      {/* TJM input and remaining days */}
      <div className="mt-4 pt-4 border-t border-gray-800">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <label className="text-sm text-gray-400 mb-2 block">
              Votre TJM moyen
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="50"
                value={defaultTJM || ''}
                onChange={(e) => onTJMChange(parseFloat(e.target.value) || 0)}
                placeholder="500"
                className="input-field pr-12"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                <Euro className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="flex-1 bg-background rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className={`w-4 h-4 ${remainingDays !== null ? statusClasses[statusColor] : 'text-gray-400'}`} />
              <span className="text-sm text-gray-400">Jours restants</span>
            </div>
            <p className={`text-2xl font-bold ${remainingDays !== null ? statusClasses[statusColor] : 'text-gray-500'}`}>
              {remainingDays !== null ? (
                <>
                  {remainingDays} <span className="text-lg font-normal">jours</span>
                </>
              ) : (
                <span className="text-base font-normal">Entrez votre TJM</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
