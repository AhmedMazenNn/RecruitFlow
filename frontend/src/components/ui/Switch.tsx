import React from 'react';
import { cn } from '../../utils/cn';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
  id: string;
}

export function Switch({ checked, onChange, label, description, disabled, id }: SwitchProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <label htmlFor={id} className="text-base font-medium text-ink">
          {label}
        </label>
        {description && <p className="mt-0.5 text-sm text-ink-muted">{description}</p>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition-colors duration-150 ease-out',
          checked ? 'bg-brand' : 'bg-strong',
          disabled && 'cursor-not-allowed opacity-50'
        )}>
        
        <span
          className={cn(
            'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-xs transition-transform duration-150 ease-out',
            checked ? 'translate-x-[1.15rem]' : 'translate-x-0.5'
          )}
          aria-hidden />
        
      </button>
    </div>);

}