import React from 'react';
import { cn } from '../../utils/cn';

interface PanelProps {
  className?: string;
  children: React.ReactNode;
  as?: 'div' | 'section' | 'article';
}

export function Panel({ className, children, as: Tag = 'div' }: PanelProps) {
  return (
    <Tag className={cn('rounded-xl border border-border bg-surface', className)}>{children}</Tag>);

}

export function PanelHeader({
  title,
  description,
  action,
  className,
  as = 'h2'






}: {title: React.ReactNode;description?: React.ReactNode;action?: React.ReactNode;className?: string;as?: 'h2' | 'h3';}) {
  const Heading = as;
  return (
    <div className={cn('flex items-start justify-between gap-4 px-5 pb-4 pt-4', className)}>
      <div className="min-w-0">
        <Heading className="truncate font-display text-md font-semibold text-ink">{title}</Heading>
        {description && <p className="mt-0.5 text-sm text-ink-muted">{description}</p>}
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>);

}