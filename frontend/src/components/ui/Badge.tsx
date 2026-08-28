import React from 'react';
import { cn } from '../../utils/cn';

export type Tone = 'neutral' | 'brand' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

const tones: Record<Tone, string> = {
  neutral: 'bg-subtle text-ink-muted border-border',
  brand: 'bg-brand-soft text-brand border-brand/20',
  accent: 'bg-accent-soft text-accent border-accent/20',
  success: 'bg-success-soft text-success-fg border-success/25',
  warning: 'bg-warning-soft text-warning-fg border-warning/25',
  danger: 'bg-danger-soft text-danger-fg border-danger/25',
  info: 'bg-info-soft text-info-fg border-info/25'
};

const dotTones: Record<Tone, string> = {
  neutral: 'bg-ink-subtle',
  brand: 'bg-brand',
  accent: 'bg-accent',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-info'
};

interface BadgeProps {
  tone?: Tone;
  dot?: boolean;
  size?: 'sm' | 'md';
  uppercase?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Badge({
  tone = 'neutral',
  dot = false,
  size = 'sm',
  uppercase = false,
  className,
  children
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded border font-medium',
        size === 'sm' ? 'h-5 px-1.5 text-2xs' : 'h-6 px-2 text-xs',
        uppercase && 'uppercase tracking-[0.06em]',
        tones[tone],
        className
      )}>
      
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dotTones[tone])} aria-hidden />}
      {children}
    </span>);

}