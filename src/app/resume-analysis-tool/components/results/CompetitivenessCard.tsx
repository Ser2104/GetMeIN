import React from 'react';
import { TrendingUp, Info } from 'lucide-react';

interface CompetitivenessCardProps {
  callbackPotential: 'Low' | 'Medium' | 'High';
  applicationCompetitiveness: string;
  atsRiskLevel: 'Low' | 'Medium' | 'High';
}

const potentialConfig = {
  Low: {
    gradient: 'from-rose-500/10 to-rose-500/5',
    border: 'border-rose-500/20',
    icon: 'text-rose-400',
    badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  },
  Medium: {
    gradient: 'from-amber-500/10 to-amber-500/5',
    border: 'border-amber-500/20',
    icon: 'text-amber-400',
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  },
  High: {
    gradient: 'from-emerald-500/10 to-emerald-500/5',
    border: 'border-emerald-500/20',
    icon: 'text-emerald-400',
    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  },
};

export default function CompetitivenessCard({
  callbackPotential,
  applicationCompetitiveness,
  atsRiskLevel,
}: CompetitivenessCardProps) {
  const cfg = potentialConfig[callbackPotential];

  return (
    <div className={`rounded-2xl bg-gradient-to-r ${cfg.gradient} border ${cfg.border} p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4`}>
      <div className={`w-10 h-10 rounded-xl bg-zinc-900/60 border ${cfg.border} flex items-center justify-center flex-shrink-0`}>
        <TrendingUp size={18} className={cfg.icon} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-sm font-bold text-white">Application Competitiveness</span>
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${cfg.badge}`}>
            {callbackPotential} Potential
          </span>
          <span className="text-xs text-zinc-500">· ATS Risk: {atsRiskLevel}</span>
        </div>
        <p className="text-sm text-zinc-300 leading-relaxed">{applicationCompetitiveness}</p>
      </div>

      <div className="flex-shrink-0 hidden lg:flex items-center gap-1.5 text-xs text-zinc-600">
        <Info size={12} />
        <span>AI-estimated, not guaranteed</span>
      </div>
    </div>
  );
}