'use client';

import type { ProcessingStage } from '@/lib/types';

const STAGE_LABELS: Partial<Record<ProcessingStage, string>> = {
  'rendering-pages': 'Reading pages',
  'extracting-questions': 'Extracting questions',
  'extracting-answers': 'Extracting answers',
  mapping: 'Mapping answers to questions',
  grading: 'Grading answers'
};

export default function LoadingStage({ stage }: { stage: ProcessingStage }) {
  const label = STAGE_LABELS[stage] ?? 'Extracting';

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-white">
      <svg viewBox="0 0 48 48" fill="#F0562E" className="sparkle-anim h-10 w-10">
        <path d="M24 4c.8 6.6 2.7 10.8 5.4 13.5S36.2 22 42.8 22.8c-6.6.8-10.8 2.7-13.5 5.4S24.8 36.2 24 42.8c-.8-6.6-2.7-10.8-5.4-13.5S11.8 24.8 5.2 24c6.6-.8 10.8-2.7 13.5-5.4S23.2 10.6 24 4Z" />
      </svg>
      <p className="mt-4 text-lg font-semibold text-ink">{label}…</p>
      <p className="mt-1 text-sm text-ink-faint">This may take a while</p>
    </div>
  );
}
