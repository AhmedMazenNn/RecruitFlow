import React from 'react';
import { Modal } from '../ui/Modal';
import { ComingSoon } from '../ui/ComingSoon';

export function AddCandidateModal({ open, onClose }: {open: boolean;onClose: () => void;}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add candidate"
      description="Choose how you want to bring this person into the pipeline."
      size="lg">
      <ComingSoon title="Add candidate" description="Candidate creation arrives with the candidates API." />
    </Modal>
  );
}
