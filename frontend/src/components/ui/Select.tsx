import React from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { inputClass } from './Input';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: {value: string;label: string;}[];
  size?: 'sm' | 'md';
}

export function Select({ options, className, size = 'md', ...rest }: SelectProps) {
  return (
    <span className="relative inline-flex w-full items-center">
      <select
        {...rest}
        className={cn(
          inputClass,
          'appearance-none pr-8',
          size === 'sm' && 'h-8 text-sm',
          className
        )}>
        
        {options.map((o) =>
        <option key={o.value} value={o.value}>
            {o.label}
          </option>
        )}
      </select>
      <ChevronDownIcon
        className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 text-ink-subtle"
        aria-hidden />
      
    </span>);

}