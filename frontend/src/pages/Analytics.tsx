import React, { useState } from 'react';
import { DownloadIcon } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { ComingSoon } from '../components/ui/ComingSoon';

export function Analytics() {
  const [range, setRange] = useState('90');

  return (
    <div className="pb-10">
      <PageHeader
        title="Analytics"
        description="Where hiring is slowing down, and which channels are actually producing hires."
        actions={
        <>
            <div className="w-40">
              <label htmlFor="range" className="sr-only">
                Date range
              </label>
              <Select
              id="range"
              value={range}
              onChange={(e) => setRange(e.target.value)}
              options={[
              { value: '30', label: 'Last 30 days' },
              { value: '90', label: 'Last 90 days' },
              { value: '365', label: 'Last 12 months' }]
              } />
            
            </div>
            <Button variant="secondary" iconLeft={<DownloadIcon className="h-4 w-4" />}>
              Export
            </Button>
          </>
        } />

      <div className="px-4 pt-5 lg:px-7">
        <ComingSoon />
      </div>
    </div>);

}
