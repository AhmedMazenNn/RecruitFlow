import React from 'react';
import {
  AtSignIcon,
  CalendarClockIcon,
  ClipboardCheckIcon,
  MoveRightIcon,
  TriangleAlertIcon,
  UserPlusIcon } from
'lucide-react';
import { Avatar } from '../ui/Avatar';
import { cn } from '../../utils/cn';
import type { Notification } from '../../types/recruiting';

const kindIcon: Record<Notification['kind'], React.ReactNode> = {
  feedback: <ClipboardCheckIcon className="h-3.5 w-3.5" />,
  stage: <MoveRightIcon className="h-3.5 w-3.5" />,
  application: <UserPlusIcon className="h-3.5 w-3.5" />,
  interview: <CalendarClockIcon className="h-3.5 w-3.5" />,
  system: <TriangleAlertIcon className="h-3.5 w-3.5" />,
  mention: <AtSignIcon className="h-3.5 w-3.5" />
};

const kindTone: Record<Notification['kind'], string> = {
  feedback: 'bg-brand-soft text-brand',
  stage: 'bg-info-soft text-info-fg',
  application: 'bg-success-soft text-success-fg',
  interview: 'bg-accent-soft text-accent',
  system: 'bg-danger-soft text-danger-fg',
  mention: 'bg-warning-soft text-warning-fg'
};

interface NotificationListProps {
  items: Notification[];
  onToggleRead?: (id: string) => void;
  compact?: boolean;
}

export function NotificationList({ items, onToggleRead, compact = false }: NotificationListProps) {
  return (
    <ul className="divide-y divide-border">
      {items.map((n) =>
      <li key={n.id}>
          <button
          type="button"
          onClick={() => onToggleRead?.(n.id)}
          className={cn(
            'flex w-full items-start gap-3 text-left transition-colors duration-150 ease-out hover:bg-subtle/70',
            compact ? 'px-3.5 py-3' : 'px-5 py-4',
            !n.read && 'bg-brand-soft/40'
          )}>
          
            <span className="relative mt-0.5 shrink-0">
              {n.actor ?
            <Avatar name={n.actor} color={n.avatarColor} size="sm" /> :

            <span
              className={cn('flex h-7 w-7 items-center justify-center rounded-full', kindTone[n.kind])}
              aria-hidden>
              
                  {kindIcon[n.kind]}
                </span>
            }
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-start gap-2">
                <span
                className={cn(
                  'min-w-0 flex-1 text-base leading-snug',
                  n.read ? 'font-medium text-ink-muted' : 'font-semibold text-ink'
                )}>
                
                  {n.title}
                </span>
                {!n.read &&
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
              }
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-ink-muted">{n.body}</span>
              <span className="mt-1.5 flex items-center gap-2 text-2xs text-ink-subtle">
                {n.at}
                <span aria-hidden>·</span>
                <span className="font-medium">{n.read ? 'Read' : 'Unread'}</span>
              </span>
            </span>
          </button>
        </li>
      )}
    </ul>);

}