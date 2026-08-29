import React from 'react';
import { Modal } from '../ui/Modal';
import { ComingSoon } from '../ui/ComingSoon';

export function CreateJobModal({ open, onClose }: {open: boolean;onClose: () => void;}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create job"
      description="Set up the requisition. You can refine the description and pipeline afterwards."
      size="lg">
      <ComingSoon title="Create job" description="Job creation arrives with the jobs API." />
    </Modal>
  );
}
