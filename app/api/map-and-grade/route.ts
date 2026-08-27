import { NextRequest, NextResponse } from 'next/server';
import { callGeminiJSON } from '@/lib/gemini';
import { GRADING_SYSTEM, gradingPrompt, SEMANTIC_MATCH_SYSTEM, semanticMatchPrompt } from '@/lib/prompts';
import { runLabelMatching } from '@/lib/matching';
import type { AnswerSegment, GradeResult, Mapping, OverallSummary, Question, Verdict } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { questions, segments } = (await req.json()) as { questions: Question[]; segments: AnswerSegment[] };
    if (!Array.isArray(questions) || !Array.isArray(segments)) {
      return NextResponse.json({ error: 'Both questions and segments arrays are required.' }, { status: 400 });
    }

    // --- Step 1: cheap, deterministic label matching -------------------
    const { matchedSegmentToQuestion, unresolvedSegments, unresolvedQuestions } = runLabelMatching(
      questions,
      segments
    );

    // --- Step 2: AI semantic fallback for whatever's left ---------------
    if (unresolvedSegments.length > 0 && unresolvedQuestions.length > 0) {
      try {
        const semantic = await callGeminiJSON<{ matches: { segmentId: string; questionId: string; confidence: number }[] }>({
          systemInstruction: SEMANTIC_MATCH_SYSTEM,
          prompt: semanticMatchPrompt(
            unresolvedQuestions.map((q) => ({ id: q.id, displayNumber: q.displayNumber, text: q.text })),
            unresolvedSegments.map((s) => ({ id: s.id, rawLabel: s.rawLabel, transcription: s.transcription }))
          ),
          temperature: 0.1
        });

        const claimed = new Set<string>();
        for (const m of semantic.matches ?? []) {
          if (m.questionId === 'NONE' || claimed.has(m.questionId)) continue;
          const questionExists = unresolvedQuestions.some((q) => q.id === m.questionId);
          if (!questionExists) continue;
          matchedSegmentToQuestion.set(m.segmentId, { questionId: m.questionId, confidence: m.confidence ?? 0.5 });
          claimed.add(m.questionId);
        }
      } catch (e) {
        // Semantic matching is a best-effort enhancement — fall through and
        // treat anything still unresolved as unanswered/unmatched.
        console.error('semantic matching failed, continuing without it', e);
      }
    }

    // --- Build mappings: one entry per question, plus unmatched segments ---
    const questionIdToSegmentIds = new Map<string, string[]>();
    for (const [segId, res] of matchedSegmentToQuestion.entries()) {
      const list = questionIdToSegmentIds.get(res.questionId) ?? [];
      list.push(segId);
      questionIdToSegmentIds.set(res.questionId, list);
    }

    const mappings: Mapping[] = questions.map((q) => {
      const segIds = questionIdToSegmentIds.get(q.id) ?? [];
      const confidences = segIds.map((id) => matchedSegmentToQuestion.get(id)?.confidence ?? 0.5);
      return {
        questionId: q.id,
        segmentIds: segIds,
        method: segIds.length === 0 ? 'none' : confidences[0] === 1 ? 'label-exact' : confidences[0] >= 0.85 ? 'label-fuzzy' : 'semantic',
        confidence: confidences.length ? Math.max(...confidences) : 0
      };
    });

    const matchedSegmentIds = new Set(matchedSegmentToQuestion.keys());
    const unmatchedSegments = segments.filter((s) => !matchedSegmentIds.has(s.id));
    for (const s of unmatchedSegments) {
      mappings.push({ questionId: null, segmentIds: [s.id], method: 'none', confidence: 0 });
    }

    // --- Step 3: grading ------------------------------------------------
    const gradingItems = questions.map((q) => {
      const segIds = questionIdToSegmentIds.get(q.id) ?? [];
      const answerText = segIds.length
        ? segIds
            .map((id) => segments.find((s) => s.id === id)?.transcription)
            .filter(Boolean)
            .join('\n---\n')
        : null;
      return {
        questionId: q.id,
        displayNumber: q.displayNumber,
        questionText: q.text,
        maxMarks: q.maxMarks,
        answerText
      };
    });

    let grades: GradeResult[] = [];
    let overallFeedback = '';

    try {
      const graded = await callGeminiJSON<{
        grades: { questionId: string; score: number | null; verdict: Verdict; feedback: string }[];
        overallFeedback: string;
      }>({
        systemInstruction: GRADING_SYSTEM,
        prompt: gradingPrompt(gradingItems),
        temperature: 0.2,
        maxOutputTokens: 8192
      });

      const maxMarksById = new Map(questions.map((q) => [q.id, q.maxMarks] as const));
      grades = (graded.grades ?? []).map((g) => ({
        questionId: g.questionId,
        score: g.score,
        maxMarks: maxMarksById.get(g.questionId) ?? null,
        verdict: g.verdict,
        feedback: g.feedback
      }));
      overallFeedback = graded.overallFeedback ?? '';
    } catch (e) {
      console.error('grading failed', e);
      // Degrade gracefully: mapping/highlighting still works even if grading fails.
      grades = questions.map((q) => ({
        questionId: q.id,
        score: null,
        maxMarks: q.maxMarks,
        verdict: (questionIdToSegmentIds.get(q.id)?.length ? 'ungraded' : 'unanswered') as Verdict,
        feedback: 'Automatic grading was unavailable for this question.'
      }));
      overallFeedback = 'Automatic grading was unavailable. Questions and answers were still extracted and mapped.';
    }

    const totalMax = grades.reduce((sum, g) => sum + (g.maxMarks ?? 0), 0);
    const totalScore = grades.reduce((sum, g) => sum + (g.score ?? 0), 0);
    const unansweredCount = grades.filter((g) => g.verdict === 'unanswered').length;

    const summary: OverallSummary = {
      totalScore,
      totalMax,
      answeredCount: questions.length - unansweredCount,
      unansweredCount,
      unmatchedAnswerCount: unmatchedSegments.length,
      overallFeedback
    };

    return NextResponse.json({ mappings, grades, summary });
  } catch (err: any) {
    console.error('map-and-grade error', err);
    return NextResponse.json({ error: err.message || 'Mapping and grading failed.' }, { status: 500 });
  }
}
