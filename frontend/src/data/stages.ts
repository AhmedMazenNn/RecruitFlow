import type { Stage, StageId } from '../types/recruiting';

export const stages: Stage[] = [
{ id: 'applied', label: 'Applied', description: 'New applications awaiting review' },
{ id: 'screening', label: 'Screening', description: 'Recruiter screen and phone call' },
{ id: 'technical', label: 'Technical', description: 'Take-home or live technical round' },
{ id: 'hr', label: 'HR Interview', description: 'Culture, motivation and compensation' },
{ id: 'offer', label: 'Offer', description: 'Offer drafted, sent or negotiating' },
{ id: 'hired', label: 'Hired', description: 'Signed and onboarding' }];


export const pipelineStages = stages.filter((s) => s.id !== 'hired');

export const stageLabels: Record<StageId, string> = {
  applied: 'Applied',
  screening: 'Screening',
  technical: 'Technical',
  hr: 'HR Interview',
  offer: 'Offer',
  hired: 'Hired',
  rejected: 'Rejected'
};

export const stageOrder: StageId[] = [
'applied',
'screening',
'technical',
'hr',
'offer',
'hired'];