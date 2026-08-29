'use client';

import {
  AssignmentsIcon,
  ClassroomIcon,
  ExamsIcon,
  HomeIcon,
  LibraryIcon,
  LogoMark,
  SettingsIcon,
  SidebarToggleIcon,
  SparkleIcon
} from './icons';

const NAV_ITEMS = [
  { label: 'Home', icon: HomeIcon },
  { label: 'My Classroom', icon: ClassroomIcon },
  { label: 'Assignments', icon: AssignmentsIcon },
  { label: 'Exams', icon: ExamsIcon, active: true },
  { label: 'My Library', icon: LibraryIcon }
];

export default function Sidebar({ collapsed, onToggle }: { collapsed?: boolean; onToggle?: () => void }) {
  if (collapsed) {
    return (
      <aside className="flex w-14 shrink-0 flex-col items-center gap-1 border-r border-gray-200 bg-white py-3">
        {/* Logo */}
        <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-xl bg-[#1A1A1A] text-white">
          <LogoMark className="h-4 w-4" />
        </div>

        {/* AI Toolkit mini */}
        <button
          className="mb-1 mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#1A1A1A] text-[#FF5B29] hover:bg-black transition-colors"
          title="AI Teacher's Toolkit"
        >
          <SparkleIcon className="h-3.5 w-3.5" />
        </button>

        {/* Nav icons */}
        <div className="flex flex-col gap-0.5 w-full px-1.5">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              title={item.label}
              className={`flex h-9 w-full items-center justify-center rounded-lg transition-colors ${
                item.active
                  ? 'bg-gray-100 text-[#1A1A1A]'
                  : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
              }`}
            >
              <item.icon className="h-[18px] w-[18px]" />
            </button>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-auto flex flex-col items-center gap-2">
          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
            title="Settings"
          >
            <SettingsIcon className="h-[18px] w-[18px]" />
          </button>
          {/* School badge */}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200/60">
            <SchoolCrest className="h-5 w-5 text-emerald-700" />
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="flex w-[220px] shrink-0 flex-col border-r border-gray-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-1">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#1A1A1A] text-white">
            <LogoMark className="h-4 w-4" />
          </div>
          <span className="text-[15px] font-extrabold tracking-tight text-[#1A1A1A]">VedaAI</span>
        </div>
        <button
          onClick={onToggle}
          className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          title="Toggle Sidebar"
        >
          <SidebarToggleIcon className="h-[15px] w-[15px]" />
        </button>
      </div>

      {/* AI Teacher's Toolkit */}
      <div className="px-3 pt-3 pb-1">
        <button className="flex w-full items-center justify-center gap-2 rounded-full border border-[#FF5B29]/30 bg-[#1A1A1A] px-3 py-[9px] text-[12px] font-semibold text-white hover:bg-black transition-colors">
          <span className="text-[#FF5B29]">✦</span>
          AI Teacher&rsquo;s Toolkit
        </button>
      </div>

      {/* Nav */}
      <nav className="mt-3 flex flex-col gap-[2px] px-2">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-[9px] text-[13px] font-medium transition-colors ${
              item.active
                ? 'bg-gray-100 text-[#1A1A1A] font-semibold'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            <item.icon className={`h-[18px] w-[18px] shrink-0 ${item.active ? 'text-[#1A1A1A]' : 'text-gray-400'}`} />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto flex flex-col gap-2 px-2 pb-3">
        <button className="flex items-center gap-2.5 rounded-lg px-3 py-[9px] text-[13px] font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors">
          <SettingsIcon className="h-[18px] w-[18px] text-gray-400" />
          Settings
        </button>

        <div className="flex items-center gap-2.5 rounded-xl border border-gray-100 bg-[#FAFAFA] p-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200/50">
            <SchoolCrest className="h-5 w-5 text-emerald-700" />
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-[12px] font-semibold text-gray-900">Delhi Public School</p>
            <p className="truncate text-[11px] text-gray-400">Bokaro Steel City</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* School crest icon - matching the Figma green shield */
function SchoolCrest({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 8v4l3 1.5M12 12L9 13.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="1" fill="currentColor" />
    </svg>
  );
}
