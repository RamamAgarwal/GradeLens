'use client';

import { ArrowRight } from './icons';
import Uploader from './Uploader';

interface UploadStageProps {
  questionFiles: File[];
  answerFiles: File[];
  onQuestionFilesChange: (files: File[]) => void;
  onAnswerFilesChange: (files: File[]) => void;
  onStart: () => void;
  canStart: boolean;
  error: string | null;
}

function TeacherAvatar() {
  return (
    <div className="relative mx-auto flex h-28 w-28 items-center justify-center">
      {/* Soft background glow halo */}
      <span className="absolute inset-0 rounded-full bg-[#FFEFE9] shadow-inner" />
      {/* Outer dashed ring */}
      <span className="absolute inset-1.5 rounded-full border-2 border-dashed border-[#FF5B29]/30" />
      {/* Inner glowing circle */}
      <span className="absolute inset-3 rounded-full bg-gradient-to-b from-[#FFF5F2] to-[#FFEFE9] ring-2 ring-[#FF5B29]/20" />

      {/* Orbital nodes */}
      <span className="absolute -top-1 left-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-[#FF5B29] ring-2 ring-white shadow-xs" />
      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-[#FF5B29] ring-2 ring-white shadow-xs" />
      <span className="absolute -left-1 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-[#FF5B29] ring-2 ring-white shadow-xs" />
      <span className="absolute -right-1 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-[#FF5B29] ring-2 ring-white shadow-xs" />

      {/* 3D Teacher Avatar SVG Graphic */}
      <div className="relative h-20 w-20 overflow-hidden rounded-full flex items-center justify-center">
        <svg viewBox="0 0 100 100" fill="none" className="h-full w-full">
          {/* Background circle inside avatar */}
          <circle cx="50" cy="50" r="48" fill="#FEE4E2" />
          
          {/* Teacher Hair Back */}
          <path d="M28 45c0-18 10-28 22-28s22 10 22 28c0 5-2 15-4 18H32c-2-3-4-13-4-18z" fill="#292524" />

          {/* Teacher Body / Suit */}
          <path d="M22 88c0-14 12-24 28-24s28 10 28 24v12H22V88z" fill="#18181B" />
          {/* Inner Shirt / Collar */}
          <path d="M42 64l8 12 8-12H42z" fill="#FFFFFF" />
          <path d="M46 72l4 6 4-6h-8z" fill="#FF5B29" />

          {/* Head & Neck */}
          <rect x="44" y="52" width="12" height="14" rx="4" fill="#FDBA74" />
          <ellipse cx="50" cy="42" rx="16" ry="18" fill="#FED7AA" />

          {/* Hair Front / Bangs */}
          <path d="M34 36c3-10 10-14 16-14s13 4 16 14c-4-4-10-6-16-6s-12 2-16 6z" fill="#292524" />
          <path d="M34 32c4 0 9 6 9 10 0-6-4-12-9-10z" fill="#1C1917" />
          <path d="M66 32c-4 0-9 6-9 10 0-6 4-12 9-10z" fill="#1C1917" />

          {/* Glasses */}
          <rect x="37" y="38" width="11" height="8" rx="3" fill="none" stroke="#18181B" strokeWidth="2.5" />
          <rect x="52" y="38" width="11" height="8" rx="3" fill="none" stroke="#18181B" strokeWidth="2.5" />
          <line x1="48" y1="42" x2="52" y2="42" stroke="#18181B" strokeWidth="2.5" />

          {/* Eyes behind glasses */}
          <circle cx="42.5" cy="42" r="2" fill="#18181B" />
          <circle cx="57.5" cy="42" r="2" fill="#18181B" />

          {/* Smile */}
          <path d="M45 49c2 2 8 2 10 0" stroke="#C2410C" strokeWidth="2" strokeLinecap="round" />

          {/* Teacher holding notebook/folder */}
          <rect x="36" y="68" width="28" height="22" rx="3" transform="rotate(-6 50 79)" fill="#FF5B29" />
          <rect x="38" y="70" width="24" height="18" rx="2" transform="rotate(-6 50 79)" fill="#FFFFFF" opacity="0.9" />
          <line x1="42" y1="76" x2="56" y2="74.5" stroke="#FF5B29" strokeWidth="2" strokeLinecap="round" />
          <line x1="42" y1="81" x2="54" y2="79.5" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

export default function UploadStage({
  questionFiles,
  answerFiles,
  onQuestionFilesChange,
  onAnswerFilesChange,
  onStart,
  canStart,
  error
}: UploadStageProps) {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-12 bg-[#F6F7F9]">
      <div className="w-full max-w-2xl text-center">
        {/* Main Heading */}
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-snug">
          Upload{' '}
          <span className="inline-block rounded-xl bg-[#FFEFE9] px-3 py-1 text-[#FF5B29] font-black shadow-2xs">
            Question Paper &amp; Answer Sheets
          </span>
        </h1>
        <p className="mt-2.5 text-sm font-semibold text-gray-400">Upload both files to get started</p>

        {/* 3D Teacher Avatar graphic */}
        <div className="mt-7">
          <TeacherAvatar />
        </div>

        {/* Two Upload Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Uploader label="Question Paper" files={questionFiles} onChange={onQuestionFilesChange} />
          <Uploader label="Answer Sheet" files={answerFiles} onChange={onAnswerFilesChange} />
        </div>

        {/* Bottom Action Area */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            onClick={onStart}
            disabled={!canStart}
            className={`flex items-center gap-2 rounded-full px-7 py-3 text-xs font-bold tracking-wide transition-all ${
              canStart
                ? 'bg-[#18181B] text-white hover:bg-black shadow-md cursor-pointer active:scale-98'
                : 'bg-[#E2E4E8] text-[#9EA3B0] cursor-not-allowed'
            }`}
          >
            Start Mapping
            <ArrowRight className="h-4 w-4" />
          </button>

          <p className="text-[11.5px] font-semibold text-gray-400">
            Once both files are uploaded, you&rsquo;ll be able to map answers with questions
          </p>

          {error && (
            <p className="mt-2 rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-xs font-semibold text-red-600 shadow-2xs">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

