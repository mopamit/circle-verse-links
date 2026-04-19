import React from 'react';
import { motion } from 'framer-motion';
import { useDroppable } from '@dnd-kit/core';
import { CycleStep, VerseChunk } from '@/data/devorahGame';

interface Props {
  steps: CycleStep[];
  placedVerses: Record<string, VerseChunk[]>;
  highlightStepId?: string | null;
  shakeStepId?: string | null;
  onCircleClick?: (stepId: string) => void;
  selectedVerseId?: string | null;
  glowStepIds?: string[];
  capturePadding?: { x: number; y: number };
}

const ANGLES = [-90, -30, 30, 90, 150, 210];
const RADIUS = 190;
const CIRCLE_SIZE = 110;

const CurvedArrow: React.FC<{ fromAngle: number; toAngle: number; radius: number; cx: number; cy: number; color?: string }> = ({ fromAngle, toAngle, radius, cx, cy, color = 'hsl(var(--amit-sky))' }) => {
  const off = 15;
  const sR = ((fromAngle + off) * Math.PI) / 180;
  const eR = ((toAngle - off) * Math.PI) / 180;
  const x1 = cx + Math.cos(sR) * radius;
  const y1 = cy + Math.sin(sR) * radius;
  const x2 = cx + Math.cos(eR) * radius;
  const y2 = cy + Math.sin(eR) * radius;
  const midR = (((fromAngle + toAngle) / 2) * Math.PI) / 180;
  const bulge = 18;
  const mx = cx + Math.cos(midR) * (radius + bulge);
  const my = cy + Math.sin(midR) * (radius + bulge);
  const arrAngle = Math.atan2(y2 - my, x2 - mx);
  const aL = 8;
  const a1x = x2 - aL * Math.cos(arrAngle - 0.4);
  const a1y = y2 - aL * Math.sin(arrAngle - 0.4);
  const a2x = x2 - aL * Math.cos(arrAngle + 0.4);
  const a2y = y2 - aL * Math.sin(arrAngle + 0.4);

  return (
    <g>
      <path d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <polygon points={`${x2},${y2} ${a1x},${a1y} ${a2x},${a2y}`} fill={color} />
    </g>
  );
};

const StepCircle: React.FC<{
  step: CycleStep;
  isHighlighted: boolean;
  isShaking: boolean;
  isFilled: boolean;
  isOver: boolean;
  isGlowing: boolean;
  clickable: boolean;
  onClick?: () => void;
  dropRef: (el: HTMLDivElement | null) => void;
}> = ({ step, isHighlighted, isShaking, isFilled, isOver, isGlowing, clickable, onClick, dropRef }) => {
  return (
    <motion.div
      ref={dropRef}
      onClick={clickable ? onClick : undefined}
      animate={
        isShaking
          ? { x: [-4, 4, -4, 4, 0] }
          : isHighlighted
            ? { scale: [1, 1.06, 1] }
            : {}
      }
      transition={
        isHighlighted
          ? { duration: 1.4, repeat: Infinity }
          : { duration: 0.4 }
      }
      style={{
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        boxShadow: isGlowing
          ? '0 0 0 6px hsl(var(--secondary) / 0.45), 0 0 28px 8px hsl(var(--secondary) / 0.6)'
          : undefined,
      }}
      className={`
        rounded-full flex items-center justify-center text-center p-3 select-none
        transition-colors duration-300
        ${clickable ? 'cursor-pointer' : 'cursor-default'}
        ${isOver
          ? 'bg-secondary/30 ring-4 ring-secondary'
          : isGlowing
            ? isFilled
              ? 'bg-accent text-accent-foreground ring-4 ring-secondary'
              : 'bg-card text-primary ring-4 ring-secondary'
            : isFilled
              ? 'bg-accent text-accent-foreground shadow-lg ring-2 ring-accent'
              : isHighlighted
                ? 'bg-secondary/20 ring-2 ring-secondary shadow-lg'
                : 'bg-card text-primary border-2 border-border shadow-sm'}
      `}
    >

      <span className="text-sm font-bold leading-tight whitespace-pre-line">{step.label}</span>
    </motion.div>
  );
};

const DroppableCircle: React.FC<{
  step: CycleStep;
  index: number;
  isHighlighted: boolean;
  isShaking: boolean;
  isFilled: boolean;
  isGlowing: boolean;
  clickable: boolean;
  onClick?: () => void;
}> = (props) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `circle-${props.step.id}`,
    data: { type: 'circle', stepId: props.step.id },
  });
  return <StepCircle {...props} dropRef={setNodeRef} isOver={isOver} />;
};

export const CycleDiagram = React.forwardRef<HTMLDivElement, Props>(
  ({ steps, placedVerses, highlightStepId, shakeStepId, onCircleClick, selectedVerseId, glowStepIds, capturePadding }, ref) => {
    const SIZE = 560;
    const frameWidth = SIZE + (capturePadding?.x ?? 0) * 2;
    const frameHeight = SIZE + (capturePadding?.y ?? 0) * 2;
    const centerX = frameWidth / 2;
    const centerY = frameHeight / 2;
    const glowSet = new Set(glowStepIds ?? []);

    const handleCircleClickInternal = (stepId: string) => {
      if (selectedVerseId) {
        onCircleClick?.(stepId);
      }
    };

    return (
      <div ref={ref} className="relative mx-auto" style={{ width: frameWidth, height: frameHeight, overflow: 'visible' }}>
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ overflow: 'visible' }}>
          {ANGLES.map((angle, i) => {
            const next = i < ANGLES.length - 1 ? ANGLES[i + 1] : ANGLES[0] + 360;
            return (
              <CurvedArrow
                key={i}
                fromAngle={angle}
                toAngle={next}
                radius={RADIUS + CIRCLE_SIZE / 2 + 4}
                cx={centerX}
                cy={centerY}
              />
            );
          })}
        </svg>

        {steps.map((step, i) => {
          const angle = ANGLES[i];
          const rad = (angle * Math.PI) / 180;
          const x = Math.cos(rad) * RADIUS;
          const y = Math.sin(rad) * RADIUS;
          const placed = placedVerses[step.id] || [];
          const isFilled = placed.length > 0;
          const clickable = !!selectedVerseId;

          return (
            <div
              key={step.id}
              className="absolute z-10"
              style={{ left: centerX, top: centerY, transform: `translate(-50%, -50%) translate(${x}px, ${y}px)` }}
            >
              <div className="relative">
                <DroppableCircle
                  step={step}
                  index={i}
                  isHighlighted={highlightStepId === step.id}
                  isShaking={shakeStepId === step.id}
                  isFilled={isFilled}
                  isGlowing={glowSet.has(step.id)}
                  clickable={clickable}
                  onClick={() => handleCircleClickInternal(step.id)}
                />

                {placed.length > 0 && (
                  <VerseSidePanel stepId={step.id} verses={placed} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
);

CycleDiagram.displayName = 'CycleDiagram';

// Verse text shown beside each circle, on the outside of the cycle (for export and dragged verses).
const PANEL_GAP = 36;

// For aziva (top), show first verse to the right of the circle and second to the left.
const AZIVA_RIGHT: React.CSSProperties = { right: `calc(100% + ${PANEL_GAP}px)`, top: '50%', transform: 'translateY(-50%)' };
const AZIVA_LEFT: React.CSSProperties = { left: `calc(100% + ${PANEL_GAP}px)`, top: '50%', transform: 'translateY(-50%)' };

const DEFAULT_POSITIONS: Record<string, React.CSSProperties> = {
  shibud:   { left: `calc(100% + ${PANEL_GAP}px)`, top: '50%', transform: 'translateY(-50%)' },
  zeaka:    { left: `calc(100% + ${PANEL_GAP}px)`, top: '50%', transform: 'translateY(-50%)' },
  shofet:   { right: `calc(100% + ${PANEL_GAP}px)`, top: '50%', transform: 'translateY(-50%)' },
  nitzahon: { right: `calc(100% + ${PANEL_GAP}px)`, top: '50%', transform: 'translateY(-50%)' },
  sheket:   { right: `calc(100% + ${PANEL_GAP}px)`, top: '50%', transform: 'translateY(-50%)' },
};

const SinglePanel: React.FC<{ verse: VerseChunk; style: React.CSSProperties }> = ({ verse, style }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.85 }}
    animate={{ opacity: 1, scale: 1 }}
    className="absolute z-40 w-52 md:w-56 p-3 rounded-xl bg-card shadow-md ring-1 ring-border pointer-events-none"
    style={style}
    dir="rtl"
  >
    <p className="text-[11px] leading-relaxed text-primary text-right">{verse.text}</p>
  </motion.div>
);

const VerseSidePanel: React.FC<{ stepId: string; verses: VerseChunk[] }> = ({ stepId, verses }) => {
  if (verses.length === 0) return null;

  if (stepId === 'aziva') {
    return (
      <>
        {verses[0] && <SinglePanel verse={verses[0]} style={AZIVA_RIGHT} />}
        {verses[1] && <SinglePanel verse={verses[1]} style={AZIVA_LEFT} />}
      </>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute z-40 w-52 md:w-56 p-3 rounded-xl bg-card shadow-md ring-1 ring-border pointer-events-none flex flex-col gap-2"
      style={DEFAULT_POSITIONS[stepId]}
      dir="rtl"
    >
      {verses.map((verse) => (
        <p key={verse.id} className="text-[11px] leading-relaxed text-primary text-right">
          {verse.text}
        </p>
      ))}
    </motion.div>
  );
};
