import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { ComingSoon } from '../components/ui/ComingSoon';

export function Candidates() {
  return (
    <div className="pb-10">
      <PageHeader
        title="Candidates"
        description="Search every person in the workspace by skill, stage, location or tag." />

      <ComingSoon />
    </div>
  );
}
