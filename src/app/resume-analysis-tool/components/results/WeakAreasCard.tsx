import React from 'react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


interface WeakArea {
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
}

interface WeakAreasCardProps {
  weakAreas: WeakArea[];
}

const severityConfig = {
  high: {
    bg: 'bg-rose-500/8 border-rose-500/20 hover:bg-rose-500/12',
    badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    icon: AlertTriangle,
    iconColor: 'text-rose-400',
    label: 'Critical',
  },
  medium: {
    bg: 'bg-amber-500/8 border-amber-500/20 hover:bg-amber-500/12',
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    icon: AlertCircle,
    iconColor: 'text-amber-400',
    label: 'Moderate',
  },
  low: {
    bg: 'bg-zinc-700/20 border-zinc-700/40 hover:bg-zinc-700/30',
    badge: 'bg-zinc-700/40 text-zinc-400 border-zinc-600/40',
    icon: Info,
    iconColor: 'text-zinc-500',
    label: 'Minor',
  },
};

export default function WeakAreasCard({ weakAreas }: WeakAreasCardProps) {
  const sorted = [...weakAreas].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.severity] - order[b.severity];
  });

  return (
    <div className="card-glow-rose rounded-2xl bg-zinc-900 border border-zinc-800 p-6 flex flex-col gap-4 h-full">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
          <AlertTriangle size={12} className="text-rose-400" />
        </div>
        <span className="text-sm font-bold text-white">Weak Areas</span>
        <span className="ml-auto text-xs font-bold text-rose-400 font-tabular bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
          {weakAreas.length} found
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {sorted.map((area, idx) => {
          const cfg = severityConfig[area.severity];
          const Icon = cfg.icon;
          return (
            <div
              key={`weak-area-${idx + 1}`}
              className={`rounded-xl border p-4 flex gap-3 transition-colors duration-150 ${cfg.bg}`}
            >
              <Icon size={15} className={`${cfg.iconColor} flex-shrink-0 mt-0.5`} />
              <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-white leading-snug">{area.title}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 ${cfg.badge}`}>
                    {cfg.label}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">{area.description}</p>
              </div>
            </div>
          );
        })}

        {weakAreas.length === 0 && (
          <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-6 flex flex-col items-center gap-2 text-center">
            <AlertTriangle size={24} className="text-emerald-500" />
            <span className="text-sm text-emerald-400 font-semibold">No critical weak areas detected</span>
            <p className="text-xs text-zinc-500">Your resume appears well-aligned with this role.</p>
          </div>
        )}
      </div>
    </div>
  );
}