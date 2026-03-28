import React from 'react';
import { Target, Zap, BarChart2, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


interface StatsSummaryCardProps {
  keywordCoverage: number;
  skillsMatchPercent: number;
  experienceAlignment: number;
  strengthCount: number;
  weakAreaCount: number;
  missingSkillsCount: number;
}

function MiniProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-1.5">
      <div
        className="h-1.5 rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${value}%`, backgroundColor: color }}
      />
    </div>
  );
}

const progressColor = (val: number) => {
  if (val >= 75) return '#10b981';
  if (val >= 50) return '#f59e0b';
  return '#f43f5e';
};

export default function StatsSummaryCard({
  keywordCoverage,
  skillsMatchPercent,
  experienceAlignment,
  strengthCount,
  weakAreaCount,
  missingSkillsCount,
}: StatsSummaryCardProps) {
  const stats = [
    {
      id: 'keyword-coverage',
      icon: Target,
      label: 'Keyword Coverage',
      value: `${keywordCoverage}%`,
      raw: keywordCoverage,
      desc: 'of JD keywords found in resume',
      showBar: true,
    },
    {
      id: 'skills-match',
      icon: Zap,
      label: 'Skills Match',
      value: `${skillsMatchPercent}%`,
      raw: skillsMatchPercent,
      desc: 'required skills present',
      showBar: true,
    },
    {
      id: 'experience-align',
      icon: BarChart2,
      label: 'Experience Alignment',
      value: `${experienceAlignment}%`,
      raw: experienceAlignment,
      desc: 'role-level and tenure match',
      showBar: true,
    },
    {
      id: 'strengths',
      icon: CheckCircle,
      label: 'Strengths Found',
      value: strengthCount.toString(),
      raw: null,
      desc: 'strong alignment points',
      showBar: false,
      valueColor: 'text-emerald-400',
    },
    {
      id: 'weak-areas',
      icon: AlertCircle,
      label: 'Weak Areas',
      value: weakAreaCount.toString(),
      raw: null,
      desc: 'areas needing improvement',
      showBar: false,
      valueColor: 'text-amber-400',
    },
    {
      id: 'missing-skills',
      icon: XCircle,
      label: 'Missing Keywords',
      value: missingSkillsCount.toString(),
      raw: null,
      desc: 'from job description',
      showBar: false,
      valueColor: 'text-rose-400',
    },
  ];

  return (
    <div className="card-glow rounded-2xl bg-zinc-900 border border-zinc-800 p-6 h-full flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <BarChart2 size={15} className="text-indigo-400" />
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Analysis Breakdown</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={`stat-${stat.id}`}
              className="rounded-xl bg-zinc-800/50 border border-zinc-700/40 p-3.5 flex flex-col gap-1"
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <Icon size={12} className="text-zinc-500" />
                <span className="text-xs text-zinc-500 font-medium leading-tight">{stat.label}</span>
              </div>
              <span
                className={`text-2xl font-extrabold font-tabular leading-none ${stat.valueColor ?? ''}`}
                style={!stat.valueColor && stat.raw !== null ? { color: progressColor(stat.raw) } : undefined}
              >
                {stat.value}
              </span>
              <span className="text-xs text-zinc-600 leading-tight">{stat.desc}</span>
              {stat.showBar && stat.raw !== null && (
                <MiniProgressBar value={stat.raw} color={progressColor(stat.raw)} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}