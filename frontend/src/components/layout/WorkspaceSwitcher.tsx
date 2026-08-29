import React from 'react';
import { ChevronsUpDownIcon } from 'lucide-react';

const workspace = {
  name: 'RecruitFlow',
  plan: 'Scale',
  initials: 'RF',
  color: '#4F46E5'
};

export function WorkspaceSwitcher() {
  return (
    <button
      type="button"
      aria-haspopup="menu"
      className="flex w-full items-center gap-2.5 rounded-md border border-transparent px-2 py-1.5 text-left transition-colors duration-150 ease-out hover:border-border hover:bg-surface">
      <span
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-[10px] font-bold text-white"
        style={{ backgroundColor: workspace.color }}
        aria-hidden>
        {workspace.initials}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-ink">{workspace.name}</span>
        <span className="block truncate text-2xs text-ink-subtle">{workspace.plan} plan</span>
      </span>
      <ChevronsUpDownIcon className="h-3.5 w-3.5 shrink-0 text-ink-subtle" aria-hidden />
    </button>
  );
}
