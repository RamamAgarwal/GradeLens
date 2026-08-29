'use client';

import type { ProcessingStage } from '@/lib/types';

const STAGE_LABELS: Partial<Record<ProcessingStage, string>> = {
  'rendering-pages': 'Extracting',
  'extracting-questions': 'Extracting',
  'extracting-answers': 'Extracting',
  mapping: 'Mapping',
  grading: 'Grading'
};

export default function LoadingStage({ stage }: { stage: ProcessingStage }) {
  const label = STAGE_LABELS[stage] ?? 'Extracting';

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-white rounded-2xl m-3 shadow-xs">
      {/* Sparkle cluster - matching Figma 3-star layout */}
      <div className="relative h-20 w-24">
        {/* Main large sparkle */}
        <svg
          viewBox="0 0 48 48"
          fill="#FF5B29"
          className="sparkle-anim absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2"
        >
          <path d="M24 4c.8 6.6 2.7 10.8 5.4 13.5S36.2 22 42.8 22.8c-6.6.8-10.8 2.7-13.5 5.4S24.8 36.2 24 42.8c-.8-6.6-2.7-10.8-5.4-13.5S11.8 24.8 5.2 24c6.6-.8 10.8-2.7 13.5-5.4S23.2 10.6 24 4Z" />
        </svg>
        {/* Small sparkle top-right */}
        <svg
          viewBox="0 0 24 24"
          fill="#FF5B29"
          className="sparkle-orbit-1 absolute right-0 top-0 h-5 w-5"
        >
          <path d="M12 2c.4 3.3 1.4 5.4 2.7 6.7S18.1 11 21.4 11.4c-3.3.4-5.4 1.4-6.7 2.7S12.4 18.1 12 21.4c-.4-3.3-1.4-5.4-2.7-6.7S5.9 12.4 2.6 12c3.3-.4 5.4-1.4 6.7-2.7S11.6 5.3 12 2Z" />
        </svg>
        {/* Tiny sparkle bottom-left */}
        <svg
          viewBox="0 0 24 24"
          fill="#FF5B29"
          className="sparkle-orbit-2 absolute bottom-1 left-1 h-3.5 w-3.5"
          fillOpacity="0.6"
        >
          <path d="M12 2c.4 3.3 1.4 5.4 2.7 6.7S18.1 11 21.4 11.4c-3.3.4-5.4 1.4-6.7 2.7S12.4 18.1 12 21.4c-.4-3.3-1.4-5.4-2.7-6.7S5.9 12.4 2.6 12c3.3-.4 5.4-1.4 6.7-2.7S11.6 5.3 12 2Z" />
        </svg>
        {/* Dot accents */}
        <span className="sparkle-orbit-3 absolute right-5 top-0 h-[5px] w-[5px] rounded-full bg-[#FF5B29]" />
        <span className="sparkle-orbit-1 absolute left-3 top-2 h-[4px] w-[4px] rounded-full bg-[#FF5B29] opacity-50" />
      </div>

      <p className="mt-4 text-lg font-bold text-[#1A1A1A]">{label}…</p>
      <p className="mt-1 text-[13px] text-gray-400">This may take a while</p>
    </div>
  );
}
