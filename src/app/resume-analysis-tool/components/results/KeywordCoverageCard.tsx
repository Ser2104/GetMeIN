'use client';

import React, { useState } from 'react';
import { CheckCircle2, XCircle, Search } from 'lucide-react';

interface KeywordCoverageCardProps {
  keywordsFound: string[];
  keywordsMissing: string[];
  keywordCoverage: number;
}

export default function KeywordCoverageCard({
  keywordsFound,
  keywordsMissing,
  keywordCoverage,
}: KeywordCoverageCardProps) {
  const [filter, setFilter] = useState('');

  const filteredFound = keywordsFound.filter((k) =>
    k.toLowerCase().includes(filter.toLowerCase())
  );
  const filteredMissing = keywordsMissing.filter((k) =>
    k.toLowerCase().includes(filter.toLowerCase())
  );

  const coverageColor = keywordCoverage >= 75 ? 'bg-emerald-500' : keywordCoverage >= 50 ? 'bg-amber-500' : 'bg-rose-500';
  const coverageText = keywordCoverage >= 75 ? 'text-emerald-400' : keywordCoverage >= 50 ? 'text-amber-400' : 'text-rose-400';

  return (
    <div className="card-glow rounded-2xl bg-zinc-900 border border-zinc-800 p-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Search size={15} className="text-indigo-400" />
          <span className="text-sm font-bold text-white">ATS Keyword Coverage</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-sm font-extrabold font-tabular ${coverageText}`}>{keywordCoverage}% covered</span>
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Filter keywords…"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-7 pr-3 py-1.5 text-xs bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/60 w-36"
            />
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-zinc-800 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-1000 ${coverageColor}`}
          style={{ width: `${keywordCoverage}%` }}
        />
      </div>

      {/* Keywords Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Found */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span className="text-xs font-semibold text-zinc-300">Found in Resume</span>
            <span className="ml-auto text-xs font-bold text-emerald-400 font-tabular">{filteredFound.length}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {filteredFound.map((kw) => (
              <span
                key={`kw-found-${kw}`}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-300"
              >
                <CheckCircle2 size={10} />
                {kw}
              </span>
            ))}
            {filteredFound.length === 0 && (
              <span className="text-xs text-zinc-600 italic">No matching keywords</span>
            )}
          </div>
        </div>

        {/* Missing */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <XCircle size={14} className="text-rose-400" />
            <span className="text-xs font-semibold text-zinc-300">Missing from Resume</span>
            <span className="ml-auto text-xs font-bold text-rose-400 font-tabular">{filteredMissing.length}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {filteredMissing.map((kw) => (
              <span
                key={`kw-missing-${kw}`}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs font-medium text-rose-300"
              >
                <XCircle size={10} />
                {kw}
              </span>
            ))}
            {filteredMissing.length === 0 && (
              <span className="text-xs text-zinc-600 italic">No missing keywords found</span>
            )}
          </div>
        </div>
      </div>

      <p className="text-xs text-zinc-600 border-t border-zinc-800 pt-3">
        Tip: Adding missing keywords naturally into your resume can improve ATS pass rates. Avoid keyword stuffing — integrate them into context-rich bullet points.
      </p>
    </div>
  );
}