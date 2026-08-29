import React from 'react';
import { Panel } from '../ui/Panel';
import { ComingSoon } from '../ui/ComingSoon';

export function TeamMembers() {
  return (
    <>
      <Panel as="section">
        <ComingSoon
          title="Team members"
          description="Team management is not built yet. It will appear here once the backend API lands." />
      </Panel>
    </>);

}
