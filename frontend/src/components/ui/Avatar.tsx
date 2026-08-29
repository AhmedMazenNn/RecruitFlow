import React from 'react';
import { cn } from '../../utils/cn';
import { initials } from '../../utils/format';

interface AvatarProps {
  name: string;
  color?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  ring?: boolean;
}

const sizes = {
  xs: 'h-5 w-5 text-[9px]',
  sm: 'h-7 w-7 text-2xs',
  md: 'h-9 w-9 text-xs',
  lg: 'h-11 w-11 text-base',
  xl: 'h-16 w-16 text-lg'
};

export function Avatar({ name, color = '#4F46E5', size = 'md', className, ring = false }: AvatarProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white',
        sizes[size],
        ring && 'ring-2 ring-surface',
        className
      )}
      style={{ backgroundColor: color }}
      aria-hidden>
      
      {initials(name)}
    </span>);

}

export function AvatarGroup({
  names,
  colors,
  max = 3,
  size = 'sm'





}: {names: string[];colors?: string[];max?: number;size?: 'xs' | 'sm' | 'md';}) {
  const shown = names.slice(0, max);
  const rest = names.length - shown.length;
  return (
    <span className="flex items-center">
      <span className="flex -space-x-1.5">
        {shown.map((n, i) =>
        <Avatar key={n} name={n} color={colors?.[i] ?? ['#4F46E5', '#8B5CF6', '#16A160'][i % 3]} size={size} ring />
        )}
      </span>
      {rest > 0 && <span className="ml-2 text-xs text-ink-subtle">+{rest}</span>}
      <span className="sr-only">{names.join(', ')}</span>
    </span>);

}