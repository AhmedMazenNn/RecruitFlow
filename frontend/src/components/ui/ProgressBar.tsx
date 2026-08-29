import React from 'react';
import { cn } from '../../utils/cn';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  tone?: 'brand' | 'success' | 'warning' | 'danger' | 'accent';
  size?: 'sm' | 'md';
  className?: string;
}

const tones = {
  brand: 'bg-brand',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  accent: 'bg-accent'
};

export function ProgressBar({ value, max = 100, label, tone = 'brand', size = 'sm', className }: ProgressBarProps) {
  const pct = Math.min(100, Math.round(value / max * 100));
  return (
    <div
      className={cn('w-full overflow-hidden rounded-full bg-subtle', size === 'sm' ? 'h-1.5' : 'h-2.5', className)}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}>
      
      <div
        className={cn('h-full rounded-full transition-[width] duration-300 ease-out', tones[tone])}
        style={{ width: `${pct}%` }} />
      
    </div>);

}