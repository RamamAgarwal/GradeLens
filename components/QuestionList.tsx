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

function scorePillColor(score: number | null, maxMarks: number | null, verdict: Verdict): string {
  if (verdict === 'unanswered') return 'bg-gray-100 text-gray-400';
  if (score === null || maxMarks === null) return 'bg-gray-100 text-gray-500';
  if (maxMarks === 0) return 'bg-gray-100 text-gray-500';
  const ratio = score / maxMarks;
  if (ratio >= 0.99) return 'bg-emerald-50 text-emerald-600';
  if (ratio <= 0.01) return 'bg-red-50 text-red-500';
  return 'bg-amber-50 text-amber-600';
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
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <h2 className="text-[13px] font-bold text-[#1A1A1A]">Extracted Questions <span className="font-normal text-gray-400">(from question paper)</span></h2>
        <button
          onClick={() => setExpandAll((v) => !v)}
          className="text-[12px] font-semibold text-[#FF5B29] hover:underline"
        >
          {expandAll ? 'Collapse All' : 'Expand All'}
        </button>
      </div>

      {/* Question list */}
      <ul className="flex-1 overflow-y-auto px-2 py-2">
        {questions.map((q, idx) => {
          const mapping = mappingByQuestion.get(q.id);
          const grade = gradeByQuestion.get(q.id);
          const hasAnswer = (mapping?.segmentIds.length ?? 0) > 0;
          const verdict: Verdict = grade?.verdict ?? (hasAnswer ? 'ungraded' : 'unanswered');
          const isSelected = selectedId === q.id;
          const isExpanded = expandAll || isSelected;
          const sub = subLabel(q.displayNumber, q.parentNumber);
          const displayNum = sub ?? (q.displayNumber.replace(/\D/g, '') || String(q.order + 1));

          return (
            <li key={q.id} className={sub ? 'ml-6' : ''}>
              <div
                className={`mb-1 rounded-xl border px-3 py-2.5 transition-all ${
                  isSelected
                    ? 'border-[#FF5B29]/30 bg-[#FFEFE9]/40'
                    : 'border-transparent hover:bg-gray-50'
                }`}
              >
                <button onClick={() => onSelect(q.id)} className="flex w-full items-start gap-2.5 text-left">
                  {/* Number badge */}
                  <span
                    className={`mt-0.5 flex h-[22px] min-w-[22px] shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                      isSelected ? 'bg-[#FF5B29] text-white' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {displayNum}
                  </span>

                  {/* Text */}
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 text-[13px] leading-[1.4] text-gray-700">{q.text}</span>
                    {!hasAnswer && (
                      <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-wider text-gray-400">Not answered</span>
                    )}
                  </span>

                  {/* Score pill */}
                  {q.maxMarks !== null && (
                    <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-bold tabular-nums ${scorePillColor(grade?.score ?? null, q.maxMarks, verdict)}`}>
                      {grade?.score ?? '–'}/{q.maxMarks}
                    </span>
                  )}

                  {/* Expand chevron */}
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    className={`mt-1 h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  >
                    <path d="M5.5 8 10 12.5 14.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {/* AI Feedback */}
                {isExpanded && grade?.feedback && (
                  <div className="mt-2.5 rounded-lg bg-[#FFEFE9]/60 border border-[#FF5B29]/15 px-3 py-2.5">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#FF5B29]">AI Feedback</p>
                    <p className="text-[12px] leading-relaxed text-gray-600">{grade.feedback}</p>
                  </div>
                )}
              </div>
            </li>
          );
        })}

        {/* Unmatched segments */}
        {unmatchedSegments.length > 0 && (
          <li className="mt-3 border-t border-gray-100 px-1 pt-3">
            <p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-wider text-amber-600">
              Answers with no matching question ({unmatchedSegments.length})
            </p>
            <ul className="space-y-1.5">
              {unmatchedSegments.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => onSelect(`seg:${s.id}`)}
                    className={`block w-full rounded-xl border border-amber-200/50 bg-amber-50/40 px-3 py-2 text-left hover:bg-amber-50 ${
                      selectedId === `seg:${s.id}` ? 'ring-2 ring-amber-400' : ''
                    }`}
                  >
                    <span className="text-[11px] font-medium text-gray-500">{s.rawLabel ? `Labelled "${s.rawLabel}"` : 'No label written'}</span>
                    <p className="mt-0.5 line-clamp-2 text-[12px] text-gray-600">{s.transcription}</p>
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
