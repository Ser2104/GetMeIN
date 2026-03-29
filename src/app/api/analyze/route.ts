import { NextRequest, NextResponse } from 'next/server';
import { completion } from '@rocketnew/llm-sdk';

const ANALYSIS_SYSTEM_PROMPT = `You are an expert resume evaluator and job-fit analyst.

Your task is to compare a candidate's resume against a specific job description and produce a structured, evidence-based evaluation.

You must base your analysis ONLY on the actual content provided. Do NOT invent qualifications, experiences, or skills that are not present in the resume.

Instructions:
- Carefully read the job description
- Carefully read the resume
- Identify direct overlaps between job requirements and candidate skills
- Identify missing skills, keywords, or experiences
- Evaluate how competitive the resume is for this role
- Be specific and realistic
- Avoid generic advice
- Do not guarantee hiring outcomes

Return ONLY valid JSON in this format:

{
  "matchScore": number,
  "callbackPotential": "Low" | "Medium" | "High",
  "strongMatches": ["...", "..."],
  "missingSkillsOrKeywords": ["...", "..."],
  "weakAreas": ["...", "..."],
  "suggestedImprovements": ["...", "..."],
  "tailoredBulletRewrites": [
    {
      "originalIdea": "...",
      "improvedVersion": "..."
    }
  ],
  "finalAssessment": "..."
}

Scoring rules:
- 80–100: strong alignment
- 60–79: moderate alignment
- 40–59: weak alignment
- below 40: poor alignment

Only output JSON. No extra text.`;

function isMeaningfulText(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length < 50) return false;
  const wordCount = trimmed.split(/\s+/).filter((w) => w.length > 1).length;
  return wordCount >= 5;
}

type ParsedAnalysis = {
  matchScore: number;
  callbackPotential: 'Low' | 'Medium' | 'High';
  strongMatches: string[];
  missingSkillsOrKeywords: string[];
  weakAreas: string[];
  suggestedImprovements: string[];
  tailoredBulletRewrites: { originalIdea: string; improvedVersion: string }[];
  finalAssessment: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resumeText, jobDescriptionText } = body;

    if (!resumeText || typeof resumeText !== 'string' || !isMeaningfulText(resumeText)) {
      return NextResponse.json(
        { error: 'We need readable text from both the resume and the job description before we can analyze the match.' },
        { status: 400 }
      );
    }

    if (!jobDescriptionText || typeof jobDescriptionText !== 'string' || !isMeaningfulText(jobDescriptionText)) {
      return NextResponse.json(
        { error: 'We need readable text from both the resume and the job description before we can analyze the match.' },
        { status: 400 }
      );
    }

    // 🔥 CAMBIO CLAVE: ahora usamos GEMINI
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured.' },
        { status: 500 }
      );
    }

    const messages = [
      { role: 'system', content: ANALYSIS_SYSTEM_PROMPT },
      {
        role: 'user',
        content: `JOB DESCRIPTION:
${jobDescriptionText.trim()}

---

RESUME:
${resumeText.trim()}`
      }
    ];

    // 🔥 CAMBIO CLAVE: modelo GEMINI
    const aiResponse = await completion({
      model: 'gemini-1.5-flash',
      messages,
      stream: false,
      api_key: apiKey,
      temperature: 0.3,
      max_completion_tokens: 2000,
    });

    const rawContent =
      (aiResponse as any)?.choices?.[0]?.message?.content ||
      (aiResponse as any)?.content ||
      (aiResponse as any)?.output_text ||
      (aiResponse as any)?.text;

    if (!rawContent || typeof rawContent !== 'string') {
      return NextResponse.json(
        {
          error: 'The AI did not return a valid response.',
          details: JSON.stringify(aiResponse, null, 2),
        },
        { status: 500 }
      );
    }

    const cleaned = rawContent
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    let parsed: ParsedAnalysis;

    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        {
          error: 'The AI returned an unexpected format.',
          details: cleaned,
        },
        { status: 500 }
      );
    }

    if (
      typeof parsed.matchScore !== 'number' ||
      !parsed.callbackPotential ||
      !Array.isArray(parsed.strongMatches) ||
      !Array.isArray(parsed.missingSkillsOrKeywords) ||
      !Array.isArray(parsed.weakAreas) ||
      !Array.isArray(parsed.suggestedImprovements) ||
      !Array.isArray(parsed.tailoredBulletRewrites) ||
      typeof parsed.finalAssessment !== 'string'
    ) {
      return NextResponse.json(
        {
          error: 'The AI returned incomplete analysis data.',
          details: JSON.stringify(parsed, null, 2),
        },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error('Analyze route error FULL:', err);

    return NextResponse.json(
      {
        error: 'Analysis failed',
        details: err?.message || String(err),
      },
      { status: 500 }
    );
  }
}