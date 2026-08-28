import React, { useState } from 'react';
import { CheckIcon, MinusIcon, ShieldCheckIcon } from 'lucide-react';
import { Panel, PanelHeader } from '../ui/Panel';
import { Badge } from '../ui/Badge';
import { cn } from '../../utils/cn';

const roles = ['Admin', 'Recruiter', 'Hiring Manager', 'Interviewer'] as const;
type Role = (typeof roles)[number];

interface Permission {
  group: string;
  label: string;
  plain: string;
  allowed: Record<Role, boolean | 'own'>;
}

const permissions: Permission[] = [
{
  group: 'Jobs',
  label: 'Create and publish jobs',
  plain: 'Open a new requisition and put it live on the careers page.',
  allowed: { Admin: true, Recruiter: true, 'Hiring Manager': false, Interviewer: false }
},
{
  group: 'Jobs',
  label: 'Edit job details',
  plain: 'Change title, description, salary range or pipeline stages.',
  allowed: { Admin: true, Recruiter: true, 'Hiring Manager': 'own', Interviewer: false }
},
{
  group: 'Candidates',
  label: 'View all candidates',
  plain: 'See every candidate in the workspace, not only assigned ones.',
  allowed: { Admin: true, Recruiter: true, 'Hiring Manager': 'own', Interviewer: false }
},
{
  group: 'Candidates',
  label: 'Move candidates between stages',
  plain: 'Advance or reject candidates in the pipeline.',
  allowed: { Admin: true, Recruiter: true, 'Hiring Manager': 'own', Interviewer: false }
},
{
  group: 'Candidates',
  label: 'See private notes',
  plain: 'Read notes marked private to recruiters.',
  allowed: { Admin: true, Recruiter: true, 'Hiring Manager': false, Interviewer: false }
},
{
  group: 'Interviews',
  label: 'Submit interview feedback',
  plain: 'Fill in a scorecard for interviews they run.',
  allowed: { Admin: true, Recruiter: true, 'Hiring Manager': true, Interviewer: true }
},
{
  group: 'Workspace',
  label: 'Manage team and billing',
  plain: 'Invite people, change roles and update the subscription.',
  allowed: { Admin: true, Recruiter: false, 'Hiring Manager': false, Interviewer: false }
}];


export function RolesPermissions() {
  const [role, setRole] = useState<Role>('Recruiter');

  return (
    <Panel as="section">
      <PanelHeader
        title="Roles and permissions"
        description="Plain-language summary of what each role can do. Owners always have full access."
        as="h2"
        action={<Badge tone="brand">4 roles</Badge>} />
      

      <div className="flex flex-wrap gap-1.5 border-t border-border px-5 py-3 lg:hidden">
        {roles.map((r) =>
        <button
          key={r}
          type="button"
          onClick={() => setRole(r)}
          aria-pressed={role === r}
          className={cn(
            'h-7 rounded border px-2.5 text-xs font-medium transition-colors duration-150 ease-out',
            role === r ? 'border-brand bg-brand text-brand-fg' : 'border-border text-ink-muted'
          )}>
          
            {r}
          </button>
        )}
      </div>

      {/* Mobile: one role at a time */}
      <ul className="divide-y divide-border lg:hidden">
        {permissions.map((p) =>
        <li key={p.label} className="flex items-start gap-3 px-5 py-3.5">
            <Cell value={p.allowed[role]} />
            <div className="min-w-0">
              <p className="text-base font-medium text-ink">{p.label}</p>
              <p className="mt-0.5 text-sm text-ink-muted">{p.plain}</p>
            </div>
          </li>
        )}
      </ul>

      {/* Desktop: matrix */}
      <div className="hidden border-t border-border lg:block">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border text-2xs font-semibold uppercase tracking-[0.07em] text-ink-subtle">
              <th scope="col" className="px-5 py-2.5">
                Permission
              </th>
              {roles.map((r) =>
              <th key={r} scope="col" className="px-3 py-2.5 text-center">
                  {r}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {permissions.map((p) =>
            <tr key={p.label} className="transition-colors duration-150 ease-out hover:bg-subtle/50">
                <td className="px-5 py-3">
                  <p className="text-base font-medium text-ink">{p.label}</p>
                  <p className="mt-0.5 text-xs text-ink-muted">{p.plain}</p>
                </td>
                {roles.map((r) =>
              <td key={r} className="px-3 py-3 text-center">
                    <Cell value={p.allowed[r]} />
                  </td>
              )}
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="flex items-start gap-2 border-t border-border px-5 py-3.5 text-xs text-ink-muted">
        <ShieldCheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-subtle" aria-hidden />
        “Own requisitions only” means the person sees jobs where they are the hiring manager, plus the candidates
        in those pipelines.
      </p>
    </Panel>);

}

function Cell({ value }: {value: boolean | 'own';}) {
  if (value === 'own') {
    return (
      <span className="inline-flex h-5 items-center rounded border border-warning/30 bg-warning-soft px-1.5 text-2xs font-medium text-warning-fg">
        Own only
      </span>);

  }
  return value ?
  <span
    className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-success-soft text-success-fg"
    role="img"
    aria-label="Allowed">
    
      <CheckIcon className="h-3 w-3" />
    </span> :

  <span
    className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-subtle text-ink-subtle"
    role="img"
    aria-label="Not allowed">
    
      <MinusIcon className="h-3 w-3" />
    </span>;

}