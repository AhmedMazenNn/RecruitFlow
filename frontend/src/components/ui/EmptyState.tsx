import React from 'react';
import { cn } from '../../utils/cn';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  tone?: 'neutral' | 'danger';
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  tone = 'neutral',
  className
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center px-6 py-14 text-center', className)}>
      <div
        className={cn(
          'mb-4 flex h-11 w-11 items-center justify-center rounded-xl border',
          tone === 'danger' ?
          'border-danger/25 bg-danger-soft text-danger' :
          'border-border bg-subtle text-ink-subtle'
        )}>
        
        {icon}
      </div>
      <h3 className="font-display text-md font-semibold text-ink">{title}</h3>
      <p className="mt-1.5 max-w-sm text-base text-ink-muted">{description}</p>
      {(action || secondaryAction) &&
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {action}
          {secondaryAction}
        </div>
      }
    </div>);

}