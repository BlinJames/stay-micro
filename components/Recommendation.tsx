'use client';

import { Lightbulb, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { type StatusColor } from '@/lib/calculations';

interface RecommendationProps {
  message: string;
  type: StatusColor;
}

export function Recommendation({ message, type }: RecommendationProps) {
  const configs = {
    safe: {
      bgClass: 'bg-status-safe/10 border-status-safe/20',
      textClass: 'text-status-safe',
      Icon: CheckCircle,
    },
    caution: {
      bgClass: 'bg-status-caution/10 border-status-caution/20',
      textClass: 'text-status-caution',
      Icon: AlertTriangle,
    },
    danger: {
      bgClass: 'bg-status-danger/10 border-status-danger/20',
      textClass: 'text-status-danger',
      Icon: XCircle,
    },
  };

  const config = configs[type];
  const { Icon } = config;

  return (
    <div
      className={`card border ${config.bgClass} animate-slide-up`}
    >
      <div className="flex items-start gap-3">
        <div className={`shrink-0 ${config.textClass}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-semibold text-white mb-1 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-accent" />
            Recommandation
          </h3>
          <p className="text-gray-300 leading-relaxed">{message}</p>
        </div>
      </div>
    </div>
  );
}
