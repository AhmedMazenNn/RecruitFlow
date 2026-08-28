import React, { useState } from 'react';
import { Panel, PanelHeader } from '../ui/Panel';
import { Switch } from '../ui/Switch';
import { Select } from '../ui/Select';
import { Field } from '../ui/Input';

const groups = [
{
  group: 'Candidates',
  items: [
  { id: 'new-application', label: 'New application on my jobs', description: 'Email and in-app', on: true },
  { id: 'stage-change', label: 'Candidate moves stage', description: 'In-app only', on: true },
  { id: 'stalled', label: 'Candidate stalled in a stage', description: 'Daily digest at 09:00', on: true }]

},
{
  group: 'Interviews',
  items: [
  { id: 'scheduled', label: 'Interview scheduled or rescheduled', description: 'Email and calendar invite', on: true },
  { id: 'reminder', label: 'Reminder 1 hour before', description: 'In-app and email', on: true },
  { id: 'feedback-due', label: 'Scorecard overdue', description: 'Email after 24 hours', on: false }]

},
{
  group: 'Workspace',
  items: [
  { id: 'mentions', label: 'Mentions in notes', description: 'Always on for direct mentions', on: true },
  { id: 'weekly', label: 'Weekly hiring summary', description: 'Monday mornings', on: false }]

}];


export function NotificationPreferences() {
  const [state, setState] = useState<Record<string, boolean>>(
    Object.fromEntries(groups.flatMap((g) => g.items.map((i) => [i.id, i.on])))
  );

  return (
    <Panel as="section">
      <PanelHeader
        title="Notification preferences"
        description="Applies to your account only. Workspace defaults are set by admins."
        as="h2" />
      
      <div className="border-t border-border px-5 py-4">
        <Field label="Digest frequency" htmlFor="digest" className="max-w-xs">
          <Select
            id="digest"
            options={[
            { value: 'realtime', label: 'Send immediately' },
            { value: 'hourly', label: 'Hourly batch' },
            { value: 'daily', label: 'Daily digest' }]
            } />
          
        </Field>
      </div>
      {groups.map((g) =>
      <div key={g.group} className="border-t border-border px-5 py-4">
          <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-subtle">{g.group}</h3>
          <ul className="mt-3 space-y-4">
            {g.items.map((i) =>
          <li key={i.id}>
                <Switch
              id={`pref-${i.id}`}
              label={i.label}
              description={i.description}
              checked={state[i.id]}
              disabled={i.id === 'mentions'}
              onChange={(v) => setState((s) => ({ ...s, [i.id]: v }))} />
            
              </li>
          )}
          </ul>
        </div>
      )}
    </Panel>);

}