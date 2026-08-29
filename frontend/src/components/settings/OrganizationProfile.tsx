import React from 'react';
import { Panel } from '../ui/Panel';
import { ComingSoon } from '../ui/ComingSoon';

export function OrganizationProfile() {
  return (
    <Panel as="section">
      <ComingSoon
        title="Organization profile"
        description="Organization settings are not built yet. They will appear here once the backend API lands." />
    </Panel>);

}
