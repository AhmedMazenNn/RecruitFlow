import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDaysIcon,
  CalendarPlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardCheckIcon,
  ListIcon,
  VideoIcon } from
'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Panel } from '../components/ui/Panel';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Avatar, AvatarGroup } from '../components/ui/Avatar';
import { InterviewStatusBadge } from '../components/ui/StatusBadge';
import { Badge } from '../components/ui/Badge';
import { Drawer } from '../components/ui/Drawer';
import { EmptyState } from '../components/ui/EmptyState';
import { InterviewCalendar } from '../components/interviews/InterviewCalendar';
import { interviews as allInterviews } from '../data/interviews';
import { formatDate } from '../utils/format';
import { cn } from '../utils/cn';
import { useUi } from '../contexts/UiContext';
import type { Interview } from '../types/recruiting';

const weeks = [
{ start: '2026-08-24', label: 'Aug 24 – Aug 30, 2026' },
{ start: '2026-08-31', label: 'Aug 31 – Sep 6, 2026' }];


export function Interviews() {
  const { open } = useUi();
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [weekIndex, setWeekIndex] = useState(1);
  const [status, setStatus] = useState('all');
  const [selected, setSelected] = useState<Interview | null>(null);

  const filtered = useMemo(
    () => allInterviews.filter((i) => status === 'all' || i.status === status),
    [status]
  );

  const awaiting = allInterviews.filter((i) => i.status === 'awaiting-feedback').length;

  return (
    <div className="pb-10">
      <PageHeader
        title="Interviews"
        description="Every scheduled round, who is running it, and which scorecards are still missing."
        actions={
        <Button
          variant="primary"
          iconLeft={<CalendarPlusIcon className="h-4 w-4" />}
          onClick={() => open('schedule-interview')}>
          
            Schedule interview
          </Button>
        }
        meta={
        <>
            <div className="inline-flex rounded-md border border-border bg-surface p-0.5">
              {(['calendar', 'list'] as const).map((v) =>
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              aria-pressed={view === v}
              className={cn(
                'inline-flex h-7 items-center gap-1.5 rounded px-2.5 text-xs font-medium capitalize',
                'transition-colors duration-150 ease-out',
                view === v ? 'bg-brand text-brand-fg' : 'text-ink-muted hover:text-ink'
              )}>
              
                  {v === 'calendar' ?
              <CalendarDaysIcon className="h-3.5 w-3.5" aria-hidden /> :

              <ListIcon className="h-3.5 w-3.5" aria-hidden />
              }
                  {v}
                </button>
            )}
            </div>
            {awaiting > 0 && <Badge tone="warning">{awaiting} awaiting feedback</Badge>}
            <div className="w-44">
              <label htmlFor="int-status" className="sr-only">
                Filter by status
              </label>
              <Select
              id="int-status"
              size="sm"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={[
              { value: 'all', label: 'All statuses' },
              { value: 'scheduled', label: 'Scheduled' },
              { value: 'awaiting-feedback', label: 'Awaiting feedback' },
              { value: 'completed', label: 'Completed' },
              { value: 'cancelled', label: 'Cancelled' }]
              } />
            
            </div>
          </>
        } />
      

      <div className="px-4 pt-5 lg:px-7">
        <Panel>
          {view === 'calendar' ?
          <>
              <div className="flex items-center justify-between gap-3 px-4 py-3 lg:px-5">
                <h2 className="font-display text-md font-semibold text-ink">{weeks[weekIndex].label}</h2>
                <div className="flex items-center gap-1">
                  <Button
                  variant="secondary"
                  size="icon"
                  aria-label="Previous week"
                  disabled={weekIndex === 0}
                  onClick={() => setWeekIndex((i) => Math.max(0, i - 1))}>
                  
                    <ChevronLeftIcon className="h-4 w-4" />
                  </Button>
                  <Button
                  variant="secondary"
                  size="icon"
                  aria-label="Next week"
                  disabled={weekIndex === weeks.length - 1}
                  onClick={() => setWeekIndex((i) => Math.min(weeks.length - 1, i + 1))}>
                  
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="border-t border-border">
                <InterviewCalendar
                interviews={filtered}
                weekStart={weeks[weekIndex].start}
                onSelect={setSelected} />
              
              </div>
            </> :
          filtered.length === 0 ?
          <EmptyState
            icon={<CalendarDaysIcon className="h-5 w-5" />}
            title="No interviews match this filter"
            description="Try a different status, or schedule a new round for candidates waiting in Screening."
            action={
            <Button variant="secondary" onClick={() => setStatus('all')}>
                  Clear filter
                </Button>
            } /> :


          <ul className="divide-y divide-border">
              {filtered.map((i) =>
            <li key={i.id}>
                  <button
                type="button"
                onClick={() => setSelected(i)}
                className="flex w-full flex-col gap-3 px-4 py-3.5 text-left transition-colors duration-150 ease-out hover:bg-subtle/50 lg:flex-row lg:items-center lg:px-5">
                
                    <span className="flex min-w-0 flex-1 items-center gap-3">
                      <Avatar name={i.candidateName} color={i.avatarColor} size="md" />
                      <span className="min-w-0">
                        <span className="block truncate text-base font-semibold text-ink">{i.candidateName}</span>
                        <span className="mt-0.5 block truncate text-sm text-ink-muted">
                          {i.type} · {i.jobTitle}
                        </span>
                      </span>
                    </span>
                    <span className="flex flex-wrap items-center gap-x-5 gap-y-2 lg:justify-end">
                      <span className="text-sm text-ink">
                        {formatDate(i.date)} · {i.time}
                        <span className="text-ink-subtle"> ({i.durationMin}m)</span>
                      </span>
                      <AvatarGroup names={i.interviewers} size="xs" max={3} />
                      <InterviewStatusBadge status={i.status} />
                    </span>
                  </button>
                </li>
            )}
            </ul>
          }
        </Panel>
      </div>

      <Drawer
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected ? `${selected.type}` : 'Interview'}
        description={selected ? `${selected.candidateName} · ${selected.jobTitle}` : undefined}
        footer={
        selected &&
        <>
              <Button variant="secondary" onClick={() => setSelected(null)}>
                Close
              </Button>
              <Link to={`/interviews/${selected.id}/feedback`}>
                <Button variant="primary" iconLeft={<ClipboardCheckIcon className="h-4 w-4" />}>
                  {selected.scorecardSubmitted ? 'View scorecard' : 'Submit feedback'}
                </Button>
              </Link>
            </>

        }>
        
        {selected &&
        <div className="p-5">
            <div className="flex items-center gap-3">
              <Avatar name={selected.candidateName} color={selected.avatarColor} size="lg" />
              <div>
                <Link
                to={`/candidates/${selected.candidateId}`}
                className="text-md font-semibold text-ink hover:text-brand">
                
                  {selected.candidateName}
                </Link>
                <p className="text-sm text-ink-muted">{selected.jobTitle}</p>
              </div>
            </div>

            <dl className="mt-5 space-y-3 text-sm">
              {[
            ['Interview type', selected.type],
            ['Date', formatDate(selected.date)],
            ['Time', `${selected.time} · ${selected.durationMin} minutes`],
            ['Interviewers', selected.interviewers.join(', ')]].
            map(([k, v]) =>
            <div key={k} className="flex items-start justify-between gap-3">
                  <dt className="text-ink-muted">{k}</dt>
                  <dd className="text-right font-medium text-ink">{v}</dd>
                </div>
            )}
              <div className="flex items-center justify-between gap-3">
                <dt className="text-ink-muted">Status</dt>
                <dd>
                  <InterviewStatusBadge status={selected.status} />
                </dd>
              </div>
            </dl>

            <a
            href={`https://${selected.meetingLink}`}
            className="mt-5 flex items-center gap-2.5 rounded-lg border border-border bg-canvas px-3.5 py-3 transition-colors duration-150 ease-out hover:border-brand">
            
              <VideoIcon className="h-4 w-4 shrink-0 text-brand" aria-hidden />
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-ink">Join meeting</span>
                <span className="block truncate text-xs text-ink-subtle">{selected.meetingLink}</span>
              </span>
            </a>
          </div>
        }
      </Drawer>
    </div>);

}