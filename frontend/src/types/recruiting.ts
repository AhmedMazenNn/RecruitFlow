export type JobStatus = 'draft' | 'open' | 'paused' | 'closed' | 'archived';

export type StageId =
'applied' |
'screening' |
'technical' |
'hr' |
'offer' |
'hired' |
'rejected';

export interface Stage {
  id: StageId;
  label: string;
  description: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  status: JobStatus;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  hiringManager: {name: string;avatarColor: string;};
  recruiter: string;
  createdAt: string;
  candidateCount: number;
  inInterview: number;
  openings: number;
  description: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
}

export interface CandidateApplication {
  jobId: string;
  jobTitle: string;
  stage: StageId;
  appliedAt: string;
  source: string;
}

export interface TimelineEntry {
  id: string;
  at: string;
  group: string;
  kind: 'stage' | 'interview' | 'document' | 'note' | 'created' | 'email' | 'offer';
  title: string;
  detail?: string;
  actor: string;
}

export interface CandidateDocument {
  id: string;
  name: string;
  kind: 'Resume' | 'Cover Letter' | 'Certificate' | 'Portfolio';
  size: string;
  uploadedAt: string;
  status: 'ready' | 'uploading' | 'failed';
  progress?: number;
}

export interface CandidateNote {
  id: string;
  author: string;
  avatarColor: string;
  at: string;
  visibility: 'team' | 'private' | 'hiring-manager';
  body: string;
}

export interface AiMatch {
  score: number;
  summary: string;
  strengths: string[];
  gaps: string[];
  generatedAt: string;
}

export interface Candidate {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  avatarColor: string;
  yearsExperience: number;
  stage: StageId;
  primaryJobId: string;
  primaryJobTitle: string;
  appliedAt: string;
  source: string;
  skills: string[];
  tags: string[];
  rating: number;
  summary: string;
  experience: {role: string;company: string;period: string;detail: string;}[];
  education: {degree: string;school: string;period: string;}[];
  applications: CandidateApplication[];
  timeline: TimelineEntry[];
  documents: CandidateDocument[];
  notes: CandidateNote[];
  ai: AiMatch;
}

export type InterviewType =
'Screening call' |
'Technical interview' |
'System design' |
'HR interview' |
'Final panel';

export type InterviewStatus = 'scheduled' | 'completed' | 'awaiting-feedback' | 'cancelled';

export interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  avatarColor: string;
  jobTitle: string;
  type: InterviewType;
  date: string;
  time: string;
  durationMin: number;
  interviewers: string[];
  meetingLink: string;
  status: InterviewStatus;
  scorecardSubmitted: boolean;
}

export interface ActivityItem {
  id: string;
  kind: 'stage' | 'candidate' | 'interview' | 'feedback' | 'hire' | 'note';
  actor: string;
  avatarColor: string;
  text: string;
  target?: string;
  at: string;
}

export interface Notification {
  id: string;
  kind: 'feedback' | 'stage' | 'application' | 'interview' | 'system' | 'mention';
  title: string;
  body: string;
  at: string;
  read: boolean;
  actor?: string;
  avatarColor?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Recruiter' | 'Hiring Manager' | 'Interviewer';
  avatarColor: string;
  status: 'active' | 'invited' | 'deactivated';
  lastActive: string;
}