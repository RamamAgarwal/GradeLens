'use client';

import type { GradeResult, OverallSummary, Question } from '@/lib/types';

interface SummaryPanelProps {
  summary: OverallSummary;
  grades: GradeResult[];
  questions: Question[];
  open: boolean;
  onClose: () => void;
}

export default function SummaryPanel({ summary, grades, questions, open, onClose }: SummaryPanelProps) {
  if (!open) return null;

  const questionById = new Map(questions.map((q) => [q.id, q]));
  const pct = summary.totalMax > 0 ? Math.round((summary.totalScore / summary.totalMax) * 100) : null;

  return (
    <div className="fixed inset-0 z-30 flex justify-end bg-ink/40" onClick={onClose}>
      <div
        className="flex h-full w-full max-w-md flex-col overflow-hidden bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-ink">Grading summary</h2>
            <p className="text-xs text-ink-muted">Automatic first pass — review before recording marks.</p>
          </div>
          <button onClick={onClose} className="focus-ring rounded-sm px-2 py-1 text-ink-muted hover:text-ink">
            Close
          </button>
        </div>

        <div className="border-b border-gray-200 bg-gray-50 px-5 py-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-ink">
              {summary.totalScore}
              <span className="text-lg text-ink-muted">/{summary.totalMax}</span>
            </span>
            {pct !== null && <span className="text-sm text-ink-muted">({pct}%)</span>}
          </div>
          <div className="mt-2 flex gap-4 text-xs text-ink-muted">
            <span>{summary.answeredCount} answered</span>
            <span>{summary.unansweredCount} not answered</span>
            {summary.unmatchedAnswerCount > 0 && <span>{summary.unmatchedAnswerCount} unmatched</span>}
          </div>
          {summary.overallFeedback && <p className="mt-3 text-sm leading-relaxed text-ink/90">{summary.overallFeedback}</p>}
        </div>

        <ul className="flex-1 overflow-y-auto">
          {grades.map((g) => {
            const q = questionById.get(g.questionId);
            if (!q) return null;
            return (
              <li key={g.questionId} className="border-b border-gray-100 px-5 py-3">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-semibold text-brand">{q.displayNumber}</span>
                  <span className="text-xs text-ink-muted">
                    {g.score ?? '–'}/{g.maxMarks ?? '–'} · {g.verdict}
                  </span>
                </div>
                <p className="mt-1 text-sm text-ink/85">{g.feedback}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
