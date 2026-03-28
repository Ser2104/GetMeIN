import React from 'react';
import PageHeader from './components/PageHeader';
import AnalysisTool from './components/AnalysisTool';
import PageFooter from './components/PageFooter';
import { Toaster } from 'sonner';

export default function ResumeAnalysisToolPage() {
  return (
    <div className="min-h-screen hero-gradient flex flex-col">
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'hsl(240 10% 8%)',
            border: '1px solid hsl(240 5% 18%)',
            color: 'hsl(0 0% 95%)',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '14px',
          },
        }}
      />
      <PageHeader />
      <main className="flex-1 w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-16 py-8 lg:py-12">
        <AnalysisTool />
      </main>
      <PageFooter />
    </div>
  );
}