'use client';

import { BellIcon, ChevronDown, DocumentExamIcon, HelpIcon, SparkleIcon } from './icons';

export default function TopBar({ breadcrumb, onBack }: { breadcrumb: string; onBack?: () => void }) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200/80 bg-white px-6">
      <div className="flex items-center gap-2.5">
        <button
          onClick={onBack}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
          disabled={!onBack}
          title="Back"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="flex items-center gap-2 text-[#18181B]">
          <DocumentExamIcon className="h-4.5 w-4.5 text-gray-500" />
          <span className="text-sm font-semibold text-gray-800">{breadcrumb}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors" title="Help">
          <HelpIcon className="h-4.5 w-4.5" />
        </button>

        <button className="relative flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors" title="Notifications">
          <BellIcon className="h-4.5 w-4.5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#FF5B29] ring-2 ring-white" />
        </button>

        <button className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors" title="AI Assistant">
          <SparkleIcon className="h-4 w-4 text-[#FF5B29]" />
        </button>

        <div className="mx-1 h-5 w-px bg-gray-200" />

        <button className="flex items-center gap-2.5 rounded-full p-1 pl-1.5 hover:bg-gray-50 transition-colors">
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-orange-100 to-amber-100 ring-2 ring-white shadow-2xs overflow-hidden">
            {/* User 3D styled avatar graphic */}
            <svg viewBox="0 0 36 36" fill="none" className="h-full w-full">
              <circle cx="18" cy="18" r="18" fill="#FEE4E2" />
              <circle cx="18" cy="14" r="6" fill="#1E293B" />
              <path d="M18 10c-2.5 0-4.5 1.5-4.5 4 0 1.2.5 2.2 1.3 3 .8.8 2 1.5 3.2 1.5s2.4-.7 3.2-1.5c.8-.8 1.3-1.8 1.3-3 0-2.5-2-4-4.5-4z" fill="#475569" />
              <circle cx="18" cy="14.5" r="4" fill="#F87171" opacity="0.8" />
              <path d="M7 32c0-6 5-10 11-10s11 4 11 10" fill="#0F172A" />
            </svg>
          </div>
          <span className="text-xs font-bold text-gray-900">Madhur Rastogi</span>
          <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
        </button>
      </div>
    </header>
  );
}

