import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeftIcon, ClipboardCheckIcon, InfoIcon, LockIcon } from 'lucide-react';
import { Panel, PanelHeader } from '../components/ui/Panel';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { Field, Textarea } from '../components/ui/Input';
import { StarRating } from '../components/ui/StarRating';
import { Alert } from '../components/ui/Alert';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { interviews } from '../data/interviews';
import { formatDate } from '../utils/format';
import { cn } from '../utils/cn';

const criteria = [
{ id: 'technical', label: 'Technical skills', hint: 'Depth in the areas the role requires' },
{ id: 'problem', label: 'Problem solving', hint: 'Structure, trade-offs and pragmatism' },
{ id: 'communication', label: 'Communication', hint: 'Clarity, listening and written follow-up' },
{ id: 'culture', label: 'Culture / team fit', hint: 'Collaboration and feedback behaviours' }];


const recommendations = [
{ id: 'strong-hire', label: 'Strong hire', tone: 'border-success bg-success-soft text-success-fg' },
{ id: 'hire', label: 'Hire', tone: 'border-success/50 bg-success-soft/60 text-success-fg' },
{ id: 'neutral', label: 'Neutral', tone: 'border-border bg-subtle text-ink' },
{ id: 'no-hire', label: 'No hire', tone: 'border-danger/50 bg-danger-soft/60 text-danger-fg' },
{ id: 'strong-no-hire', label: 'Strong no hire', tone: 'border-danger bg-danger-soft text-danger-fg' }];


export function InterviewFeedback() {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const interview = interviews.find((i) => i.id === interviewId);

  const [scores, setScores] = useState<Record<string, number>>({});
  const [recommendation, setRecommendation] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState(false);
  const [leaving, setLeaving] = useState(false);

  if (!interview) {
    return (
      <div className="px-4 py-10 lg:px-7">
        <Panel>
          <EmptyState
            icon={<ClipboardCheckIcon className="h-5 w-5" />}
            title="Interview not found"
            description="This interview may have been cancelled or rescheduled."
            action={
            <Button variant="primary" onClick={() => navigate('/interviews')}>
                Back to interviews
              </Button>
            } />
          
        </Panel>
      </div>);

  }

  const dirty = Object.keys(scores).length > 0 || recommendation !== '' || notes !== '';
  const missingRecommendation = touched && recommendation === '';

  const submit = () => {
    setTouched(true);
    if (!recommendation) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success('Feedback submitted', {
        description: `Your scorecard for ${interview.candidateName} is visible to the hiring team.`
      });
      navigate(`/candidates/${interview.candidateId}`);
    }, 900);
  };

  return (
    <div className="pb-10">
      <div className="border-b border-border bg-surface px-4 pb-5 pt-4 lg:px-7">
        <button
          type="button"
          onClick={() => dirty ? setLeaving(true) : navigate('/interviews')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-subtle transition-colors duration-150 ease-out hover:text-ink">
          
          <ArrowLeftIcon className="h-3.5 w-3.5" aria-hidden />
          Interviews
        </button>
        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Avatar name={interview.candidateName} color={interview.avatarColor} size="lg" />
            <div>
              <h1 className="font-display text-xl font-semibold text-ink">Interview scorecard</h1>
              <p className="mt-0.5 text-sm text-ink-muted">
                <Link to={`/candidates/${interview.candidateId}`} className="font-medium text-ink hover:text-brand">
                  {interview.candidateName}
                </Link>{' '}
                · {interview.type} · {formatDate(interview.date)} at {interview.time}
              </p>
            </div>
          </div>
          {dirty &&
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-warning-fg">
              <span className="h-1.5 w-1.5 rounded-full bg-warning" aria-hidden />
              Unsaved changes
            </span>
          }
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pt-5 lg:px-7">
        <Panel as="section">
          <PanelHeader
            title="Rate the candidate"
            description="Score each area independently before writing your summary."
            as="h2" />
          
          <ul className="divide-y divide-border border-t border-border">
            {criteria.map((c) =>
            <li key={c.id} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-base font-medium text-ink">{c.label}</p>
                  <p className="mt-0.5 text-xs text-ink-subtle">{c.hint}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StarRating
                  value={scores[c.id] ?? 0}
                  size="lg"
                  label={c.label}
                  onChange={(v) => setScores((s) => ({ ...s, [c.id]: v }))} />
                
                  <span className="w-10 text-sm font-medium text-ink-muted">
                    {scores[c.id] ? `${scores[c.id]}/5` : '—'}
                  </span>
                </div>
              </li>
            )}
          </ul>

          <fieldset className="border-t border-border px-5 py-4">
            <legend className="text-base font-semibold text-ink">Recommendation</legend>
            <p className="mt-0.5 text-xs text-ink-subtle">
              Required. This is what the hiring team sees first on the candidate profile.
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-5">
              {recommendations.map((r) => {
                const selected = recommendation === r.id;
                return (
                  <label
                    key={r.id}
                    className={cn(
                      'cursor-pointer rounded-lg border px-3 py-2.5 text-center text-sm font-medium',
                      'transition-[border-color,background-color,color] duration-150 ease-out',
                      selected ? r.tone : 'border-border bg-surface text-ink-muted hover:border-strong hover:text-ink'
                    )}>
                    
                    <input
                      type="radio"
                      name="recommendation"
                      value={r.id}
                      checked={selected}
                      onChange={() => setRecommendation(r.id)}
                      className="sr-only" />
                    
                    {r.label}
                  </label>);

              })}
            </div>
            {missingRecommendation &&
            <p className="mt-2 text-xs font-medium text-danger-fg">
                Choose a recommendation before submitting.
              </p>
            }
          </fieldset>

          <div className="border-t border-border px-5 py-4">
            <Field
              label="Additional feedback"
              htmlFor="fb-notes"
              hint="Evidence, quotes and specifics are far more useful than adjectives.">
              
              <Textarea
                id="fb-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What did they do well? Where did they struggle? What should the next interviewer probe?"
                className="min-h-[140px]" />
              
            </Field>
            <p className="mt-3 flex items-start gap-2 text-xs text-ink-subtle">
              <LockIcon className="mt-0.5 h-3 w-3 shrink-0" aria-hidden />
              Other interviewers cannot see your scorecard until they submit their own, to avoid anchoring.
            </p>
          </div>

          <div className="flex flex-col gap-2 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-1.5 text-xs text-ink-subtle">
              <InfoIcon className="h-3.5 w-3.5" aria-hidden />
              Submitted {interview.status === 'awaiting-feedback' ? '2 days after the round' : 'right after the round'} keeps decisions fast.
            </p>
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={() => toast.success('Draft saved')}>
                Save draft
              </Button>
              <Button variant="primary" loading={submitting} onClick={submit}>
                Submit feedback
              </Button>
            </div>
          </div>
        </Panel>

        {interview.status === 'awaiting-feedback' &&
        <Alert tone="warning" title="This scorecard is overdue" className="mt-4">
            The interview happened on {formatDate(interview.date)}. The candidate is waiting on a decision.
          </Alert>
        }
      </div>

      <ConfirmDialog
        open={leaving}
        title="Discard your feedback?"
        description="You have unsaved ratings and notes. Leaving now discards them."
        confirmLabel="Discard and leave"
        cancelLabel="Keep editing"
        tone="danger"
        onCancel={() => setLeaving(false)}
        onConfirm={() => navigate('/interviews')} />
      
    </div>);

}