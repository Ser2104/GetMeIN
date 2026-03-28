'use client';

import React, { useRef } from 'react';
import { Briefcase, FileText, Loader2, Sparkles, AlertCircle } from 'lucide-react';

interface InputSectionProps {
  jobDescription: string;
  resume: string;
  onJobDescriptionChange: (val: string) => void;
  onResumeChange: (val: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  disabled?: boolean;
}

export default function InputSection({
  jobDescription,
  resume,
  onJobDescriptionChange,
  onResumeChange,
  onAnalyze,
  isAnalyzing,
  disabled = false,
}: InputSectionProps) {
  const jdRef = useRef<HTMLTextAreaElement>(null);
  const resumeRef = useRef<HTMLTextAreaElement>(null);

  const jdWordCount = jobDescription.trim() ? jobDescription.trim().split(/\s+/).length : 0;
  const resumeWordCount = resume.trim() ? resume.trim().split(/\s+/).length : 0;

  const canAnalyze = jobDescription.trim().length >= 50 && resume.trim().length >= 100 && !isAnalyzing;

  const jdTooShort = jobDescription.trim().length > 0 && jobDescription.trim().length < 50;
  const resumeTooShort = resume.trim().length > 0 && resume.trim().length < 100;

  return (
    <div className="flex flex-col gap-6">
      {/* Input Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Job Description */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
              <div className="w-6 h-6 rounded-md bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                <Briefcase size={12} className="text-indigo-400" />
              </div>
              Job Description
              <span className="text-rose-400 text-xs">*</span>
            </label>
            <span className="text-xs text-zinc-600 font-tabular">{jdWordCount} words</span>
          </div>
          <p className="text-xs text-zinc-500 -mt-1">Paste the full job posting including responsibilities and requirements.</p>
          <div className={`input-gradient-border rounded-xl overflow-hidden transition-all duration-200 ${jdTooShort ? 'ring-1 ring-rose-500/40' : ''}`}>
            <textarea
              ref={jdRef}
              value={jobDescription}
              onChange={(e) => onJobDescriptionChange(e.target.value)}
              disabled={disabled}
              placeholder={`Paste the job description here…\n\nExample:\n"We're looking for a Senior Frontend Engineer with 4+ years of React experience, strong TypeScript skills, and experience with AWS services. The ideal candidate will lead technical architecture decisions and mentor junior engineers…"`}
              className="w-full h-64 bg-[hsl(240_10%_6%)] text-zinc-200 text-sm leading-relaxed px-4 py-3.5 resize-none focus:outline-none placeholder:text-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          {jdTooShort && (
            <div className="flex items-center gap-1.5 text-xs text-rose-400">
              <AlertCircle size={12} />
              <span>Please paste the complete job description (at least 50 characters).</span>
            </div>
          )}
        </div>

        {/* Resume */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
              <div className="w-6 h-6 rounded-md bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <FileText size={12} className="text-emerald-400" />
              </div>
              Your Resume
              <span className="text-rose-400 text-xs">*</span>
            </label>
            <span className="text-xs text-zinc-600 font-tabular">{resumeWordCount} words</span>
          </div>
          <p className="text-xs text-zinc-500 -mt-1">Paste the plain-text version of your resume. Include all sections.</p>
          <div className={`input-gradient-border rounded-xl overflow-hidden transition-all duration-200 ${resumeTooShort ? 'ring-1 ring-rose-500/40' : ''}`}>
            <textarea
              ref={resumeRef}
              value={resume}
              onChange={(e) => onResumeChange(e.target.value)}
              disabled={disabled}
              placeholder={`Paste your resume content here…\n\nExample:\nJane Reyes | jane.reyes@email.com | linkedin.com/in/janereyes\n\nSummary\nFrontend engineer with 5 years of experience building scalable React applications…\n\nExperience\nSenior Frontend Developer — Axiom Labs (2022–Present)\n• Reduced page load time by 40% through code splitting and lazy loading…`}
              className="w-full h-64 bg-[hsl(240_10%_6%)] text-zinc-200 text-sm leading-relaxed px-4 py-3.5 resize-none focus:outline-none placeholder:text-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          {resumeTooShort && (
            <div className="flex items-center gap-1.5 text-xs text-rose-400">
              <AlertCircle size={12} />
              <span>Please paste your complete resume content (at least 100 characters).</span>
            </div>
          )}
        </div>
      </div>

      {/* Analyze Button */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={onAnalyze}
          disabled={!canAnalyze}
          className={`
            group relative flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-base
            transition-all duration-200 active:scale-[0.98]
            ${canAnalyze
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 cursor-pointer'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
            }
          `}
        >
          {isAnalyzing ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Analyzing your resume…</span>
            </>
          ) : (
            <>
              <Sparkles size={18} className={canAnalyze ? 'text-indigo-200 group-hover:rotate-12 transition-transform duration-200' : 'text-zinc-600'} />
              <span>Analyze Match</span>
              {canAnalyze && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 animate-ping opacity-75" />
              )}
            </>
          )}
        </button>

        {!canAnalyze && !isAnalyzing && (
          <p className="text-xs text-zinc-600 text-center">
            Paste both a job description and your resume to enable analysis.
          </p>
        )}

        {isAnalyzing && (
          <p className="text-xs text-zinc-500 text-center animate-pulse">
            AI is scanning for keyword overlap, experience alignment, and skill gaps… This takes about 10–15 seconds.
          </p>
        )}
      </div>
    </div>
  );
}