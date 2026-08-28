import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
  ArrowLeftIcon,
  BriefcaseBusinessIcon,
  CalendarPlusIcon,
  CheckIcon,
  ClockIcon,
  MailIcon,
  MapPinIcon,
  MoreHorizontalIcon,
  PhoneIcon,
  UserRoundXIcon } from
'lucide-react';
import { Panel, PanelHeader } from '../components/ui/Panel';
import { Button } from '../components/ui/Button';
import { Avatar, AvatarGroup } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';
import { Dropdown } from '../components/ui/Dropdown';
import { StageBadge, InterviewStatusBadge } from '../components/ui/StatusBadge';
import { StarRating } from '../components/ui/StarRating';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { AiInsightsPanel } from '../components/candidates/AiInsightsPanel';
import { CandidateTimeline } from '../components/candidates/CandidateTimeline';
import { CandidateDocuments } from '../components/candidates/CandidateDocuments';
import { CandidateNotes } from '../components/candidates/CandidateNotes';
import { ScheduleInterviewModal } from '../components/interviews/ScheduleInterviewModal';
import { getCandidate } from '../data/candidates';
import { interviews } from '../data/interviews';
import { stages, stageLabels, stageOrder } from '../data/stages';
import { daysSince, formatDate } from '../utils/format';
import { cn } from '../utils/cn';
import type { StageId } from '../types/recruiting';

const tabs = [
{ id: 'overview', label: 'Overview' },
{ id: 'applications', label: 'Applications' },
{ id: 'timeline', label: 'Timeline' },
{ id: 'documents', label: 'Documents' },
{ id: 'notes', label: 'Notes' },
{ id: 'interviews', label: 'Interviews' }];


export function CandidateProfile() {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const candidate = getCandidate(candidateId ?? '');
  const [tab, setTab] = useState('overview');
  const [stage, setStage] = useState<StageId>(candidate?.stage ?? 'applied');
  const [scheduling, setScheduling] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  if (!candidate) {
    return (
      <div className="px-4 py-10 lg:px-7">
        <Panel>
          <EmptyState
            icon={<UserRoundXIcon className="h-5 w-5" />}
            title="Candidate not found"
            description="This candidate may have been merged into another profile or deleted from the workspace."
            action={
            <Button variant="primary" onClick={() => navigate('/candidates')}>
                Back to candidates
              </Button>
            } />
          
        </Panel>
      </div>);

  }

  const candidateInterviews = interviews.filter((i) => i.candidateId === candidate.id);
  const stageIndex = stageOrder.indexOf(stage);

  const changeStage = (next: StageId) => {
    if (next === stage) return;
    const from = stage;
    setStage(next);
    toast.success(`Moved to ${stageLabels[next]}`, {
      description: `${candidate.name} left ${stageLabels[from]}.`,
      action: { label: 'Undo', onClick: () => setStage(from) }
    });
  };

  const tabsWithCounts = tabs.map((t) =>
  t.id === 'applications' ?
  { ...t, count: candidate.applications.length } :
  t.id === 'documents' ?
  { ...t, count: candidate.documents.length } :
  t.id === 'notes' ?
  { ...t, count: candidate.notes.length } :
  t.id === 'interviews' ?
  { ...t, count: candidateInterviews.length } :
  t
  );

  return (
    <div className="pb-10">
      {/* Identity header */}
      <div className="border-b border-border bg-surface px-4 pb-5 pt-4 lg:px-7">
        <Link
          to="/candidates"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-subtle transition-colors duration-150 ease-out hover:text-ink">
          
          <ArrowLeftIcon className="h-3.5 w-3.5" aria-hidden />
          All candidates
        </Link>

        <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <Avatar name={candidate.name} color={candidate.avatarColor} size="xl" />
            <div className="min-w-0">
              <h1 className="font-display text-2xl font-semibold text-ink">{candidate.name}</h1>
              <p className="mt-1 text-md text-ink-muted">{candidate.title}</p>
              <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-ink-muted">
                <span className="inline-flex items-center gap-1.5">
                  <MapPinIcon className="h-3.5 w-3.5 text-ink-subtle" aria-hidden />
                  {candidate.location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <BriefcaseBusinessIcon className="h-3.5 w-3.5 text-ink-subtle" aria-hidden />
                  {candidate.yearsExperience} years experience
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ClockIcon className="h-3.5 w-3.5 text-ink-subtle" aria-hidden />
                  {daysSince(candidate.appliedAt)} days in pipeline
                </span>
                <StarRating value={candidate.rating} size="sm" label="Candidate rating" />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Dropdown
              width="w-52"
              header={
              <p className="px-2.5 pb-1.5 pt-1 text-2xs font-semibold uppercase tracking-[0.08em] text-ink-subtle">
                  Move to stage
                </p>
              }
              items={stages.map((s) => ({
                id: s.id,
                label: s.label,
                icon:
                s.id === stage ?
                <CheckIcon className="h-3.5 w-3.5 text-brand" aria-hidden /> :

                <span className="h-3.5 w-3.5" aria-hidden />,

                onSelect: () => changeStage(s.id)
              }))}
              trigger={({ toggle, open }) =>
              <Button variant="primary" onClick={toggle} aria-haspopup="menu" aria-expanded={open}>
                  Move stage
                </Button>
              } />
            
            <Button
              variant="secondary"
              iconLeft={<CalendarPlusIcon className="h-4 w-4" />}
              onClick={() => setScheduling(true)}>
              
              Schedule interview
            </Button>
            <Dropdown
              items={[
              { id: 'email', label: 'Send email' },
              { id: 'tag', label: 'Manage tags' },
              { id: 'share', label: 'Share profile' },
              { id: 'reject', label: 'Reject candidate', danger: true, onSelect: () => setRejecting(true) }]
              }
              trigger={({ toggle, open }) =>
              <Button variant="secondary" size="icon" onClick={toggle} aria-label="More actions" aria-expanded={open}>
                  <MoreHorizontalIcon className="h-4 w-4" />
                </Button>
              } />
            
          </div>
        </div>

        {/* Stage rail */}
        <ol className="mt-5 flex flex-wrap items-center gap-1.5" aria-label="Pipeline progress">
          {stages.map((s, i) => {
            const done = i < stageIndex;
            const active = i === stageIndex;
            return (
              <li key={s.id} className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => changeStage(s.id)}
                  className={cn(
                    'inline-flex h-7 items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium',
                    'transition-[background-color,border-color,color] duration-150 ease-out',
                    active ?
                    'border-brand bg-brand text-brand-fg' :
                    done ?
                    'border-success/25 bg-success-soft text-success-fg' :
                    'border-border bg-surface text-ink-muted hover:border-strong hover:text-ink'
                  )}
                  aria-current={active ? 'step' : undefined}>
                  
                  {done && <CheckIcon className="h-3 w-3" aria-hidden />}
                  {s.label}
                </button>
                {i < stages.length - 1 &&
                <span className="h-px w-3 bg-border sm:w-5" aria-hidden />
                }
              </li>);

          })}
        </ol>
      </div>

      <div className="grid gap-4 px-4 pt-5 lg:grid-cols-3 lg:px-7">
        <div className="lg:col-span-2">
          <Panel>
            <div className="px-4 pt-3 lg:px-5">
              <Tabs tabs={tabsWithCounts} active={tab} onChange={setTab} ariaLabel="Candidate sections" />
            </div>

            {tab === 'overview' &&
            <div className="space-y-6 p-5">
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-subtle">Summary</h3>
                  <p className="mt-2 text-base leading-relaxed text-ink-muted">{candidate.summary}</p>
                </section>

                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-subtle">Skills</h3>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {candidate.skills.map((s) =>
                  <li key={s}>
                        <span className="inline-flex h-6 items-center rounded border border-border bg-canvas px-2 text-xs font-medium text-ink">
                          {s}
                        </span>
                      </li>
                  )}
                  </ul>
                </section>

                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-subtle">Experience</h3>
                  <ol className="mt-3 space-y-4">
                    {candidate.experience.map((e) =>
                  <li key={`${e.company}-${e.period}`} className="border-l-2 border-border pl-3.5">
                        <p className="text-base font-semibold text-ink">{e.role}</p>
                        <p className="text-sm text-ink-muted">
                          {e.company} · {e.period}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-ink-muted">{e.detail}</p>
                      </li>
                  )}
                  </ol>
                </section>

                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-subtle">Education</h3>
                  <ol className="mt-3 space-y-2">
                    {candidate.education.map((e) =>
                  <li key={e.school}>
                        <p className="text-base font-semibold text-ink">{e.degree}</p>
                        <p className="text-sm text-ink-muted">
                          {e.school} · {e.period}
                        </p>
                      </li>
                  )}
                  </ol>
                </section>
              </div>
            }

            {tab === 'applications' &&
            <ul className="divide-y divide-border">
                {candidate.applications.map((a) =>
              <li key={a.jobId} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                    <div className="min-w-0 flex-1">
                      <Link
                    to={`/jobs/${a.jobId}`}
                    className="text-base font-semibold text-ink transition-colors duration-150 ease-out hover:text-brand">
                    
                        {a.jobTitle}
                      </Link>
                      <p className="mt-0.5 text-xs text-ink-subtle">
                        Applied {formatDate(a.appliedAt)} · {a.source}
                      </p>
                    </div>
                    <StageBadge stage={a.stage} size="md" />
                  </li>
              )}
              </ul>
            }

            {tab === 'timeline' && <CandidateTimeline entries={candidate.timeline} />}
            {tab === 'documents' && <CandidateDocuments documents={candidate.documents} />}
            {tab === 'notes' && <CandidateNotes notes={candidate.notes} />}

            {tab === 'interviews' && (
            candidateInterviews.length === 0 ?
            <EmptyState
              icon={<CalendarPlusIcon className="h-5 w-5" />}
              title="No interviews yet"
              description="Schedule the first round to collect structured feedback from the panel."
              action={
              <Button variant="primary" size="sm" onClick={() => setScheduling(true)}>
                      Schedule interview
                    </Button>
              } /> :


            <ul className="divide-y divide-border">
                  {candidateInterviews.map((i) =>
              <li key={i.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                      <div className="min-w-0 flex-1">
                        <p className="text-base font-semibold text-ink">{i.type}</p>
                        <p className="mt-0.5 text-xs text-ink-subtle">
                          {formatDate(i.date)} · {i.time} · {i.durationMin} min
                        </p>
                        <div className="mt-1.5">
                          <AvatarGroup names={i.interviewers} size="xs" max={3} />
                        </div>
                      </div>
                      <InterviewStatusBadge status={i.status} />
                      {i.status !== 'completed' && i.status !== 'cancelled' &&
                <Link to={`/interviews/${i.id}/feedback`}>
                          <Button variant="secondary" size="sm">
                            {i.status === 'awaiting-feedback' ? 'Submit feedback' : 'Scorecard'}
                          </Button>
                        </Link>
                }
                    </li>
              )}
                </ul>)
            }
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel as="section">
            <PanelHeader title="Application" as="h3" />
            <dl className="space-y-3 border-t border-border px-5 py-4 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-ink-muted">Current stage</dt>
                <dd>
                  <StageBadge stage={stage} />
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-ink-muted">Job</dt>
                <dd className="text-right font-medium text-ink">
                  <Link to={`/jobs/${candidate.primaryJobId}`} className="hover:text-brand">
                    {candidate.primaryJobTitle}
                  </Link>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-ink-muted">Source</dt>
                <dd className="text-right font-medium text-ink">{candidate.source}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-ink-muted">Applied</dt>
                <dd className="text-right font-medium text-ink">{formatDate(candidate.appliedAt)}</dd>
              </div>
            </dl>
            <div className="border-t border-border px-5 py-4">
              <h4 className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-subtle">Contact</h4>
              <ul className="mt-2.5 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <MailIcon className="h-3.5 w-3.5 shrink-0 text-ink-subtle" aria-hidden />
                  <a href={`mailto:${candidate.email}`} className="truncate text-ink hover:text-brand">
                    {candidate.email}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <PhoneIcon className="h-3.5 w-3.5 shrink-0 text-ink-subtle" aria-hidden />
                  <span className="text-ink">{candidate.phone}</span>
                </li>
              </ul>
              {candidate.tags.length > 0 &&
              <ul className="mt-3.5 flex flex-wrap gap-1.5">
                  {candidate.tags.map((t) =>
                <li key={t}>
                      <Badge tone="accent">{t}</Badge>
                    </li>
                )}
                </ul>
              }
            </div>
          </Panel>

          <AiInsightsPanel candidate={candidate} />
        </div>
      </div>

      <ScheduleInterviewModal open={scheduling} onClose={() => setScheduling(false)} candidateId={candidate.id} />
      <ConfirmDialog
        open={rejecting}
        title={`Reject ${candidate.name}?`}
        description="The candidate moves to Rejected and is removed from the active pipeline. You can send a rejection email as a separate step."
        confirmLabel="Reject candidate"
        tone="danger"
        onCancel={() => setRejecting(false)}
        onConfirm={() => {
          setRejecting(false);
          toast.success(`${candidate.name} rejected`, { description: 'Removed from the active pipeline.' });
        }} />
      
    </div>);

}