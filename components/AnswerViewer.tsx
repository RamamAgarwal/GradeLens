'use client';

import { useEffect, useMemo, useState } from 'react';
import type { AnswerSegment, BBox, Mapping, PageImage, Question } from '@/lib/types';

interface AnswerViewerProps {
  pages: PageImage[];
  segments: AnswerSegment[];
  mappings: Mapping[];
  questions: Question[];
  selectedId: string | null;
}

interface ActiveRegion {
  page: number;
  bbox: BBox;
}

function regionsForSelection(selectedId: string | null, segments: AnswerSegment[], mappings: Mapping[]): ActiveRegion[] {
  if (!selectedId) return [];
  if (selectedId.startsWith('seg:')) {
    const seg = segments.find((s) => s.id === selectedId.slice(4));
    return seg ? seg.regions : [];
  }
  const mapping = mappings.find((m) => m.questionId === selectedId);
  if (!mapping) return [];
  const regions: ActiveRegion[] = [];
  for (const segId of mapping.segmentIds) {
    const seg = segments.find((s) => s.id === segId);
    if (seg) regions.push(...seg.regions);
  }
  return regions;
}

const ZOOM_LEVELS = [75, 100, 125, 150];

export default function AnswerViewer({ pages, segments, mappings, questions, selectedId }: AnswerViewerProps) {
  const [pageIndex, setPageIndex] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [zoomOpen, setZoomOpen] = useState(false);

  const activeRegions = useMemo(() => regionsForSelection(selectedId, segments, mappings), [selectedId, segments, mappings]);
  const tagLabel = useMemo(() => {
    if (!selectedId) return null;
    if (selectedId.startsWith('seg:')) return 'Unmatched';
    const q = questions.find((q) => q.id === selectedId);
    return q ? `Q${q.displayNumber}` : null;
  }, [selectedId, questions]);

  useEffect(() => {
    if (activeRegions.length === 0) return;
    const firstPage = activeRegions[0].page;
    const idx = pages.findIndex((p) => p.page === firstPage);
    if (idx >= 0) setPageIndex(idx);
  }, [activeRegions, pages]);

  const currentPage = pages[pageIndex];
  const regionsOnPage = currentPage ? activeRegions.filter((r) => r.page === currentPage.page) : [];

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2.5">
        <h2 className="text-[13px] font-bold text-[#1A1A1A]">Answer Sheet</h2>
        <div className="flex items-center gap-2.5">
          {/* Zoom dropdown */}
          <div className="relative">
            <button
              onClick={() => setZoomOpen((v) => !v)}
              className="flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-[11px] font-medium text-gray-500 hover:bg-gray-50 transition-colors"
            >
              {zoom}%
              <svg viewBox="0 0 16 16" fill="none" className="h-2.5 w-2.5">
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {zoomOpen && (
              <div className="absolute right-0 top-full z-10 mt-1 w-16 rounded-lg border border-gray-200 bg-white py-0.5 shadow-lg">
                {ZOOM_LEVELS.map((z) => (
                  <button
                    key={z}
                    onClick={() => {
                      setZoom(z);
                      setZoomOpen(false);
                    }}
                    className={`block w-full px-2.5 py-1.5 text-left text-[11px] transition-colors ${
                      z === zoom ? 'bg-gray-100 font-semibold text-[#1A1A1A]' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {z}%
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Page nav */}
          {pages.length > 1 && (
            <div className="flex items-center gap-1 text-[11px] text-gray-500">
              <button
                onClick={() => setPageIndex((i) => Math.max(0, i - 1))}
                disabled={pageIndex === 0}
                className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-gray-100 disabled:opacity-30 transition-colors"
              >
                <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3">
                  <path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <span className="font-medium">
                Page {pageIndex + 1} of {pages.length}
              </span>
              <button
                onClick={() => setPageIndex((i) => Math.min(pages.length - 1, i + 1))}
                disabled={pageIndex === pages.length - 1}
                className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-gray-100 disabled:opacity-30 transition-colors"
              >
                <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3">
                  <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sheet */}
      <div className="flex-1 overflow-auto bg-[#F6F7F9] p-5">
        {currentPage && (
          <div className="mx-auto" style={{ width: `${zoom}%`, maxWidth: `${zoom}%` }}>
            <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={currentPage.dataUrl} alt={`Answer sheet page ${currentPage.page}`} className="block w-full" draggable={false} />
              {regionsOnPage.length > 0 && (
                <div className="pointer-events-none absolute inset-0">
                  {regionsOnPage.map((r, i) => (
                    <div
                      key={i}
                      className="match-box absolute"
                      style={{
                        left: `${r.bbox.x * 100}%`,
                        top: `${r.bbox.y * 100}%`,
                        width: `${r.bbox.w * 100}%`,
                        height: `${r.bbox.h * 100}%`
                      }}
                    >
                      {tagLabel && (
                        <span className="match-tag absolute -top-2.5 left-2 rounded px-1.5 py-0.5 text-[10px] font-semibold">{tagLabel}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
