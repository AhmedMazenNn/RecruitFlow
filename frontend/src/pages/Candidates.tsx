import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BookmarkIcon, SearchXIcon, SparklesIcon, UserPlusIcon, UsersIcon } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Panel } from '../components/ui/Panel';
import { Button } from '../components/ui/Button';
import { SearchInput } from '../components/ui/SearchInput';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { StageBadge } from '../components/ui/StatusBadge';
import { StarRating } from '../components/ui/StarRating';
import { EmptyState } from '../components/ui/EmptyState';
import { Pagination } from '../components/ui/Pagination';
import { CandidateFilters, emptyFilters, type FilterState } from '../components/candidates/CandidateFilters';
import { candidates as allCandidates } from '../data/candidates';
import { jobs } from '../data/jobs';
import { stages } from '../data/stages';
import { daysSince, formatDate } from '../utils/format';
import { useUi } from '../contexts/UiContext';

const PAGE_SIZE = 8;

const savedSearches = ['Senior backend · EMEA', 'Referrals in Offer', 'Designers, 5+ yrs'];

export function Candidates() {
  const { open } = useUi();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [page, setPage] = useState(1);

  const options = useMemo(
    () => ({
      skills: Array.from(new Set(allCandidates.flatMap((c) => c.skills))).sort(),
      locations: Array.from(new Set(allCandidates.map((c) => c.location))).sort(),
      jobs: jobs.map((j) => ({ value: j.id, label: j.title })),
      stages: stages.map((s) => ({ value: s.id, label: s.label })),
      tags: Array.from(new Set(allCandidates.flatMap((c) => c.tags))).sort()
    }),
    []
  );

  const results = useMemo(() => {
    return allCandidates.filter((c) => {
      const haystack = `${c.name} ${c.title} ${c.location} ${c.skills.join(' ')} ${c.tags.join(' ')}`.toLowerCase();
      if (query.trim() && !haystack.includes(query.toLowerCase())) return false;
      if (filters.skill !== 'all' && !c.skills.includes(filters.skill)) return false;
      if (filters.location !== 'all' && c.location !== filters.location) return false;
      if (filters.job !== 'all' && c.primaryJobId !== filters.job) return false;
      if (filters.stage !== 'all' && c.stage !== filters.stage) return false;
      if (filters.tag !== 'all' && !c.tags.includes(filters.tag)) return false;
      if (filters.experience !== 'all') {
        const y = c.yearsExperience;
        if (filters.experience === '0-3' && y > 3) return false;
        if (filters.experience === '4-6' && (y < 4 || y > 6)) return false;
        if (filters.experience === '7+' && y < 7) return false;
      }
      if (filters.added !== 'all' && daysSince(c.appliedAt) > Number(filters.added)) return false;
      return true;
    });
  }, [query, filters]);

  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const visible = results.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <div className="pb-10">
      <PageHeader
        title="Candidates"
        description="Search every person in the workspace by skill, stage, location or tag."
        actions={
        <Button variant="primary" iconLeft={<UserPlusIcon className="h-4 w-4" />} onClick={() => open('add-candidate')}>
            Add candidate
          </Button>
        } />
      

      <div className="space-y-4 px-4 pt-5 lg:px-7">
        <Panel className="p-4 lg:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <SearchInput
              id="cand-search"
              label="Search candidates"
              placeholder="Search candidates by name, skill, location…"
              value={query}
              onChange={(v) => {
                setQuery(v);
                setPage(1);
                setParams(v ? { q: v } : {});
              }}
              className="flex-1" />
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-ink-subtle">Saved</span>
              {savedSearches.map((s) =>
              <button
                key={s}
                type="button"
                className="inline-flex h-7 items-center gap-1.5 rounded border border-border bg-surface px-2 text-xs font-medium text-ink-muted transition-colors duration-150 ease-out hover:border-strong hover:text-ink">
                
                  <BookmarkIcon className="h-3 w-3" aria-hidden />
                  {s}
                </button>
              )}
            </div>
          </div>
          <div className="mt-4 border-t border-border pt-4">
            <CandidateFilters
              filters={filters}
              options={options}
              onChange={(next) => {
                setFilters(next);
                setPage(1);
              }} />
            
          </div>
        </Panel>

        <Panel>
          <div className="flex items-center justify-between gap-3 px-4 py-3 lg:px-5">
            <p className="text-sm text-ink-muted">
              <span className="font-semibold text-ink">{results.length}</span> candidates
              {query &&
              <>
                  {' '}
                  matching <span className="font-medium text-ink">“{query}”</span>
                </>
              }
            </p>
            <Button variant="secondary" size="sm" iconLeft={<SparklesIcon className="h-3.5 w-3.5" />}>
              Rank by match
            </Button>
          </div>

          {results.length === 0 ?
          query || Object.values(filters).some((v) => v !== 'all') ?
          <EmptyState
            className="border-t border-border"
            icon={<SearchXIcon className="h-5 w-5" />}
            title="No candidates found"
            description="Nothing matches this combination of search and filters. Remove a filter or broaden the skill match."
            action={
            <Button
              variant="secondary"
              onClick={() => {
                setQuery('');
                setFilters(emptyFilters);
                setParams({});
              }}>
              
                    Reset search
                  </Button>
            } /> :


          <EmptyState
            className="border-t border-border"
            icon={<UsersIcon className="h-5 w-5" />}
            title="No candidates yet"
            description="Add your first candidate manually, upload a CV, or import a spreadsheet from your previous ATS."
            action={
            <Button variant="primary" onClick={() => open('add-candidate')}>
                    Add candidate
                  </Button>
            } /> :



          <>
              <ul className="divide-y divide-border border-t border-border">
                {visible.map((c) =>
              <li key={c.id}>
                    <Link
                  to={`/candidates/${c.id}`}
                  className="flex flex-col gap-3 px-4 py-3.5 transition-colors duration-150 ease-out hover:bg-subtle/50 lg:flex-row lg:items-center lg:px-5">
                  
                      <span className="flex min-w-0 flex-1 items-center gap-3">
                        <Avatar name={c.name} color={c.avatarColor} size="md" />
                        <span className="min-w-0">
                          <span className="block truncate text-base font-semibold text-ink">{c.name}</span>
                          <span className="mt-0.5 block truncate text-sm text-ink-muted">
                            {c.title} · {c.location} · {c.yearsExperience} yrs
                          </span>
                        </span>
                      </span>

                      <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
                        {c.skills.slice(0, 4).map((s) =>
                    <span
                      key={s}
                      className="inline-flex h-5 items-center rounded border border-border bg-canvas px-1.5 text-2xs font-medium text-ink-muted">
                      
                            {s}
                          </span>
                    )}
                        {c.skills.length > 4 &&
                    <span className="text-2xs font-medium text-ink-subtle">+{c.skills.length - 4}</span>
                    }
                      </span>

                      <span className="flex shrink-0 flex-wrap items-center gap-3 lg:w-[26rem] lg:justify-end">
                        <span className="hidden text-xs text-ink-subtle sm:block">{formatDate(c.appliedAt)}</span>
                        <StarRating value={c.rating} size="sm" label={`${c.name} rating`} />
                        <Badge tone={c.ai.score >= 85 ? 'success' : 'neutral'}>{c.ai.score}% match</Badge>
                        <span className="hidden max-w-[9rem] truncate text-xs text-ink-muted lg:block">
                          {c.primaryJobTitle}
                        </span>
                        <StageBadge stage={c.stage} />
                      </span>
                    </Link>
                  </li>
              )}
              </ul>
              <Pagination
              page={current}
              pageCount={pageCount}
              total={results.length}
              pageSize={PAGE_SIZE}
              onPage={setPage} />
            
            </>
          }
        </Panel>
      </div>
    </div>);

}