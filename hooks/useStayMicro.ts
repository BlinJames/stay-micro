'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  THRESHOLD,
  DEFAULT_VAT_RATE,
  calculateRemainingCA,
  calculateTotalEngaged,
  getProgressPercentage,
  getStatusColor,
  calculateMonthlyLimit,
  getMonthsRemaining,
  calculateAverageMonthlyRate,
  getRecommendation,
  predictOverflowMonth,
  type StatusColor,
  type VATRate,
} from '@/lib/calculations';

const STORAGE_KEY = 'stay-micro-data';

export interface Mission {
  id: string;
  tjm: number;
  days: number;
  amountHT: number;
}

interface StayMicroState {
  earnedCA: number;
  securedCA: number;
  vatEnabled: boolean;
  vatRate: VATRate;
  missions: Mission[];
  defaultTJM: number;
}

interface StayMicroComputed {
  totalEngaged: number;
  remainingCA: number;
  progressPercentage: number;
  statusColor: StatusColor;
  monthlyLimit: number;
  monthsRemaining: number;
  averageMonthlyRate: number;
  overflowMonth: string | null;
  recommendation: { message: string; type: StatusColor };
  remainingDays: number | null;
}

const defaultState: StayMicroState = {
  earnedCA: 0,
  securedCA: 0,
  vatEnabled: false,
  vatRate: DEFAULT_VAT_RATE as VATRate,
  missions: [],
  defaultTJM: 0,
};

function loadFromStorage(): StayMicroState {
  if (typeof window === 'undefined') return defaultState;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...defaultState,
        ...parsed,
        vatRate: parsed.vatRate || DEFAULT_VAT_RATE,
      };
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }

  return defaultState;
}

function saveToStorage(state: StayMicroState): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

export function useStayMicro() {
  const [state, setState] = useState<StayMicroState>(defaultState);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const loaded = loadFromStorage();
    setState(loaded);
    setIsLoaded(true);
  }, []);

  // Save to localStorage on state change
  useEffect(() => {
    if (isLoaded) {
      saveToStorage(state);
    }
  }, [state, isLoaded]);

  // Computed values
  const computed: StayMicroComputed = useMemo(() => {
    const totalEngaged = calculateTotalEngaged(state.earnedCA, state.securedCA);
    const remainingCA = calculateRemainingCA(state.earnedCA, state.securedCA);
    const progressPercentage = getProgressPercentage(totalEngaged);
    const statusColor = getStatusColor(progressPercentage);
    const monthsRemaining = getMonthsRemaining();
    const monthlyLimit = calculateMonthlyLimit(remainingCA, monthsRemaining);
    const averageMonthlyRate = calculateAverageMonthlyRate(totalEngaged);
    const overflowMonth = predictOverflowMonth(totalEngaged, averageMonthlyRate);
    const recommendation = getRecommendation(
      totalEngaged,
      monthlyLimit,
      averageMonthlyRate,
      monthsRemaining
    );
    const remainingDays = state.defaultTJM > 0 ? Math.floor(remainingCA / state.defaultTJM) : null;

    return {
      totalEngaged,
      remainingCA,
      progressPercentage,
      statusColor,
      monthlyLimit,
      monthsRemaining,
      averageMonthlyRate,
      overflowMonth,
      recommendation,
      remainingDays,
    };
  }, [state.earnedCA, state.securedCA, state.defaultTJM]);

  // Actions
  const setEarnedCA = useCallback((value: number) => {
    setState((prev) => ({ ...prev, earnedCA: Math.max(0, value) }));
  }, []);

  const setSecuredCA = useCallback((value: number) => {
    setState((prev) => ({ ...prev, securedCA: Math.max(0, value) }));
  }, []);

  const setVATEnabled = useCallback((enabled: boolean) => {
    setState((prev) => ({ ...prev, vatEnabled: enabled }));
  }, []);

  const setVATRate = useCallback((rate: VATRate) => {
    setState((prev) => ({ ...prev, vatRate: rate }));
  }, []);

  const setDefaultTJM = useCallback((value: number) => {
    setState((prev) => ({ ...prev, defaultTJM: Math.max(0, value) }));
  }, []);

  const addMission = useCallback((mission: Omit<Mission, 'id'>) => {
    const newMission: Mission = {
      ...mission,
      id: Date.now().toString(),
    };
    setState((prev) => ({
      ...prev,
      missions: [...prev.missions, newMission],
      securedCA: prev.securedCA + mission.amountHT,
    }));
  }, []);

  const removeMission = useCallback((missionId: string) => {
    setState((prev) => {
      const mission = prev.missions.find((m) => m.id === missionId);
      if (!mission) return prev;

      return {
        ...prev,
        missions: prev.missions.filter((m) => m.id !== missionId),
        securedCA: Math.max(0, prev.securedCA - mission.amountHT),
      };
    });
  }, []);

  const resetAll = useCallback(() => {
    setState(defaultState);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return {
    // State
    ...state,
    isLoaded,
    threshold: THRESHOLD,

    // Computed
    ...computed,

    // Actions
    setEarnedCA,
    setSecuredCA,
    setVATEnabled,
    setVATRate,
    setDefaultTJM,
    addMission,
    removeMission,
    resetAll,
  };
}

export type UseStayMicroReturn = ReturnType<typeof useStayMicro>;
