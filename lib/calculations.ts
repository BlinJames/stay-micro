// Constants
export const THRESHOLD = 77700; // €77,700 HT
export const DEFAULT_VAT_RATE = 20;
export const VAT_RATES = [20, 10, 5.5] as const;

export type VATRate = (typeof VAT_RATES)[number];
export type StatusColor = 'safe' | 'caution' | 'danger';

/**
 * Calculate remaining CA before reaching the threshold
 */
export function calculateRemainingCA(earned: number, secured: number): number {
  const total = earned + secured;
  return Math.max(0, THRESHOLD - total);
}

/**
 * Calculate total engaged CA (earned + secured)
 */
export function calculateTotalEngaged(earned: number, secured: number): number {
  return earned + secured;
}

/**
 * Convert TTC amount to HT by removing VAT
 */
export function convertTTCtoHT(amountTTC: number, vatRate: number): number {
  return amountTTC / (1 + vatRate / 100);
}

/**
 * Convert HT amount to TTC by adding VAT
 */
export function convertHTtoTTC(amountHT: number, vatRate: number): number {
  return amountHT * (1 + vatRate / 100);
}

/**
 * Get the number of months remaining in the current year
 */
export function getMonthsRemaining(currentDate: Date = new Date()): number {
  const currentMonth = currentDate.getMonth(); // 0-indexed
  return 12 - currentMonth - 1; // -1 because we don't count current month as full
}

/**
 * Calculate the maximum monthly amount to stay under threshold
 */
export function calculateMonthlyLimit(
  remaining: number,
  monthsLeft: number
): number {
  if (monthsLeft <= 0) return remaining;
  return remaining / monthsLeft;
}

/**
 * Get the progress percentage toward the threshold
 */
export function getProgressPercentage(totalEngaged: number): number {
  return Math.min(100, (totalEngaged / THRESHOLD) * 100);
}

/**
 * Get the status color based on percentage
 * < 70% = safe (green)
 * 70-90% = caution (orange)
 * > 90% = danger (red)
 */
export function getStatusColor(percentage: number): StatusColor {
  if (percentage < 70) return 'safe';
  if (percentage <= 90) return 'caution';
  return 'danger';
}

/**
 * Calculate the impact of a mission on the threshold
 */
export function calculateMissionImpact(
  tjm: number,
  days: number,
  vatEnabled: boolean,
  vatRate: number
): number {
  const totalTTC = tjm * days;
  if (vatEnabled) {
    return convertTTCtoHT(totalTTC, vatRate);
  }
  return totalTTC;
}

/**
 * Get French month name
 */
export function getMonthName(monthIndex: number): string {
  const months = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ];
  return months[monthIndex] || '';
}

/**
 * Predict when the threshold will be exceeded based on current rate
 */
export function predictOverflowMonth(
  currentCA: number,
  monthlyRate: number,
  currentDate: Date = new Date()
): string | null {
  if (monthlyRate <= 0) return null;

  const currentMonth = currentDate.getMonth();
  const monthsToOverflow = Math.ceil((THRESHOLD - currentCA) / monthlyRate);

  if (monthsToOverflow <= 0) {
    return 'Déjà dépassé';
  }

  const overflowMonth = (currentMonth + monthsToOverflow) % 12;

  if (currentMonth + monthsToOverflow > 11) {
    // Overflow happens next year or later
    return null;
  }

  return getMonthName(overflowMonth);
}

/**
 * Calculate average monthly rate based on elapsed months
 */
export function calculateAverageMonthlyRate(
  totalCA: number,
  currentDate: Date = new Date()
): number {
  const currentMonth = currentDate.getMonth();
  const elapsedMonths = currentMonth + 1; // +1 because months are 0-indexed
  return totalCA / elapsedMonths;
}

/**
 * Format number as French currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format number with French locale
 */
export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Parse a French-formatted number string to a number
 */
export function parseFormattedNumber(value: string): number {
  // Remove spaces and replace comma with dot for parsing
  const cleaned = value.replace(/\s/g, '').replace(',', '.');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Get recommendation message based on current situation
 */
export function getRecommendation(
  totalEngaged: number,
  monthlyLimit: number,
  averageMonthlyRate: number,
  monthsRemaining: number
): {
  message: string;
  type: StatusColor;
} {
  const percentage = getProgressPercentage(totalEngaged);
  const remaining = calculateRemainingCA(totalEngaged, 0);

  if (totalEngaged >= THRESHOLD) {
    return {
      message:
        "Attention : vous avez atteint ou dépassé le plafond micro-entreprise. Consultez un expert-comptable pour évaluer vos options.",
      type: 'danger',
    };
  }

  if (percentage >= 90) {
    return {
      message: `Il vous reste ${formatCurrency(remaining)} de marge. Ralentissez significativement votre activité ou préparez-vous à changer de statut.`,
      type: 'danger',
    };
  }

  if (percentage >= 70) {
    if (averageMonthlyRate > monthlyLimit && monthsRemaining > 0) {
      return {
        message: `À votre rythme actuel, vous risquez de dépasser le plafond. Limitez-vous à ${formatCurrency(monthlyLimit)}/mois maximum.`,
        type: 'caution',
      };
    }
    return {
      message: `Vous approchez du plafond. Vous pouvez encore facturer ${formatCurrency(monthlyLimit)}/mois sur les ${monthsRemaining} mois restants.`,
      type: 'caution',
    };
  }

  if (monthsRemaining > 0) {
    return {
      message: `Bonne marge de manœuvre ! Vous pouvez facturer jusqu'à ${formatCurrency(monthlyLimit)}/mois pour rester sous le plafond.`,
      type: 'safe',
    };
  }

  return {
    message: `Il vous reste ${formatCurrency(remaining)} de CA disponible cette année.`,
    type: percentage < 70 ? 'safe' : 'caution',
  };
}
