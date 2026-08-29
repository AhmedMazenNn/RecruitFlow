import React from 'react';
import { cn } from '../../utils/cn';

interface FieldProps {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Field({ label, htmlFor, hint, error, required, className, children }: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
        {required &&
        <span className="ml-0.5 text-danger" aria-hidden>
            *
          </span>
        }
      </label>
      {children}
      {error ?
      <p className="text-xs text-danger-fg">{error}</p> :

      hint && <p className="text-xs text-ink-subtle">{hint}</p>
      }
    </div>);

}

export const inputClass =
'h-9 w-full rounded-md border border-border bg-surface px-3 text-base text-ink placeholder:text-ink-subtle ' +
'transition-[border-color,box-shadow] duration-150 ease-out hover:border-strong ' +
'focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 ' +
'disabled:cursor-not-allowed disabled:bg-subtle disabled:text-ink-subtle';

export function Input({
  className,
  invalid,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & {invalid?: boolean;}) {
  return (
    <input
      {...rest}
      aria-invalid={invalid || undefined}
      className={cn(inputClass, invalid && 'border-danger focus:border-danger focus:ring-danger/20', className)} />);


}

export function Textarea({
  className,
  ...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...rest} className={cn(inputClass, 'h-auto min-h-[92px] py-2 leading-relaxed', className)} />;
}