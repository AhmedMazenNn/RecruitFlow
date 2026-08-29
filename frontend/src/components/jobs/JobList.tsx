import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, MoreHorizontalIcon, UsersIcon } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { JobStatusBadge } from '../ui/StatusBadge';
import { Dropdown } from '../ui/Dropdown';
import { ProgressBar } from '../ui/ProgressBar';
import { formatDate, formatSalary } from '../../utils/format';
import type { Job } from '../../types/recruiting';

const rowMenu = [
{ id: 'edit', label: 'Edit job' },
{ id: 'duplicate', label: 'Duplicate' },
{ id: 'pause', label: 'Pause hiring' },
{ id: 'close', label: 'Close job', danger: true }];


export function JobList({ jobs }: {jobs: Job[];}) {
  return (
    <>
      {/* Desktop: dense table */}
      <div className="hidden lg:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border text-2xs font-semibold uppercase tracking-[0.07em] text-ink-subtle">
              <th scope="col" className="px-5 py-2.5 font-semibold">
                Job
              </th>
              <th scope="col" className="px-3 py-2.5 font-semibold">
                Department
              </th>
              <th scope="col" className="px-3 py-2.5 font-semibold">
                Pipeline
              </th>
              <th scope="col" className="px-3 py-2.5 font-semibold">
                Hiring manager
              </th>
              <th scope="col" className="px-3 py-2.5 font-semibold">
                Created
              </th>
              <th scope="col" className="px-3 py-2.5 font-semibold">
                Status
              </th>
              <th scope="col" className="px-5 py-2.5">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {jobs.map((job) =>
            <tr key={job.id} className="group transition-colors duration-150 ease-out hover:bg-subtle/50">
                <td className="px-5 py-3">
                  <Link to={`/jobs/${job.id}`} className="block">
                    <span className="block text-base font-semibold text-ink group-hover:text-brand">
                      {job.title}
                    </span>
                    <span className="mt-0.5 flex items-center gap-2 text-xs text-ink-muted">
                      <MapPinIcon className="h-3 w-3" aria-hidden />
                      {job.location} · {job.employmentType}
                      <span className="text-ink-subtle">
                        {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
                      </span>
                    </span>
                  </Link>
                </td>
                <td className="px-3 py-3 text-sm text-ink-muted">{job.department}</td>
                <td className="px-3 py-3">
                  <div className="w-40">
                    <p className="flex items-baseline gap-1.5 text-sm">
                      <span className="font-semibold text-ink">{job.candidateCount}</span>
                      <span className="text-ink-muted">candidates</span>
                    </p>
                    <ProgressBar
                    value={job.inInterview}
                    max={Math.max(job.candidateCount, 1)}
                    label={`${job.inInterview} in interview`}
                    className="mt-1.5" />
                  
                    <p className="mt-1 text-xs text-ink-subtle">{job.inInterview} in interview</p>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <span className="flex items-center gap-2">
                    <Avatar name={job.hiringManager.name} color={job.hiringManager.avatarColor} size="xs" />
                    <span className="text-sm text-ink-muted">{job.hiringManager.name}</span>
                  </span>
                </td>
                <td className="px-3 py-3 text-sm text-ink-muted">{formatDate(job.createdAt)}</td>
                <td className="px-3 py-3">
                  <JobStatusBadge status={job.status} />
                </td>
                <td className="px-5 py-3 text-right">
                  <Dropdown
                  items={rowMenu}
                  trigger={({ toggle, open }) =>
                  <button
                    type="button"
                    onClick={toggle}
                    aria-label={`Actions for ${job.title}`}
                    aria-expanded={open}
                    className="rounded p-1.5 text-ink-subtle transition-colors duration-150 ease-out hover:bg-subtle hover:text-ink">
                    
                        <MoreHorizontalIcon className="h-4 w-4" />
                      </button>
                  } />
                
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile / tablet: cards */}
      <ul className="divide-y divide-border lg:hidden">
        {jobs.map((job) =>
        <li key={job.id}>
            <Link to={`/jobs/${job.id}`} className="block px-4 py-4 transition-colors duration-150 ease-out active:bg-subtle">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-md font-semibold text-ink">{job.title}</p>
                  <p className="mt-1 text-sm text-ink-muted">
                    {job.department} · {job.location}
                  </p>
                </div>
                <JobStatusBadge status={job.status} />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge tone="neutral">
                  <UsersIcon className="h-3 w-3" aria-hidden />
                  {job.candidateCount} candidates
                </Badge>
                <Badge tone="brand">{job.inInterview} in interview</Badge>
                <Badge tone="neutral">{job.openings} opening{job.openings > 1 ? 's' : ''}</Badge>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-ink-subtle">
                <Avatar name={job.hiringManager.name} color={job.hiringManager.avatarColor} size="xs" />
                {job.hiringManager.name} · created {formatDate(job.createdAt)}
              </div>
            </Link>
          </li>
        )}
      </ul>
    </>);

}