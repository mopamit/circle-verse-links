import React, { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { toPng } from 'html-to-image';
import { RotateCcw, Home, HelpCircle, Volume2, VolumeX, Download } from 'lucide-react';
import { StyledCircularIcon } from '@/components/StyledCircularIcon';
import { CycleDiagram } from '@/components/devorah/CycleDiagram';
import { VerseCard } from '@/components/devorah/VerseCard';
import { CORRECT_ORDER, INSTRUCTION, VERSES, VerseChunk } from '@/data/devorahGame';
import amitLogo from '@/assets/amit-logo.png';

const shuffle = <T,>(items: T[]) => {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
};

const initialPlaced = (): Record<string, VerseChunk[]> => {
  const placed: Record<string, VerseChunk[]> = {};
  VERSES.filter((v) => v.pinned).forEach((v) => {
    placed[v.targetStepId] = [...(placed[v.targetStepId] || []), v];
  });
  return placed;
};

const DevorahGame: React.FC = () => {
  const [placedVerses, setPlacedVerses] = useState<Record<string, VerseChunk[]>>(initialPlaced);
  const [shakeStepId, setShakeStepId] = useState<string | null>(null);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [selectedVerseId, setSelectedVerseId] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [complete, setComplete] = useState(false);
  const [verseOrder] = useState(() => shuffle(VERSES.filter((v) => !v.pinned)));

  const cycleRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const placedVerseIds = useMemo(() => {
    const ids = new Set<string>();
    Object.values(placedVerses).forEach((chunks) => chunks.forEach((c) => ids.add(c.id)));
    return ids;
  }, [placedVerses]);

  const draggableVerses = useMemo(
    () => verseOrder.filter((v) => !placedVerseIds.has(v.id)),
    [verseOrder, placedVerseIds]
  );

  const tryPlaceVerse = (verseId: string, stepId: string) => {
    const verse = VERSES.find((v) => v.id === verseId);
    if (!verse || placedVerseIds.has(verse.id)) return;

    if (verse.targetStepId !== stepId) {
      setShakeStepId(stepId);
      window.setTimeout(() => setShakeStepId(null), 500);
      return;
    }

    setPlacedVerses((prev) => ({
      ...prev,
      [stepId]: [...(prev[stepId] || []), verse],
    }));
    setSelectedVerseId(null);
  };

  const handleDragStart = (e: DragStartEvent) => setActiveDragId(String(e.active.id));

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveDragId(null);
    const { active, over } = e;
    if (!over) return;
    const a = active.data.current as { type?: string; verseId?: string } | undefined;
    const o = over.data.current as { type?: string; stepId?: string } | undefined;
    if (a?.type !== 'verse' || o?.type !== 'circle' || !a.verseId || !o.stepId) return;
    tryPlaceVerse(a.verseId, o.stepId);
  };

  const handleVerseSelect = (verseId: string) => {
    setSelectedVerseId((prev) => (prev === verseId ? null : verseId));
  };

  const handleCircleClick = (stepId: string) => {
    if (!selectedVerseId) return;
    tryPlaceVerse(selectedVerseId, stepId);
  };

  // Detect completion
  React.useEffect(() => {
    const allPlaced = VERSES.every((v) => placedVerseIds.has(v.id));
    if (allPlaced && !complete) {
      window.setTimeout(() => setComplete(true), 700);
    }
  }, [placedVerseIds, complete]);

  const reset = () => {
    setPlacedVerses(initialPlaced());
    setSelectedVerseId(null);
    setShakeStepId(null);
    setActiveDragId(null);
    setComplete(false);
  };

  const downloadImage = async () => {
    const exportNode = exportRef.current ?? cycleRef.current;
    if (!exportNode) return;
    try {
      // Capture the actual on-screen diagram (no clone — clones lose computed styles)
      const cycleDataUrl = await toPng(exportNode, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#ffffff',
        skipFonts: false,
      });

      // Compose final PNG with title + logo above the diagram on a canvas
      const cycleImg = new Image();
      cycleImg.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        cycleImg.onload = () => resolve();
        cycleImg.onerror = reject;
        cycleImg.src = cycleDataUrl;
      });

      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        logoImg.onload = () => resolve();
        logoImg.onerror = reject;
        logoImg.src = amitLogo;
      });

      const PAD = 48;
      const HEADER_H = 96;
      const canvasW = cycleImg.width + PAD * 2;
      const canvasH = cycleImg.height + HEADER_H + PAD * 2;

      const canvas = document.createElement('canvas');
      canvas.width = canvasW;
      canvas.height = canvasH;
      const ctx = canvas.getContext('2d')!;

      // Background gradient (sky → white)
      const grad = ctx.createLinearGradient(0, 0, 0, canvasH);
      grad.addColorStop(0, '#d6efff');
      grad.addColorStop(1, '#f5f9fc');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvasW, canvasH);

      // Title (RTL)
      ctx.fillStyle = '#15365e';
      ctx.font = 'bold 36px system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.direction = 'rtl';
      ctx.fillText('מעגל תקופת השופט גדעון', canvasW - PAD - logoImg.width * (HEADER_H / logoImg.height) - 24, PAD + HEADER_H / 2);

      // Logo on the left
      const logoH = HEADER_H;
      const logoW = logoImg.width * (logoH / logoImg.height);
      ctx.drawImage(logoImg, PAD, PAD, logoW, logoH);

      // Cycle diagram below header
      ctx.drawImage(cycleImg, PAD, PAD + HEADER_H, cycleImg.width, cycleImg.height);

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'מעגל-גדעון.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('PNG export failed', err);
    }
  };

  const activeVerse = activeDragId?.startsWith('verse-')
    ? VERSES.find((v) => v.id === activeDragId.replace('verse-', ''))
    : null;

  return (
    <div
      className="min-h-screen font-simpler"
      dir="rtl"
      style={{ background: 'linear-gradient(180deg, hsl(196 73% 92%) 0%, hsl(196 73% 96%) 50%, hsl(210 33% 98%) 100%)' }}
    >
      <header className="p-4 flex justify-between items-center">
        <div className="flex gap-2">
          <StyledCircularIcon iconId="1GQcqcC7jSx1OPvKq39TxS_jhNrokQ4J9" fallback={Home} size="sm" onClick={() => window.location.reload()} />
          <StyledCircularIcon iconId="11brKm4UhEQOL3dG4NbJnRYYUugpOnV4r" fallback={HelpCircle} size="sm" onClick={() => setShowInstructions(true)} />
        </div>
        <img src={amitLogo} className="h-12 object-contain" alt="Amit Logo" />
      </header>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <main className="max-w-7xl mx-auto px-4 pb-24">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-primary tracking-tight mb-2">הסיפור של גדעון</h1>
            <p className="text-primary text-base font-bold leading-relaxed max-w-2xl mx-auto">
              {INSTRUCTION.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
                part.startsWith('**') && part.endsWith('**') ? (
                  <strong key={i} className="font-extrabold underline">{part.slice(2, -2)}</strong>
                ) : (
                  <React.Fragment key={i}>{part}</React.Fragment>
                )
              )}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8">
            <div className="lg:w-80 w-full flex flex-col gap-3 order-2 lg:order-1">
              <div className="text-center lg:text-right">
                <h2 className="text-lg font-bold text-primary">פסוקים לגרירה</h2>
              </div>
              {draggableVerses.map((verse) => (
                <VerseCard
                  key={verse.id}
                  verse={verse}
                  used={false}
                  selected={selectedVerseId === verse.id}
                  onSelect={() => handleVerseSelect(verse.id)}
                />
              ))}
              {draggableVerses.length === 0 && (
                <p className="text-center text-sm text-muted-foreground italic">כל הפסוקים שובצו! 🎉</p>
              )}
            </div>

            <div className="order-1 lg:order-2 w-full lg:w-auto flex justify-center">
              <CycleDiagram
                ref={cycleRef}
                steps={CORRECT_ORDER}
                placedVerses={placedVerses}
                highlightStepId={null}
                shakeStepId={shakeStepId}
                onCircleClick={handleCircleClick}
                selectedVerseId={selectedVerseId}
              />
            </div>
          </div>
        </main>

        <DragOverlay>
          {activeVerse && (
            <div className="px-4 py-3 rounded-xl text-sm bg-card shadow-2xl ring-2 ring-secondary max-w-xs" dir="rtl">
              {activeVerse.text}
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <div className="fixed left-[-10000px] top-0 pointer-events-none" aria-hidden="true">
        <CycleDiagram
          ref={exportRef}
          steps={CORRECT_ORDER}
          placedVerses={placedVerses}
          highlightStepId={null}
          shakeStepId={null}
          selectedVerseId={null}
          capturePadding={{ x: 300, y: 140 }}
        />
      </div>

      <AnimatePresence>
        {complete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-primary/20 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 20 }}
              className="bg-card p-8 rounded-3xl shadow-2xl text-center max-w-md w-full"
            >
              <h2 className="text-3xl font-bold text-primary mb-4">כל הכבוד! 🎉</h2>
              <p className="text-foreground/80 leading-relaxed mb-6">
                השלמתם את מעגל תקופת השופט גדעון. אפשר להוריד את התמונה לזיכרון.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={downloadImage}
                  className="bg-secondary text-secondary-foreground px-6 py-2 rounded-full font-bold cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  הורידו תמונה
                </button>
                <button
                  onClick={reset}
                  className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-bold cursor-pointer hover:opacity-90 transition-opacity"
                >
                  שחקו שוב
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-primary/20 backdrop-blur-sm"
            onClick={() => setShowInstructions(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-card p-8 rounded-3xl shadow-2xl text-center max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-primary mb-4">הוראות</h2>
              <p className="text-foreground/80 mb-3 leading-relaxed">
                {INSTRUCTION.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
                  part.startsWith('**') && part.endsWith('**') ? (
                    <strong key={i} className="font-extrabold underline">{part.slice(2, -2)}</strong>
                  ) : (
                    <React.Fragment key={i}>{part}</React.Fragment>
                  )
                )}
              </p>
              <p className="text-foreground/80 mb-3 leading-relaxed">
                ארבעה פסוקים כבר משובצים על העיגולים הראשונים של מעגל תקופת גדעון. גררו את שלושת הפסוקים הנותרים אל העיגול המתאים, או לחצו על פסוק ואז על העיגול.
              </p>
              <p className="text-foreground/80 mb-6 leading-relaxed">
                שימו לב — הפסוק האחרון מחזיר אותנו אל תחילת המעגל ("עזיבת ה'"). בסיום אפשר להוריד תמונה של המעגל המלא.
              </p>
              <button
                onClick={() => setShowInstructions(false)}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-bold cursor-pointer hover:opacity-90 transition-opacity"
              >
                הבנתי!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="fixed bottom-4 left-4 flex gap-2">
        <StyledCircularIcon iconId="1Fvt--8I3VF9zK_Bi6_Dech_COZbAwuJ-" fallback={RotateCcw} size="sm" onClick={reset} />
        <StyledCircularIcon
          iconId={isMuted ? '1fVssO7_tw-bqjE5cMcGi1ObJ_a-tZHBE' : '1xSfJJVsrUlbgE9eZ1-hHk9C4SghPDTlI'}
          fallback={isMuted ? VolumeX : Volume2}
          size="sm"
          onClick={() => setIsMuted(!isMuted)}
        />
      </footer>
    </div>
  );
};

export default DevorahGame;
