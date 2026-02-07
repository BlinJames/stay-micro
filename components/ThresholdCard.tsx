'use client';

import { Info } from 'lucide-react';
import { THRESHOLD, formatCurrency } from '@/lib/calculations';

export function ThresholdCard() {
  return (
    <div className="card animate-slide-up">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-accent/10 rounded-lg shrink-0">
          <Info className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">
            Plafond annuel : {formatCurrency(THRESHOLD)}
          </h2>
          <p className="microcopy">
            Chiffre d'affaires HT maximum pour les prestations de services (BNC)
          </p>
        </div>
      </div>
    </div>
  );
}
