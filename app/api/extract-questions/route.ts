import { NextRequest, NextResponse } from 'next/server';
import { callGeminiJSON } from '@/lib/gemini';
import { QUESTION_EXTRACTION_SYSTEM, questionExtractionPrompt } from '@/lib/prompts';
import type { Question } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

interface RawQuestion {
  displayNumber: string;
  parentNumber: string;
  text: string;
  maxMarks: number | null;
  page: number;
}

function slugify(displayNumber: string): string {
  return displayNumber
    .toLowerCase()
    .replace(/[().\-–—:]/g, ' ')
    .replace(/\s+/g, '')
    .trim();
}

export async function POST(req: NextRequest) {
  try {
    const { pages } = await req.json();
    if (!Array.isArray(pages) || pages.length === 0) {
      return NextResponse.json({ error: 'No question paper pages were provided.' }, { status: 400 });
    }

    const result = await callGeminiJSON<{ questions: RawQuestion[] }>({
      systemInstruction: QUESTION_EXTRACTION_SYSTEM,
      prompt: questionExtractionPrompt(pages.length),
      images: pages.map((p: { mimeType: string; base64: string }) => ({ mimeType: p.mimeType, base64: p.base64 }))
    });

    const seen = new Map<string, number>();
    const questions: Question[] = (result.questions ?? []).map((q, i) => {
      let base = slugify(q.displayNumber) || `q${i + 1}`;
      const count = seen.get(base) ?? 0;
      seen.set(base, count + 1);
      const id = count === 0 ? base : `${base}-${count + 1}`;
      return {
        id,
        displayNumber: q.displayNumber,
        parentNumber: q.parentNumber || q.displayNumber,
        text: q.text,
        maxMarks: typeof q.maxMarks === 'number' ? q.maxMarks : null,
        page: q.page || 1,
        order: i
      };
    });

    return NextResponse.json({ questions });
  } catch (err: any) {
    console.error('extract-questions error', err);
    return NextResponse.json({ error: err.message || 'Question extraction failed.' }, { status: 500 });
  }
}
