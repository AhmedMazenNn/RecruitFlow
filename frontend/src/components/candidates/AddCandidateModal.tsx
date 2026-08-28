import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  CheckCircle2Icon,
  FileSpreadsheetIcon,
  FileTextIcon,
  Loader2Icon,
  PencilLineIcon,
  SparklesIcon,
  UploadCloudIcon } from
'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Field, Input, Textarea } from '../ui/Input';
import { Select } from '../ui/Select';
import { Alert } from '../ui/Alert';
import { ProgressBar } from '../ui/ProgressBar';
import { Badge } from '../ui/Badge';
import { jobs } from '../../data/jobs';
import { cn } from '../../utils/cn';

type Method = 'manual' | 'cv' | 'csv';
type CvStep = 'upload' | 'processing' | 'review';

const extracted = {
  name: 'Yasmin Haddad',
  title: 'Senior Backend Engineer',
  email: 'yasmin.haddad@mail.com',
  phone: '+962 79 442 1180',
  location: 'Amman, Jordan',
  years: '6',
  skills: 'Django, PostgreSQL, Docker, Celery, AWS',
  summary:
  'Backend engineer with six years across fintech and marketplace platforms. Led a services migration covering the payments domain and owns a team of three.'
};

const methodOptions: {id: Method;label: string;description: string;icon: React.ReactNode;}[] = [
{
  id: 'manual',
  label: 'Enter manually',
  description: 'Type the details yourself — best for referrals and sourced candidates.',
  icon: <PencilLineIcon className="h-4 w-4" />
},
{
  id: 'cv',
  label: 'Upload CV',
  description: 'We extract the details from a PDF or DOCX for you to review.',
  icon: <FileTextIcon className="h-4 w-4" />
},
{
  id: 'csv',
  label: 'Import CSV',
  description: 'Bulk import from a spreadsheet or another ATS export.',
  icon: <FileSpreadsheetIcon className="h-4 w-4" />
}];


export function AddCandidateModal({ open, onClose }: {open: boolean;onClose: () => void;}) {
  const [method, setMethod] = useState<Method>('manual');
  const [cvStep, setCvStep] = useState<CvStep>('upload');
  const [progress, setProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(extracted);

  useEffect(() => {
    if (!open) {
      setMethod('manual');
      setCvStep('upload');
      setProgress(0);
      setSaving(false);
    }
  }, [open]);

  useEffect(() => {
    if (cvStep !== 'processing') return;
    setProgress(8);
    const tick = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 100;
        return p + 11;
      });
    }, 260);
    const done = setTimeout(() => setCvStep('review'), 2600);
    return () => {
      clearInterval(tick);
      clearTimeout(done);
    };
  }, [cvStep]);

  const submit = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      onClose();
      toast.success('Candidate added', {
        description: `${form.name} was added to Senior Backend Engineer · Applied.`
      });
    }, 900);
  };

  const jobOptions = jobs.
  filter((j) => j.status === 'open').
  map((j) => ({ value: j.id, label: `${j.title} · ${j.department}` }));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add candidate"
      description="Choose how you want to bring this person into the pipeline."
      size="lg"
      footer={
      method === 'cv' && cvStep === 'processing' ?
      <Button variant="secondary" onClick={() => setCvStep('upload')}>
            Cancel processing
          </Button> :

      <>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            {method === 'csv' ?
        <Button variant="primary" disabled>
                Import 0 candidates
              </Button> :

        <Button variant="primary" loading={saving} onClick={submit} disabled={method === 'cv' && cvStep !== 'review'}>
                {method === 'cv' ? 'Confirm and create candidate' : 'Create candidate'}
              </Button>
        }
          </>

      }>
      
      <fieldset className="mb-5">
        <legend className="mb-2 text-sm font-medium text-ink">How are you adding this candidate?</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {methodOptions.map((m) => {
            const selected = method === m.id;
            return (
              <label
                key={m.id}
                className={cn(
                  'cursor-pointer rounded-lg border p-3 transition-[border-color,background-color] duration-150 ease-out',
                  selected ? 'border-brand bg-brand-soft' : 'border-border bg-surface hover:border-strong'
                )}>
                
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="add-method"
                    value={m.id}
                    checked={selected}
                    onChange={() => {
                      setMethod(m.id);
                      setCvStep('upload');
                    }}
                    className="h-3.5 w-3.5 accent-[rgb(var(--rf-brand))]" />
                  
                  <span className={cn(selected ? 'text-brand' : 'text-ink-subtle')} aria-hidden>
                    {m.icon}
                  </span>
                  <span className="text-base font-semibold text-ink">{m.label}</span>
                </span>
                <span className="mt-1.5 block text-xs leading-relaxed text-ink-muted">{m.description}</span>
              </label>);

          })}
        </div>
      </fieldset>

      {method === 'manual' &&
      <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" htmlFor="c-name" required>
            <Input id="c-name" placeholder="e.g. Yasmin Haddad" />
          </Field>
          <Field label="Current title" htmlFor="c-title">
            <Input id="c-title" placeholder="e.g. Senior Backend Engineer" />
          </Field>
          <Field label="Email" htmlFor="c-email" required>
            <Input id="c-email" type="email" placeholder="name@company.com" />
          </Field>
          <Field label="Phone" htmlFor="c-phone">
            <Input id="c-phone" placeholder="+20 100 000 0000" />
          </Field>
          <Field label="Location" htmlFor="c-loc">
            <Input id="c-loc" placeholder="City, Country" />
          </Field>
          <Field label="Apply to job" htmlFor="c-job" required>
            <Select id="c-job" options={jobOptions} />
          </Field>
          <Field label="Skills" htmlFor="c-skills" hint="Comma separated" className="sm:col-span-2">
            <Input id="c-skills" placeholder="Django, PostgreSQL, Docker" />
          </Field>
        </div>
      }

      {method === 'csv' &&
      <div className="space-y-4">
          <div className="rounded-xl border border-dashed border-strong bg-canvas px-6 py-10 text-center">
            <FileSpreadsheetIcon className="mx-auto h-5 w-5 text-ink-subtle" aria-hidden />
            <p className="mt-3 text-base font-semibold text-ink">Drop a CSV file here</p>
            <p className="mt-1 text-sm text-ink-muted">Up to 5,000 rows. Columns are mapped in the next step.</p>
            <Button variant="secondary" size="sm" className="mt-4">
              Choose file
            </Button>
          </div>
          <Alert tone="info" title="Nothing selected yet">
            Import stays disabled until a file is attached and its columns are mapped to RecruitFlow fields.
          </Alert>
        </div>
      }

      {method === 'cv' && cvStep === 'upload' &&
      <div className="space-y-4">
          <button
          type="button"
          onClick={() => setCvStep('processing')}
          className="w-full rounded-xl border border-dashed border-strong bg-canvas px-6 py-10 text-center transition-colors duration-150 ease-out hover:border-brand hover:bg-brand-soft/40">
          
            <UploadCloudIcon className="mx-auto h-5 w-5 text-ink-subtle" aria-hidden />
            <span className="mt-3 block text-base font-semibold text-ink">Upload a CV</span>
            <span className="mt-1 block text-sm text-ink-muted">PDF or DOCX, up to 10 MB</span>
          </button>
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-subtle">
            {['Upload', 'Processing', 'Extract details', 'Review', 'Create'].map((s, i) =>
          <li key={s} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden>→</span>}
                <span className={cn(i === 0 && 'font-semibold text-ink')}>{s}</span>
              </li>
          )}
          </ol>
        </div>
      }

      {method === 'cv' && cvStep === 'processing' &&
      <div className="rounded-xl border border-border bg-canvas px-6 py-10 text-center">
          <motion.span
          className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand"
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}>
          
            <Loader2Icon className="h-5 w-5 animate-spin" aria-hidden />
          </motion.span>
          <p className="mt-4 text-base font-semibold text-ink">Reading yasmin-haddad-cv.pdf</p>
          <p className="mt-1 text-sm text-ink-muted">
            Extracting contact details, experience, education and skills.
          </p>
          <ProgressBar value={Math.min(progress, 100)} label="CV processing" className="mx-auto mt-5 max-w-xs" />
          <p className="mt-2 text-xs text-ink-subtle" role="status">
            {Math.min(progress, 100)}% · usually takes under 10 seconds
          </p>
        </div>
      }

      {method === 'cv' && cvStep === 'review' &&
      <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg border border-accent/25 bg-accent-soft px-3.5 py-3">
            <SparklesIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
            <div className="min-w-0">
              <p className="flex flex-wrap items-center gap-2 text-base font-semibold text-ink">
                Extracted from CV
                <Badge tone="accent">AI-assisted</Badge>
              </p>
              <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                Every field below is editable and nothing is saved until you confirm. Fields we were less
                certain about are marked <span className="font-medium text-ink">Check</span>.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" htmlFor="e-name" required>
              <Input id="e-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Current title" htmlFor="e-title">
              <Input id="e-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </Field>
            <Field label="Email" htmlFor="e-email" required>
              <Input id="e-email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Field>
            <Field label="Phone" htmlFor="e-phone" hint="Check — low confidence in the source document">
              <Input id="e-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </Field>
            <Field label="Location" htmlFor="e-loc">
              <Input id="e-loc" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </Field>
            <Field label="Years of experience" htmlFor="e-years">
              <Input id="e-years" value={form.years} onChange={(e) => setForm({ ...form, years: e.target.value })} />
            </Field>
            <Field label="Skills" htmlFor="e-skills" className="sm:col-span-2">
              <Input id="e-skills" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
            </Field>
            <Field label="Summary" htmlFor="e-summary" className="sm:col-span-2">
              <Textarea
              id="e-summary"
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })} />
            
            </Field>
            <Field label="Apply to job" htmlFor="e-job" required className="sm:col-span-2">
              <Select id="e-job" options={jobOptions} />
            </Field>
          </div>

          <p className="flex items-center gap-2 text-xs text-ink-subtle">
            <CheckCircle2Icon className="h-3.5 w-3.5 text-success" aria-hidden />
            Original file will be attached to the candidate as their resume.
          </p>
        </div>
      }
    </Modal>);

}