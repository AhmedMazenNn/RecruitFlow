import React from 'react';
import { StarIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StarRatingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  onChange?: (value: number) => void;
  label?: string;
  className?: string;
}

const sizes = { sm: 'h-3.5 w-3.5', md: 'h-4 w-4', lg: 'h-5 w-5' };

export function StarRating({ value, max = 5, size = 'md', onChange, label, className }: StarRatingProps) {
  const readOnly = !onChange;
  return (
    <div
      className={cn('inline-flex items-center gap-0.5', className)}
      role={readOnly ? 'img' : 'radiogroup'}
      aria-label={label ? `${label}: ${value} of ${max}` : `${value} of ${max}`}>
      
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < value;
        const star =
        <StarIcon
          className={cn(
            sizes[size],
            'transition-colors duration-150 ease-out',
            filled ? 'fill-warning text-warning' : 'text-strong'
          )} />;


        if (readOnly) return <span key={i}>{star}</span>;
        return (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={value === i + 1}
            aria-label={`${i + 1} of ${max}`}
            onClick={() => onChange?.(i + 1)}
            className="rounded p-0.5 transition-transform duration-150 ease-out hover:scale-110 active:scale-95">
            
            {star}
          </button>);

      })}
      {readOnly &&
      <span className="sr-only">
          {value} out of {max}
        </span>
      }
    </div>);

}