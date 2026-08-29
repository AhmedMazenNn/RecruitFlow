import React from 'react';
import { Link } from 'react-router-dom';
import { ClockIcon, FileWarningIcon, HourglassIcon, MailWarningIcon } from 'lucide-react';
import { Panel, PanelHeader } from '../ui/Panel';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface Item {
  id: string;
  icon: React.ReactNode;
  title: string;
  detail: string;
  severity: 'warning' | 'danger' | 'info';
  action: string;
  to: string;
}

const items: Item[] = [
{
  id: 'feedback',
  icon: <ClockIcon className="h-4 w-4" />,
  title: '4 scorecards overdue',
  detail: 'Tarek Idrissi’s technical round was 2 days ago and no feedback has been submitted.',
  severity: 'danger',
  action: 'Chase interviewers',
  to: '/interviews'
},
{
  id: 'stale',
  icon: <HourglassIcon className="h-4 w-4" />,
  title: '4 candidates stalled in Technical',
  detail: 'Average 11 days in stage against a 7 day target for Senior Backend Engineer.',
  severity: 'warning',
  action: 'Open pipeline',
  to: '/pipeline'
},
{
  id: 'offer',
  icon: <MailWarningIcon className="h-4 w-4" />,
  title: 'Offer expires Friday',
  detail: 'Ali Rahmani has not responded to the offer sent on Aug 26.',
  severity: 'warning',
  action: 'Review offer',
  to: '/candidates/cand-ali'
},
{
  id: 'parse',
  icon: <FileWarningIcon className="h-4 w-4" />,
  title: 'CV parsing failed for 1 document',
  detail: 'system-design-take-home.zip is not a supported format. Ask for a PDF instead.',
  severity: 'info',
  action: 'View document',
  to: '/candidates/cand-ahmed'
}];


const tones = {
  danger: 'bg-danger-soft text-danger',
  warning: 'bg-warning-soft text-warning-fg',
  info: 'bg-info-soft text-info-fg'
};

export function NeedsAttention() {
  return (
    <Panel as="section">
      <PanelHeader
        title="Needs attention"
        description="Blocking the pipeline right now"
        action={<Badge tone="danger">{items.length} open</Badge>} />
      
      <ul className="divide-y divide-border border-t border-border">
        {items.map((item) =>
        <li key={item.id} className="flex flex-col gap-3 px-5 py-3.5 sm:flex-row sm:items-center">
            <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${tones[item.severity]}`}
            aria-hidden>
            
              {item.icon}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-base font-semibold text-ink">{item.title}</span>
              <span className="mt-0.5 block text-sm leading-relaxed text-ink-muted">{item.detail}</span>
            </span>
            <Link to={item.to} className="shrink-0">
              <Button variant="secondary" size="sm">
                {item.action}
              </Button>
            </Link>
          </li>
        )}
      </ul>
    </Panel>);

}