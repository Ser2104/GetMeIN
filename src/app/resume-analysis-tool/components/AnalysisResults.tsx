import React from 'react';
import type { AnalysisResult } from './AnalysisTool';
import ScoreHeroCard from './results/ScoreHeroCard';
import StatsSummaryCard from './results/StatsSummaryCard';
import KeywordCoverageCard from './results/KeywordCoverageCard';
import StrengthsCard from './results/StrengthsCard';
import WeakAreasCard from './results/WeakAreasCard';
import ImprovementsCard from './results/ImprovementsCard';
import BulletRewritesCard from './results/BulletRewritesCard';
import CompetitivenessCard from './results/CompetitivenessCard';

interface AnalysisResultsProps {
  result: AnalysisResult;
}

export default function AnalysisResults({ result }: AnalysisResultsProps) {
  const total = result.strongMatches.length + result.missingSkillsOrKeywords.length;
  const keywordCoverage = total > 0 ? Math.round((result.strongMatches.length / total) * 100) : 0;

  // Derive ATS risk from score
  const atsRiskLevel: 'Low' | 'Medium' | 'High' =
    result.matchScore >= 70 ? 'Low' : result.matchScore >= 50 ? 'Medium' : 'High';

  // Map strongMatches → strengths for StrengthsCard
  const strengths = result.strongMatches.map((s) => ({
    title: s,
    description: '',
  }));

  // Map weakAreas → weak areas for WeakAreasCard (strings → objects)
  const weakAreas = result.weakAreas.map((w) => ({
    title: w,
    description: '',
    severity: 'medium' as 'high' | 'medium' | 'low',
  }));

  // Map suggestedImprovements → improvements for ImprovementsCard
  const improvements = result.suggestedImprovements.map((s, i) => ({
    area: `Improvement ${i + 1}`,
    suggestion: s,
  }));

  // Map tailoredBulletRewrites → bulletRewrites for BulletRewritesCard
  const bulletRewrites = result.tailoredBulletRewrites.map((r) => ({
    original: r.originalIdea,
    rewritten: r.improvedVersion,
    reason: '',
  }));

  const skillsMatchPercent = result.matchScore;
  const experienceAlignment = Math.max(0, result.matchScore - 5);

  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      {/* Row 1: Score Hero + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1">
          <ScoreHeroCard
            score={result.matchScore}
            callbackPotential={result.callbackPotential}
            atsRiskLevel={atsRiskLevel}
          />
        </div>
        <div className="lg:col-span-2">
          <StatsSummaryCard
            keywordCoverage={keywordCoverage}
            skillsMatchPercent={skillsMatchPercent}
            experienceAlignment={experienceAlignment}
            strengthCount={result.strongMatches.length}
            weakAreaCount={result.weakAreas.length}
            missingSkillsCount={result.missingSkillsOrKeywords.length}
          />
        </div>
      </div>

      {/* Row 2: Competitiveness banner */}
      <CompetitivenessCard
        callbackPotential={result.callbackPotential}
        applicationCompetitiveness={result.finalAssessment}
        atsRiskLevel={atsRiskLevel}
      />

      {/* Row 3: Keyword Coverage */}
      <KeywordCoverageCard
        keywordsFound={result.strongMatches}
        keywordsMissing={result.missingSkillsOrKeywords}
        keywordCoverage={keywordCoverage}
      />

      {/* Row 4: Strengths + Weak Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <StrengthsCard strengths={strengths} />
        <WeakAreasCard weakAreas={weakAreas} />
      </div>

      {/* Row 5: Improvements */}
      <ImprovementsCard improvements={improvements} />

      {/* Row 6: Bullet Rewrites */}
      <BulletRewritesCard bulletRewrites={bulletRewrites} />
    </div>
  );
}