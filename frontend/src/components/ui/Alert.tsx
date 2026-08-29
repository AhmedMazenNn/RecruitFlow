import React from 'react';
import { AlertTriangleIcon, CheckCircle2Icon, InfoIcon, XCircleIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

type AlertTone = 'info' | 'success' | 'warning' | 'danger';

const config: Record<AlertTone, {wrap: string;icon: React.ReactNode;}> = {
  info: { wrap: 'border-info/25 bg-info-soft text-info-fg', icon: <InfoIcon className="h-4 w-4" /> },
  success: {
    wrap: 'border-success/25 bg-success-soft text-success-fg',
    icon: <CheckCircle2Icon className="h-4 w-4" />
  },
  warning: {
    wrap: 'border-warning/30 bg-warning-soft text-warning-fg',
    icon: <AlertTriangleIcon className="h-4 w-4" />
  },
  danger: {
    wrap: 'border-danger/25 bg-danger-soft text-danger-fg',
    icon: <XCircleIcon className="h-4 w-4" />
  }
};

interface AlertProps {
  tone?: AlertTone;
  title: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function Alert({ tone = 'info', title, children, action, className }: AlertProps) {
  return (
    <div
      role="status"
      className={cn('flex items-start gap-3 rounded-lg border px-3.5 py-3', config[tone].wrap, className)}>
      
      <span className="mt-0.5 shrink-0" aria-hidden>
        {config[tone].icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-base font-semibold">{title}</p>
        {children && <div className="mt-1 text-sm leading-relaxed opacity-90">{children}</div>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>);

}