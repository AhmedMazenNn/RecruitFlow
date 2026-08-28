import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface PaginationProps {
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
  onPage: (page: number) => void;
  className?: string;
}

export function Pagination({ page, pageCount, total, pageSize, onPage, className }: PaginationProps) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === pageCount || Math.abs(p - page) <= 1
  );

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3', className)}>
      
      <p className="text-sm text-ink-muted">
        Showing <span className="font-medium text-ink">{from}–{to}</span> of{' '}
        <span className="font-medium text-ink">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPage(Math.max(1, page - 1))}
          disabled={page === 1}
          aria-label="Previous page"
          className="flex h-8 w-8 items-center justify-center rounded border border-border text-ink-muted transition-colors duration-150 ease-out hover:bg-subtle hover:text-ink disabled:pointer-events-none disabled:opacity-40">
          
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
        {pages.map((p, i) =>
        <React.Fragment key={p}>
            {i > 0 && p - pages[i - 1] > 1 && <span className="px-1 text-sm text-ink-subtle">…</span>}
            <button
            type="button"
            onClick={() => onPage(p)}
            aria-current={p === page ? 'page' : undefined}
            className={cn(
              'h-8 min-w-8 rounded px-2 text-sm font-medium transition-colors duration-150 ease-out',
              p === page ?
              'bg-brand text-brand-fg' :
              'border border-border text-ink-muted hover:bg-subtle hover:text-ink'
            )}>
            
              {p}
            </button>
          </React.Fragment>
        )}
        <button
          type="button"
          onClick={() => onPage(Math.min(pageCount, page + 1))}
          disabled={page === pageCount || pageCount === 0}
          aria-label="Next page"
          className="flex h-8 w-8 items-center justify-center rounded border border-border text-ink-muted transition-colors duration-150 ease-out hover:bg-subtle hover:text-ink disabled:pointer-events-none disabled:opacity-40">
          
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
    </nav>);

}