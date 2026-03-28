import React from 'react';

export default function PageFooter() {
  return (
    <footer className="w-full border-t border-white/5 mt-16">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-16 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-zinc-500">
          © 2026 GetMeIn — Know your fit before you apply.
        </p>
        <div className="flex items-center gap-6">
          <span className="text-xs text-zinc-600">Resume data is never stored or shared.</span>
          <span className="text-xs text-zinc-600 px-2 py-1 rounded bg-zinc-800/60 border border-zinc-700/40">v1.0.0</span>
        </div>
      </div>
    </footer>
  );
}