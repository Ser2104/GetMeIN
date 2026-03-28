'use client';

import React, { useState } from 'react';
import HeroSection from './HeroSection';
import InputSection from './InputSection';
import AnalysisResults from './AnalysisResults';
import AnalysisLoadingSkeleton from './AnalysisLoadingSkeleton';
import { toast } from 'sonner';

export interface AnalysisResult {
  matchScore: number;
  callbackPotential: 'Low' | 'Medium' | 'High';
  strongMatches: string[];
  missingSkillsOrKeywords: string[];
  weakAreas: string[];
  suggestedImprovements: string[];
  tailoredBulletRewrites: { originalIdea: string; improvedVersion: string }[];
  finalAssessment: string;
}

type AppState = 'idle' | 'analyzing' | 'results' | 'error';

const VALIDATION_ERROR =
  'We need readable text from both the resume and the job description before we can analyze the match.';

function isMeaningfulContent(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length < 50) return false;
  const wordCount = trimmed.split(/\s+/).filter((w) => w.length > 1).length;
  return wordCount >= 5;
}

export default function AnalysisTool() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [jobDescription, setJobDescription] = useState('');
  const [resume, setResume] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAnalyze = async () => {
    if (!isMeaningfulContent(jobDescription)) {
      toast.error(VALIDATION_ERROR);
      return;
    }

    if (!isMeaningfulContent(resume)) {
      toast.error(VALIDATION_ERROR);
      return;
    }

    setAppState('analyzing');
    setErrorMessage('');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: resume.trim(),
          jobDescriptionText: jobDescription.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const msg =
          data?.details ||
          data?.error ||
          'Analysis failed. Please try again.';
        setAppState('error');
        setErrorMessage(msg);
        toast.error(data?.error || 'Analysis failed.');
        return;
      }

      setResult(data as AnalysisResult);
      setAppState('results');
      toast.success('Analysis complete — your report is ready.');
    } catch (err: any) {
      const msg =
        err?.message || 'Analysis failed. Check your connection and try again.';
      setAppState('error');
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  const handleReset = () => {
    setAppState('idle');
    setResult(null);
    setJobDescription('');
    setResume('');
    setErrorMessage('');
  };

  const handleReanalyze = () => {
    setAppState('idle');
    setResult(null);
    setErrorMessage('');
  };

  return (
    <div className="flex flex-col gap-10" suppressHydrationWarning>
      {appState === 'idle' && (
        <>
          <HeroSection />
          <InputSection
            jobDescription={jobDescription}
            resume={resume}
            onJobDescriptionChange={setJobDescription}
            onResumeChange={setResume}
            onAnalyze={handleAnalyze}
            isAnalyzing={false}
          />
        </>
      )}

      {appState === 'analyzing' && (
        <>
          <HeroSection compact />
          <InputSection
            jobDescription={jobDescription}
            resume={resume}
            onJobDescriptionChange={setJobDescription}
            onResumeChange={setResume}
            onAnalyze={handleAnalyze}
            isAnalyzing={true}
            disabled
          />
          <AnalysisLoadingSkeleton />
        </>
      )}

      {appState === 'results' && result && (
        <>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Analysis Report</h2>
              <p className="text-sm text-zinc-400 mt-1">
                Based on your resume vs. the provided job description
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleReanalyze}
                className="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 text-sm font-medium hover:bg-zinc-800 hover:text-white transition-all duration-150 active:scale-95"
              >
                Edit Inputs
              </button>

              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all duration-150 active:scale-95"
              >
                Start New Analysis
              </button>
            </div>
          </div>

          <AnalysisResults result={result} />
        </>
      )}

      {appState === 'error' && (
        <div className="flex flex-col items-center justify-center py-20 gap-6">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-2">
              Analysis Failed
            </h3>
            <p className="text-zinc-400 text-sm max-w-md whitespace-pre-wrap break-words">
              {errorMessage}
            </p>
          </div>

          <button
            onClick={() => setAppState('idle')}
            className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all duration-150 active:scale-95"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}