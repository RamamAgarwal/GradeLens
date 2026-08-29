'use client';

import { BellIcon, ChevronDown, HelpIcon, SparkleIcon } from './icons';

export default function TopBar({ breadcrumb, onBack }: { breadcrumb: string; onBack?: () => void }) {
  return (
    <header className="flex h-[52px] shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4">
      {/* Left: Back + Breadcrumb */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onBack}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
          disabled={!onBack}
          title="Back"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="flex items-center gap-1.5">
          {/* Small document/folder icon */}
          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 text-gray-400" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 5.5A1.5 1.5 0 014.5 4h3.172a1 1 0 01.707.293L9.5 5.414a1 1 0 00.707.293H15.5A1.5 1.5 0 0117 7.207V14.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 14.5V5.5z" />
          </svg>
          <span className="text-[13px] font-medium text-gray-600">{breadcrumb}</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        <button className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors" title="Help">
          <HelpIcon className="h-[18px] w-[18px]" />
        </button>

        <button className="relative flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors" title="Notifications">
          <BellIcon className="h-[18px] w-[18px]" />
          <span className="absolute right-1.5 top-1.5 h-[7px] w-[7px] rounded-full bg-[#FF5B29] ring-[1.5px] ring-white" />
        </button>

        <button className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors" title="AI">
          <SparkleIcon className="h-4 w-4 text-[#FF5B29]" />
        </button>

        <div className="mx-1.5 h-5 w-px bg-gray-200" />

        {/* User profile */}
        <button className="flex items-center gap-2 rounded-full py-1 px-1.5 hover:bg-gray-50 transition-colors">
          {/* Avatar - 3D style matching Figma */}
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full overflow-hidden ring-2 ring-white shadow-sm">
            <svg viewBox="0 0 40 40" fill="none" className="h-full w-full">
              <circle cx="20" cy="20" r="20" fill="#FEE4E2" />
              {/* Hair back */}
              <path d="M10 20c0-8 4.5-14 10-14s10 6 10 14c0 2-1 6-2 8H12c-1-2-2-6-2-8z" fill="#292524" />
              {/* Body */}
              <path d="M8 38c0-7 5.5-12 12-12s12 5 12 12v2H8v-2z" fill="#1A1A1A" />
              {/* Collar */}
              <path d="M16 26l4 5 4-5h-8z" fill="white" />
              {/* Neck */}
              <rect x="17" y="22" width="6" height="6" rx="2" fill="#FDBA74" />
              {/* Face */}
              <ellipse cx="20" cy="18" rx="8" ry="9" fill="#FED7AA" />
              {/* Hair front */}
              <path d="M12 15c2-5 5-7 8-7s6 2 8 7c-2-2-5-3-8-3s-6 1-8 3z" fill="#292524" />
              {/* Glasses */}
              <rect x="14" y="16.5" width="5" height="3.5" rx="1.5" fill="none" stroke="#1A1A1A" strokeWidth="1.2" />
              <rect x="21" y="16.5" width="5" height="3.5" rx="1.5" fill="none" stroke="#1A1A1A" strokeWidth="1.2" />
              <line x1="19" y1="18" x2="21" y2="18" stroke="#1A1A1A" strokeWidth="1.2" />
              {/* Eyes */}
              <circle cx="16.5" cy="18" r="1" fill="#1A1A1A" />
              <circle cx="23.5" cy="18" r="1" fill="#1A1A1A" />
              {/* Smile */}
              <path d="M18 21c.8.8 3.2.8 4 0" stroke="#C2410C" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-[13px] font-semibold text-gray-800">Madhur Rastogi</span>
          <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
        </button>
      </div>
    </header>
  );
}
