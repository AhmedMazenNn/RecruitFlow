import React from 'react';
import { cn } from '../../utils/cn';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: TabItem[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
  ariaLabel: string;
}

export function Tabs({ tabs, active, onChange, className, ariaLabel }: TabsProps) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn('rf-scroll -mb-px flex gap-1 overflow-x-auto border-b border-border', className)}>
      
      {tabs.map((t) => {
        const selected = t.id === active;
        return (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={selected}
            onClick={() => onChange(t.id)}
            className={cn(
              'relative -mb-px flex shrink-0 items-center gap-1.5 whitespace-nowrap px-3 pb-2.5 pt-2 text-base font-medium',
              'transition-colors duration-150 ease-out',
              selected ? 'text-ink' : 'text-ink-muted hover:text-ink'
            )}>
            
            {t.label}
            {typeof t.count === 'number' &&
            <span
              className={cn(
                'rounded px-1.5 py-0.5 text-2xs font-semibold',
                selected ? 'bg-brand-soft text-brand' : 'bg-subtle text-ink-subtle'
              )}>
              
                {t.count}
              </span>
            }
            <span
              className={cn(
                'absolute inset-x-2 -bottom-px h-0.5 rounded-full transition-colors duration-150 ease-out',
                selected ? 'bg-brand' : 'bg-transparent'
              )}
              aria-hidden />
            
          </button>);

      })}
    </div>);

}