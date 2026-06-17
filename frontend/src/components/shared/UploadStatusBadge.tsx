import React from 'react';
import { UPLOAD_STATUS_META, normalizeUploadStatus } from '@/lib/uploadStatus';
import { cn } from '@/lib/utils';

type Props = {
  status: unknown;
  className?: string;
};

export function UploadStatusBadge({ status, className }: Props) {
  const key = normalizeUploadStatus(status);
  const meta = key ? UPLOAD_STATUS_META[key] : null;

  if (!meta) {
    return (
      <span
        className={cn(
          'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider border bg-gray-500/15 text-gray-400 border-gray-500/30',
          className,
        )}
      >
        {String(status ?? 'Unknown')}
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider border',
        meta.className,
        className,
      )}
    >
      {meta.label}
    </span>
  );
}
