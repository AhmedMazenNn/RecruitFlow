import React, { useState } from 'react';
import { toast } from 'sonner';
import { EyeOffIcon, LockIcon, MessageSquarePlusIcon, UsersIcon } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Input';
import { Select } from '../ui/Select';
import { EmptyState } from '../ui/EmptyState';
import type { CandidateNote } from '../../types/recruiting';

const visibility: Record<
  CandidateNote['visibility'],
  {label: string;icon: React.ReactNode;tone: 'neutral' | 'warning' | 'brand';}> =
{
  team: { label: 'Visible to hiring team', icon: <UsersIcon className="h-3 w-3" />, tone: 'neutral' },
  private: { label: 'Private to you', icon: <LockIcon className="h-3 w-3" />, tone: 'warning' },
  'hiring-manager': {
    label: 'Recruiters + hiring manager',
    icon: <EyeOffIcon className="h-3 w-3" />,
    tone: 'brand'
  }
};

export function CandidateNotes({ notes: initial }: {notes: CandidateNote[];}) {
  const [notes, setNotes] = useState(initial);
  const [draft, setDraft] = useState('');
  const [scope, setScope] = useState<CandidateNote['visibility']>('team');

  const submit = () => {
    if (!draft.trim()) return;
    setNotes([
    {
      id: `n-${Date.now()}`,
      author: 'Nadia Fouad',
      avatarColor: '#4F46E5',
      at: 'Just now',
      visibility: scope,
      body: draft.trim()
    },
    ...notes]
    );
    setDraft('');
    toast.success('Note added', { description: visibility[scope].label });
  };

  return (
    <div className="p-5">
      <div className="rounded-lg border border-border bg-canvas p-3.5">
        <label htmlFor="note-body" className="sr-only">
          Add a note
        </label>
        <Textarea
          id="note-body"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Share interview signal, comp expectations or next steps…"
          className="bg-surface" />
        
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:w-64">
            <label htmlFor="note-scope" className="sr-only">
              Note visibility
            </label>
            <Select
              id="note-scope"
              size="sm"
              value={scope}
              onChange={(e) => setScope(e.target.value as CandidateNote['visibility'])}
              options={[
              { value: 'team', label: 'Visible to hiring team' },
              { value: 'hiring-manager', label: 'Recruiters + hiring manager' },
              { value: 'private', label: 'Private to you' }]
              } />
            
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={submit}
            disabled={!draft.trim()}
            iconLeft={<MessageSquarePlusIcon className="h-3.5 w-3.5" />}>
            
            Add note
          </Button>
        </div>
      </div>

      {notes.length === 0 ?
      <EmptyState
        icon={<MessageSquarePlusIcon className="h-5 w-5" />}
        title="No notes yet"
        description="Notes keep interview signal in one place so the panel does not repeat questions." /> :


      <ul className="mt-4 space-y-3">
          {notes.map((n) =>
        <li key={n.id} className="rounded-lg border border-border bg-surface p-3.5">
              <div className="flex items-center gap-2.5">
                <Avatar name={n.author} color={n.avatarColor} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-base font-semibold text-ink">{n.author}</p>
                  <p className="text-xs text-ink-subtle">{n.at}</p>
                </div>
                <Badge tone={visibility[n.visibility].tone}>
                  {visibility[n.visibility].icon}
                  {visibility[n.visibility].label}
                </Badge>
              </div>
              <p className="mt-2.5 text-base leading-relaxed text-ink-muted">{n.body}</p>
            </li>
        )}
        </ul>
      }
    </div>);

}