'use client';

import React, { useState } from 'react';
import { Lightbulb, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

interface Improvement {
  area: string;
  suggestion: string;
}

interface ImprovementsCardProps {
  improvements: Improvement[];
}

export default function ImprovementsCard({ improvements }: ImprovementsCardProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied((prev) => ({ ...prev, [id]: true }));
      toast.success('Suggestion copied to clipboard.');
      setTimeout(() => setCopied((prev) => ({ ...prev, [id]: false })), 2000);
    } catch {
      toast.error('Failed to copy. Please select and copy manually.');
    }
  };

  const handleCopyAll = async () => {
    const allText = improvements
      .map((imp) => `${imp.area}:\n${imp.suggestion}`)
      .join('\n\n---\n\n');
    try {
      await navigator.clipboard.writeText(allText);
      toast.success(`All ${improvements.length} suggestions copied to clipboard.`);
    } catch {
      toast.error('Failed to copy. Please try again.');
    }
  };

  return (
    <div className="card-glow-amber rounded-2xl bg-zinc-900 border border-zinc-800 p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
            <Lightbulb size={12} className="text-amber-400" />
          </div>
          <span className="text-sm font-bold text-white">Suggested Resume Improvements</span>
          <span className="text-xs font-bold text-amber-400 font-tabular bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
            {improvements.length} suggestions
          </span>
        </div>
        <button
          onClick={handleCopyAll}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-semibold text-zinc-300 hover:text-white transition-all duration-150 active:scale-95"
        >
          <Copy size={12} />
          Copy All
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {improvements.map((imp, idx) => {
          const id = `improvement-${idx + 1}`;
          const isExpanded = expanded[id] !== false;
          const isCopied = copied[id];

          return (
            <div
              key={id}
              className="rounded-xl bg-amber-500/5 border border-amber-500/15 overflow-hidden"
            >
              <button
                onClick={() => toggleExpand(id)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-amber-500/8 transition-colors duration-150"
              >
                <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-amber-400">{idx + 1}</span>
                </div>
                <span className="text-sm font-semibold text-white flex-1 text-left">{imp.area}</span>
                {isExpanded ? (
                  <ChevronUp size={14} className="text-zinc-500 flex-shrink-0" />
                ) : (
                  <ChevronDown size={14} className="text-zinc-500 flex-shrink-0" />
                )}
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 flex flex-col gap-3">
                  <p className="text-sm text-zinc-300 leading-relaxed pl-9">{imp.suggestion}</p>
                  <div className="pl-9">
                    <button
                      onClick={() => handleCopy(imp.suggestion, id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 active:scale-95 ${
                        isCopied
                          ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400' :'bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700'
                      }`}
                    >
                      {isCopied ? <Check size={11} /> : <Copy size={11} />}
                      {isCopied ? 'Copied!' : 'Copy suggestion'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}