import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { VerseChunk } from '@/data/devorahGame';

interface Props {
  verse: VerseChunk;
  used: boolean;
  selected: boolean;
  onSelect: () => void;
}

export const VerseCard: React.FC<Props> = ({ verse, used, selected, onSelect }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `verse-${verse.id}`,
    data: { type: 'verse', verseId: verse.id },
    disabled: used,
  });

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      type="button"
      onClick={used ? undefined : onSelect}
      disabled={used}
      className={`
        w-full text-right px-4 py-3 rounded-xl text-sm leading-relaxed transition-all touch-none
        ${used
          ? 'opacity-30 pointer-events-none bg-muted text-muted-foreground'
          : selected
            ? 'bg-secondary text-secondary-foreground shadow-lg ring-2 ring-secondary cursor-grab active:cursor-grabbing'
            : 'bg-card text-foreground shadow-md ring-1 ring-inset ring-border hover:shadow-lg cursor-grab active:cursor-grabbing'}
        ${isDragging ? 'opacity-30' : ''}
      `}
    >
      {verse.text}
    </button>
  );
};
