'use client';

import { useCallback, useRef, useState } from 'react';
import { CloseIcon, ImgChip, PdfChip, UploadIcon } from './icons';

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
      className={`group relative flex flex-col justify-center rounded-2xl border-2 border-dashed bg-white p-6 transition-all duration-200 ${
        dragOver
          ? 'border-[#FF5B29] bg-[#FFEFE9]/30 shadow-md'
          : 'border-gray-200/90 hover:border-[#FF5B29]/50 hover:shadow-xs'
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
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F3F4F6] text-gray-500 transition-colors group-hover:bg-[#FFEFE9] group-hover:text-[#FF5B29]">
            <UploadIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">
              Upload <span className="font-bold text-[#FF5B29]">{label}</span>
            </p>
            <p className="mt-1 text-[11px] font-medium text-gray-400">Max 10MB</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 py-1">
          {files.map((f, i) => {
            const isPdf = f.type.includes('pdf') || f.name.toLowerCase().endsWith('.pdf');
            return (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-[#FAFAFA] px-3.5 py-2.5 transition-all hover:bg-white hover:border-gray-200">
                {isPdf ? <PdfChip className="h-8 w-8 text-[9px]" /> : <ImgChip className="h-8 w-8 text-[9px]" />}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-gray-900">{f.name}</p>
                  <p className="text-[11px] font-medium text-gray-400">{formatSize(f.size)}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(i);
                  }}
                  disabled={disabled}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-[#18181B] hover:text-white transition-colors disabled:opacity-40"
                  aria-label={`Remove ${f.name}`}
                >
                  <CloseIcon className="h-3 w-3" />
                </button>
              </div>
            );
          })}
          {!disabled && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
              className="mt-1 self-start text-xs font-bold text-[#FF5B29] hover:underline"
            >
              + Add more pages
            </button>
          )}
        </div>
      )}
    </div>
  );
}

