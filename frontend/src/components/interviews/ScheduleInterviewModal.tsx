import React from 'react';
import { Modal } from '../ui/Modal';
import { ComingSoon } from '../ui/ComingSoon';

interface Props {
  open: boolean;
  onClose: () => void;
  candidateId?: string;
}

export function ScheduleInterviewModal({ open, onClose }: Props) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Schedule interview"
      description="Invites and the meeting link are sent automatically once scheduled."
      size="lg">
      <ComingSoon title="Schedule interview" description="Interview scheduling arrives with the interviews API." />
    </Modal>
  );
}
