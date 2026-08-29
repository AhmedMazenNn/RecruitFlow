import React, { useMemo, useState } from 'react';
import { BriefcaseBusinessIcon, PlusIcon, SearchXIcon, SlidersHorizontalIcon } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Panel } from '../components/ui/Panel';
import { Button } from '../components/ui/Button';
import { SearchInput } from '../components/ui/SearchInput';
import { Select } from '../components/ui/Select';
import { Tabs } from '../components/ui/Tabs';
import { EmptyState } from '../components/ui/EmptyState';
import { Pagination } from '../components/ui/Pagination';
import { SkeletonRows } from '../components/ui/Skeleton';
import { JobList } from '../components/jobs/JobList';
import { jobs as allJobs } from '../data/jobs';
import { useUi } from '../contexts/UiContext';
import type { JobStatus } from '../types/recruiting';

const statusTabs = [
{ id: 'all', label: 'All' },
{ id: 'open', label: 'Open' },
{ id: 'draft', label: 'Draft' },
{ id: 'paused', label: 'Paused' },
{ id: 'closed', label: 'Closed' }];


const PAGE_SIZE = 6;

export function Jobs() {
  const { open } = useUi();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [department, setDepartment] = useState('all');
  const [sort, setSort] = useState('recent');
  const [page, setPage] = useState(1);
  const [loading] = useState(false);

  const departments = useMemo(
    () => Array.from(new Set(allJobs.map((j) => j.department))).sort(),
    []
  );

  const filtered = useMemo(() => {
    const list = allJobs.filter((j) => {
      const matchesQuery =
      query.trim().length === 0 ||
      `${j.title} ${j.department} ${j.location} ${j.hiringManager.name}`.
      toLowerCase().
      includes(query.toLowerCase());
      const matchesStatus = status === 'all' || j.status === status as JobStatus;
      const matchesDept = department === 'all' || j.department === department;
      return matchesQuery && matchesStatus && matchesDept;
    });
    return [...list].sort((a, b) => {
      if (sort === 'candidates') return b.candidateCount - a.candidateCount;
      if (sort === 'title') return a.title.localeCompare(b.title);
      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [query, status, department, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const tabs = statusTabs.map((t) => ({
    ...t,
    count: t.id === 'all' ? allJobs.length : allJobs.filter((j) => j.status === t.id).length
  }));

  return (
    <div className="pb-10">
      <PageHeader
        title="Jobs"
        description="Every requisition in Northwind Labs, with live pipeline volume."
        actions={
        <Button variant="primary" iconLeft={<PlusIcon className="h-4 w-4" />} onClick={() => open('create-job')}>
            Create job
          </Button>
        } />
      

      <div className="px-4 pt-5 lg:px-7">
        <Panel>
          <div className="flex flex-col gap-3 px-4 pt-3.5 lg:px-5">
            <Tabs
              tabs={tabs}
              active={status}
              onChange={(id) => {
                setStatus(id);
                setPage(1);
              }}
              ariaLabel="Filter jobs by status" />
            
            <div className="flex flex-col gap-2 pb-3.5 sm:flex-row sm:items-center">
              <SearchInput
                id="jobs-search"
                label="Search jobs"
                placeholder="Search by title, location or hiring manager…"
                value={query}
                onChange={(v) => {
                  setQuery(v);
                  setPage(1);
                }}
                className="sm:max-w-xs" />
              
              <div className="flex items-center gap-2 sm:ml-auto">
                <div className="w-40">
                  <label htmlFor="dept-filter" className="sr-only">
                    Filter by department
                  </label>
                  <Select
                    id="dept-filter"
                    size="sm"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    options={[
                    { value: 'all', label: 'All departments' },
                    ...departments.map((d) => ({ value: d, label: d }))]
                    } />
                  
                </div>
                <div className="w-40">
                  <label htmlFor="sort-jobs" className="sr-only">
                    Sort jobs
                  </label>
                  <Select
                    id="sort-jobs"
                    size="sm"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    options={[
                    { value: 'recent', label: 'Newest first' },
                    { value: 'candidates', label: 'Most candidates' },
                    { value: 'title', label: 'Title A–Z' }]
                    } />
                  
                </div>
                <Button variant="secondary" size="sm" iconLeft={<SlidersHorizontalIcon className="h-3.5 w-3.5" />}>
                  More filters
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-border">
            {loading ?
            <SkeletonRows rows={5} /> :
            filtered.length === 0 ?
            query || department !== 'all' || status !== 'all' ?
            <EmptyState
              icon={<SearchXIcon className="h-5 w-5" />}
              title="No jobs match these filters"
              description="Try a different status, department or search term to widen the results."
              action={
              <Button
                variant="secondary"
                onClick={() => {
                  setQuery('');
                  setStatus('all');
                  setDepartment('all');
                }}>
                
                      Clear filters
                    </Button>
              } /> :


            <EmptyState
              icon={<BriefcaseBusinessIcon className="h-5 w-5" />}
              title="No jobs yet"
              description="Create your first requisition to start collecting applications and building a pipeline."
              action={
              <Button variant="primary" onClick={() => open('create-job')}>
                      Create job
                    </Button>
              } /> :



            <>
                <JobList jobs={visible} />
                <Pagination
                page={current}
                pageCount={pageCount}
                total={filtered.length}
                pageSize={PAGE_SIZE}
                onPage={setPage} />
              
              </>
            }
          </div>
        </Panel>
      </div>
    </div>);

}