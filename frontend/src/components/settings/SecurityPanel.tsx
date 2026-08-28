import React, { useState } from 'react';
import { KeyRoundIcon, LaptopIcon, ShieldIcon, SmartphoneIcon } from 'lucide-react';
import { Panel, PanelHeader } from '../ui/Panel';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Switch } from '../ui/Switch';
import { Alert } from '../ui/Alert';

const sessions = [
{ id: 's1', device: 'MacBook Pro · Chrome', location: 'Cairo, Egypt', at: 'Active now', current: true, icon: <LaptopIcon className="h-4 w-4" /> },
{ id: 's2', device: 'iPhone 15 · RecruitFlow app', location: 'Cairo, Egypt', at: '2 hours ago', current: false, icon: <SmartphoneIcon className="h-4 w-4" /> },
{ id: 's3', device: 'Windows · Edge', location: 'Berlin, Germany', at: '4 days ago', current: false, icon: <LaptopIcon className="h-4 w-4" /> }];


export function SecurityPanel() {
  const [mfa, setMfa] = useState(true);
  const [sso, setSso] = useState(false);

  return (
    <div className="space-y-4">
      <Panel as="section">
        <PanelHeader title="Authentication" description="How your team signs in to Northwind Labs." as="h2" />
        <div className="space-y-5 border-t border-border px-5 py-4">
          <Switch
            id="sec-mfa"
            label="Require two-factor authentication"
            description="Every member must set up an authenticator app before accessing candidate data."
            checked={mfa}
            onChange={setMfa} />
          
          <Switch
            id="sec-sso"
            label="SAML single sign-on"
            description="Available on the Scale plan. Requires an identity provider metadata URL."
            checked={sso}
            onChange={setSso} />
          
          {sso &&
          <Alert tone="info" title="Finish SSO setup">
              Add your identity provider metadata URL to activate SSO. Password sign-in stays available until you
              enforce SSO.
            </Alert>
          }
          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-canvas px-3.5 py-3">
            <KeyRoundIcon className="h-4 w-4 shrink-0 text-ink-subtle" aria-hidden />
            <p className="min-w-0 flex-1 text-sm text-ink-muted">
              Data retention: candidate records are deleted 24 months after their last activity.
            </p>
            <Button variant="secondary" size="sm">
              Edit policy
            </Button>
          </div>
        </div>
      </Panel>

      <Panel as="section">
        <PanelHeader
          title="Active sessions"
          description="Sign out of devices you no longer recognise."
          as="h2"
          action={
          <Button variant="secondary" size="sm">
              Sign out all others
            </Button>
          } />
        
        <ul className="divide-y divide-border border-t border-border">
          {sessions.map((s) =>
          <li key={s.id} className="flex items-center gap-3 px-5 py-3.5">
              <span className="text-ink-subtle" aria-hidden>
                {s.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2 text-base font-medium text-ink">
                  {s.device}
                  {s.current && <Badge tone="success">This device</Badge>}
                </p>
                <p className="mt-0.5 text-xs text-ink-subtle">
                  {s.location} · {s.at}
                </p>
              </div>
              {!s.current &&
            <Button variant="ghost" size="sm">
                  Sign out
                </Button>
            }
            </li>
          )}
        </ul>
        <p className="flex items-center gap-2 border-t border-border px-5 py-3 text-xs text-ink-muted">
          <ShieldIcon className="h-3.5 w-3.5 shrink-0 text-ink-subtle" aria-hidden />
          Audit logs for the last 90 days are available to Admins and Owners.
        </p>
      </Panel>
    </div>);

}