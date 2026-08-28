import React, { useState } from 'react';
import { toast } from 'sonner';
import { VideoIcon } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Field, Input, Textarea } from '../ui/Input';
import { Select } from '../ui/Select';
import { candidates } from '../../data/candidates';
import { team } from '../../data/activity';

interface Props {
  open: boolean;
  onClose: () => void;
  candidateId?: string;
}

export function ScheduleInterviewModal({ open, onClose, candidateId }: Props) {
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState(candidateId ?? candidates[0].id);
  const candidate = candidates.find((c) => c.id === selected) ?? candidates[0];

  const submit = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      onClose();
      toast.success('Interview scheduled', {
        description: `Invites sent to ${candidate.name} and 2 interviewers.`
      });
    }, 900);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Schedule interview"
      description="Invites and the meeting link are sent automatically once scheduled."
      footer={
      <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" loading={saving} onClick={submit}>
            Schedule and send invites
          </Button>
        </>
      }>
      
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Candidate" htmlFor="i-cand" required className="sm:col-span-2">
          <Select
            id="i-cand"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            options={candidates.map((c) => ({ value: c.id, label: `${c.name} — ${c.primaryJobTitle}` }))} />
          
        </Field>
        <Field label="Interview type" htmlFor="i-type" required>
          <Select
            id="i-type"
            options={[
            { value: 'screening', label: 'Screening call' },
            { value: 'technical', label: 'Technical interview' },
            { value: 'design', label: 'System design' },
            { value: 'hr', label: 'HR interview' },
            { value: 'panel', label: 'Final panel' }]
            } />
          
        </Field>
        <Field label="Duration" htmlFor="i-dur">
          <Select
            id="i-dur"
            options={[
            { value: '30', label: '30 minutes' },
            { value: '45', label: '45 minutes' },
            { value: '60', label: '60 minutes' },
            { value: '90', label: '90 minutes' }]
            } />
          
        </Field>
        <Field label="Date" htmlFor="i-date" required>
          <Input id="i-date" type="date" defaultValue="2026-09-02" />
        </Field>
        <Field label="Start time" htmlFor="i-time" required>
          <Input id="i-time" type="time" defaultValue="14:00" />
        </Field>
        <Field
          label="Interviewers"
          htmlFor="i-people"
          hint="Availability is checked against connected calendars"
          className="sm:col-span-2">
          
          <Select
            id="i-people"
            multiple
            className="h-24 py-2"
            defaultValue={[team[3].name, team[4].name]}
            options={team.filter((t) => t.status === 'active').map((t) => ({ value: t.name, label: `${t.name} · ${t.role}` }))} />
          
        </Field>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-canvas px-3.5 py-3 sm:col-span-2">
          <VideoIcon className="h-4 w-4 shrink-0 text-brand" aria-hidden />
          <p className="text-sm text-ink-muted">
            A RecruitFlow meeting link will be generated and added to the invite.
          </p>
        </div>
        <Field label="Note to interviewers" htmlFor="i-note" className="sm:col-span-2">
          <Textarea id="i-note" placeholder="What to focus on, areas to probe, scorecard reminders…" />
        </Field>
      </div>
    </Modal>);

}