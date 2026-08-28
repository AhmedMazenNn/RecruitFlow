import React from 'react';
import { Badge, type Tone } from './Badge';
import { stageLabels } from '../../data/stages';
import { stageTone } from '../../utils/format';
import type { InterviewStatus, JobStatus, StageId } from '../../types/recruiting';

const jobTones: Record<JobStatus, Tone> = {
  draft: 'neutral',
  open: 'success',
  paused: 'warning',
  closed: 'danger',
  archived: 'neutral'
};

export function JobStatusBadge({ status }: {status: JobStatus;}) {
  return (
    <Badge tone={jobTones[status]} dot uppercase>
      {status}
    </Badge>);

}

export function StageBadge({ stage, size = 'sm' }: {stage: StageId;size?: 'sm' | 'md';}) {
  return (
    <Badge tone={stageTone[stage]} size={size} dot>
      {stageLabels[stage]}
    </Badge>);

}

const interviewTones: Record<InterviewStatus, {tone: Tone;label: string;}> = {
  scheduled: { tone: 'info', label: 'Scheduled' },
  completed: { tone: 'success', label: 'Completed' },
  'awaiting-feedback': { tone: 'warning', label: 'Awaiting feedback' },
  cancelled: { tone: 'neutral', label: 'Cancelled' }
};

export function InterviewStatusBadge({ status }: {status: InterviewStatus;}) {
  const { tone, label } = interviewTones[status];
  return (
    <Badge tone={tone} dot>
      {label}
    </Badge>);

}