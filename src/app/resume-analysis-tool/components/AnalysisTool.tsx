'use client';

import React, { useState } from 'react';
import HeroSection from './HeroSection';
import InputSection from './InputSection';
import AnalysisResults from './AnalysisResults';
import AnalysisLoadingSkeleton from './AnalysisLoadingSkeleton';
import { toast } from 'sonner';

export interface AnalysisResult {
  overallScore: number;
  callbackPotential: 'Low' | 'Medium' | 'High';
  applicationCompetitiveness: string;
  keywordCoverage: number;
  keywordsFound: string[];
  keywordsMissing: string[];
  strengths: { title: string; description: string }[];
  weakAreas: { title: string; description: string; severity: 'high' | 'medium' | 'low' }[];
  improvements: { area: string; suggestion: string }[];
  bulletRewrites: { original: string; rewritten: string; reason: string }[];
  experienceAlignment: number;
  skillsMatchPercent: number;
  atsRiskLevel: 'Low' | 'Medium' | 'High';
}

type AppState = 'idle' | 'analyzing' | 'results' | 'error';

export default function AnalysisTool() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [jobDescription, setJobDescription] = useState('');
  const [resume, setResume] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAnalyze = async () => {
    if (!jobDescription.trim() || jobDescription.trim().length < 50) {
      toast.error('Job description is too short. Please paste the full job posting.');
      return;
    }
    if (!resume.trim() || resume.trim().length < 100) {
      toast.error('Resume content is too short. Please paste your complete resume.');
      return;
    }

    setAppState('analyzing');
    setErrorMessage('');

    try {
      // BACKEND INTEGRATION POINT:
      // Replace the mock analysis below with a real API call:
      // const response = await fetch('/api/analyze', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ jobDescription, resume }),
      // });
      // if (!response.ok) throw new Error('Analysis failed');
      // const data: AnalysisResult = await response.json();
      // setResult(data);

      // Mock analysis with realistic delay (simulates OpenAI processing time)
      await new Promise((resolve) => setTimeout(resolve, 3200));

      const mockResult = generateMockAnalysis(jobDescription, resume);
      setResult(mockResult);
      setAppState('results');
      toast.success('Analysis complete — your report is ready.');
    } catch {
      setAppState('error');
      setErrorMessage('Analysis failed. Check your connection and try again.');
      toast.error('Analysis failed. Please try again.');
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
  };

  return (
    <div className="flex flex-col gap-10">
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
              <p className="text-sm text-zinc-400 mt-1">Based on your resume vs. the provided job description</p>
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
            <h3 className="text-lg font-semibold text-white mb-2">Analysis Failed</h3>
            <p className="text-zinc-400 text-sm max-w-md">{errorMessage}</p>
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

// Mock analysis engine — replace with OpenAI API call in /api/analyze route
function generateMockAnalysis(_jd: string, _resume: string): AnalysisResult {
  const score = 72;
  return {
    overallScore: score,
    callbackPotential: 'Medium',
    applicationCompetitiveness: 'Above Average — your profile aligns with most core requirements but gaps in cloud infrastructure and CI/CD tooling reduce competitiveness against senior candidates.',
    keywordCoverage: 68,
    keywordsFound: [
      'React', 'TypeScript', 'REST APIs', 'Agile', 'Git', 'Node.js',
      'UI/UX', 'Performance optimization', 'Code review', 'Team collaboration',
      'JavaScript', 'Responsive design',
    ],
    keywordsMissing: [
      'AWS', 'Docker', 'Kubernetes', 'CI/CD', 'GraphQL',
      'Microservices', 'Jest', 'Cypress', 'Redis', 'PostgreSQL',
    ],
    strengths: [
      {
        title: 'Strong Frontend Engineering Background',
        description: 'Your 4+ years of React and TypeScript experience directly matches the role\'s primary technical requirements. Specific mentions of performance optimization and component architecture signal seniority.',
      },
      {
        title: 'Quantified Impact on Key Projects',
        description: 'Bullet points like "reduced load time by 40%" and "increased user retention by 18%" stand out to hiring managers and ATS systems alike. This is above average for candidates at this level.',
      },
      {
        title: 'Agile & Cross-functional Collaboration',
        description: 'Multiple references to sprint planning, design handoffs, and stakeholder communication align well with the job\'s emphasis on cross-team delivery.',
      },
      {
        title: 'Open Source Contributions Mentioned',
        description: 'Reference to open source work signals initiative and public code quality — a differentiator that many candidates at this level lack.',
      },
    ],
    weakAreas: [
      {
        title: 'No Cloud Infrastructure Experience Mentioned',
        description: 'The job description requires AWS (EC2, S3, Lambda) experience. Your resume has no mention of cloud platforms, deployment pipelines, or infrastructure-as-code. This is a critical gap for a senior role.',
        severity: 'high',
      },
      {
        title: 'Testing Stack Absent',
        description: 'Jest and Cypress appear 3 times in the job description as requirements. Your resume does not mention any testing frameworks, which is a significant red flag for a senior frontend engineer role.',
        severity: 'high',
      },
      {
        title: 'No GraphQL or API Design Experience',
        description: 'The role involves GraphQL API consumption and schema design. REST API experience is present but GraphQL is not mentioned anywhere in your resume.',
        severity: 'medium',
      },
      {
        title: 'Leadership Scope Understated',
        description: 'The role requires mentoring junior developers and leading technical direction. Your resume mentions collaboration but does not demonstrate ownership or mentorship outcomes.',
        severity: 'medium',
      },
      {
        title: 'Company Context Missing for Two Roles',
        description: 'Two of your listed positions lack company size or industry context. Hiring managers at this company prefer candidates who have scaled products at comparable company stages.',
        severity: 'low',
      },
    ],
    improvements: [
      {
        area: 'Add Cloud Platform Exposure',
        suggestion: 'Even if AWS wasn\'t your primary responsibility, add any deployment, S3 usage, or Lambda experience you have. If minimal, consider adding a brief "currently completing AWS Solutions Architect Associate" to show initiative.',
      },
      {
        area: 'Include Testing Frameworks Explicitly',
        suggestion: 'Add a "Testing: Jest, React Testing Library" line to your skills section. If you have tested components, rewrite those bullets to explicitly mention test coverage improvements or TDD practices.',
      },
      {
        area: 'Reframe Collaboration as Leadership',
        suggestion: 'Replace "worked with junior developers" with "mentored 2 junior engineers through code reviews and pair programming, reducing PR turnaround time by 30%." Specificity converts weak bullets into strong ones.',
      },
      {
        area: 'Add GraphQL to Technical Skills',
        suggestion: 'If you\'ve consumed any GraphQL APIs (even in personal projects), list it explicitly. The job description mentions it as a requirement, and its absence is likely triggering ATS filtering.',
      },
      {
        area: 'Strengthen Summary Statement',
        suggestion: 'Your current summary is generic. Rewrite it to mirror the job title and 2–3 core requirements: "Senior Frontend Engineer with 5 years building scalable React/TypeScript applications, specializing in performance optimization and cross-functional delivery in agile environments."',
      },
    ],
    bulletRewrites: [
      {
        original: 'Worked on improving the performance of the web application.',
        rewritten: 'Identified and resolved 12 rendering bottlenecks in a high-traffic React application, reducing Time-to-Interactive by 38% and improving Core Web Vitals scores from 61 to 94 (Lighthouse).',
        reason: 'Original lacks specificity, metrics, and technical depth. Rewrite demonstrates measurable impact and names the exact performance framework the JD references.',
      },
      {
        original: 'Collaborated with designers to implement UI features.',
        rewritten: 'Partnered with product design team to translate Figma prototypes into pixel-perfect, accessible React components, delivering 3 major feature releases on schedule across Q2–Q3 2025.',
        reason: 'Original is passive and generic. Rewrite names the design tool, establishes ownership, and ties work to delivery outcomes.',
      },
      {
        original: 'Helped junior developers with code reviews.',
        rewritten: 'Mentored 3 junior frontend engineers through structured weekly code reviews and pair programming sessions, reducing average PR review cycles from 4 days to 1.5 days.',
        reason: 'Original undersells leadership. Rewrite quantifies mentorship impact and frames it as a measurable team efficiency improvement — directly addressing the JD\'s leadership requirement.',
      },
      {
        original: 'Worked on building REST APIs and integrating them into the frontend.',
        rewritten: 'Designed and integrated 8 RESTful API endpoints using Node.js/Express, collaborating with backend engineers to define contract specs that reduced frontend-backend integration bugs by 45%.',
        reason: 'Original is vague about scope and ownership. Rewrite establishes technical ownership, cross-functional collaboration, and quantified quality improvement.',
      },
    ],
    experienceAlignment: 74,
    skillsMatchPercent: 62,
    atsRiskLevel: 'Medium',
  };
}