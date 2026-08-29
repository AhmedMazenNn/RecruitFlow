import React from 'react';
import { Panel } from '../ui/Panel';
import { ComingSoon } from '../ui/ComingSoon';

export function PipelineConfig() {
  return (
    <Panel as="section">
      <ComingSoon
        title="Pipeline configuration"
        description="Pipeline configuration is not built yet. It will appear here once the backend API lands." />
    </Panel>);

}
