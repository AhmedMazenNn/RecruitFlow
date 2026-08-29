import React from 'react';
import { Loader2Icon } from 'lucide-react';
import { cn } from '../../utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'subtle';
type Size = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
  'bg-brand text-brand-fg hover:bg-brand-hover shadow-xs disabled:bg-brand/45',
  secondary:
  'bg-surface text-ink border border-border hover:bg-subtle hover:border-strong shadow-xs',
  subtle: 'bg-subtle text-ink hover:bg-border/70',
  ghost: 'text-ink-muted hover:bg-subtle hover:text-ink',
  danger: 'bg-danger text-white hover:brightness-95 shadow-xs'
};

const sizes: Record<Size, string> = {
  sm: 'h-7 px-2.5 text-xs gap-1.5 rounded',
  md: 'h-9 px-3.5 text-base gap-2 rounded-md',
  lg: 'h-10 px-4 text-md gap-2 rounded-md',
  icon: 'h-9 w-9 rounded-md'
};

export function Button({
  variant = 'secondary',
  size = 'md',
  loading = false,
  iconLeft,
  iconRight,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={cn(
        'inline-flex select-none items-center justify-center whitespace-nowrap font-medium',
        'transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-out',
        'active:scale-[0.985] disabled:pointer-events-none disabled:opacity-60',
        variants[variant],
        sizes[size],
        className
      )}>
      
      {loading ?
      <Loader2Icon className="h-4 w-4 animate-spin" aria-hidden /> :

      iconLeft
      }
      {children}
      {!loading && iconRight}
    </button>);

}