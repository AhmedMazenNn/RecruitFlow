import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { ComingSoon } from '../components/ui/ComingSoon';

export function Pipeline() {
  return (
    <div>
      <PageHeader
        title="Pipeline"
        description="Every active candidate across all open requisitions." />

      <ComingSoon title="Pipeline" />
    </div>
  );
}
