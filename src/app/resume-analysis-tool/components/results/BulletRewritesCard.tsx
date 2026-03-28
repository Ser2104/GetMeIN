'use client';

import React, { useState } from 'react';
import { Pencil, Copy, Check, ArrowRight, Info } from 'lucide-react';
import { toast } from 'sonner';

interface BulletRewrite {
  original: string;
  rewritten: string;
  reason: string;
}

interface BulletRewritesCardProps {
  bulletRewrites: BulletRewrite[];
}

export default function BulletRewritesCard({ bulletRewrites }: BulletRewritesCardProps) {
  const [copied, setCopied] = useState<Record<string, boolean>>({});
  const [showReason, setShowReason] = useState<Record<string, boolean>>({});

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied((prev) => ({ ...prev, [id]: true }));
      toast.success('Rewritten bullet copied to clipboard.');
      setTimeout(() => setCopied((prev) => ({ ...prev, [id]: false })), 2000);
    } catch {
      toast.error('Copy failed. Please select text manually.');
    }
  };

  const handleCopyAll = async () => {
    const text = bulletRewrites.map((r) => `• ${r.rewritten}`).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${bulletRewrites.length} rewritten bullets copied.`);
    } catch {
      toast.error('Copy failed. Please try again.');
    }
  };

  const toggleReason = (id: string) => {
    setShowReason((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="card-glow rounded-2xl bg-zinc-900 border border-zinc-800 p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <Pencil size={12} className="text-indigo-400" />
          </div>
          <span className="text-sm font-bold text-white">Tailored Bullet Point Rewrites</span>
          <span className="text-xs font-bold text-indigo-400 font-tabular bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
            {bulletRewrites.length} rewrites
          </span>
        </div>
        <button
          onClick={handleCopyAll}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-semibold text-indigo-300 hover:text-indigo-200 transition-all duration-150 active:scale-95"
        >
          <Copy size={12} />
          Copy All Rewrites
        </button>
      </div>

      <p className="text-xs text-zinc-500 -mt-2">
        These are AI-suggested rewrites of your existing bullet points, tailored to the specific language and requirements of this job description.
      </p>

      <div className="flex flex-col gap-4">
        {bulletRewrites.map((rewrite, idx) => {
          const id = `rewrite-${idx + 1}`;
          const isCopied = copied[id];
          const isShowingReason = showReason[id];

          return (
            <div
              key={id}
              className="rounded-xl bg-zinc-800/40 border border-zinc-700/50 overflow-hidden hover:border-zinc-600/50 transition-colors duration-150"
            >
              {/* Header */}
              <div className="px-4 py-2.5 bg-zinc-800/60 border-b border-zinc-700/40 flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-indigo-400">{idx + 1}</span>
                </div>
                <span className="text-xs font-semibold text-zinc-400">Bullet Rewrite</span>
              </div>

              <div className="p-4 flex flex-col gap-4">
                {/* Before */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-rose-500/60" />
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Before</span>
                  </div>
                  <div className="rounded-lg bg-rose-500/5 border border-rose-500/15 px-3.5 py-2.5">
                    <p className="text-sm text-zinc-400 leading-relaxed">{rewrite.original}</p>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-zinc-700/60" />
                  <ArrowRight size={14} className="text-indigo-400 flex-shrink-0" />
                  <div className="flex-1 h-px bg-zinc-700/60" />
                </div>

                {/* After */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
                    <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">Rewritten</span>
                  </div>
                  <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 px-3.5 py-2.5">
                    <p className="text-sm text-zinc-200 leading-relaxed font-medium">{rewrite.rewritten}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <button
                    onClick={() => toggleReason(id)}
                    className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors duration-150"
                  >
                    <Info size={12} />
                    {isShowingReason ? 'Hide rationale' : 'Why this rewrite?'}
                  </button>

                  <button
                    onClick={() => handleCopy(rewrite.rewritten, id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 active:scale-95 ${
                      isCopied
                        ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400' :'bg-zinc-700 border border-zinc-600 text-zinc-300 hover:text-white hover:bg-zinc-600'
                    }`}
                  >
                    {isCopied ? <Check size={11} /> : <Copy size={11} />}
                    {isCopied ? 'Copied!' : 'Copy rewrite'}
                  </button>
                </div>

                {/* Reason */}
                {isShowingReason && (
                  <div className="rounded-lg bg-indigo-500/5 border border-indigo-500/15 px-3.5 py-3 flex gap-2.5">
                    <Info size={13} className="text-indigo-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-zinc-400 leading-relaxed">{rewrite.reason}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl bg-zinc-800/40 border border-zinc-700/40 p-4 flex gap-3">
        <Info size={14} className="text-zinc-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-zinc-500 leading-relaxed">
          These rewrites are AI-generated suggestions. Review each one carefully before adding it to your resume. Ensure accuracy — only include experiences you can speak to in an interview.
        </p>
      </div>
    </div>
  );
}