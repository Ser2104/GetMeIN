import { NextRequest, NextResponse } from 'next/server';
import { completion } from '@rocketnew/llm-sdk';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured.' },
        { status: 500 }
      );
    }

    const aiResponse = await completion({
      model: 'gemini-2.0-flash',
      messages,
      stream: false,
      api_key: apiKey,
      temperature: 0.7,
      max_completion_tokens: 2000,
    });

    const content =
      (aiResponse as any)?.choices?.[0]?.message?.content ||
      (aiResponse as any)?.content ||
      (aiResponse as any)?.output_text ||
      (aiResponse as any)?.text;

    if (!content) {
      return NextResponse.json(
        { error: 'Invalid AI response.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      role: 'assistant',
      content,
    });
  } catch (err: any) {
    console.error('Chat error:', err);

    return NextResponse.json(
      {
        error: 'Chat failed',
        details: err?.message || String(err),
      },
      { status: 500 }
    );
  }
}
