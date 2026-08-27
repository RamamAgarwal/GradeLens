import { NextRequest, NextResponse } from 'next/server';
import { callGeminiJSON } from '@/lib/gemini';
import { ANSWER_EXTRACTION_SYSTEM, answerExtractionPrompt } from '@/lib/prompts';
import type { AnswerSegment, BBox } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

interface RawSegment {
  rawLabel: string | null;
  transcription: string;
  regions: { page: number; bbox: BBox }[];
}

function clampBBox(b: BBox): BBox {
  const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
  return {
    x: clamp01(b.x),
    y: clamp01(b.y),
    w: Math.max(0.01, Math.min(1 - clamp01(b.x), b.w)),
    h: Math.max(0.01, Math.min(1 - clamp01(b.y), b.h))
  };
}

export async function POST(req: NextRequest) {
  try {
    const { pages } = await req.json();
    if (!Array.isArray(pages) || pages.length === 0) {
      return NextResponse.json({ error: 'No answer sheet pages were provided.' }, { status: 400 });
    }

    const result = await callGeminiJSON<{ segments: RawSegment[] }>({
      systemInstruction: ANSWER_EXTRACTION_SYSTEM,
      prompt: answerExtractionPrompt(pages.length),
      images: pages.map((p: { mimeType: string; base64: string }) => ({ mimeType: p.mimeType, base64: p.base64 }))
    });

    const segments: AnswerSegment[] = (result.segments ?? []).map((s, i) => ({
      id: `seg-${i + 1}`,
      rawLabel: s.rawLabel,
      transcription: s.transcription,
      regions: (s.regions ?? []).map((r) => ({ page: r.page, bbox: clampBBox(r.bbox) })),
      order: i
    }));

    return NextResponse.json({ segments });
  } catch (err: any) {
    console.error('extract-answers error', err);
    return NextResponse.json({ error: err.message || 'Answer extraction failed.' }, { status: 500 });
  }
}
