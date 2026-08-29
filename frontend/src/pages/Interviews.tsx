import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { ComingSoon } from '../components/ui/ComingSoon';

export function Interviews() {
  return (
    <div className="pb-10">
      <PageHeader
        title="Interviews"
        description="Every scheduled round, who is running it, and which scorecards are still missing." />

      <ComingSoon title="Interviews" />
    </div>
  );
}
