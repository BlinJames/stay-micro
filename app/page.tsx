'use client';

import { useStayMicro } from '@/hooks/useStayMicro';
import { Header } from '@/components/Header';
import { ThresholdCard } from '@/components/ThresholdCard';
import { RevenueInput } from '@/components/RevenueInput';
import { SecuredInput } from '@/components/SecuredInput';
import { VATToggle } from '@/components/VATToggle';
import { MissionSimulator } from '@/components/MissionSimulator';
import { ResultsCard } from '@/components/ResultsCard';
import { ProgressBar } from '@/components/ProgressBar';
import { Timeline } from '@/components/Timeline';
import { Recommendation } from '@/components/Recommendation';
import { RevenueChart } from '@/components/RevenueChart';
import { Disclaimer } from '@/components/Disclaimer';

export default function Home() {
  const stayMicro = useStayMicro();

  // Show loading state while hydrating from localStorage
  if (!stayMicro.isLoaded) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Chargement...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 pb-12">
        <Header />

        <div className="space-y-6">
          {/* Info Section */}
          <ThresholdCard />

          {/* Input Section */}
          <RevenueInput
            value={stayMicro.earnedCA}
            onChange={stayMicro.setEarnedCA}
          />

          <SecuredInput
            value={stayMicro.securedCA}
            onChange={stayMicro.setSecuredCA}
          />

          <VATToggle
            enabled={stayMicro.vatEnabled}
            rate={stayMicro.vatRate}
            onEnabledChange={stayMicro.setVATEnabled}
            onRateChange={stayMicro.setVATRate}
          />

          {/* Mission Simulator */}
          <MissionSimulator
            vatEnabled={stayMicro.vatEnabled}
            vatRate={stayMicro.vatRate}
            onAddMission={stayMicro.addMission}
          />

          {/* Results Section */}
          <ResultsCard
            totalEngaged={stayMicro.totalEngaged}
            remainingCA={stayMicro.remainingCA}
            monthlyLimit={stayMicro.monthlyLimit}
            monthsRemaining={stayMicro.monthsRemaining}
            statusColor={stayMicro.statusColor}
            defaultTJM={stayMicro.defaultTJM}
            remainingDays={stayMicro.remainingDays}
            onTJMChange={stayMicro.setDefaultTJM}
          />

          <ProgressBar
            percentage={stayMicro.progressPercentage}
            totalEngaged={stayMicro.totalEngaged}
            statusColor={stayMicro.statusColor}
          />

          <Timeline
            progressPercentage={stayMicro.progressPercentage}
            statusColor={stayMicro.statusColor}
          />

          {/* Recommendation */}
          <Recommendation
            message={stayMicro.recommendation.message}
            type={stayMicro.recommendation.type}
          />

          {/* Revenue Chart */}
          <RevenueChart
            earnedCA={stayMicro.earnedCA}
            monthlyLimit={stayMicro.monthlyLimit}
            monthsRemaining={stayMicro.monthsRemaining}
            statusColor={stayMicro.statusColor}
          />

          {/* Disclaimer */}
          <Disclaimer />
        </div>
      </div>
    </main>
  );
}
