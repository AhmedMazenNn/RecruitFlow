import React from 'react';
import {
  DownloadIcon,
  FileTextIcon,
  Loader2Icon,
  RotateCcwIcon,
  TriangleAlertIcon,
  UploadCloudIcon } from
'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { EmptyState } from '../ui/EmptyState';
import { cn } from '../../utils/cn';
import type { CandidateDocument } from '../../types/recruiting';

export function CandidateDocuments({ documents }: {documents: CandidateDocument[];}) {
  if (documents.length === 0) {
    return (
      <EmptyState
        icon={<FileTextIcon className="h-5 w-5" />}
        title="No documents yet"
        description="Upload a resume, cover letter or certificate. PDFs are parsed automatically."
        action={
        <Button variant="primary" size="sm" iconLeft={<UploadCloudIcon className="h-4 w-4" />}>
            Upload document
          </Button>
        } />);


  }

  return (
    <div className="p-5">
      <ul className="space-y-2">
        {documents.map((d) =>
        <li
          key={d.id}
          className={cn(
            'flex flex-col gap-3 rounded-lg border p-3.5 sm:flex-row sm:items-center',
            d.status === 'failed' ? 'border-danger/25 bg-danger-soft/40' : 'border-border bg-surface'
          )}>
          
            <span
            className={cn(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
              d.status === 'failed' ? 'bg-danger-soft text-danger' : 'bg-subtle text-ink-muted'
            )}
            aria-hidden>
            
              {d.status === 'uploading' ?
            <Loader2Icon className="h-4 w-4 animate-spin" /> :
            d.status === 'failed' ?
            <TriangleAlertIcon className="h-4 w-4" /> :

            <FileTextIcon className="h-4 w-4" />
            }
            </span>

            <div className="min-w-0 flex-1">
              <p className="flex flex-wrap items-center gap-2">
                <span className="truncate text-base font-semibold text-ink">{d.name}</span>
                <Badge tone={d.kind === 'Resume' ? 'brand' : 'neutral'}>{d.kind}</Badge>
              </p>
              {d.status === 'uploading' ?
            <>
                  <ProgressBar value={d.progress ?? 0} label={`Uploading ${d.name}`} className="mt-2 max-w-xs" />
                  <p className="mt-1 text-xs text-ink-subtle" role="status">
                    Uploading · {d.progress}% of {d.size}
                  </p>
                </> :
            d.status === 'failed' ?
            <p className="mt-1 text-xs font-medium text-danger-fg">
                  Processing failed — .zip files are not supported. Ask for a PDF or DOCX.
                </p> :

            <p className="mt-1 text-xs text-ink-subtle">
                  {d.size} · uploaded {d.uploadedAt}
                </p>
            }
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {d.status === 'failed' ?
            <Button variant="secondary" size="sm" iconLeft={<RotateCcwIcon className="h-3.5 w-3.5" />}>
                  Retry
                </Button> :

            <Button
              variant="ghost"
              size="sm"
              disabled={d.status === 'uploading'}
              iconLeft={<DownloadIcon className="h-3.5 w-3.5" />}>
              
                  Download
                </Button>
            }
            </div>
          </li>
        )}
      </ul>

      <button
        type="button"
        className="mt-3 w-full rounded-lg border border-dashed border-strong px-4 py-6 text-center transition-colors duration-150 ease-out hover:border-brand hover:bg-brand-soft/40">
        
        <UploadCloudIcon className="mx-auto h-4 w-4 text-ink-subtle" aria-hidden />
        <span className="mt-2 block text-sm font-medium text-ink">Upload another document</span>
        <span className="mt-0.5 block text-xs text-ink-subtle">PDF, DOCX or PNG up to 10 MB</span>
      </button>
    </div>);

}