import { NextRequest, NextResponse } from 'next/server';
import { getChatCompletion } from '@/lib/ai/chatCompletion';

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
  // Must have at least 5 words
  const wordCount = trimmed.split(/\s+/).filter((w) => w.length > 1).length;
  return wordCount >= 5;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resumeText, jobDescriptionText } = body;

    // Validate inputs
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

    const userMessage = `JOB DESCRIPTION:
${jobDescriptionText.trim()}

---

RESUME:
${resumeText.trim()}`;

    const aiResponse = await getChatCompletion(
      'OPEN_AI',
      'gpt-4o',
      [
        { role: 'system', content: ANALYSIS_SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      {
        max_completion_tokens: 2000,
        temperature: 1,
      }
    );

    const rawContent =
      aiResponse?.choices?.[0]?.message?.content ||
      aiResponse?.content ||
      aiResponse?.output_text ||
      aiResponse?.text;

    if (!rawContent) {
      return NextResponse.json(
        { error: 'The AI did not return a valid response. Please try again.' },
        { status: 500 }
      );
    }

    // Strip markdown code fences if present
    const cleaned = rawContent.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

    let parsed: {
      matchScore: number;
      callbackPotential: 'Low' | 'Medium' | 'High';
      strongMatches: string[];
      missingSkillsOrKeywords: string[];
      weakAreas: string[];
      suggestedImprovements: string[];
      tailoredBulletRewrites: { originalIdea: string; improvedVersion: string }[];
      finalAssessment: string;
    };

    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: 'The AI returned an unexpected format. Please try again.' },
        { status: 500 }
      );
    }

    // Validate required fields
    if (
      typeof parsed.matchScore !== 'number' ||
      !parsed.callbackPotential ||
      !Array.isArray(parsed.strongMatches) ||
      !Array.isArray(parsed.missingSkillsOrKeywords)
    ) {
      return NextResponse.json(
        { error: 'The AI returned incomplete analysis data. Please try again.' },
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
        full: err
      },
      { status: 500 }
    );
  }
}
