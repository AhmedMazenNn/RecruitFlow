import React from 'react';
import { SearchIcon, XIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label: string;
  id?: string;
  size?: 'sm' | 'md';
  shortcut?: string;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search…',
  label,
  id = 'search',
  size = 'md',
  shortcut,
  className
}: SearchInputProps) {
  return (
    <div className={cn('relative', className)}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <SearchIcon
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle"
        aria-hidden />
      
      <input
        id={id}
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'w-full rounded-md border border-border bg-surface pl-9 pr-9 text-base text-ink placeholder:text-ink-subtle',
          'transition-[border-color,box-shadow] duration-150 ease-out hover:border-strong',
          'focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20',
          size === 'sm' ? 'h-8' : 'h-9'
        )} />
      
      {value ?
      <button
        type="button"
        onClick={() => onChange('')}
        aria-label="Clear search"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-ink-subtle transition-colors duration-150 ease-out hover:bg-subtle hover:text-ink">
        
          <XIcon className="h-3.5 w-3.5" />
        </button> :

      shortcut &&
      <kbd className="absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-subtle px-1.5 py-0.5 text-2xs font-medium text-ink-subtle sm:block">
            {shortcut}
          </kbd>

      }
    </div>);

}