import React, { useState } from 'react';
import { toast } from 'sonner';
import { PipelineColumn } from './PipelineColumn';
import { stages, stageOrder, stageLabels } from '../../data/stages';
import type { Candidate, StageId } from '../../types/recruiting';

const accents = [
'bg-ink-subtle',
'bg-info',
'bg-brand',
'bg-accent',
'bg-warning',
'bg-success'];


export function KanbanBoard({ initial }: {initial: Candidate[];}) {
  const [items, setItems] = useState(initial);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<StageId | null>(null);

  const move = (id: string, stage: StageId) => {
    const candidate = items.find((c) => c.id === id);
    if (!candidate || candidate.stage === stage) return;
    const from = candidate.stage;
    setItems((prev) => prev.map((c) => c.id === id ? { ...c, stage } : c));
    toast.success(`${candidate.name} moved to ${stageLabels[stage]}`, {
      description: `From ${stageLabels[from]} · interviewers on the next round will be notified.`,
      action: {
        label: 'Undo',
        onClick: () => setItems((prev) => prev.map((c) => c.id === id ? { ...c, stage: from } : c))
      }
    });
  };

  const moveByStep = (id: string, direction: -1 | 1) => {
    const candidate = items.find((c) => c.id === id);
    if (!candidate) return;
    const index = stageOrder.indexOf(candidate.stage);
    const next = stageOrder[index + direction];
    if (!next) return;
    move(id, next);
  };

  return (
    <div className="rf-scroll flex gap-3 overflow-x-auto px-4 pb-6 pt-4 lg:px-7">
      {stages.map((stage, i) =>
      <PipelineColumn
        key={stage.id}
        stage={stage}
        accent={accents[i]}
        candidates={items.filter((c) => c.stage === stage.id)}
        isDropTarget={dropTarget === stage.id}
        draggingId={draggingId}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          setDropTarget(stage.id);
        }}
        onDragLeave={() => setDropTarget((t) => t === stage.id ? null : t)}
        onDrop={(e) => {
          e.preventDefault();
          const id = e.dataTransfer.getData('text/plain');
          setDropTarget(null);
          setDraggingId(null);
          if (id) move(id, stage.id);
        }}
        onCardDragStart={setDraggingId}
        onCardDragEnd={() => {
          setDraggingId(null);
          setDropTarget(null);
        }}
        onMove={moveByStep} />

      )}
    </div>);

}