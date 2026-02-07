'use client';

import { Euro, FileCheck } from 'lucide-react';

interface SecuredInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function SecuredInput({ value, onChange }: SecuredInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseFloat(e.target.value) || 0;
    onChange(numValue);
  };

  return (
    <div className="card animate-slide-up">
      <div className="flex items-center gap-2 mb-4">
        <FileCheck className="w-5 h-5 text-accent" />
        <h3 className="section-title mb-0">
          Combien avez-vous déjà sécurisé ?
        </h3>
      </div>

      <label className="label" htmlFor="secured-ca">
        CA sécurisé (HT)
      </label>
      <div className="relative">
        <input
          id="secured-ca"
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
        Contrats signés, devis acceptés, facturation future quasi certaine
      </p>
    </div>
  );
}
