import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface Crumb {
  label: string;
  to?: string;
}

interface PageHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  crumbs?: Crumb[];
  actions?: React.ReactNode;
  meta?: React.ReactNode;
  className?: string;
  border?: boolean;
}

export function PageHeader({
  title,
  description,
  crumbs,
  actions,
  meta,
  className,
  border = true
}: PageHeaderProps) {
  return (
    <div className={cn('px-4 pb-5 pt-5 lg:px-7', border && 'border-b border-border', className)}>
      {crumbs && crumbs.length > 0 &&
      <nav aria-label="Breadcrumb" className="mb-2.5">
          <ol className="flex flex-wrap items-center gap-1 text-xs text-ink-subtle">
            {crumbs.map((c, i) =>
          <li key={c.label} className="flex items-center gap-1">
                {i > 0 && <ChevronRightIcon className="h-3 w-3" aria-hidden />}
                {c.to ?
            <Link
              to={c.to}
              className="font-medium transition-colors duration-150 ease-out hover:text-ink">
              
                    {c.label}
                  </Link> :

            <span className="font-medium text-ink-muted">{c.label}</span>
            }
              </li>
          )}
          </ol>
        </nav>
      }
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-semibold text-ink">{title}</h1>
          {description && <p className="mt-1.5 max-w-2xl text-base text-ink-muted">{description}</p>}
          {meta && <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">{meta}</div>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>);

}