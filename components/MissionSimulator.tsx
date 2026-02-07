'use client';

import { useState } from 'react';
import { Calculator, Plus, Euro, Calendar, Clock } from 'lucide-react';
import {
  calculateMissionImpact,
  formatCurrency,
  type VATRate,
} from '@/lib/calculations';

interface MissionSimulatorProps {
  vatEnabled: boolean;
  vatRate: VATRate;
  onAddMission: (mission: { tjm: number; days: number; amountHT: number }) => void;
}

type InputMode = 'simple' | 'advanced';

// Average weeks per month (52 weeks / 12 months)
const WEEKS_PER_MONTH = 4.33;

export function MissionSimulator({
  vatEnabled,
  vatRate,
  onAddMission,
}: MissionSimulatorProps) {
  const [tjm, setTjm] = useState<number>(0);
  const [inputMode, setInputMode] = useState<InputMode>('simple');

  // Simple mode
  const [days, setDays] = useState<number>(0);

  // Advanced mode
  const [daysPerWeek, setDaysPerWeek] = useState<number>(0);
  const [months, setMonths] = useState<number>(0);

  // Calculate total days based on mode
  const totalDays = inputMode === 'simple'
    ? days
    : Math.round(daysPerWeek * WEEKS_PER_MONTH * months);

  const amountHT = calculateMissionImpact(tjm, totalDays, vatEnabled, vatRate);
  const amountTTC = tjm * totalDays;

  const handleAdd = () => {
    if (tjm > 0 && totalDays > 0) {
      onAddMission({ tjm, days: totalDays, amountHT });
      setTjm(0);
      setDays(0);
      setDaysPerWeek(0);
      setMonths(0);
    }
  };

  const isValid = tjm > 0 && totalDays > 0;

  return (
    <div className="card animate-slide-up">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-accent" />
        <h3 className="section-title mb-0">Simuler une mission</h3>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setInputMode('simple')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            inputMode === 'simple'
              ? 'bg-accent text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          Jours fixes
        </button>
        <button
          onClick={() => setInputMode('advanced')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            inputMode === 'advanced'
              ? 'bg-accent text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          Jours/semaine
        </button>
      </div>

      <div className="space-y-4 mb-4">
        {/* TJM - always visible */}
        <div>
          <label className="label" htmlFor="tjm">
            TJM
          </label>
          <div className="relative">
            <input
              id="tjm"
              type="number"
              min="0"
              step="50"
              value={tjm || ''}
              onChange={(e) => setTjm(parseFloat(e.target.value) || 0)}
              placeholder="500"
              className="input-field pr-12"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
              <Euro className="w-4 h-4" />
            </div>
          </div>
        </div>

        {inputMode === 'simple' ? (
          /* Simple mode - total days */
          <div>
            <label className="label" htmlFor="days">
              Nombre de jours
            </label>
            <div className="relative">
              <input
                id="days"
                type="number"
                min="0"
                step="1"
                value={days || ''}
                onChange={(e) => setDays(parseFloat(e.target.value) || 0)}
                placeholder="10"
                className="input-field pr-12"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
          </div>
        ) : (
          /* Advanced mode - days per week + months */
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="daysPerWeek">
                Jours / semaine
              </label>
              <div className="relative">
                <input
                  id="daysPerWeek"
                  type="number"
                  min="0"
                  max="7"
                  step="0.5"
                  value={daysPerWeek || ''}
                  onChange={(e) => setDaysPerWeek(parseFloat(e.target.value) || 0)}
                  placeholder="3"
                  className="input-field pr-12"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div>
              <label className="label" htmlFor="months">
                Durée (mois)
              </label>
              <div className="relative">
                <input
                  id="months"
                  type="number"
                  min="0"
                  step="1"
                  value={months || ''}
                  onChange={(e) => setMonths(parseFloat(e.target.value) || 0)}
                  placeholder="3"
                  className="input-field pr-12"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Show calculated days in advanced mode */}
      {inputMode === 'advanced' && daysPerWeek > 0 && months > 0 && (
        <div className="bg-background rounded-lg p-3 mb-4 text-sm">
          <span className="text-gray-400">
            {daysPerWeek} j/sem × {months} mois =
          </span>
          <span className="text-white font-medium ml-1">
            {totalDays} jours
          </span>
        </div>
      )}

      {isValid && (
        <div className="bg-background rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Montant total</span>
            <span className="text-white font-medium">
              {formatCurrency(amountTTC)}
              {vatEnabled && ' TTC'}
            </span>
          </div>
          {vatEnabled && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">TVA ({vatRate}%)</span>
              <span className="text-gray-400">
                - {formatCurrency(amountTTC - amountHT)}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center pt-2 border-t border-gray-800">
            <span className="text-accent font-medium">Impact sur le plafond</span>
            <span className="text-accent font-bold text-lg">
              {formatCurrency(amountHT)} HT
            </span>
          </div>
        </div>
      )}

      <button
        onClick={handleAdd}
        disabled={!isValid}
        className={`w-full btn-primary ${
          !isValid && 'opacity-50 cursor-not-allowed'
        }`}
      >
        <Plus className="w-5 h-5" />
        Ajouter au CA sécurisé
      </button>
    </div>
  );
}
