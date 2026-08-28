import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownRightIcon, ArrowUpRightIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface Kpi {
  label: string;
  value: string;
  delta: number;
  deltaLabel: string;
  to: string;
  emphasis?: boolean;
}

const kpis: Kpi[] = [
{ label: 'Open jobs', value: '6', delta: 1, deltaLabel: 'vs last month', to: '/jobs' },
{ label: 'Active candidates', value: '128', delta: 12, deltaLabel: 'vs last month', to: '/candidates' },
{
  label: 'Interviews this week',
  value: '9',
  delta: 3,
  deltaLabel: '4 need feedback',
  to: '/interviews',
  emphasis: true
},
{ label: 'Offers out', value: '3', delta: 0, deltaLabel: '1 expiring Friday', to: '/pipeline' },
{ label: 'Hires this quarter', value: '17', delta: -2, deltaLabel: 'vs target of 19', to: '/analytics' }];


export function KpiStrip() {
  return (
    <section aria-label="Recruitment key figures" className="rounded-xl border border-border bg-surface">
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {kpis.map((k) =>
        <li
          key={k.label}
          className="border-b border-r border-border last:border-r-0 lg:border-b-0">
          
            <Link
            to={k.to}
            className="group block px-4 py-4 transition-colors duration-150 ease-out hover:bg-subtle/60">
            
              <p className="flex items-center gap-1.5 text-xs font-medium text-ink-muted">
                {k.label}
                {k.emphasis && <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden />}
              </p>
              <p
              className={cn(
                'mt-2 font-display font-semibold tracking-[-0.02em] text-ink',
                k.emphasis ? 'text-4xl' : 'text-3xl'
              )}>
              
                {k.value}
              </p>
              <p className="mt-1.5 flex items-center gap-1.5 text-xs">
                {k.delta !== 0 &&
              <span
                className={cn(
                  'inline-flex items-center gap-0.5 font-semibold',
                  k.delta > 0 ? 'text-success-fg' : 'text-danger-fg'
                )}>
                
                    {k.delta > 0 ?
                <ArrowUpRightIcon className="h-3 w-3" aria-hidden /> :

                <ArrowDownRightIcon className="h-3 w-3" aria-hidden />
                }
                    {k.delta > 0 ? '+' : ''}
                    {k.delta}
                  </span>
              }
                <span className="text-ink-subtle">{k.deltaLabel}</span>
              </p>
            </Link>
          </li>
        )}
      </ul>
    </section>);

}