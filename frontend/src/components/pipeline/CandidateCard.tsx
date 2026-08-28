import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClockIcon, GripVerticalIcon, MapPinIcon, SparklesIcon } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { StarRating } from '../ui/StarRating';
import { cn } from '../../utils/cn';
import { daysSince } from '../../utils/format';
import type { Candidate } from '../../types/recruiting';

interface CandidateCardProps {
  candidate: Candidate;
  dragging?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: () => void;
  onKeyboardMove?: (direction: -1 | 1) => void;
}

export function CandidateCard({
  candidate,
  dragging = false,
  onDragStart,
  onDragEnd,
  onKeyboardMove
}: CandidateCardProps) {
  const age = daysSince(candidate.appliedAt);
  const stale = age > 14;

  return (
    <motion.div
      layout
      layoutId={candidate.id}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: dragging ? 0.4 : 1, y: 0, scale: dragging ? 0.98 : 1 }}
      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
      className={cn(
        'group cursor-grab rounded-lg border border-border bg-surface p-3 shadow-xs',
        'transition-[border-color,box-shadow] duration-150 ease-out hover:border-strong hover:shadow-sm',
        'active:cursor-grabbing',
        dragging && 'shadow-drag'
      )}>
      
      <div className="flex items-start gap-2.5">
        <Avatar name={candidate.name} color={candidate.avatarColor} size="sm" />
        <div className="min-w-0 flex-1">
          <Link
            to={`/candidates/${candidate.id}`}
            className="block truncate text-base font-semibold text-ink transition-colors duration-150 ease-out hover:text-brand">
            
            {candidate.name}
          </Link>
          <p className="mt-0.5 truncate text-xs text-ink-muted">{candidate.title}</p>
        </div>
        <span
          className="mt-0.5 text-ink-subtle opacity-0 transition-opacity duration-150 ease-out group-hover:opacity-100"
          aria-hidden>
          
          <GripVerticalIcon className="h-3.5 w-3.5" />
        </span>
      </div>

      <p className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-ink-muted">
        <span className="inline-flex items-center gap-1">
          <MapPinIcon className="h-3 w-3" aria-hidden />
          {candidate.location}
        </span>
        <span className="text-ink-subtle" aria-hidden>
          ·
        </span>
        <span>{candidate.yearsExperience} yrs exp</span>
      </p>

      <ul className="mt-2.5 flex flex-wrap gap-1">
        {candidate.skills.slice(0, 3).map((s) =>
        <li key={s}>
            <span className="inline-flex h-5 items-center rounded border border-border bg-canvas px-1.5 text-2xs font-medium text-ink-muted">
              {s}
            </span>
          </li>
        )}
        {candidate.skills.length > 3 &&
        <li>
            <span className="inline-flex h-5 items-center px-1 text-2xs font-medium text-ink-subtle">
              +{candidate.skills.length - 3}
            </span>
          </li>
        }
      </ul>

      {candidate.tags.length > 0 &&
      <ul className="mt-2 flex flex-wrap gap-1">
          {candidate.tags.map((t) =>
        <li key={t}>
              <Badge tone="accent">{t}</Badge>
            </li>
        )}
        </ul>
      }

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-2.5">
        <span className="inline-flex items-center gap-1.5">
          <span
            className={cn(
              'inline-flex items-center gap-1 text-2xs font-semibold',
              candidate.ai.score >= 85 ? 'text-success-fg' : 'text-ink-muted'
            )}>
            
            <SparklesIcon className="h-3 w-3" aria-hidden />
            {candidate.ai.score}% match
          </span>
          <StarRating value={candidate.rating} size="sm" label={`${candidate.name} rating`} />
        </span>
        <span
          className={cn(
            'inline-flex items-center gap-1 text-2xs font-medium',
            stale ? 'text-danger-fg' : 'text-ink-subtle'
          )}>
          
          <ClockIcon className="h-3 w-3" aria-hidden />
          {age}d
          {stale && <span className="sr-only"> — stalled</span>}
        </span>
      </div>

      <div className="mt-2 flex gap-1 opacity-0 transition-opacity duration-150 ease-out focus-within:opacity-100 group-hover:opacity-100">
        <button
          type="button"
          onClick={() => onKeyboardMove?.(-1)}
          className="flex-1 rounded border border-border px-2 py-1 text-2xs font-medium text-ink-muted transition-colors duration-150 ease-out hover:bg-subtle hover:text-ink">
          
          ← Back a stage
        </button>
        <button
          type="button"
          onClick={() => onKeyboardMove?.(1)}
          className="flex-1 rounded border border-border px-2 py-1 text-2xs font-medium text-ink-muted transition-colors duration-150 ease-out hover:bg-subtle hover:text-ink">
          
          Advance →
        </button>
      </div>
    </motion.div>);

}