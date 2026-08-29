import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';
import { ComingSoon } from '../components/ui/ComingSoon';

export function CandidateProfile() {
  return (
    <div className="pb-10">
      <div className="border-b border-border bg-surface px-4 pb-5 pt-4 lg:px-7">
        <Link
          to="/candidates"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-subtle transition-colors duration-150 ease-out hover:text-ink">
          <ArrowLeftIcon className="h-3.5 w-3.5" aria-hidden />
          All candidates
        </Link>
      </div>

      <ComingSoon />
    </div>
  );
}
