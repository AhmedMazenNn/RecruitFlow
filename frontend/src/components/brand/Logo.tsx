import React from 'react';
import { cn } from '../../utils/cn';

interface MarkProps {
  className?: string;
  /** Renders the mark in a single flat color instead of the two-tone brand treatment. */
  monochrome?: boolean;
}

/**
 * RecruitFlow mark — three talent nodes rising along a connected path.
 * The ascending stroke reads as progress/flow; the nodes read as people moving
 * through stages. Works down to 16px because the geometry is only 3 dots + 1 path.
 */
export function LogoMark({ className, monochrome = false }: MarkProps) {
  return (
    <svg viewBox="0 0 32 32" role="img" aria-label="RecruitFlow" className={cn('h-8 w-8', className)}>
      <rect width="32" height="32" rx="8" fill={monochrome ? 'currentColor' : 'rgb(var(--rf-navy))'} />
      <path
        d="M7.5 22.5C11 22.5 12.4 18 15.6 18c3.2 0 4.6-4.5 8.1-4.5"
        fill="none"
        stroke={monochrome ? 'rgb(var(--rf-brand-fg))' : 'rgb(var(--rf-brand))'}
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity={monochrome ? 0.55 : 1} />
      
      <circle cx="7.5" cy="22.5" r="2.6" fill="rgb(var(--rf-brand-fg))" opacity={monochrome ? 0.75 : 0.95} />
      <circle cx="15.6" cy="18" r="2.6" fill="rgb(var(--rf-brand-fg))" opacity={monochrome ? 0.85 : 0.95} />
      <circle
        cx="23.7"
        cy="13.5"
        r="3.4"
        fill={monochrome ? 'rgb(var(--rf-brand-fg))' : 'rgb(var(--rf-accent))'} />
      
    </svg>);

}

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showPlan?: boolean;
}

export function Logo({ className, size = 'md', showPlan = false }: LogoProps) {
  const markSize = size === 'sm' ? 'h-7 w-7' : size === 'lg' ? 'h-10 w-10' : 'h-8 w-8';
  const textSize = size === 'sm' ? 'text-[15px]' : size === 'lg' ? 'text-xl' : 'text-lg';
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark className={markSize} />
      <span className="flex flex-col leading-none">
        <span className={cn('font-display font-semibold tracking-[-0.02em] text-ink', textSize)}>
          Recruit<span className="text-brand">Flow</span>
        </span>
        {showPlan &&
        <span className="mt-1 text-2xs font-medium uppercase tracking-[0.14em] text-ink-subtle">
            Talent Platform
          </span>
        }
      </span>
    </span>);

}