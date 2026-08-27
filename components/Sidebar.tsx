'use client';

import {
  AssignmentsIcon,
  ClassroomIcon,
  ExamsIcon,
  HomeIcon,
  LibraryIcon,
  LogoMark,
  PlusSparkleIcon,
  SettingsIcon,
  SidebarToggleIcon
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
      <aside className="flex w-16 shrink-0 flex-col items-center gap-3 border-r border-gray-200/80 bg-white py-4 transition-all">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#18181B] text-white shadow-xs">
          <LogoMark className="h-4 w-4" />
        </div>

        <div className="my-1 h-px w-8 bg-gray-100" />

        <div className="flex flex-col gap-1.5 w-full px-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              title={item.label}
              className={`flex h-10 w-full items-center justify-center rounded-xl transition-all ${item.active ? 'bg-gray-100 text-[#18181B] font-semibold' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'
                }`}
            >
              <item.icon className="h-4.5 w-4.5" />
            </button>
          ))}
        </div>

        <div className="mt-auto flex flex-col items-center gap-2">
          <button className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-700" title="Settings">
            <SettingsIcon className="h-4.5 w-4.5" />
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-700 border border-emerald-200/60" title="Delhi Public School">
            DPS
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-gray-200/80 bg-white transition-all">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#18181B] text-white shadow-xs">
            <LogoMark className="h-4.5 w-4.5" />
          </div>
          <span className="text-base font-extrabold tracking-tight text-[#18181B]">VedaAI</span>
        </div>
        <button
          onClick={onToggle}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          title="Toggle Sidebar"
        >
          <SidebarToggleIcon className="h-4 w-4" />
        </button>
      </div>

      {/* AI Teacher's Toolkit Button */}
      <div className="px-4 pt-3 pb-2">
        <button className="group flex w-full items-center justify-center gap-2 rounded-full border border-[#FF5B29]/30 bg-[#18181B] px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-black hover:border-[#FF5B29]/60">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#FF5B29] text-white">
            <PlusSparkleIcon className="h-3 w-3" />
          </span>
          AI Teacher&rsquo;s Toolkit
        </button>
      </div>

      {/* Nav links */}
      <nav className="mt-4 flex flex-col gap-1 px-3">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${item.active
                ? 'bg-[#F3F4F6] text-[#18181B]'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`}
          >
            <item.icon className={`h-4.5 w-4.5 ${item.active ? 'text-[#18181B]' : 'text-gray-400'}`} />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto flex flex-col gap-2.5 p-3">
        <button className="flex items-center gap-3 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors">
          <SettingsIcon className="h-4.5 w-4.5 text-gray-400" />
          Settings
        </button>

        <div className="flex items-center gap-2.5 rounded-2xl border border-gray-100 bg-[#FAFAFA] p-2.5 shadow-2xs">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100/80 text-[11px] font-bold text-emerald-800 border border-emerald-200/50">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-xs font-bold text-gray-900">Delhi Public School</p>
            <p className="truncate text-[10.5px] text-gray-400 font-medium">Bokaro Steel City</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

