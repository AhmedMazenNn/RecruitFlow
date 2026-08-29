import React from 'react';
import { toast } from 'sonner';
import { CalendarIcon, LinkedinIcon, MailIcon, MessageSquareIcon, VideoIcon, ZapIcon } from 'lucide-react';
import { Panel, PanelHeader } from '../ui/Panel';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

const integrations = [
{
  id: 'gcal',
  name: 'Google Calendar',
  description: 'Two-way sync for interview scheduling and availability.',
  icon: <CalendarIcon className="h-4 w-4" />,
  status: 'connected' as const,
  meta: 'Connected as nadia@northwind.io'
},
{
  id: 'gmail',
  name: 'Gmail',
  description: 'Send and log candidate emails from inside RecruitFlow.',
  icon: <MailIcon className="h-4 w-4" />,
  status: 'connected' as const,
  meta: 'Connected · 412 emails logged'
},
{
  id: 'slack',
  name: 'Slack',
  description: 'Post pipeline updates and scorecard reminders to a channel.',
  icon: <MessageSquareIcon className="h-4 w-4" />,
  status: 'error' as const,
  meta: 'Token expired 3 days ago — reconnect to resume updates'
},
{
  id: 'zoom',
  name: 'Zoom',
  description: 'Generate meeting links automatically for every interview.',
  icon: <VideoIcon className="h-4 w-4" />,
  status: 'available' as const,
  meta: 'Not connected'
},
{
  id: 'linkedin',
  name: 'LinkedIn Recruiter',
  description: 'Import profiles and sync InMail conversations.',
  icon: <LinkedinIcon className="h-4 w-4" />,
  status: 'available' as const,
  meta: 'Requires the Scale plan'
},
{
  id: 'api',
  name: 'Webhooks & API',
  description: 'Push candidate and interview events into your own systems.',
  icon: <ZapIcon className="h-4 w-4" />,
  status: 'available' as const,
  meta: 'No endpoints configured'
}];


const tones = {
  connected: { tone: 'success' as const, label: 'Connected' },
  error: { tone: 'danger' as const, label: 'Action needed' },
  available: { tone: 'neutral' as const, label: 'Available' }
};

export function IntegrationsPanel() {
  return (
    <Panel as="section">
      <PanelHeader title="Integrations" description="Connect the tools your hiring team already uses." as="h2" />
      <ul className="divide-y divide-border border-t border-border">
        {integrations.map((i) =>
        <li key={i.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
            <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-canvas text-ink-muted"
            aria-hidden>
            
              {i.icon}
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex flex-wrap items-center gap-2 text-base font-semibold text-ink">
                {i.name}
                <Badge tone={tones[i.status].tone} dot>
                  {tones[i.status].label}
                </Badge>
              </p>
              <p className="mt-0.5 text-sm text-ink-muted">{i.description}</p>
              <p className="mt-1 text-xs text-ink-subtle">{i.meta}</p>
            </div>
            <Button
            variant={i.status === 'error' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() =>
            toast.success(
              i.status === 'connected' ?
              `${i.name} disconnected` :
              i.status === 'error' ?
              `${i.name} reconnected` :
              `${i.name} connected`
            )
            }>
            
              {i.status === 'connected' ? 'Disconnect' : i.status === 'error' ? 'Reconnect' : 'Connect'}
            </Button>
          </li>
        )}
      </ul>
    </Panel>);

}