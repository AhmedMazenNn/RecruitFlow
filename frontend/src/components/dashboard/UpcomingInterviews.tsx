import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, CalendarDaysIcon, VideoIcon } from 'lucide-react';
import { Panel, PanelHeader } from '../ui/Panel';
import { Avatar, AvatarGroup } from '../ui/Avatar';
import { InterviewStatusBadge } from '../ui/StatusBadge';
import { EmptyState } from '../ui/EmptyState';
import { Button } from '../ui/Button';
import { interviews } from '../../data/interviews';
import { formatShortDate, weekdayLabel } from '../../utils/format';
import { useUi } from '../../contexts/UiContext';

export function UpcomingInterviews() {
  const { open } = useUi();
  const upcoming = interviews.
  filter((i) => i.status === 'scheduled').
  sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)).
  slice(0, 5);

  return (
    <Panel as="section" className="flex flex-col">
      <PanelHeader
        title="Upcoming interviews"
        description="Next 7 days"
        action={
        <Link
          to="/interviews"
          className="inline-flex items-center gap-1 text-sm font-semibold text-brand transition-colors duration-150 ease-out hover:text-brand-hover">
          
            Calendar
            <ArrowRightIcon className="h-3.5 w-3.5" aria-hidden />
          </Link>
        } />
      
      {upcoming.length === 0 ?
      <EmptyState
        icon={<CalendarDaysIcon className="h-5 w-5" />}
        title="No interviews scheduled"
        description="Nothing is booked in the next seven days. Schedule the candidates waiting in Screening."
        action={
        <Button variant="primary" size="sm" onClick={() => open('schedule-interview')}>
              Schedule interview
            </Button>
        } /> :


      <ul className="flex-1 divide-y divide-border border-t border-border">
          {upcoming.map((i) =>
        <li key={i.id}>
              <Link
            to={`/candidates/${i.candidateId}`}
            className="flex items-start gap-3 px-5 py-3.5 transition-colors duration-150 ease-out hover:bg-subtle/60">
            
                <span className="flex w-11 shrink-0 flex-col items-center rounded-md border border-border bg-canvas py-1">
                  <span className="text-2xs font-semibold uppercase tracking-wide text-ink-subtle">
                    {weekdayLabel(i.date)}
                  </span>
                  <span className="font-display text-base font-semibold text-ink">
                    {formatShortDate(i.date).split(' ')[1]}
                  </span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <Avatar name={i.candidateName} color={i.avatarColor} size="xs" />
                    <span className="truncate text-base font-semibold text-ink">{i.candidateName}</span>
                  </span>
                  <span className="mt-1 block truncate text-sm text-ink-muted">
                    {i.type} · {i.jobTitle}
                  </span>
                  <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <span className="text-xs font-medium text-ink">
                      {i.time} · {i.durationMin}m
                    </span>
                    <AvatarGroup names={i.interviewers} size="xs" max={2} />
                    <span className="inline-flex items-center gap-1 text-xs text-ink-subtle">
                      <VideoIcon className="h-3 w-3" aria-hidden />
                      Meet link
                    </span>
                  </span>
                </span>
                <span className="hidden shrink-0 sm:block">
                  <InterviewStatusBadge status={i.status} />
                </span>
              </Link>
            </li>
        )}
        </ul>
      }
    </Panel>);

}