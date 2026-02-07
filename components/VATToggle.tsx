'use client';

import { Receipt } from 'lucide-react';
import { VAT_RATES, type VATRate } from '@/lib/calculations';

interface VATToggleProps {
  enabled: boolean;
  rate: VATRate;
  onEnabledChange: (enabled: boolean) => void;
  onRateChange: (rate: VATRate) => void;
}

export function VATToggle({
  enabled,
  rate,
  onEnabledChange,
  onRateChange,
}: VATToggleProps) {
  return (
    <div className="card animate-slide-up">
      <div className="flex items-center gap-2 mb-4">
        <Receipt className="w-5 h-5 text-accent" />
        <h3 className="section-title mb-0">TVA</h3>
      </div>

      <div className="flex items-center justify-between">
        <label htmlFor="vat-toggle" className="text-white cursor-pointer">
          Je facture la TVA
        </label>
        <button
          id="vat-toggle"
          role="switch"
          aria-checked={enabled}
          onClick={() => onEnabledChange(!enabled)}
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
            enabled ? 'bg-accent' : 'bg-gray-700'
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
              enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {enabled && (
        <div className="mt-4 pt-4 border-t border-gray-800">
          <label className="label">Taux de TVA</label>
          <div className="flex gap-2">
            {VAT_RATES.map((vatRate) => (
              <button
                key={vatRate}
                onClick={() => onRateChange(vatRate)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  rate === vatRate
                    ? 'bg-accent text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {vatRate}%
              </button>
            ))}
          </div>
          <p className="microcopy mt-3">
            La TVA sera automatiquement déduite lors du calcul des missions
          </p>
        </div>
      )}
    </div>
  );
}
