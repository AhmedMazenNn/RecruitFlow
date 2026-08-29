import React, { useState } from 'react';
import { ArrowDownRightIcon, ArrowUpRightIcon, DownloadIcon } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Panel, PanelHeader } from '../components/ui/Panel';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { HiringTrendChart } from '../components/analytics/HiringTrendChart';
import { StageTimeChart } from '../components/analytics/StageTimeChart';
import { applicationsPerJob, recruiterPerformance, sources } from '../data/analytics';
import { cn } from '../utils/cn';

const headline = [
{ label: 'Time to hire', value: '29', unit: 'days', delta: -4, good: true, meta: 'Target 30 days' },
{ label: 'Interview → offer', value: '41', unit: '%', delta: 6, good: true, meta: 'Benchmark 35%' },
{ label: 'Offer acceptance', value: '80', unit: '%', delta: -6, good: false, meta: '4 of 5 accepted' },
{ label: 'Jobs filled', value: '17', unit: 'of 19', delta: 3, good: true, meta: 'Quarter to date' }];


export function Analytics() {
  const [range, setRange] = useState('90');
  const maxApplications = Math.max(...applicationsPerJob.map((j) => j.applications));

  return (
    <div className="pb-10">
      <PageHeader
        title="Analytics"
        description="Where hiring is slowing down, and which channels are actually producing hires."
        actions={
        <>
            <div className="w-40">
              <label htmlFor="range" className="sr-only">
                Date range
              </label>
              <Select
              id="range"
              value={range}
              onChange={(e) => setRange(e.target.value)}
              options={[
              { value: '30', label: 'Last 30 days' },
              { value: '90', label: 'Last 90 days' },
              { value: '365', label: 'Last 12 months' }]
              } />
            
            </div>
            <Button variant="secondary" iconLeft={<DownloadIcon className="h-4 w-4" />}>
              Export
            </Button>
          </>
        } />
      

      <div className="space-y-4 px-4 pt-5 lg:px-7">
        <section aria-label="Headline metrics" className="rounded-xl border border-border bg-surface">
          <dl className="grid grid-cols-2 lg:grid-cols-4">
            {headline.map((h) =>
            <div
              key={h.label}
              className="border-b border-r border-border px-5 py-4 last:border-r-0 lg:border-b-0">
              
                <dt className="text-xs font-medium text-ink-muted">{h.label}</dt>
                <dd className="mt-2 flex items-baseline gap-1.5">
                  <span className="font-display text-3xl font-semibold text-ink">{h.value}</span>
                  <span className="text-sm text-ink-subtle">{h.unit}</span>
                </dd>
                <p className="mt-1.5 flex items-center gap-1.5 text-xs">
                  <span
                  className={cn(
                    'inline-flex items-center gap-0.5 font-semibold',
                    h.good ? 'text-success-fg' : 'text-danger-fg'
                  )}>
                  
                    {h.delta > 0 ?
                  <ArrowUpRightIcon className="h-3 w-3" aria-hidden /> :

                  <ArrowDownRightIcon className="h-3 w-3" aria-hidden />
                  }
                    {Math.abs(h.delta)}
                    {h.unit === '%' ? 'pp' : ''}
                  </span>
                  <span className="text-ink-subtle">{h.meta}</span>
                </p>
              </div>
            )}
          </dl>
        </section>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Panel as="section">
              <PanelHeader
                title="Hires and time to hire"
                description="Monthly hires against average days from application to signed offer"
                action={<Badge tone="success">Time to hire down 29% since March</Badge>} />
              
              <div className="border-t border-border pt-2">
                <HiringTrendChart />
              </div>
            </Panel>
          </div>

          <Panel as="section">
            <PanelHeader title="Time in stage" description="Actual vs target, in days" />
            <div className="border-t border-border pt-2">
              <StageTimeChart />
            </div>
            <p className="px-5 pb-4 text-xs leading-relaxed text-ink-muted">
              Technical rounds run 1.6 days over target — the single biggest contributor to overall time to hire.
            </p>
          </Panel>

          <Panel as="section">
            <PanelHeader title="Applications per job" description={`Last ${range} days`} />
            <ol className="space-y-3 border-t border-border px-5 py-4">
              {applicationsPerJob.map((j) =>
              <li key={j.job}>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="truncate font-medium text-ink">{j.job}</span>
                    <span className="text-ink-muted">{j.applications}</span>
                  </div>
                  <ProgressBar
                  value={j.applications}
                  max={maxApplications}
                  label={`${j.job} applications`}
                  className="mt-1.5" />
                
                </li>
              )}
            </ol>
          </Panel>

          <div className="lg:col-span-2">
            <Panel as="section">
              <PanelHeader
                title="Source effectiveness"
                description="Volume is not quality — referrals convert 7× better than job boards" />
              
              <div className="rf-scroll overflow-x-auto border-t border-border">
                <table className="w-full min-w-[560px] text-left">
                  <thead>
                    <tr className="border-b border-border text-2xs font-semibold uppercase tracking-[0.07em] text-ink-subtle">
                      <th scope="col" className="px-5 py-2.5">
                        Source
                      </th>
                      <th scope="col" className="px-3 py-2.5">
                        Applications
                      </th>
                      <th scope="col" className="px-3 py-2.5">
                        Hires
                      </th>
                      <th scope="col" className="px-3 py-2.5">
                        Conversion
                      </th>
                      <th scope="col" className="px-5 py-2.5">
                        Quality score
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {sources.map((s) =>
                    <tr key={s.source} className="transition-colors duration-150 ease-out hover:bg-subtle/50">
                        <td className="px-5 py-3 text-base font-medium text-ink">{s.source}</td>
                        <td className="px-3 py-3 text-sm text-ink-muted">{s.applications}</td>
                        <td className="px-3 py-3 text-sm text-ink-muted">{s.hires}</td>
                        <td className="px-3 py-3 text-sm text-ink-muted">
                          {(s.hires / s.applications * 100).toFixed(1)}%
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2.5">
                            <ProgressBar
                            value={s.quality}
                            tone={s.quality >= 80 ? 'success' : s.quality >= 60 ? 'brand' : 'warning'}
                            label={`${s.source} quality`}
                            className="w-24" />
                          
                            <span className="text-sm font-medium text-ink">{s.quality}</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>

          <Panel as="section">
            <PanelHeader title="Recruiter performance" description="Quarter to date" />
            <ul className="divide-y divide-border border-t border-border">
              {recruiterPerformance.map((r) =>
              <li key={r.name} className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={r.name} color={r.avatarColor} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-semibold text-ink">{r.name}</p>
                      <p className="text-xs text-ink-subtle">{r.open} open requisitions</p>
                    </div>
                    <Badge tone={r.timeToHire <= 33 ? 'success' : 'warning'}>{r.timeToHire}d to hire</Badge>
                  </div>
                  <dl className="mt-2.5 grid grid-cols-3 gap-2 text-center">
                    {[
                  ['Interviews', r.interviews],
                  ['Offers', r.offers],
                  ['Hires', r.hires]].
                  map(([label, value]) =>
                  <div key={String(label)} className="rounded-md bg-canvas py-1.5">
                        <dt className="text-2xs text-ink-subtle">{label}</dt>
                        <dd className="font-display text-base font-semibold text-ink">{value}</dd>
                      </div>
                  )}
                  </dl>
                </li>
              )}
            </ul>
          </Panel>
        </div>
      </div>
    </div>);

}