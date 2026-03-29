import React from 'react';
import AppLogo from '@/components/ui/AppLogo';
import { Sparkles } from 'lucide-react';

export default function PageHeader() {
  return (
    <header className="w-full border-b border-white/5 backdrop-blur-sm sticky top-0 z-50 bg-[hsl(240_10%_3.9%/0.85)]">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-16 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AppLogo size={32} />
          <span className="font-bold text-lg tracking-tight text-white hidden sm:block">
            Get<span className="text-gradient">Me</span>In
          </span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
          <Sparkles size={13} className="text-indigo-400" />
          <span className="text-xs font-semibold text-indigo-300 tracking-wide">Powered by Gemini</span>
        </div>
      </div>
    </header>
  );
}