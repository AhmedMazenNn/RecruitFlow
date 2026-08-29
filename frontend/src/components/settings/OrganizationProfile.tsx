import React, { useState } from 'react';
import { toast } from 'sonner';
import { Panel, PanelHeader } from '../ui/Panel';
import { Button } from '../ui/Button';
import { Field, Input, Textarea } from '../ui/Input';
import { Select } from '../ui/Select';
import { LogoMark } from '../brand/Logo';

export function OrganizationProfile() {
  const [dirty, setDirty] = useState(false);

  return (
    <Panel as="section">
      <PanelHeader
        title="Organization profile"
        description="Shown on your careers page and in candidate emails."
        as="h2"
        action={
        <>
            {dirty && <span className="text-xs font-medium text-warning-fg">Unsaved changes</span>}
            <Button
            variant="primary"
            size="sm"
            disabled={!dirty}
            onClick={() => {
              setDirty(false);
              toast.success('Organization profile saved');
            }}>
            
              Save changes
            </Button>
          </>
        } />
      
      <div className="border-t border-border p-5">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-canvas">
            <LogoMark className="h-9 w-9" />
          </span>
          <div>
            <p className="text-base font-medium text-ink">Company logo</p>
            <p className="mt-0.5 text-xs text-ink-subtle">SVG or PNG, at least 256×256px</p>
            <div className="mt-2 flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setDirty(true)}>
                Replace
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setDirty(true)}>
                Remove
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Organization name" htmlFor="o-name" required>
            <Input id="o-name" defaultValue="Northwind Labs" onChange={() => setDirty(true)} />
          </Field>
          <Field label="Careers page URL" htmlFor="o-url" hint="jobs.recruitflow.io/northwind">
            <Input id="o-url" defaultValue="northwind" onChange={() => setDirty(true)} />
          </Field>
          <Field label="Industry" htmlFor="o-industry">
            <Select
              id="o-industry"
              onChange={() => setDirty(true)}
              options={[
              { value: 'software', label: 'Software & Technology' },
              { value: 'finance', label: 'Financial Services' },
              { value: 'health', label: 'Healthcare' },
              { value: 'other', label: 'Other' }]
              } />
            
          </Field>
          <Field label="Default timezone" htmlFor="o-tz">
            <Select
              id="o-tz"
              onChange={() => setDirty(true)}
              options={[
              { value: 'cairo', label: 'Africa/Cairo (GMT+2)' },
              { value: 'london', label: 'Europe/London (GMT+1)' },
              { value: 'berlin', label: 'Europe/Berlin (GMT+2)' },
              { value: 'ny', label: 'America/New_York (GMT-4)' }]
              } />
            
          </Field>
          <Field label="Company description" htmlFor="o-desc" className="sm:col-span-2">
            <Textarea
              id="o-desc"
              defaultValue="Northwind Labs builds infrastructure tooling for engineering teams. We are 180 people across Cairo, Berlin and London."
              onChange={() => setDirty(true)} />
            
          </Field>
        </div>
      </div>
    </Panel>);

}