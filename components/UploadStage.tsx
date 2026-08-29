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
    <div className="relative mx-auto flex h-[120px] w-[120px] items-center justify-center">
      {/* Outer halo */}
      <span className="absolute inset-0 rounded-full bg-[#FFEFE9]" />
      {/* Dashed ring */}
      <span className="absolute inset-[6px] rounded-full border-[1.5px] border-dashed border-[#FF5B29]/25" />

      {/* Orbital dots */}
      <span className="absolute -top-[3px] left-1/2 -translate-x-1/2 h-[7px] w-[7px] rounded-full bg-[#FF5B29]" />
      <span className="absolute -bottom-[3px] left-1/2 -translate-x-1/2 h-[7px] w-[7px] rounded-full bg-[#FF5B29]" />
      <span className="absolute -left-[3px] top-1/2 -translate-y-1/2 h-[7px] w-[7px] rounded-full bg-[#FF5B29]" />
      <span className="absolute -right-[3px] top-1/2 -translate-y-1/2 h-[7px] w-[7px] rounded-full bg-[#FF5B29]" />

      {/* Avatar circle */}
      <div className="relative h-[88px] w-[88px] overflow-hidden rounded-full bg-gradient-to-b from-[#FFF5F2] to-[#FFE8E0] ring-[2.5px] ring-white shadow-sm">
        <svg viewBox="0 0 100 100" fill="none" className="h-full w-full">
          {/* Background */}
          <circle cx="50" cy="50" r="50" fill="#FECACA" fillOpacity="0.3" />

          {/* Hair back / volume */}
          <path d="M25 42c0-18 11-28 25-28s25 10 25 28c0 6-2 14-3 17H28c-1-3-3-11-3-17z" fill="#292524" />

          {/* Body - dark suit */}
          <path d="M20 90c0-15 13-25 30-25s30 10 30 25v10H20V90z" fill="#1A1A1A" />
          {/* White collar */}
          <path d="M40 65l10 13 10-13H40z" fill="white" />
          {/* Orange tie detail */}
          <path d="M46 74l4 6 4-6h-8z" fill="#FF5B29" />

          {/* Neck */}
          <rect x="44" y="53" width="12" height="14" rx="4" fill="#FDBA74" />
          {/* Face */}
          <ellipse cx="50" cy="42" rx="17" ry="19" fill="#FED7AA" />

          {/* Hair bangs */}
          <path d="M33 35c3-11 10-15 17-15s14 4 17 15c-4-4-10-7-17-7s-13 3-17 7z" fill="#292524" />
          <path d="M33 31c3 0 8 5 8 9-1-5-4-11-8-9z" fill="#1C1917" />
          <path d="M67 31c-3 0-8 5-8 9 1-5 4-11 8-9z" fill="#1C1917" />

          {/* Glasses */}
          <rect x="36" y="38" width="12" height="8" rx="3" fill="none" stroke="#1A1A1A" strokeWidth="2.2" />
          <rect x="52" y="38" width="12" height="8" rx="3" fill="none" stroke="#1A1A1A" strokeWidth="2.2" />
          <line x1="48" y1="42" x2="52" y2="42" stroke="#1A1A1A" strokeWidth="2.2" />

          {/* Eyes */}
          <circle cx="42" cy="42" r="2.2" fill="#1A1A1A" />
          <circle cx="58" cy="42" r="2.2" fill="#1A1A1A" />
          {/* Eye highlights */}
          <circle cx="41" cy="41" r="0.8" fill="white" />
          <circle cx="57" cy="41" r="0.8" fill="white" />

          {/* Smile */}
          <path d="M44 49c2 2.5 10 2.5 12 0" stroke="#C2410C" strokeWidth="1.8" strokeLinecap="round" fill="none" />

          {/* Book/notebook in hand */}
          <rect x="60" y="68" width="18" height="24" rx="2.5" fill="#FF5B29" transform="rotate(8 69 80)" />
          <rect x="62" y="70" width="14" height="20" rx="1.5" fill="white" fillOpacity="0.9" transform="rotate(8 69 80)" />
          <line x1="65" y1="77" x2="73" y2="76" stroke="#FF5B29" strokeWidth="1.5" strokeLinecap="round" transform="rotate(8 69 80)" />
          <line x1="65" y1="81" x2="72" y2="80" stroke="#D4D4D4" strokeWidth="1.5" strokeLinecap="round" transform="rotate(8 69 80)" />
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
    <div className="flex flex-1 items-center justify-center px-6 py-10 overflow-auto">
      <div className="w-full max-w-[580px] text-center">
        {/* Heading */}
        <h1 className="text-[26px] font-extrabold text-[#1A1A1A] tracking-tight leading-tight">
          Upload{' '}
          <span className="inline rounded-lg bg-[#FFEFE9] px-2.5 py-0.5 text-[#FF5B29]">
            Question Paper &amp; Answer Sheets
          </span>
        </h1>
        <p className="mt-2 text-[13px] text-gray-400">Upload both files to get started</p>

        {/* Avatar */}
        <div className="mt-6">
          <TeacherAvatar />
        </div>

        {/* Upload cards */}
        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <Uploader label="Question Paper" files={questionFiles} onChange={onQuestionFilesChange} />
          <Uploader label="Answer Sheet" files={answerFiles} onChange={onAnswerFilesChange} />
        </div>

        {/* Action */}
        <div className="mt-7 flex flex-col items-center gap-2.5">
          <button
            onClick={onStart}
            disabled={!canStart}
            className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-[12px] font-semibold transition-all ${
              canStart
                ? 'bg-[#1A1A1A] text-white hover:bg-black shadow-sm'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Start Mapping
            <ArrowRight className="h-3.5 w-3.5" />
          </button>

          <p className="text-[11px] text-gray-400">
            Once both files are uploaded, you&rsquo;ll be able to map answers with questions
          </p>

          {error && (
            <p className="mt-1 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-[12px] text-red-600">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
