import React from 'react';
import { XIcon } from 'lucide-react';
import { Select } from '../ui/Select';
import { cn } from '../../utils/cn';

export interface FilterState {
  skill: string;
  experience: string;
  location: string;
  job: string;
  stage: string;
  tag: string;
  added: string;
}

export const emptyFilters: FilterState = {
  skill: 'all',
  experience: 'all',
  location: 'all',
  job: 'all',
  stage: 'all',
  tag: 'all',
  added: 'all'
};

interface Props {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  options: {
    skills: string[];
    locations: string[];
    jobs: {value: string;label: string;}[];
    stages: {value: string;label: string;}[];
    tags: string[];
  };
}

const labels: Record<keyof FilterState, string> = {
  skill: 'Skill',
  experience: 'Experience',
  location: 'Location',
  job: 'Job',
  stage: 'Stage',
  tag: 'Tag',
  added: 'Date added'
};

export function CandidateFilters({ filters, onChange, options }: Props) {
  const set = (key: keyof FilterState) => (e: React.ChangeEvent<HTMLSelectElement>) =>
  onChange({ ...filters, [key]: e.target.value });

  const active = (Object.keys(filters) as (keyof FilterState)[]).filter((k) => filters[k] !== 'all');

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-7">
        <FilterSelect
          id="f-skill"
          label={labels.skill}
          value={filters.skill}
          onChange={set('skill')}
          options={[{ value: 'all', label: 'Any skill' }, ...options.skills.map((s) => ({ value: s, label: s }))]} />
        
        <FilterSelect
          id="f-exp"
          label={labels.experience}
          value={filters.experience}
          onChange={set('experience')}
          options={[
          { value: 'all', label: 'Any experience' },
          { value: '0-3', label: '0–3 years' },
          { value: '4-6', label: '4–6 years' },
          { value: '7+', label: '7+ years' }]
          } />
        
        <FilterSelect
          id="f-loc"
          label={labels.location}
          value={filters.location}
          onChange={set('location')}
          options={[
          { value: 'all', label: 'Any location' },
          ...options.locations.map((l) => ({ value: l, label: l }))]
          } />
        
        <FilterSelect id="f-job" label={labels.job} value={filters.job} onChange={set('job')} options={[{ value: 'all', label: 'Any job' }, ...options.jobs]} />
        <FilterSelect
          id="f-stage"
          label={labels.stage}
          value={filters.stage}
          onChange={set('stage')}
          options={[{ value: 'all', label: 'Any stage' }, ...options.stages]} />
        
        <FilterSelect
          id="f-tag"
          label={labels.tag}
          value={filters.tag}
          onChange={set('tag')}
          options={[{ value: 'all', label: 'Any tag' }, ...options.tags.map((t) => ({ value: t, label: t }))]} />
        
        <FilterSelect
          id="f-added"
          label={labels.added}
          value={filters.added}
          onChange={set('added')}
          options={[
          { value: 'all', label: 'Any time' },
          { value: '7', label: 'Last 7 days' },
          { value: '30', label: 'Last 30 days' },
          { value: '90', label: 'Last 90 days' }]
          } />
        
      </div>

      {active.length > 0 &&
      <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-ink-subtle">Active filters</span>
          {active.map((key) =>
        <span
          key={key}
          className={cn(
            'inline-flex h-6 items-center gap-1.5 rounded border border-brand/25 bg-brand-soft px-2 text-xs font-medium text-brand'
          )}>
          
              {labels[key]}: {filters[key]}
              <button
            type="button"
            onClick={() => onChange({ ...filters, [key]: 'all' })}
            aria-label={`Remove ${labels[key]} filter`}
            className="rounded p-0.5 transition-colors duration-150 ease-out hover:bg-brand/15">
            
                <XIcon className="h-3 w-3" />
              </button>
            </span>
        )}
          <button
          type="button"
          onClick={() => onChange(emptyFilters)}
          className="text-xs font-semibold text-ink-muted underline-offset-2 transition-colors duration-150 ease-out hover:text-ink hover:underline">
          
            Clear all
          </button>
        </div>
      }
    </div>);

}

function FilterSelect({
  id,
  label,
  value,
  onChange,
  options






}: {id: string;label: string;value: string;onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;options: {value: string;label: string;}[];}) {
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Select id={id} size="sm" value={value} onChange={onChange} options={options} />
    </div>);

}