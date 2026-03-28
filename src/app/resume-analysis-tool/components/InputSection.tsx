'use client';

import React, { useRef, useState, useCallback } from 'react';
import { Briefcase, FileText, Loader2, Sparkles, AlertCircle, Upload, CheckCircle2, X, Type } from 'lucide-react';
import { toast } from 'sonner';

interface InputSectionProps {
  jobDescription: string;
  resume: string;
  onJobDescriptionChange: (val: string) => void;
  onResumeChange: (val: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  disabled?: boolean;
}

type InputMode = 'paste' | 'upload';

interface UploadedFile {
  name: string;
  type: string;
  size: number;
}

function getFileTypeLabel(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  if (ext === 'pdf') return 'PDF';
  if (ext === 'docx' || ext === 'doc') return 'DOCX';
  if (ext === 'txt') return 'TXT';
  return ext.toUpperCase();
}

async function extractTextFromFile(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';

  if (ext === 'txt') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve((e.target?.result as string) ?? '');
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  if (ext === 'pdf' || ext === 'docx' || ext === 'doc') {
    // PDF/DOCX require server-side parsing — prompt user to paste text manually
    throw new Error('We couldn\'t read this file. Please try another file or paste the text manually.');
  }

  return '';
}

interface FileInputPanelProps {
  accentColor: 'indigo' | 'emerald';
  uploadedFile: UploadedFile | null;
  onFileSelect: (file: File) => void;
  onClear: () => void;
  disabled?: boolean;
}

function FileInputPanel({ accentColor, uploadedFile, onFileSelect, onClear, disabled }: FileInputPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const accent = accentColor === 'indigo'
    ? { border: 'border-indigo-500/30', bg: 'bg-indigo-500/10', text: 'text-indigo-400', ring: 'ring-indigo-500/40', hover: 'hover:border-indigo-500/50 hover:bg-indigo-500/5' }
    : { border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', text: 'text-emerald-400', ring: 'ring-emerald-500/40', hover: 'hover:border-emerald-500/50 hover:bg-emerald-500/5' };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    if (file) onFileSelect(file);
  }, [disabled, onFileSelect]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
    e.target.value = '';
  };

  if (uploadedFile) {
    return (
      <div className="h-64 flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-zinc-700 bg-[hsl(240_10%_6%)] px-4">
        <div className={`flex items-center justify-center w-12 h-12 rounded-full ${accent.bg} border ${accent.border}`}>
          <CheckCircle2 size={22} className={accent.text} />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-white truncate max-w-[220px]">{uploadedFile.name}</p>
          <p className="text-xs text-zinc-500 mt-0.5">{getFileTypeLabel(uploadedFile.name)} · {(uploadedFile.size / 1024).toFixed(1)} KB</p>
          <p className={`text-xs font-medium mt-1 ${accent.text}`}>File uploaded successfully</p>
        </div>
        <button
          onClick={onClear}
          disabled={disabled}
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors disabled:opacity-50"
        >
          <X size={12} />
          Remove file
        </button>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => !disabled && fileInputRef.current?.click()}
      className={`
        h-64 flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed
        transition-all duration-200 cursor-pointer
        ${isDragging ? `${accent.border} ${accent.bg}` : `border-zinc-700 bg-[hsl(240_10%_6%)] ${accent.hover}`}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <div className={`w-11 h-11 rounded-xl ${accent.bg} border ${accent.border} flex items-center justify-center`}>
        <Upload size={18} className={accent.text} />
      </div>
      <div className="text-center px-4">
        <p className="text-sm font-semibold text-zinc-200">Drop your file here</p>
        <p className="text-xs text-zinc-500 mt-1">or click to browse</p>
        <p className="text-xs text-zinc-600 mt-2">Supports PDF, DOCX, TXT</p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
}

interface TabToggleProps {
  mode: InputMode;
  onChange: (mode: InputMode) => void;
  accentColor: 'indigo' | 'emerald';
  disabled?: boolean;
}

function TabToggle({ mode, onChange, accentColor, disabled }: TabToggleProps) {
  const activeClass = accentColor === 'indigo' ?'bg-indigo-600 text-white shadow-sm' :'bg-emerald-600 text-white shadow-sm';

  return (
    <div className="flex items-center gap-1 p-0.5 rounded-lg bg-zinc-800/80 border border-zinc-700/60">
      <button
        onClick={() => onChange('paste')}
        disabled={disabled}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 ${
          mode === 'paste' ? activeClass : 'text-zinc-400 hover:text-zinc-200'
        } disabled:opacity-50`}
      >
        <Type size={11} />
        Paste Text
      </button>
      <button
        onClick={() => onChange('upload')}
        disabled={disabled}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 ${
          mode === 'upload' ? activeClass : 'text-zinc-400 hover:text-zinc-200'
        } disabled:opacity-50`}
      >
        <Upload size={11} />
        Upload File
      </button>
    </div>
  );
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

  const [jdMode, setJdMode] = useState<InputMode>('paste');
  const [resumeMode, setResumeMode] = useState<InputMode>('paste');
  const [jdUploadedFile, setJdUploadedFile] = useState<UploadedFile | null>(null);
  const [resumeUploadedFile, setResumeUploadedFile] = useState<UploadedFile | null>(null);
  const [jdExtracting, setJdExtracting] = useState(false);
  const [resumeExtracting, setResumeExtracting] = useState(false);

  const jdWordCount = jobDescription.trim() ? jobDescription.trim().split(/\s+/).length : 0;
  const resumeWordCount = resume.trim() ? resume.trim().split(/\s+/).length : 0;

  const canAnalyze = jobDescription.trim().length >= 50 && resume.trim().length >= 100 && !isAnalyzing;

  const jdTooShort = jobDescription.trim().length > 0 && jobDescription.trim().length < 50;
  const resumeTooShort = resume.trim().length > 0 && resume.trim().length < 100;

  const handleJdFileSelect = async (file: File) => {
    setJdExtracting(true);
    try {
      const text = await extractTextFromFile(file);
      onJobDescriptionChange(text);
      setJdUploadedFile({ name: file.name, type: file.type, size: file.size });
      setJdMode('paste');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'We couldn\'t read this file. Please try another file or paste the text manually.';
      onJobDescriptionChange('');
      setJdMode('paste');
      toast.error(msg);
    } finally {
      setJdExtracting(false);
    }
  };

  const handleResumeFileSelect = async (file: File) => {
    setResumeExtracting(true);
    try {
      const text = await extractTextFromFile(file);
      onResumeChange(text);
      setResumeUploadedFile({ name: file.name, type: file.type, size: file.size });
      setResumeMode('paste');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'We couldn\'t read this file. Please try another file or paste the text manually.';
      onResumeChange('');
      setResumeMode('paste');
      toast.error(msg);
    } finally {
      setResumeExtracting(false);
    }
  };

  const handleJdClear = () => {
    setJdUploadedFile(null);
    onJobDescriptionChange('');
  };

  const handleResumeClear = () => {
    setResumeUploadedFile(null);
    onResumeChange('');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Input Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Job Description */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
              <div className="w-6 h-6 rounded-md bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                <Briefcase size={12} className="text-indigo-400" />
              </div>
              Job Description
              <span className="text-rose-400 text-xs">*</span>
            </label>
            <div className="flex items-center gap-3">
              {jdMode === 'paste' && <span className="text-xs text-zinc-600 font-tabular">{jdWordCount} words</span>}
              <TabToggle mode={jdMode} onChange={setJdMode} accentColor="indigo" disabled={disabled || jdExtracting} />
            </div>
          </div>
          <p className="text-xs text-zinc-500 -mt-1">
            {jdMode === 'paste' ? 'Paste the full job posting including responsibilities and requirements.' : 'Upload a PDF, DOCX, or TXT file of the job posting.'}
          </p>

          {jdMode === 'paste' ? (
            <>
              {jdUploadedFile && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                  <CheckCircle2 size={13} className="text-indigo-400 flex-shrink-0" />
                  <span className="text-xs text-indigo-300 truncate flex-1">{jdUploadedFile.name}</span>
                  <span className="text-xs text-zinc-500">{getFileTypeLabel(jdUploadedFile.name)}</span>
                  <button onClick={handleJdClear} disabled={disabled} className="text-zinc-500 hover:text-zinc-300 transition-colors ml-1">
                    <X size={12} />
                  </button>
                </div>
              )}
              <div className={`input-gradient-border rounded-xl overflow-hidden transition-all duration-200 ${jdTooShort ? 'ring-1 ring-rose-500/40' : ''}`}>
                <textarea
                  ref={jdRef}
                  value={jobDescription}
                  onChange={(e) => onJobDescriptionChange(e.target.value)}
                  disabled={disabled}
                  placeholder={`Paste the job description here…\n\nExample:\n"We're looking for a Senior Frontend Engineer with 4+ years of React experience, strong TypeScript skills, and experience with AWS services…"`}
                  className="w-full h-64 bg-[hsl(240_10%_6%)] text-zinc-200 text-sm leading-relaxed px-4 py-3.5 resize-none focus:outline-none placeholder:text-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </>
          ) : (
            <div className="relative">
              {jdExtracting && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-zinc-900/70 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-sm text-zinc-300">
                    <Loader2 size={16} className="animate-spin text-indigo-400" />
                    Extracting text…
                  </div>
                </div>
              )}
              <FileInputPanel
                accentColor="indigo"
                uploadedFile={jdUploadedFile}
                onFileSelect={handleJdFileSelect}
                onClear={handleJdClear}
                disabled={disabled || jdExtracting}
              />
            </div>
          )}

          {jdTooShort && (
            <div className="flex items-center gap-1.5 text-xs text-rose-400">
              <AlertCircle size={12} />
              <span>Please provide the complete job description (at least 50 characters).</span>
            </div>
          )}
        </div>

        {/* Resume */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
              <div className="w-6 h-6 rounded-md bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <FileText size={12} className="text-emerald-400" />
              </div>
              Your Resume
              <span className="text-rose-400 text-xs">*</span>
            </label>
            <div className="flex items-center gap-3">
              {resumeMode === 'paste' && <span className="text-xs text-zinc-600 font-tabular">{resumeWordCount} words</span>}
              <TabToggle mode={resumeMode} onChange={setResumeMode} accentColor="emerald" disabled={disabled || resumeExtracting} />
            </div>
          </div>
          <p className="text-xs text-zinc-500 -mt-1">
            {resumeMode === 'paste' ? 'Paste the plain-text version of your resume. Include all sections.' : 'Upload a PDF, DOCX, or TXT version of your resume.'}
          </p>

          {resumeMode === 'paste' ? (
            <>
              {resumeUploadedFile && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />
                  <span className="text-xs text-emerald-300 truncate flex-1">{resumeUploadedFile.name}</span>
                  <span className="text-xs text-zinc-500">{getFileTypeLabel(resumeUploadedFile.name)}</span>
                  <button onClick={handleResumeClear} disabled={disabled} className="text-zinc-500 hover:text-zinc-300 transition-colors ml-1">
                    <X size={12} />
                  </button>
                </div>
              )}
              <div className={`input-gradient-border rounded-xl overflow-hidden transition-all duration-200 ${resumeTooShort ? 'ring-1 ring-rose-500/40' : ''}`}>
                <textarea
                  ref={resumeRef}
                  value={resume}
                  onChange={(e) => onResumeChange(e.target.value)}
                  disabled={disabled}
                  placeholder={`Paste your resume content here…\n\nExample:\nJane Reyes | jane.reyes@email.com | linkedin.com/in/janereyes\n\nSummary\nFrontend engineer with 5 years of experience building scalable React applications…`}
                  className="w-full h-64 bg-[hsl(240_10%_6%)] text-zinc-200 text-sm leading-relaxed px-4 py-3.5 resize-none focus:outline-none placeholder:text-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </>
          ) : (
            <div className="relative">
              {resumeExtracting && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-zinc-900/70 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-sm text-zinc-300">
                    <Loader2 size={16} className="animate-spin text-emerald-400" />
                    Extracting text…
                  </div>
                </div>
              )}
              <FileInputPanel
                accentColor="emerald"
                uploadedFile={resumeUploadedFile}
                onFileSelect={handleResumeFileSelect}
                onClear={handleResumeClear}
                disabled={disabled || resumeExtracting}
              />
            </div>
          )}

          {resumeTooShort && (
            <div className="flex items-center gap-1.5 text-xs text-rose-400">
              <AlertCircle size={12} />
              <span>Please provide your complete resume content (at least 100 characters).</span>
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
            Provide both a job description and your resume to enable analysis.
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