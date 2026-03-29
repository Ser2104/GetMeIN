'use client';

import React, { useEffect, useState } from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import { ShieldCheck, AlertTriangle, TrendingUp } from 'lucide-react';

interface ScoreHeroCardProps {
  score: number;
  callbackPotential: 'Low' | 'Medium' | 'High';
  atsRiskLevel: 'Low' | 'Medium' | 'High';
}

const callbackConfig = {
  Low: { label: 'Low Callback Potential', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
  Medium: { label: 'Medium Callback Potential', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  High: { label: 'High Callback Potential', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
};

const scoreColor = (score: number) => {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#f59e0b';
  return '#f43f5e';
};

const atsConfig = {
  Low: { label: 'Low ATS Risk', icon: ShieldCheck, color: 'text-emerald-400' },
  Medium: { label: 'Medium ATS Risk', icon: AlertTriangle, color: 'text-amber-400' },
  High: { label: 'High ATS Risk', icon: AlertTriangle, color: 'text-rose-400' },
};

export default function ScoreHeroCard({ score, callbackPotential, atsRiskLevel }: ScoreHeroCardProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const duration = 1200;
    const steps = 60;
    const increment = score / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [score]);

  const cb = callbackConfig[callbackPotential];
  const ats = atsConfig[atsRiskLevel];
  const AtsIcon = ats.icon;
  const chartColor = scoreColor(score);

  const chartData = [{ value: score, fill: chartColor }];

  return (
    <div className="card-glow rounded-2xl bg-zinc-900 border border-zinc-800 p-6 flex flex-col items-center gap-4 h-full">
      <div className="flex items-center gap-2 self-start">
        <TrendingUp size={15} className="text-indigo-400" />
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Overall Match Score</span>
      </div>

      {/* Radial Chart */}
      <div className="relative w-40 h-40">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="72%"
            outerRadius="100%"
            barSize={10}
            data={chartData}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar
              background={{ fill: 'hsl(240 5% 14%)' }}
              dataKey="value"
              angleAxisId={0}
              cornerRadius={6}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-4xl font-extrabold font-tabular leading-none"
            style={{ color: chartColor }}
          >
            {displayScore}
          </span>
          <span className="text-xs text-zinc-500 font-medium mt-0.5">out of 100</span>
        </div>
      </div>

      {/* Callback Potential Badge */}
      <div className={`flex items-center gap-2 px-3.5 py-2 rounded-full ${cb.bg} border ${cb.border}`}>
        <span className={`text-sm font-bold ${cb.color}`}>{cb.label}</span>
      </div>

      {/* ATS Risk */}
      <div className="flex items-center gap-2 w-full justify-center">
        <AtsIcon size={13} className={ats.color} />
        <span className={`text-xs font-semibold ${ats.color}`}>{ats.label}</span>
      </div>

      {/* Score interpretation */}
      <div className="w-full rounded-xl bg-zinc-800/60 border border-zinc-700/40 p-3 text-center">
        <p className="text-xs text-zinc-400 leading-relaxed">
          {score >= 80
            ? 'Strong alignment. Your resume is competitive for this role.'
            : score >= 60
            ? 'Moderate fit. Targeted improvements could significantly boost your standing.'
            : 'Significant gaps detected. Resume needs substantial tailoring for this role.'}
        </p>
      </div>
    </div>
  );
}