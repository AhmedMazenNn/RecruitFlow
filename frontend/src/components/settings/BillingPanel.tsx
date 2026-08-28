import React from 'react';
import { LockKeyholeIcon } from 'lucide-react';
import { Panel } from '../ui/Panel';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';

export function BillingPanel() {
  return (
    <Panel as="section">
      <EmptyState
        icon={<LockKeyholeIcon className="h-5 w-5" />}
        title="You do not have access to billing"
        description="Billing is restricted to Owners and Admins with the finance permission. Nadia Fouad can grant access, or you can ask them to make the change."
        action={<Button variant="primary">Request access</Button>}
        secondaryAction={<Button variant="secondary">Contact owner</Button>} />
      
    </Panel>);

}