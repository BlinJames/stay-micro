'use client';

import { Download } from 'lucide-react';
import { generatePDF } from '@/lib/pdf-generator';
import type { UseStayMicroReturn } from '@/hooks/useStayMicro';

interface ExportButtonProps {
  data: UseStayMicroReturn;
}

export function ExportButton({ data }: ExportButtonProps) {
  const handleExport = () => {
    generatePDF(data);
  };

  return (
    <button onClick={handleExport} className="btn-secondary w-full">
      <Download className="w-5 h-5" />
      Télécharger mon plan PDF
    </button>
  );
}
