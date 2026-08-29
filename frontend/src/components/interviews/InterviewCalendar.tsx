import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Avatar } from '../ui/Avatar';
import { cn } from '../../utils/cn';
import type { Interview } from '../../types/recruiting';

const typeTone: Record<string, string> = {
  'Screening call': 'border-l-info bg-info-soft/60',
  'Technical interview': 'border-l-brand bg-brand-soft/60',
  'System design': 'border-l-accent bg-accent-soft/60',
  'HR interview': 'border-l-warning bg-warning-soft/60',
  'Final panel': 'border-l-success bg-success-soft/60'
};

interface Props {
  interviews: Interview[];
  weekStart: string;
  onSelect: (interview: Interview) => void;
}

function addDays(iso: string, days: number) {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function InterviewCalendar({ interviews, weekStart, onSelect }: Props) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const today = '2026-08-28';

  return (
    <div className="rf-scroll overflow-x-auto">
      <div className="grid min-w-[860px] grid-cols-7 divide-x divide-border">
        {days.map((day) => {
          const items = interviews.
          filter((i) => i.date === day && i.status !== 'cancelled').
          sort((a, b) => a.time.localeCompare(b.time));
          const date = new Date(day);
          const isToday = day === today;
          const weekend = [0, 6].includes(date.getDay());

          return (
            <div key={day} className={cn('min-h-[22rem] p-2', weekend && 'bg-canvas/60')}>
              <div className="mb-2 flex items-baseline gap-1.5 px-1">
                <span className="text-2xs font-semibold uppercase tracking-[0.07em] text-ink-subtle">
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                <span
                  className={cn(
                    'font-display text-base font-semibold',
                    isToday ?
                    'flex h-6 w-6 items-center justify-center rounded-full bg-brand text-brand-fg' :
                    'text-ink'
                  )}>
                  
                  {date.getDate()}
                </span>
              </div>

              <div className="space-y-1.5">
                {items.length === 0 ?
                <p className="px-1 text-2xs text-ink-subtle">No interviews</p> :

                items.map((i) =>
                <motion.button
                  key={i.id}
                  type="button"
                  onClick={() => onSelect(i)}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                  className={cn(
                    'w-full rounded-md border border-border border-l-2 p-2 text-left',
                    'transition-[box-shadow,transform] duration-150 ease-out hover:shadow-sm',
                    typeTone[i.type] ?? 'border-l-border bg-subtle'
                  )}>
                  
                      <span className="block text-2xs font-semibold text-ink">
                        {i.time} · {i.durationMin}m
                      </span>
                      <span className="mt-1 flex items-center gap-1.5">
                        <Avatar name={i.candidateName} color={i.avatarColor} size="xs" />
                        <span className="truncate text-xs font-semibold text-ink">{i.candidateName}</span>
                      </span>
                      <span className="mt-1 block truncate text-2xs text-ink-muted">{i.type}</span>
                      {i.status === 'awaiting-feedback' &&
                  <span className="mt-1 block text-2xs font-semibold text-warning-fg">Feedback due</span>
                  }
                    </motion.button>
                )
                }
              </div>
            </div>);

        })}
      </div>
      <p className="border-t border-border px-4 py-3 text-xs text-ink-subtle">
        Times shown in Africa/Cairo (GMT+2).{' '}
        <Link to="/settings" className="font-medium text-brand hover:text-brand-hover">
          Change timezone
        </Link>
      </p>
    </div>);

}