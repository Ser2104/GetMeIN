import React from 'react';
import { CheckCircle2, Star } from 'lucide-react';

interface Strength {
  title: string;
  description: string;
}

interface StrengthsCardProps {
  strengths: Strength[];
}

export default function StrengthsCard({ strengths }: StrengthsCardProps) {
  return (
    <div className="card-glow-emerald rounded-2xl bg-zinc-900 border border-zinc-800 p-6 flex flex-col gap-4 h-full">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
          <Star size={12} className="text-emerald-400" />
        </div>
        <span className="text-sm font-bold text-white">Key Strengths</span>
        <span className="ml-auto text-xs font-bold text-emerald-400 font-tabular bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
          {strengths.length} found
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {strengths.map((strength, idx) => (
          <div
            key={`strength-${idx + 1}`}
            className="rounded-xl bg-emerald-500/5 border border-emerald-500/15 p-4 flex gap-3 hover:bg-emerald-500/8 transition-colors duration-150"
          >
            <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-sm font-semibold text-white leading-snug">{strength.title}</span>
              <p className="text-xs text-zinc-400 leading-relaxed">{strength.description}</p>
            </div>
          </div>
        ))}

        {strengths.length === 0 && (
          <div className="rounded-xl bg-zinc-800/50 border border-zinc-700/40 p-6 flex flex-col items-center gap-2 text-center">
            <CheckCircle2 size={24} className="text-zinc-600" />
            <span className="text-sm text-zinc-500">No strong alignment points detected</span>
            <p className="text-xs text-zinc-600">Tailor your resume more closely to the job description to surface strengths.</p>
          </div>
        )}
      </div>
    </div>
  );
}