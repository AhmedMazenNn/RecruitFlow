import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, TrendingDownIcon } from 'lucide-react';
import { Panel, PanelHeader } from '../ui/Panel';
import { Badge } from '../ui/Badge';
import { funnel } from '../../data/analytics';
import { cn } from '../../utils/cn';

const toneByIndex = [
'bg-ink-subtle/70',
'bg-info',
'bg-brand',
'bg-accent',
'bg-warning',
'bg-success'];


export function FunnelPanel() {
  const top = funnel[0].count;

  return (
    <Panel as="section" className="flex flex-col">
      <PanelHeader
        title="Recruitment funnel"
        description="All open jobs · last 90 days"
        action={
        <Link
          to="/analytics"
          className="inline-flex items-center gap-1 text-sm font-semibold text-brand transition-colors duration-150 ease-out hover:text-brand-hover">
          
            Analytics
            <ArrowRightIcon className="h-3.5 w-3.5" aria-hidden />
          </Link>
        } />
      
      <div className="flex-1 border-t border-border px-5 pb-5 pt-4">
        <ol className="space-y-2.5">
          {funnel.map((s, i) => {
            const width = Math.max(8, s.count / top * 100);
            const prev = funnel[i - 1];
            const stepDrop = prev ? Math.round((prev.count - s.count) / prev.count * 100) : 0;
            const bottleneck = stepDrop >= 50;
            return (
              <li key={s.stage}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-sm font-medium text-ink">{s.stage}</p>
                  <p className="flex items-baseline gap-2">
                    <span className="font-display text-md font-semibold text-ink">{s.count}</span>
                    <span className="text-xs text-ink-subtle">{s.conversion}% of applied</span>
                  </p>
                </div>
                <div className="mt-1.5 flex items-center gap-2.5">
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-subtle">
                    <div
                      className={cn('h-full rounded-full transition-[width] duration-300 ease-out', toneByIndex[i])}
                      style={{ width: `${width}%` }} />
                    
                  </div>
                  {prev &&
                  <span
                    className={cn(
                      'inline-flex w-16 shrink-0 items-center justify-end gap-1 text-xs font-medium',
                      bottleneck ? 'text-danger-fg' : 'text-ink-subtle'
                    )}>
                    
                      <TrendingDownIcon className="h-3 w-3" aria-hidden />
                      {stepDrop}%
                    </span>
                  }
                </div>
              </li>);

          })}
        </ol>

        <div className="mt-5 flex flex-wrap items-center gap-2 rounded-lg border border-warning/25 bg-warning-soft px-3.5 py-3">
          <Badge tone="warning">Bottleneck</Badge>
          <p className="text-sm text-warning-fg">
            Screening → Technical loses 49% of candidates, the largest single drop in the funnel.
          </p>
        </div>
      </div>
    </Panel>);

}