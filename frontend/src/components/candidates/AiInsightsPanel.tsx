import React from 'react';
import { AlertTriangleIcon, CheckIcon, InfoIcon, RefreshCwIcon, SparklesIcon } from 'lucide-react';
import { Panel, PanelHeader } from '../ui/Panel';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { cn } from '../../utils/cn';
import type { Candidate } from '../../types/recruiting';

export function AiInsightsPanel({ candidate }: {candidate: Candidate;}) {
  const { ai } = candidate;
  const circumference = 2 * Math.PI * 34;
  const offset = circumference - ai.score / 100 * circumference;

  return (
    <Panel as="section">
      <PanelHeader
        title={
        <span className="flex items-center gap-2">
            <SparklesIcon className="h-4 w-4 text-accent" aria-hidden />
            AI candidate match
          </span>
        }
        description={`Against ${candidate.primaryJobTitle} · generated ${ai.generatedAt}`}
        action={
        <Button variant="secondary" size="sm" iconLeft={<RefreshCwIcon className="h-3.5 w-3.5" />}>
            Re-run
          </Button>
        } />
      
      <div className="border-t border-border p-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 shrink-0">
              <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90">
                <circle cx="40" cy="40" r="34" fill="none" strokeWidth="7" className="stroke-subtle" />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  fill="none"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  className="stroke-accent transition-[stroke-dashoffset] duration-300 ease-out" />
                
              </svg>
              <span className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-xl font-semibold text-ink">{ai.score}%</span>
                <span className="text-2xs text-ink-subtle">match</span>
              </span>
            </div>
            <div>
              <Badge tone={ai.score >= 85 ? 'success' : ai.score >= 70 ? 'warning' : 'neutral'}>
                {ai.score >= 85 ? 'Strong match' : ai.score >= 70 ? 'Possible match' : 'Weak match'}
              </Badge>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-muted">{ai.summary}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-subtle">Strong matches</p>
            <ul className="mt-2 space-y-1.5">
              {ai.strengths.map((s) =>
              <li key={s} className="flex items-center gap-2 text-base text-ink">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-success-soft text-success-fg" aria-hidden>
                    <CheckIcon className="h-2.5 w-2.5" />
                  </span>
                  {s}
                </li>
              )}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-subtle">Potential gaps</p>
            {ai.gaps.length === 0 ?
            <p className="mt-2 text-base text-ink-muted">No gaps identified against the requirements.</p> :

            <ul className="mt-2 space-y-1.5">
                {ai.gaps.map((g) =>
              <li key={g} className="flex items-center gap-2 text-base text-ink">
                    <span
                  className="flex h-4 w-4 items-center justify-center rounded-full bg-warning-soft text-warning-fg"
                  aria-hidden>
                  
                      <AlertTriangleIcon className="h-2.5 w-2.5" />
                    </span>
                    {g}
                  </li>
              )}
              </ul>
            }
          </div>
        </div>

        <div className={cn('mt-5 flex items-start gap-2.5 rounded-lg border border-border bg-canvas px-3.5 py-3')}>
          <InfoIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-subtle" aria-hidden />
          <p className="text-xs leading-relaxed text-ink-muted">
            This score is decision support, not a decision. It compares CV evidence with the job requirements and
            can miss context. Always confirm with interview evidence before advancing or rejecting.
          </p>
        </div>
      </div>
    </Panel>);

}