import React, { useState } from 'react';
import { toast } from 'sonner';
import { MoreHorizontalIcon, UserPlusIcon } from 'lucide-react';
import { Panel, PanelHeader } from '../ui/Panel';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Dropdown } from '../ui/Dropdown';
import { Modal } from '../ui/Modal';
import { Field, Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { team } from '../../data/activity';

const statusTone = {
  active: 'success',
  invited: 'warning',
  deactivated: 'neutral'
} as const;

export function TeamMembers() {
  const [inviting, setInviting] = useState(false);

  return (
    <>
      <Panel as="section">
        <PanelHeader
          title="Team members"
          description={`${team.filter((t) => t.status === 'active').length} active · 2 seats remaining on the Scale plan`}
          as="h2"
          action={
          <Button
            variant="primary"
            size="sm"
            iconLeft={<UserPlusIcon className="h-3.5 w-3.5" />}
            onClick={() => setInviting(true)}>
            
              Invite people
            </Button>
          } />
        
        <ul className="divide-y divide-border border-t border-border">
          {team.map((m) =>
          <li key={m.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
              <Avatar name={m.name} color={m.avatarColor} size="md" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-semibold text-ink">{m.name}</p>
                <p className="truncate text-sm text-ink-muted">{m.email}</p>
              </div>
              <Badge tone={statusTone[m.status]} dot>
                {m.status}
              </Badge>
              <span className="w-36 text-sm text-ink-muted">{m.role}</span>
              <span className="hidden w-24 text-xs text-ink-subtle sm:block">{m.lastActive}</span>
              <Dropdown
              items={[
              { id: 'role', label: 'Change role' },
              { id: 'resend', label: 'Resend invite', disabled: m.status !== 'invited' },
              {
                id: 'remove',
                label: m.status === 'deactivated' ? 'Delete member' : 'Deactivate member',
                danger: true,
                disabled: m.role === 'Owner',
                onSelect: () => toast.success(`${m.name} deactivated`)
              }]
              }
              trigger={({ toggle, open }) =>
              <button
                type="button"
                onClick={toggle}
                aria-label={`Manage ${m.name}`}
                aria-expanded={open}
                className="rounded p-1.5 text-ink-subtle transition-colors duration-150 ease-out hover:bg-subtle hover:text-ink">
                
                    <MoreHorizontalIcon className="h-4 w-4" />
                  </button>
              } />
            
            </li>
          )}
        </ul>
      </Panel>

      <Modal
        open={inviting}
        onClose={() => setInviting(false)}
        title="Invite people"
        description="Invited people receive an email and appear as pending until they accept."
        footer={
        <>
            <Button variant="ghost" onClick={() => setInviting(false)}>
              Cancel
            </Button>
            <Button
            variant="primary"
            onClick={() => {
              setInviting(false);
              toast.success('Invitations sent');
            }}>
            
              Send invitations
            </Button>
          </>
        }>
        
        <div className="space-y-4">
          <Field label="Email addresses" htmlFor="inv-email" hint="Separate multiple addresses with commas" required>
            <Input id="inv-email" placeholder="name@northwind.io, other@northwind.io" />
          </Field>
          <Field label="Role" htmlFor="inv-role" required>
            <Select
              id="inv-role"
              options={[
              { value: 'recruiter', label: 'Recruiter — full pipeline access' },
              { value: 'hm', label: 'Hiring Manager — own requisitions only' },
              { value: 'interviewer', label: 'Interviewer — assigned interviews only' },
              { value: 'admin', label: 'Admin — full access including billing' }]
              } />
            
          </Field>
        </div>
      </Modal>
    </>);

}