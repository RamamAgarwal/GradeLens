'use client';

import { useState } from 'react';
import type { AnswerSegment, GradeResult, Mapping, Question, Verdict } from '@/lib/types';

interface QuestionListProps {
  questions: Question[];
  mappings: Mapping[];
  grades: GradeResult[];
  unmatchedSegments: AnswerSegment[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onShowSummary: () => void;
}

function scorePillClasses(score: number | null, maxMarks: number | null, verdict: Verdict): string {
  if (verdict === 'unanswered') return 'bg-gray-100 text-ink-faint';
  if (score === null || maxMarks === null) return 'bg-gray-100 text-ink-muted';
  if (maxMarks === 0) return 'bg-gray-100 text-ink-muted';
  const ratio = score / maxMarks;
  if (ratio >= 0.99) return 'bg-success-bg text-success-text';
  if (ratio <= 0.01) return 'bg-danger-bg text-danger-text';
  return 'bg-warn-bg text-warn-text';
}

function subLabel(displayNumber: string, parentNumber: string): string | null {
  if (displayNumber === parentNumber) return null;
  const stripped = displayNumber.replace(parentNumber, '').replace(/[().\s]/g, '');
  return stripped || null;
}

export default function QuestionList({ questions, mappings, grades, unmatchedSegments, selectedId, onSelect, onShowSummary }: QuestionListProps) {
  const [expandAll, setExpandAll] = useState(false);
  const mappingByQuestion = new Map(mappings.filter((m) => m.questionId).map((m) => [m.questionId as string, m]));
  const gradeByQuestion = new Map(grades.map((g) => [g.questionId, g]));

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-ink">Extracted Questions (from question paper)</h2>
        <div className="flex items-center gap-3">
          <button onClick={onShowSummary} className="focus-ring text-xs font-medium text-ink-muted hover:text-brand hover:underline">
            Summary
          </button>
          <button onClick={() => setExpandAll((v) => !v)} className="focus-ring text-xs font-medium text-brand hover:underline">
            {expandAll ? 'Collapse All' : 'Expand All'}
          </button>
        </div>
      </div>

      <ul className="flex-1 overflow-y-auto p-2">
        {questions.map((q) => {
          const mapping = mappingByQuestion.get(q.id);
          const grade = gradeByQuestion.get(q.id);
          const hasAnswer = (mapping?.segmentIds.length ?? 0) > 0;
          const verdict: Verdict = grade?.verdict ?? (hasAnswer ? 'ungraded' : 'unanswered');
          const isSelected = selectedId === q.id;
          const isExpanded = expandAll || isSelected;
          const sub = subLabel(q.displayNumber, q.parentNumber);

          return (
            <li key={q.id} className={sub ? 'ml-6' : ''}>
              <div
                className={`mb-1.5 rounded-lg border px-3 py-2.5 transition-colors ${
                  isSelected ? 'border-brand bg-brand-light/50' : 'border-transparent hover:bg-gray-50'
                }`}
              >
                <button onClick={() => onSelect(q.id)} className="focus-ring flex w-full items-start gap-2.5 text-left">
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                      isSelected ? 'bg-brand text-white' : 'bg-gray-100 text-ink-muted'
                    }`}
                  >
                    {sub ?? (q.displayNumber.replace(/\D/g, '') || String(q.order + 1))}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 text-sm text-ink">{q.text}</span>
                    {!hasAnswer && <span className="mt-0.5 block text-[11px] font-medium uppercase tracking-wide text-ink-faint">Not answered</span>}
                  </span>
                  {q.maxMarks !== null && (
                    <span className={`shrink-0 rounded-md px-1.5 py-0.5 font-mono text-xs font-medium ${scorePillClasses(grade?.score ?? null, q.maxMarks, verdict)}`}>
                      {grade?.score ?? '–'}/{q.maxMarks}
                    </span>
                  )}
                  <svg viewBox="0 0 20 20" fill="none" className={`mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-faint transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                    <path d="M5.5 8 10 12.5 14.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {isExpanded && grade?.feedback && (
                  <div className="mt-2 rounded-md border border-brand/20 bg-brand-light/60 px-3 py-2">
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-brand">AI Feedback</p>
                    <p className="text-xs leading-relaxed text-ink/90">{grade.feedback}</p>
                  </div>
                )}
              </div>
            </li>
          );
        })}

        {unmatchedSegments.length > 0 && (
          <li className="mt-3 border-t border-gray-100 px-1 pt-3">
            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-warn-text">
              Answers with no matching question ({unmatchedSegments.length})
            </p>
            <ul className="space-y-1.5">
              {unmatchedSegments.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => onSelect(`seg:${s.id}`)}
                    className={`focus-ring block w-full rounded-lg border border-warn/30 bg-warn-bg/40 px-3 py-2 text-left text-sm hover:bg-warn-bg ${
                      selectedId === `seg:${s.id}` ? 'ring-2 ring-warn' : ''
                    }`}
                  >
                    <span className="text-xs font-medium text-ink-muted">{s.rawLabel ? `Labelled "${s.rawLabel}"` : 'No label written'}</span>
                    <p className="mt-0.5 line-clamp-2 text-ink/80">{s.transcription}</p>
                  </button>
                </li>
              ))}
            </ul>
          </li>
        )}
      </ul>
    </div>
  );
}
