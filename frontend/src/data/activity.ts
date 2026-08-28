import type { ActivityItem, Notification, TeamMember } from '../types/recruiting';

export const activity: ActivityItem[] = [
{
  id: 'a1',
  kind: 'stage',
  actor: 'Nadia Fouad',
  avatarColor: '#4F46E5',
  text: 'moved Ahmed Mazen to',
  target: 'Technical Interview',
  at: '12 min ago'
},
{
  id: 'a2',
  kind: 'feedback',
  actor: 'Sarah Khalil',
  avatarColor: '#8B5CF6',
  text: 'submitted interview feedback for',
  target: 'Tarek Idrissi',
  at: '48 min ago'
},
{
  id: 'a3',
  kind: 'candidate',
  actor: 'Tomás Rivera',
  avatarColor: '#CA8A04',
  text: 'added a new candidate',
  target: 'Yara Nassif',
  at: '2 hours ago'
},
{
  id: 'a4',
  kind: 'interview',
  actor: 'Nadia Fouad',
  avatarColor: '#4F46E5',
  text: 'scheduled a system design round with',
  target: 'Mohamed Farouk',
  at: '3 hours ago'
},
{
  id: 'a5',
  kind: 'hire',
  actor: 'Grace Adeyemi',
  avatarColor: '#16A160',
  text: 'marked as hired',
  target: 'Hana Kimura',
  at: 'Yesterday'
},
{
  id: 'a6',
  kind: 'note',
  actor: 'Layla Hassan',
  avatarColor: '#8B5CF6',
  text: 'left a note on',
  target: 'Ahmed Mazen',
  at: 'Yesterday'
},
{
  id: 'a7',
  kind: 'stage',
  actor: 'Tomás Rivera',
  avatarColor: '#CA8A04',
  text: 'moved Dina Saleh to',
  target: 'HR Interview',
  at: 'Yesterday'
}];


export const notifications: Notification[] = [
{
  id: 'n1',
  kind: 'feedback',
  title: 'Sarah Khalil submitted interview feedback',
  body: 'Technical interview · Tarek Idrissi · Senior Frontend Engineer. Recommendation: Hire.',
  at: '48 min ago',
  read: false,
  actor: 'Sarah Khalil',
  avatarColor: '#8B5CF6'
},
{
  id: 'n2',
  kind: 'stage',
  title: 'Ahmed Mazen moved to Technical Interview',
  body: 'Nadia Fouad advanced the candidate from Screening.',
  at: '12 min ago',
  read: false,
  actor: 'Nadia Fouad',
  avatarColor: '#4F46E5'
},
{
  id: 'n3',
  kind: 'application',
  title: '3 new candidates applied to Senior Backend Engineer',
  body: 'Omar Zaki, Nour El-Din and one more arrived via the careers page.',
  at: '5 hours ago',
  read: false
},
{
  id: 'n4',
  kind: 'interview',
  title: 'Interview tomorrow at 09:30',
  body: 'Screening call with Peter Novak · Platform / DevOps Engineer.',
  at: 'Yesterday',
  read: true
},
{
  id: 'n5',
  kind: 'mention',
  title: 'Layla Hassan mentioned you in a note',
  body: '“@nadia keep the technical round rigorous anyway so the panel has its own signal.”',
  at: 'Yesterday',
  read: true,
  actor: 'Layla Hassan',
  avatarColor: '#8B5CF6'
},
{
  id: 'n6',
  kind: 'system',
  title: 'CV parsing failed for 1 document',
  body: 'system-design-take-home.zip could not be processed. Retry or upload a PDF.',
  at: '2 days ago',
  read: true
},
{
  id: 'n7',
  kind: 'application',
  title: 'Offer accepted by Hana Kimura',
  body: 'Product Designer · start date Oct 1, 2026.',
  at: '3 days ago',
  read: true
}];


export const team: TeamMember[] = [
{ id: 'u1', name: 'Nadia Fouad', email: 'nadia@northwind.io', role: 'Owner', avatarColor: '#4F46E5', status: 'active', lastActive: 'Now' },
{ id: 'u2', name: 'Grace Adeyemi', email: 'grace@northwind.io', role: 'Admin', avatarColor: '#16A160', status: 'active', lastActive: '20 min ago' },
{ id: 'u3', name: 'Tomás Rivera', email: 'tomas@northwind.io', role: 'Recruiter', avatarColor: '#CA8A04', status: 'active', lastActive: '2 hours ago' },
{ id: 'u4', name: 'Layla Hassan', email: 'layla@northwind.io', role: 'Hiring Manager', avatarColor: '#8B5CF6', status: 'active', lastActive: 'Yesterday' },
{ id: 'u5', name: 'Sven Larsson', email: 'sven@northwind.io', role: 'Interviewer', avatarColor: '#0E84C8', status: 'active', lastActive: '3 days ago' },
{ id: 'u6', name: 'Marco Bianchi', email: 'marco@northwind.io', role: 'Hiring Manager', avatarColor: '#DB3747', status: 'invited', lastActive: '—' },
{ id: 'u7', name: 'Rania Adel', email: 'rania@northwind.io', role: 'Interviewer', avatarColor: '#6366F1', status: 'deactivated', lastActive: '2 months ago' }];


export const currentUser = {
  name: 'Nadia Fouad',
  email: 'nadia@northwind.io',
  role: 'Talent Lead',
  avatarColor: '#4F46E5'
};

export const workspaces = [
{ id: 'ws-northwind', name: 'Northwind Labs', plan: 'Scale', initials: 'NL', color: '#4F46E5' },
{ id: 'ws-atlas', name: 'Atlas Health', plan: 'Growth', initials: 'AH', color: '#16A160' },
{ id: 'ws-vega', name: 'Vega Robotics', plan: 'Trial', initials: 'VR', color: '#CA8A04' }];