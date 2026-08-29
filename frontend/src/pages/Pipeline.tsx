import React, { useMemo, useState } from 'react';
import { InfoIcon, UserPlusIcon } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { SearchInput } from '../components/ui/SearchInput';
import { Badge } from '../components/ui/Badge';
import { KanbanBoard } from '../components/pipeline/KanbanBoard';
import { candidates as allCandidates } from '../data/candidates';
import { jobs } from '../data/jobs';
import { useUi } from '../contexts/UiContext';

export function Pipeline() {
  const { open } = useUi();
  const [jobId, setJobId] = useState('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () =>
    allCandidates.filter((c) => {
      const matchesJob = jobId === 'all' || c.primaryJobId === jobId;
      const matchesQuery =
      query.trim().length === 0 ||
      `${c.name} ${c.title} ${c.skills.join(' ')}`.toLowerCase().includes(query.toLowerCase());
      return matchesJob && matchesQuery;
    }),
    [jobId, query]
  );

  const activeJob = jobs.find((j) => j.id === jobId);

  return (
    <div>
      <PageHeader
        title="Pipeline"
        description={
        activeJob ?
        `${activeJob.title} · ${activeJob.department} · ${activeJob.openings} opening${activeJob.openings > 1 ? 's' : ''}` :
        'Every active candidate across all open requisitions.'
        }
        actions={
        <Button variant="primary" iconLeft={<UserPlusIcon className="h-4 w-4" />} onClick={() => open('add-candidate')}>
            Add candidate
          </Button>
        }
        meta={
        <>
            <div className="w-full sm:w-64">
              <label htmlFor="pipeline-job" className="sr-only">
                Filter pipeline by job
              </label>
              <Select
              id="pipeline-job"
              size="sm"
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              options={[
              { value: 'all', label: 'All open jobs' },
              ...jobs.filter((j) => j.status === 'open').map((j) => ({ value: j.id, label: j.title }))]
              } />
            
            </div>
            <SearchInput
            id="pipeline-search"
            label="Search candidates in pipeline"
            placeholder="Filter by name or skill…"
            size="sm"
            value={query}
            onChange={setQuery}
            className="w-full sm:w-64" />
          
            <Badge tone="brand">{filtered.length} candidates</Badge>
            <span className="inline-flex items-center gap-1.5 text-xs text-ink-subtle">
              <InfoIcon className="h-3.5 w-3.5" aria-hidden />
              Drag a card between columns, or use the Advance / Back buttons on a card.
            </span>
          </>
        } />
      

      <KanbanBoard key={`${jobId}-${query}`} initial={filtered} />
    </div>);

}