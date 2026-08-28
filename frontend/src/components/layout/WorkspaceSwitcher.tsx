import React, { useState } from 'react';
import { CheckIcon, ChevronsUpDownIcon, PlusIcon } from 'lucide-react';
import { Dropdown, type DropdownItem } from '../ui/Dropdown';
import { workspaces } from '../../data/activity';
import { cn } from '../../utils/cn';

export function WorkspaceSwitcher() {
  const [activeId, setActiveId] = useState(workspaces[0].id);
  const active = workspaces.find((w) => w.id === activeId) ?? workspaces[0];

  const items: DropdownItem[] = [
  ...workspaces.map((w) => ({
    id: w.id,
    label: w.name,
    icon:
    <span className="flex items-center gap-2">
          <span
        className="flex h-5 w-5 items-center justify-center rounded text-[9px] font-bold text-white"
        style={{ backgroundColor: w.color }}
        aria-hidden>
        
            {w.initials}
          </span>
          {w.id === activeId ?
      <CheckIcon className="h-3.5 w-3.5 text-brand" aria-label="Current workspace" /> :

      <span className="h-3.5 w-3.5" aria-hidden />
      }
        </span>,

    onSelect: () => setActiveId(w.id)
  })),
  { id: 'new', label: 'Create workspace', icon: <PlusIcon className="h-4 w-4 text-ink-subtle" /> }];


  return (
    <Dropdown
      align="left"
      width="w-64"
      items={items}
      header={
      <p className="px-2.5 pb-1.5 pt-1 text-2xs font-semibold uppercase tracking-[0.08em] text-ink-subtle">
          Workspaces
        </p>
      }
      trigger={({ toggle, open }) =>
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          'flex w-full items-center gap-2.5 rounded-md border border-transparent px-2 py-1.5 text-left',
          'transition-colors duration-150 ease-out hover:border-border hover:bg-surface',
          open && 'border-border bg-surface'
        )}>
        
          <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-[10px] font-bold text-white"
          style={{ backgroundColor: active.color }}
          aria-hidden>
          
            {active.initials}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-ink">{active.name}</span>
            <span className="block truncate text-2xs text-ink-subtle">{active.plan} plan</span>
          </span>
          <ChevronsUpDownIcon className="h-3.5 w-3.5 shrink-0 text-ink-subtle" aria-hidden />
        </button>
      } />);


}