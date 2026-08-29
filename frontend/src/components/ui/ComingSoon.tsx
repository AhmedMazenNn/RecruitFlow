import React from 'react';
import { SparklesIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ComingSoonProps {
  title?: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function ComingSoon({
  title = 'Coming soon',
  description = 'This feature is not built yet. It will appear here once the backend API lands.',
  action,
  className,
}: ComingSoonProps) {
  return (
    <div className={cn('flex min-h-[320px] w-full flex-col items-center justify-center px-6 py-16 text-center', className)}>
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-brand/20 bg-brand/10 text-brand">
        <SparklesIcon className="h-7 w-7" aria-hidden />
      </div>
      <h2 className="mt-5 font-display text-xl font-semibold text-ink">{title}</h2>
      <p className="mt-2 max-w-sm text-base leading-relaxed text-ink-muted">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}