import React from 'react';
import { Zap, Shield, TrendingUp } from 'lucide-react';

interface HeroSectionProps {
  compact?: boolean;
}

export default function HeroSection({ compact = false }: HeroSectionProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-3 py-2">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
          <Zap size={15} className="text-indigo-400" />
        </div>
        <div>
          <h1 className="text-base font-bold text-white leading-tight">
            Get<span className="text-gradient">MeIn</span>
          </h1>
          <p className="text-xs text-zinc-500">Analyzing your resume against the job description…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-10 lg:py-14 flex flex-col items-center gap-6">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
        <span className="text-xs font-semibold text-indigo-300 tracking-wider uppercase">AI-Powered Resume Analysis</span>
      </div>

      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight max-w-3xl">
        Know your <span className="text-gradient">fit</span> before
        <br className="hidden sm:block" /> you apply.
      </h1>

      <p className="text-base sm:text-lg text-zinc-400 max-w-xl leading-relaxed">
        Paste or upload your resume and a job description. Get an instant AI analysis — match score, keyword gaps, weak areas, and rewritten bullet points ready to copy.
      </p>

      <div className="flex items-center gap-6 sm:gap-8 mt-2 flex-wrap justify-center">
        {[
          { icon: TrendingUp, label: 'Match Score', desc: '0–100 alignment rating' },
          { icon: Shield, label: 'ATS Safety Check', desc: 'Keyword coverage analysis' },
          { icon: Zap, label: 'Instant Rewrites', desc: 'Copy-ready bullet points' },
        ].map((item) => (
          <div key={`hero-feature-${item.label}`} className="flex items-center gap-2.5 text-sm text-zinc-400">
            <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0">
              <item.icon size={14} className="text-indigo-400" />
            </div>
            <div className="text-left">
              <div className="text-white font-semibold text-xs">{item.label}</div>
              <div className="text-zinc-500 text-xs">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}