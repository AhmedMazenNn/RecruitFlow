import React from 'react';
import {
  FileTextIcon,
  MailIcon,
  MessageSquareIcon,
  MoveRightIcon,
  SparkleIcon,
  CalendarPlusIcon,
  BadgeCheckIcon } from
'lucide-react';
import { cn } from '../../utils/cn';
import type { TimelineEntry } from '../../types/recruiting';

const icons: Record<TimelineEntry['kind'], React.ReactNode> = {
  stage: <MoveRightIcon className="h-3.5 w-3.5" />,
  interview: <CalendarPlusIcon className="h-3.5 w-3.5" />,
  document: <FileTextIcon className="h-3.5 w-3.5" />,
  note: <MessageSquareIcon className="h-3.5 w-3.5" />,
  created: <SparkleIcon className="h-3.5 w-3.5" />,
  email: <MailIcon className="h-3.5 w-3.5" />,
  offer: <BadgeCheckIcon className="h-3.5 w-3.5" />
};

const tones: Record<TimelineEntry['kind'], string> = {
  stage: 'bg-info-soft text-info-fg',
  interview: 'bg-accent-soft text-accent',
  document: 'bg-subtle text-ink-muted',
  note: 'bg-subtle text-ink-muted',
  created: 'bg-success-soft text-success-fg',
  email: 'bg-brand-soft text-brand',
  offer: 'bg-warning-soft text-warning-fg'
};

export function CandidateTimeline({ entries }: {entries: TimelineEntry[];}) {
  const groups = entries.reduce<Record<string, TimelineEntry[]>>((acc, e) => {
    acc[e.group] = acc[e.group] ? [...acc[e.group], e] : [e];
    return acc;
  }, {});

  return (
    <div className="space-y-6 p-5">
      {Object.entries(groups).map(([group, items]) =>
      <section key={group}>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-ink-subtle">{group}</h3>
          <ol>
            {items.map((e, i) =>
          <li key={e.id} className="relative flex gap-3 pb-5 last:pb-0">
                {i < items.length - 1 &&
            <span className="absolute left-[15px] top-8 h-[calc(100%-1.5rem)] w-px bg-border" aria-hidden />
            }
                <span
              className={cn(
                'relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-4 ring-surface',
                tones[e.kind]
              )}
              aria-hidden>
              
                  {icons[e.kind]}
                </span>
                <div className="min-w-0 flex-1 pt-1">
                  <p className="text-base font-semibold text-ink">{e.title}</p>
                  {e.detail && <p className="mt-0.5 text-sm leading-relaxed text-ink-muted">{e.detail}</p>}
                  <p className="mt-1 text-xs text-ink-subtle">
                    {e.at} · {e.actor}
                  </p>
                </div>
              </li>
          )}
          </ol>
        </section>
      )}
    </div>);

}