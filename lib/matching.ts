import type { AnswerSegment, Question } from './types';

/**
 * Normalizes a printed or handwritten question label into a comparable key.
 * "11 (a)" / "Q.11a" / "11-a" / "Ans 11 b" all collapse to "11a".
 */
export function normalizeLabel(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let s = raw.toLowerCase();
  s = s.replace(/\b(q|question|ans|answer|no)\b\.?/g, ' ');
  s = s.replace(/[().\-–—:]/g, ' ');
  s = s.replace(/\s+/g, '');
  s = s.trim();
  return s.length ? s : null;
}

export interface LabelMatchResult {
  questionId: string;
  confidence: number;
}

/**
 * Tries to match a student's raw label directly against the known question
 * labels. Returns null if nothing matches with reasonable confidence.
 */
export function matchLabelToQuestion(rawLabel: string | null, questions: Question[]): LabelMatchResult | null {
  const norm = normalizeLabel(rawLabel);
  if (!norm) return null;

  // Exact match against normalized displayNumber first.
  const exact = questions.find((q) => normalizeLabel(q.displayNumber) === norm);
  if (exact) return { questionId: exact.id, confidence: 1 };

  // If the student only wrote the parent number (e.g. "11") and that parent
  // has exactly one sub-part, or no sub-parts at all, match it.
  const parentMatches = questions.filter((q) => normalizeLabel(q.parentNumber) === norm);
  if (parentMatches.length === 1) {
    return { questionId: parentMatches[0].id, confidence: 0.9 };
  }
  if (parentMatches.length > 1) {
    // Ambiguous between sub-parts — let semantic matching decide.
    return null;
  }

  // Loose containment match as a last resort (handles stray characters).
  const loose = questions.find(
    (q) => normalizeLabel(q.displayNumber)?.includes(norm) || norm.includes(normalizeLabel(q.displayNumber) ?? '\u0000')
  );
  if (loose) return { questionId: loose.id, confidence: 0.6 };

  return null;
}

/**
 * Runs the rule-based pass over all segments, returning matched pairs and the
 * leftover segments/questions that still need semantic matching.
 */
export function runLabelMatching(questions: Question[], segments: AnswerSegment[]) {
  const matchedSegmentToQuestion = new Map<string, LabelMatchResult>();
  const claimedQuestionIds = new Set<string>();

  // Sort by confidence-friendly order: exact-shaped labels first isn't necessary
  // since matchLabelToQuestion already returns high confidence for exact matches.
  for (const seg of segments) {
    const result = matchLabelToQuestion(seg.rawLabel, questions);
    if (result && !claimedQuestionIds.has(result.questionId)) {
      matchedSegmentToQuestion.set(seg.id, result);
      claimedQuestionIds.add(result.questionId);
    }
  }

  const unresolvedSegments = segments.filter((s) => !matchedSegmentToQuestion.has(s.id));
  const unresolvedQuestions = questions.filter((q) => !claimedQuestionIds.has(q.id));

  return { matchedSegmentToQuestion, unresolvedSegments, unresolvedQuestions };
}
