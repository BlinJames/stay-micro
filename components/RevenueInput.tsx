'use client';

import { Euro, Wallet } from 'lucide-react';

interface RevenueInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function RevenueInput({ value, onChange }: RevenueInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseFloat(e.target.value) || 0;
    onChange(numValue);
  };

  return (
    <div className="card animate-slide-up">
      <div className="flex items-center gap-2 mb-4">
        <Wallet className="w-5 h-5 text-accent" />
        <h3 className="section-title mb-0">
          Combien avez-vous déjà gagné cette année ?
        </h3>
      </div>

      <label className="label" htmlFor="earned-ca">
        Montant déjà encaissé (HT)
      </label>
      <div className="relative">
        <input
          id="earned-ca"
          type="number"
          min="0"
          step="100"
          value={value || ''}
          onChange={handleChange}
          placeholder="0"
          className="input-field pr-12"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
          <Euro className="w-5 h-5" />
        </div>
      </div>
      <p className="microcopy">
        Incluez uniquement le CA effectivement encaissé sur votre compte
      </p>
    </div>
  );
}
