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
  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      {/* Row 1: Score Hero + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1">
          <ScoreHeroCard
            score={result.overallScore}
            callbackPotential={result.callbackPotential}
            atsRiskLevel={result.atsRiskLevel}
          />
        </div>
        <div className="lg:col-span-2">
          <StatsSummaryCard
            keywordCoverage={result.keywordCoverage}
            skillsMatchPercent={result.skillsMatchPercent}
            experienceAlignment={result.experienceAlignment}
            strengthCount={result.strengths.length}
            weakAreaCount={result.weakAreas.length}
            missingSkillsCount={result.keywordsMissing.length}
          />
        </div>
      </div>

      {/* Row 2: Competitiveness banner */}
      <CompetitivenessCard
        callbackPotential={result.callbackPotential}
        applicationCompetitiveness={result.applicationCompetitiveness}
        atsRiskLevel={result.atsRiskLevel}
      />

      {/* Row 3: Keyword Coverage */}
      <KeywordCoverageCard
        keywordsFound={result.keywordsFound}
        keywordsMissing={result.keywordsMissing}
        keywordCoverage={result.keywordCoverage}
      />

      {/* Row 4: Strengths + Weak Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <StrengthsCard strengths={result.strengths} />
        <WeakAreasCard weakAreas={result.weakAreas} />
      </div>

      {/* Row 5: Improvements */}
      <ImprovementsCard improvements={result.improvements} />

      {/* Row 6: Bullet Rewrites */}
      <BulletRewritesCard bulletRewrites={result.bulletRewrites} />
    </div>
  );
}