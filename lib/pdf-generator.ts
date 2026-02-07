import jsPDF from 'jspdf';
import {
  THRESHOLD,
  formatCurrency,
  formatNumber,
  getMonthName,
} from './calculations';
import type { UseStayMicroReturn } from '@/hooks/useStayMicro';

export function generatePDF(data: UseStayMicroReturn): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Helper functions
  const addTitle = (text: string, size: number = 20) => {
    doc.setFontSize(size);
    doc.setFont('helvetica', 'bold');
    doc.text(text, margin, y);
    y += size * 0.5;
  };

  const addSubtitle = (text: string) => {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    doc.text(text, margin, y);
    doc.setTextColor(0);
    y += 8;
  };

  const addSection = (title: string) => {
    y += 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin, y);
    y += 8;
    doc.setDrawColor(200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
  };

  const addRow = (label: string, value: string, highlight: boolean = false) => {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(label, margin, y);
    doc.setFont('helvetica', highlight ? 'bold' : 'normal');
    doc.text(value, pageWidth - margin, y, { align: 'right' });
    y += 7;
  };

  const addParagraph = (text: string) => {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(text, contentWidth);
    doc.text(lines, margin, y);
    y += lines.length * 5 + 5;
  };

  // Title
  addTitle('Stay Micro - Mon Plan');
  y += 5;

  // Date
  const today = new Date();
  const dateStr = `Généré le ${today.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })}`;
  addSubtitle(dateStr);
  y += 5;

  // Threshold info
  addSection('Plafond Micro-Entreprise');
  addRow('Plafond annuel (HT)', formatCurrency(THRESHOLD));
  addRow('Applicable aux', 'Prestations de services (BNC)');

  // Current situation
  addSection('Situation Actuelle');
  addRow('CA encaissé', formatCurrency(data.earnedCA));
  addRow('CA sécurisé', formatCurrency(data.securedCA));
  addRow('CA total engagé', formatCurrency(data.totalEngaged), true);
  y += 3;
  addRow('CA restant autorisé', formatCurrency(data.remainingCA), true);
  addRow(
    'Progression',
    `${data.progressPercentage.toFixed(1)}% du plafond`
  );

  // VAT info
  if (data.vatEnabled) {
    y += 3;
    addRow('TVA appliquée', `${data.vatRate}%`);
  }

  // Projection
  addSection('Projection');
  addRow('Mois restants dans l\'année', `${data.monthsRemaining} mois`);
  addRow(
    'Montant max conseillé/mois',
    data.monthsRemaining > 0 ? formatCurrency(data.monthlyLimit) : 'N/A'
  );
  if (data.overflowMonth) {
    addRow('Attention', `Risque de dépassement en ${data.overflowMonth}`);
  }

  // Recommendation
  addSection('Recommandation');
  const statusLabels = {
    safe: 'SITUATION SAINE',
    caution: 'VIGILANCE REQUISE',
    danger: 'ATTENTION',
  };
  addRow('Statut', statusLabels[data.recommendation.type]);
  y += 3;
  addParagraph(data.recommendation.message);

  // Missions (if any)
  if (data.missions.length > 0) {
    addSection('Missions Simulées');
    data.missions.forEach((mission, index) => {
      addRow(
        `Mission ${index + 1}: ${mission.days} jours à ${formatCurrency(mission.tjm)}/j`,
        formatCurrency(mission.amountHT) + ' HT'
      );
    });
  }

  // Disclaimer
  y = doc.internal.pageSize.getHeight() - 40;
  doc.setDrawColor(200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;
  doc.setFontSize(8);
  doc.setTextColor(120);
  const disclaimer =
    'Avertissement : Cet outil est fourni à titre indicatif uniquement et ne constitue pas un conseil fiscal ou juridique. ' +
    'Les calculs sont basés sur le plafond de 77 700 € HT applicable aux prestations de services (BNC). ' +
    'Pour toute question spécifique, consultez un expert-comptable.';
  const disclaimerLines = doc.splitTextToSize(disclaimer, contentWidth);
  doc.text(disclaimerLines, margin, y);

  // Save
  const filename = `stay-micro-plan-${today.toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}
