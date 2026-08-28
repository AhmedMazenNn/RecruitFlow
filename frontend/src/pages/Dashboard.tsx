import React from 'react';
import { BriefcaseBusinessIcon, CalendarPlusIcon, UploadIcon, UserPlusIcon } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { KpiStrip } from '../components/dashboard/KpiStrip';
import { FunnelPanel } from '../components/dashboard/FunnelPanel';
import { UpcomingInterviews } from '../components/dashboard/UpcomingInterviews';
import { NeedsAttention } from '../components/dashboard/NeedsAttention';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';
import { useUi } from '../contexts/UiContext';
import { currentUser } from '../data/activity';

export function Dashboard() {
  const { open } = useUi();
  const firstName = currentUser.name.split(' ')[0];

  return (
    <div className="pb-10">
      <PageHeader
        title={`Good morning, ${firstName}`}
        description="Friday, 28 August 2026 · 9 interviews and 3 offers are in flight this week."
        actions={
        <>
            <Button variant="secondary" iconLeft={<UploadIcon className="h-4 w-4" />} onClick={() => open('add-candidate')}>
              Import
            </Button>
            <Button
            variant="secondary"
            iconLeft={<BriefcaseBusinessIcon className="h-4 w-4" />}
            onClick={() => open('create-job')}>
            
              Create job
            </Button>
            <Button
            variant="secondary"
            iconLeft={<CalendarPlusIcon className="h-4 w-4" />}
            onClick={() => open('schedule-interview')}>
            
              Schedule
            </Button>
            <Button variant="primary" iconLeft={<UserPlusIcon className="h-4 w-4" />} onClick={() => open('add-candidate')}>
              Add candidate
            </Button>
          </>
        } />
      

      <div className="space-y-4 px-4 pt-5 lg:px-7">
        <KpiStrip />

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <FunnelPanel />
          </div>
          <UpcomingInterviews />
          <div className="lg:col-span-2">
            <NeedsAttention />
          </div>
          <ActivityFeed />
        </div>
      </div>
    </div>);

}