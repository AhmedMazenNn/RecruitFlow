import React from 'react';
import {
  ClipboardCheckIcon,
  CalendarPlusIcon,
  MessageSquareIcon,
  MoveRightIcon,
  PartyPopperIcon,
  UserPlusIcon } from
'lucide-react';
import { Panel, PanelHeader } from '../ui/Panel';
import { Avatar } from '../ui/Avatar';
import { activity } from '../../data/activity';
import { cn } from '../../utils/cn';
import type { ActivityItem } from '../../types/recruiting';

const icons: Record<ActivityItem['kind'], React.ReactNode> = {
  stage: <MoveRightIcon className="h-3 w-3" />,
  candidate: <UserPlusIcon className="h-3 w-3" />,
  interview: <CalendarPlusIcon className="h-3 w-3" />,
  feedback: <ClipboardCheckIcon className="h-3 w-3" />,
  hire: <PartyPopperIcon className="h-3 w-3" />,
  note: <MessageSquareIcon className="h-3 w-3" />
};

const tones: Record<ActivityItem['kind'], string> = {
  stage: 'bg-info-soft text-info-fg',
  candidate: 'bg-success-soft text-success-fg',
  interview: 'bg-accent-soft text-accent',
  feedback: 'bg-brand-soft text-brand',
  hire: 'bg-success-soft text-success-fg',
  note: 'bg-subtle text-ink-muted'
};

export function ActivityFeed() {
  return (
    <Panel as="section">
      <PanelHeader title="Recent activity" description="Across the whole workspace" />
      <ol className="border-t border-border px-5 py-4">
        {activity.map((a, i) =>
        <li key={a.id} className="relative flex gap-3 pb-4 last:pb-0">
            {i < activity.length - 1 &&
          <span className="absolute left-[13px] top-8 h-[calc(100%-1.5rem)] w-px bg-border" aria-hidden />
          }
            <span className="relative shrink-0">
              <Avatar name={a.actor} color={a.avatarColor} size="sm" />
              <span
              className={cn(
                'absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full ring-2 ring-surface',
                tones[a.kind]
              )}
              aria-hidden>
              
                {icons[a.kind]}
              </span>
            </span>
            <span className="min-w-0 flex-1 pt-0.5">
              <span className="block text-base leading-snug text-ink-muted">
                <span className="font-semibold text-ink">{a.actor}</span> {a.text}{' '}
                {a.target && <span className="font-semibold text-ink">{a.target}</span>}
              </span>
              <span className="mt-0.5 block text-xs text-ink-subtle">{a.at}</span>
            </span>
          </li>
        )}
      </ol>
    </Panel>);

}