'use client';

import { useCallback, useRef, useState } from 'react';
import { UploadIcon } from './icons';

interface UploaderProps {
  label: string;
  files: File[];
  onChange: (files: File[]) => void;
  disabled?: boolean;
}

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function PdfBadge() {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50">
      <span className="text-[9px] font-extrabold tracking-wider text-red-500">PDF</span>
    </div>
  );
}

export default function Uploader({ label, files, onChange, disabled }: UploaderProps) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;
      onChange(Array.from(fileList));
    },
    [onChange]
  );

  const removeFile = (idx: number) => onChange(files.filter((_, i) => i !== idx));

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        if (!disabled) handleFiles(e.dataTransfer.files);
      }}
      onClick={() => files.length === 0 && !disabled && inputRef.current?.click()}
      className={`upload-card rounded-2xl border-2 border-dashed bg-white p-5 ${
        dragOver
          ? 'border-[#FF5B29] bg-orange-50/30'
          : 'border-gray-200 hover:border-gray-300'
      } ${files.length === 0 && !disabled ? 'cursor-pointer' : ''}`}
      role={files.length === 0 ? 'button' : undefined}
      tabIndex={files.length === 0 ? 0 : undefined}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="application/pdf,image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
        disabled={disabled}
      />

      {files.length === 0 ? (
        /* ─── Empty state ─── */
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <UploadIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-gray-700">
              Upload <span className="font-bold text-[#FF5B29]">{label}</span>
            </p>
            <p className="mt-0.5 text-[11px] text-gray-400">Max 10MB</p>
          </div>
        </div>
      ) : (
        /* ─── Filled state ─── */
        <div className="flex flex-col gap-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-2.5 rounded-lg bg-gray-50/80 px-3 py-2">
              <PdfBadge />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-semibold text-gray-800">{f.name}</p>
                <p className="text-[11px] text-gray-400">
                  {formatSize(f.size)} • {Math.max(1, Math.ceil(f.size / (100 * 1024)))} Pages
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(i);
                }}
                disabled={disabled}
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-300 text-white hover:bg-gray-500 transition-colors disabled:opacity-40"
                aria-label={`Remove ${f.name}`}
              >
                <svg viewBox="0 0 16 16" fill="none" className="h-2.5 w-2.5">
                  <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
