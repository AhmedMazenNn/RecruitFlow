import React from 'react';
import { UserRoundSearchIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import type { Candidate, Stage } from '../../types/recruiting';
import { CandidateCard } from './CandidateCard';

interface PipelineColumnProps {
  stage: Stage;
  candidates: Candidate[];
  accent: string;
  isDropTarget: boolean;
  draggingId: string | null;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onCardDragStart: (id: string) => void;
  onCardDragEnd: () => void;
  onMove: (id: string, direction: -1 | 1) => void;
}

export function PipelineColumn({
  stage,
  candidates,
  accent,
  isDropTarget,
  draggingId,
  onDragOver,
  onDragLeave,
  onDrop,
  onCardDragStart,
  onCardDragEnd,
  onMove
}: PipelineColumnProps) {
  return (
    <section
      aria-label={`${stage.label} — ${candidates.length} candidates`}
      className="flex w-[286px] shrink-0 flex-col sm:w-[300px]">
      
      <header className="flex items-center gap-2 px-1 pb-2.5">
        <span className={cn('h-2 w-2 rounded-full', accent)} aria-hidden />
        <h2 className="text-sm font-semibold text-ink">{stage.label}</h2>
        <span className="rounded bg-subtle px-1.5 py-0.5 text-2xs font-semibold text-ink-muted">
          {candidates.length}
        </span>
      </header>

      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          'rf-scroll flex max-h-[calc(100vh-19rem)] min-h-[180px] flex-1 flex-col gap-2 overflow-y-auto rounded-xl border p-2',
          'transition-[background-color,border-color] duration-150 ease-out',
          isDropTarget ?
          'border-brand bg-brand-soft/60' :
          'border-border bg-canvas'
        )}>
        
        {candidates.length === 0 ?
        <div
          className={cn(
            'flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed px-3 py-8 text-center',
            isDropTarget ? 'border-brand' : 'border-border'
          )}>
          
            <UserRoundSearchIcon className="h-4 w-4 text-ink-subtle" aria-hidden />
            <p className="mt-2 text-xs font-medium text-ink-muted">
              {isDropTarget ? `Drop to move to ${stage.label}` : 'No candidates'}
            </p>
            <p className="mt-1 text-2xs text-ink-subtle">{stage.description}</p>
          </div> :

        candidates.map((c) =>
        <CandidateCard
          key={c.id}
          candidate={c}
          dragging={draggingId === c.id}
          onDragStart={(e) => {
            e.dataTransfer.setData('text/plain', c.id);
            e.dataTransfer.effectAllowed = 'move';
            onCardDragStart(c.id);
          }}
          onDragEnd={onCardDragEnd}
          onKeyboardMove={(dir) => onMove(c.id, dir)} />

        )
        }
      </div>
    </section>);

}