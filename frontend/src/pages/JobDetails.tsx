import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  BriefcaseBusinessIcon,
  BuildingIcon,
  CalendarIcon,
  ExternalLinkIcon,
  MapPinIcon,
  MoreHorizontalIcon,
  UserPlusIcon,
  WalletIcon } from
'lucide-react';
import { Panel, PanelHeader } from '../components/ui/Panel';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';
import { Dropdown } from '../components/ui/Dropdown';
import { JobStatusBadge, StageBadge } from '../components/ui/StatusBadge';
import { EmptyState } from '../components/ui/EmptyState';
import { ProgressBar } from '../components/ui/ProgressBar';
import { KanbanBoard } from '../components/pipeline/KanbanBoard';
import { getJob } from '../data/jobs';
import { candidates } from '../data/candidates';
import { funnel } from '../data/analytics';
import { formatDate, formatSalary } from '../utils/format';
import { useUi } from '../contexts/UiContext';

const tabs = [
{ id: 'pipeline', label: 'Pipeline' },
{ id: 'overview', label: 'Job details' },
{ id: 'candidates', label: 'Candidates' },
{ id: 'analytics', label: 'Analytics' }];


export function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { open } = useUi();
  const job = getJob(jobId ?? '');
  const [tab, setTab] = useState('pipeline');

  if (!job) {
    return (
      <div className="px-4 py-10 lg:px-7">
        <Panel>
          <EmptyState
            icon={<BriefcaseBusinessIcon className="h-5 w-5" />}
            title="Job not found"
            description="This requisition may have been archived or deleted from the workspace."
            action={
            <Button variant="primary" onClick={() => navigate('/jobs')}>
                Back to jobs
              </Button>
            } />
          
        </Panel>
      </div>);

  }

  const jobCandidates = candidates.filter((c) => c.primaryJobId === job.id);

  return (
    <div className="pb-10">
      <div className="border-b border-border bg-surface px-4 pb-5 pt-4 lg:px-7">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 text-xs text-ink-subtle">
            <li>
              <Link to="/jobs" className="font-medium transition-colors duration-150 ease-out hover:text-ink">
                Jobs
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="font-medium text-ink-muted">{job.title}</li>
          </ol>
        </nav>

        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-2xl font-semibold text-ink">{job.title}</h1>
              <JobStatusBadge status={job.status} />
            </div>
            <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-ink-muted">
              <span className="inline-flex items-center gap-1.5">
                <BuildingIcon className="h-3.5 w-3.5 text-ink-subtle" aria-hidden />
                {job.department}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPinIcon className="h-3.5 w-3.5 text-ink-subtle" aria-hidden />
                {job.location} · {job.workMode}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <WalletIcon className="h-3.5 w-3.5 text-ink-subtle" aria-hidden />
                {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarIcon className="h-3.5 w-3.5 text-ink-subtle" aria-hidden />
                Created {formatDate(job.createdAt)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" iconLeft={<ExternalLinkIcon className="h-4 w-4" />}>
              View posting
            </Button>
            <Button
              variant="primary"
              iconLeft={<UserPlusIcon className="h-4 w-4" />}
              onClick={() => open('add-candidate')}>
              
              Add candidate
            </Button>
            <Dropdown
              items={[
              { id: 'edit', label: 'Edit job' },
              { id: 'stages', label: 'Configure pipeline' },
              { id: 'duplicate', label: 'Duplicate job' },
              { id: 'close', label: 'Close job', danger: true }]
              }
              trigger={({ toggle, open: isOpen }) =>
              <Button variant="secondary" size="icon" onClick={toggle} aria-label="More job actions" aria-expanded={isOpen}>
                  <MoreHorizontalIcon className="h-4 w-4" />
                </Button>
              } />
            
          </div>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4 lg:max-w-3xl">
          <div>
            <dt className="text-xs text-ink-subtle">Candidates</dt>
            <dd className="mt-0.5 font-display text-xl font-semibold text-ink">{job.candidateCount}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-subtle">In interview</dt>
            <dd className="mt-0.5 font-display text-xl font-semibold text-ink">{job.inInterview}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-subtle">Openings</dt>
            <dd className="mt-0.5 font-display text-xl font-semibold text-ink">{job.openings}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-subtle">Hiring manager</dt>
            <dd className="mt-1 flex items-center gap-2">
              <Avatar name={job.hiringManager.name} color={job.hiringManager.avatarColor} size="xs" />
              <span className="text-sm font-medium text-ink">{job.hiringManager.name}</span>
            </dd>
          </div>
        </dl>

        <div className="mt-5">
          <Tabs tabs={tabs} active={tab} onChange={setTab} ariaLabel="Job sections" className="border-b-0" />
        </div>
      </div>

      {tab === 'pipeline' &&
      <>
          {jobCandidates.length === 0 ?
        <div className="px-4 pt-5 lg:px-7">
              <Panel>
                <EmptyState
              icon={<UserPlusIcon className="h-5 w-5" />}
              title="No candidates in this pipeline"
              description="Add candidates manually, upload CVs, or publish the job to start collecting applications."
              action={
              <Button variant="primary" onClick={() => open('add-candidate')}>
                      Add candidate
                    </Button>
              }
              secondaryAction={<Button variant="secondary">Share job link</Button>} />
            
              </Panel>
            </div> :

        <KanbanBoard initial={jobCandidates} />
        }
        </>
      }

      {tab === 'overview' &&
      <div className="grid gap-4 px-4 pt-5 lg:grid-cols-3 lg:px-7">
          <div className="space-y-4 lg:col-span-2">
            <Panel as="section">
              <PanelHeader title="About the role" as="h2" />
              <div className="border-t border-border px-5 py-4">
                <p className="text-base leading-relaxed text-ink-muted">{job.description}</p>
                <h3 className="mt-5 text-xs font-semibold uppercase tracking-[0.08em] text-ink-subtle">
                  Responsibilities
                </h3>
                <ul className="mt-2.5 space-y-1.5">
                  {job.responsibilities.map((r) =>
                <li key={r} className="flex gap-2.5 text-base text-ink-muted">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand" aria-hidden />
                      {r}
                    </li>
                )}
                </ul>
              </div>
            </Panel>

            <Panel as="section">
              <PanelHeader title="Requirements" as="h2" />
              <div className="border-t border-border px-5 py-4">
                <ul className="space-y-1.5">
                  {job.requirements.map((r) =>
                <li key={r} className="flex gap-2.5 text-base text-ink-muted">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink-subtle" aria-hidden />
                      {r}
                    </li>
                )}
                </ul>
                <h3 className="mt-5 text-xs font-semibold uppercase tracking-[0.08em] text-ink-subtle">
                  Nice to have
                </h3>
                <ul className="mt-2.5 flex flex-wrap gap-1.5">
                  {job.niceToHave.map((n) =>
                <li key={n}>
                      <Badge tone="neutral" size="md">
                        {n}
                      </Badge>
                    </li>
                )}
                </ul>
              </div>
            </Panel>
          </div>

          <Panel as="section">
            <PanelHeader title="Details" as="h2" />
            <dl className="space-y-3 border-t border-border px-5 py-4 text-sm">
              {[
            ['Department', job.department],
            ['Employment type', job.employmentType],
            ['Work mode', job.workMode],
            ['Location', job.location],
            ['Salary', formatSalary(job.salaryMin, job.salaryMax, job.currency)],
            ['Recruiter', job.recruiter],
            ['Openings', String(job.openings)],
            ['Created', formatDate(job.createdAt)]].
            map(([k, v]) =>
            <div key={k} className="flex items-start justify-between gap-3">
                  <dt className="text-ink-muted">{k}</dt>
                  <dd className="text-right font-medium text-ink">{v}</dd>
                </div>
            )}
            </dl>
          </Panel>
        </div>
      }

      {tab === 'candidates' &&
      <div className="px-4 pt-5 lg:px-7">
          <Panel>
            {jobCandidates.length === 0 ?
          <EmptyState
            icon={<UserPlusIcon className="h-5 w-5" />}
            title="No candidates yet"
            description="Once applications arrive they will be listed here with their current stage." /> :


          <ul className="divide-y divide-border">
                {jobCandidates.map((c) =>
            <li key={c.id}>
                    <Link
                to={`/candidates/${c.id}`}
                className="flex flex-wrap items-center gap-3 px-5 py-3.5 transition-colors duration-150 ease-out hover:bg-subtle/50">
                
                      <Avatar name={c.name} color={c.avatarColor} size="md" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-base font-semibold text-ink">{c.name}</span>
                        <span className="mt-0.5 block truncate text-sm text-ink-muted">
                          {c.title} · {c.location} · {c.yearsExperience} yrs
                        </span>
                      </span>
                      <Badge tone={c.ai.score >= 85 ? 'success' : 'neutral'}>{c.ai.score}% match</Badge>
                      <StageBadge stage={c.stage} />
                    </Link>
                  </li>
            )}
              </ul>
          }
          </Panel>
        </div>
      }

      {tab === 'analytics' &&
      <div className="grid gap-4 px-4 pt-5 lg:grid-cols-2 lg:px-7">
          <Panel as="section">
            <PanelHeader title="Stage conversion" description="Since the job opened" as="h2" />
            <ol className="space-y-3 border-t border-border px-5 py-4">
              {funnel.map((f) =>
            <li key={f.stage}>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="font-medium text-ink">{f.stage}</span>
                    <span className="text-ink-muted">
                      {Math.round(f.count / 3)} · {f.conversion}%
                    </span>
                  </div>
                  <ProgressBar value={f.conversion} label={`${f.stage} conversion`} className="mt-1.5" />
                </li>
            )}
            </ol>
          </Panel>
          <Panel as="section">
            <PanelHeader title="Health" description="Against workspace benchmarks" as="h2" />
            <dl className="grid grid-cols-2 gap-4 border-t border-border px-5 py-5">
              {[
            ['Time to hire', '34 days', 'Target 30'],
            ['Avg. time in stage', '6.2 days', 'Target 5'],
            ['Interview-to-offer', '41%', 'Benchmark 35%'],
            ['Offer acceptance', '80%', 'Benchmark 74%']].
            map(([label, value, meta]) =>
            <div key={label}>
                  <dt className="text-xs text-ink-subtle">{label}</dt>
                  <dd className="mt-1 font-display text-xl font-semibold text-ink">{value}</dd>
                  <p className="mt-0.5 text-xs text-ink-muted">{meta}</p>
                </div>
            )}
            </dl>
          </Panel>
        </div>
      }
    </div>);

}