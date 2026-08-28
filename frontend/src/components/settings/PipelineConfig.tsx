import React, { useState } from 'react';
import { toast } from 'sonner';
import { GripVerticalIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { Panel, PanelHeader } from '../ui/Panel';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Alert } from '../ui/Alert';
import { stages as defaultStages } from '../../data/stages';

export function PipelineConfig() {
  const [items, setItems] = useState(
    defaultStages.map((s) => ({ ...s, autoEmail: s.id === 'applied', required: s.id === 'applied' || s.id === 'hired' }))
  );

  return (
    <Panel as="section">
      <PanelHeader
        title="Pipeline configuration"
        description="The default stage sequence for new jobs. Individual jobs can override it."
        as="h2"
        action={
        <Button
          variant="secondary"
          size="sm"
          iconLeft={<PlusIcon className="h-3.5 w-3.5" />}
          onClick={() =>
          setItems([
          ...items.slice(0, -1),
          {
            id: `custom-${items.length}` as never,
            label: 'New stage',
            description: 'Describe what happens in this stage',
            autoEmail: false,
            required: false
          },
          items[items.length - 1]]
          )
          }>
          
            Add stage
          </Button>
        } />
      
      <ol className="divide-y divide-border border-t border-border">
        {items.map((s, i) =>
        <li key={s.id} className="flex items-center gap-3 px-5 py-3.5">
            <span className="cursor-grab text-ink-subtle" aria-hidden>
              <GripVerticalIcon className="h-4 w-4" />
            </span>
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-subtle text-2xs font-semibold text-ink-muted">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex flex-wrap items-center gap-2 text-base font-semibold text-ink">
                {s.label}
                {s.required && <Badge tone="neutral">Required</Badge>}
                {s.autoEmail && <Badge tone="info">Auto-acknowledgement email</Badge>}
              </p>
              <p className="mt-0.5 text-sm text-ink-muted">{s.description}</p>
            </div>
            <Button
            variant="ghost"
            size="icon"
            aria-label={`Remove ${s.label} stage`}
            disabled={s.required}
            onClick={() => {
              setItems(items.filter((x) => x.id !== s.id));
              toast.success(`${s.label} removed from the default pipeline`);
            }}>
            
              <Trash2Icon className="h-4 w-4" />
            </Button>
          </li>
        )}
      </ol>
      <div className="border-t border-border p-5">
        <Alert tone="warning" title="Changing stages affects reporting">
          Removing a stage keeps historical data but stops it appearing in the funnel for new jobs. Candidates
          currently in a removed stage are moved to the previous stage.
        </Alert>
      </div>
    </Panel>);

}