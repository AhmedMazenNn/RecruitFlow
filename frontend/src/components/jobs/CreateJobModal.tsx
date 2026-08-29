import React, { useState } from 'react';
import { toast } from 'sonner';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Field, Input, Textarea } from '../ui/Input';
import { Select } from '../ui/Select';
import { Alert } from '../ui/Alert';

export function CreateJobModal({ open, onClose }: {open: boolean;onClose: () => void;}) {
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [touched, setTouched] = useState(false);

  const invalid = touched && title.trim().length === 0;

  const submit = (publish: boolean) => {
    setTouched(true);
    if (title.trim().length === 0) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      onClose();
      setTitle('');
      setTouched(false);
      toast.success(publish ? 'Job published' : 'Draft saved', {
        description: publish ?
        `${title} is now open and accepting applications.` :
        `${title} was saved as a draft. Publish it when you are ready.`
      });
    }, 900);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create job"
      description="Set up the requisition. You can refine the description and pipeline afterwards."
      size="lg"
      footer={
      <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={() => submit(false)} loading={saving}>
            Save as draft
          </Button>
          <Button variant="primary" onClick={() => submit(true)} loading={saving}>
            Publish job
          </Button>
        </>
      }>
      
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Job title"
          htmlFor="j-title"
          required
          className="sm:col-span-2"
          error={invalid ? 'A job title is required before publishing.' : undefined}>
          
          <Input
            id="j-title"
            value={title}
            invalid={invalid}
            onBlur={() => setTouched(true)}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Senior Backend Engineer" />
          
        </Field>
        <Field label="Department" htmlFor="j-dept" required>
          <Select
            id="j-dept"
            options={[
            { value: 'engineering', label: 'Engineering' },
            { value: 'design', label: 'Design' },
            { value: 'sales', label: 'Sales' },
            { value: 'cs', label: 'Customer Success' },
            { value: 'people', label: 'People' }]
            } />
          
        </Field>
        <Field label="Hiring manager" htmlFor="j-hm" required>
          <Select
            id="j-hm"
            options={[
            { value: 'layla', label: 'Layla Hassan' },
            { value: 'marco', label: 'Marco Bianchi' },
            { value: 'sven', label: 'Sven Larsson' },
            { value: 'grace', label: 'Grace Adeyemi' }]
            } />
          
        </Field>
        <Field label="Location" htmlFor="j-loc">
          <Input id="j-loc" placeholder="e.g. Remote — EMEA" />
        </Field>
        <Field label="Work mode" htmlFor="j-mode">
          <Select
            id="j-mode"
            options={[
            { value: 'remote', label: 'Remote' },
            { value: 'hybrid', label: 'Hybrid' },
            { value: 'onsite', label: 'On-site' }]
            } />
          
        </Field>
        <Field label="Employment type" htmlFor="j-type">
          <Select
            id="j-type"
            options={[
            { value: 'ft', label: 'Full-time' },
            { value: 'pt', label: 'Part-time' },
            { value: 'contract', label: 'Contract' },
            { value: 'intern', label: 'Internship' }]
            } />
          
        </Field>
        <Field label="Openings" htmlFor="j-openings">
          <Input id="j-openings" type="number" min={1} defaultValue={1} />
        </Field>
        <Field label="Salary range" htmlFor="j-salary" hint="Shown on the careers page" className="sm:col-span-2">
          <div className="flex items-center gap-2">
            <Input id="j-salary" placeholder="95,000" />
            <span className="text-sm text-ink-subtle">to</span>
            <Input aria-label="Maximum salary" placeholder="130,000" />
            <Select
              aria-label="Currency"
              className="w-28"
              options={[
              { value: 'usd', label: 'USD' },
              { value: 'eur', label: 'EUR' },
              { value: 'gbp', label: 'GBP' }]
              } />
            
          </div>
        </Field>
        <Field label="Description" htmlFor="j-desc" className="sm:col-span-2">
          <Textarea id="j-desc" placeholder="What the role owns, who they work with, and what success looks like." />
        </Field>
      </div>
      <Alert tone="info" title="Pipeline template" className="mt-4">
        This job will use the <span className="font-medium">Engineering — 5 stage</span> pipeline. You can change
        the stages from the job’s settings once created.
      </Alert>
    </Modal>);

}