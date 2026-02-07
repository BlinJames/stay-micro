'use client';

import { AlertCircle } from 'lucide-react';

export function Disclaimer() {
  return (
    <div className="mt-8 p-4 bg-gray-900/50 rounded-lg border border-gray-800 animate-fade-in">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
        <div className="text-sm text-gray-500 leading-relaxed">
          <p className="font-medium text-gray-400 mb-1">Avertissement légal</p>
          <p>
            Cet outil est fourni à titre indicatif uniquement et ne constitue pas
            un conseil fiscal ou juridique. Les calculs sont basés sur le plafond
            de 77 700 € HT applicable aux prestations de services (BNC) en 2024.
            Pour toute question spécifique à votre situation, consultez un
            expert-comptable ou les services fiscaux. Les données sont stockées
            localement sur votre appareil et ne sont pas transmises à des tiers.
          </p>
        </div>
      </div>
    </div>
  );
}
