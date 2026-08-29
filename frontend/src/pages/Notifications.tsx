import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { ComingSoon } from '../components/ui/ComingSoon';

export function Notifications() {
  return (
    <div className="pb-10">
      <PageHeader
        title="Notifications"
        description="Everything that happened while you were away, newest first." />

      <div className="mx-auto max-w-3xl px-4 pt-5 lg:px-7">
        <ComingSoon />
      </div>
    </div>);

}
