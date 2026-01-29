import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Toolbar } from '@/components/layout/Toolbar';
import { SlideCanvas } from '@/components/slides/SlideCanvas';
import { SlideOverviewGrid } from '@/components/slides/SlideOverviewGrid';
import { PresentationMode } from '@/components/slides/PresentationMode';
import { PresenterNotesPanel } from '@/components/slides/PresenterNotesPanel';
import { demoSlides } from '@/slides/demo';
import { WIPSlide } from '@/slides/WIPSlide';
import { useSlideOrder } from '@/hooks/useSlideOrder';
import { useActionHistory } from '@/hooks/useActionHistory';
import { toast } from 'sonner';
import type { SlideMetadata } from '@/types/slide';

export default function Index() {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [showGrid, setShowGrid] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(256);

  // Slide order from database
  const { slideOrder, initialized, initializeSlides, reorderSlides, bulkMoveSlides, restoreOrder, getSlideId, updateSlideDescription, duplicateSlide, deleteSlide, restoreSlide, removeDuplicatedSlide } = useSlideOrder();

  // Undo/redo action history
  const actionHistory = useActionHistory();

  // Get current slide ID
  const currentSlideId = getSlideId(activeSlideIndex);

  // Initialize slides in database if not already done
  useEffect(() => {
    if (!initialized) {
      const slidesData = demoSlides.map((s, i) => ({
        filePath: `src/slides/demo/Slide${String(i + 1).padStart(2, '0')}${s.name.replace(/\s+/g, '')}.tsx`,
        templateType: s.template,
      }));
      initializeSlides(slidesData);
    }
  }, [initialized, initializeSlides]);

  // Build ordered slides list
  const orderedSlides = useMemo(() => {
    if (slideOrder.length === 0) {
      return demoSlides.map((s, i) => ({
        id: `temp-${i}`,
        component: s.component,
        name: s.name,
        isWIP: false,
        description: undefined,
      }));
    }

    return slideOrder.map((meta) => {
      if (meta.filePath.includes('WIPSlide')) {
        return {
          id: meta.id,
          component: WIPSlide,
          name: 'WIP Slide',
          isWIP: true,
          description: meta.description || meta.templateType,
        };
      }
      
      const index = parseInt(meta.filePath.match(/Slide(\d+)/)?.[1] || '1') - 1;
      const slide = demoSlides[index] || demoSlides[0];
      return {
        id: meta.id,
        component: slide.component,
        name: slide.name,
        isWIP: false,
        description: undefined,
      };
    });
  }, [slideOrder]);

  // Toggle dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (isPresentationMode) return;

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        setActiveSlideIndex(prev => Math.min(orderedSlides.length - 1, prev + 1));
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setActiveSlideIndex(prev => Math.max(0, prev - 1));
      } else if (e.key === 'G' && e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowGrid(prev => !prev);
      } else if (e.key === 'N' && e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowNotes(prev => !prev);
      } else if (e.key === 'P' && e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setIsPresentationMode(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [orderedSlides.length, isPresentationMode]);

  const handleReorder = async (oldIndex: number, newIndex: number) => {
    const previousOrder = await reorderSlides(oldIndex, newIndex);
    
    if (previousOrder) {
      const newOrder = [...previousOrder];
      const [movedId] = newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, movedId);
      
      actionHistory.pushAction({
        type: 'reorder',
        undoData: { previousOrder },
        redoData: { newOrder },
        description: `Move slide ${oldIndex + 1} to ${newIndex + 1}`,
      });
    }
    
    if (activeSlideIndex === oldIndex) {
      setActiveSlideIndex(newIndex);
    } else if (oldIndex < activeSlideIndex && newIndex >= activeSlideIndex) {
      setActiveSlideIndex(activeSlideIndex - 1);
    } else if (oldIndex > activeSlideIndex && newIndex <= activeSlideIndex) {
      setActiveSlideIndex(activeSlideIndex + 1);
    }
  };

  const handleBulkMove = async (slideIndices: number[], targetIndex: number) => {
    const previousOrder = await bulkMoveSlides(slideIndices, targetIndex);
    
    if (previousOrder) {
      const movedIds = slideIndices.map(i => previousOrder[i]);
      const remaining = previousOrder.filter((_, i) => !slideIndices.includes(i));
      const newOrder = [...remaining.slice(0, targetIndex), ...movedIds, ...remaining.slice(targetIndex)];
      
      actionHistory.pushAction({
        type: 'bulk-move',
        undoData: { previousOrder },
        redoData: { newOrder },
        description: `Move ${slideIndices.length} slides`,
      });
      
      toast.success(`Moved ${slideIndices.length} slides to position ${targetIndex + 1}`);
    }
  };

  const handleDescriptionChange = useCallback((description: string) => {
    const currentSlide = orderedSlides[activeSlideIndex];
    if (currentSlide?.isWIP) {
      updateSlideDescription(currentSlide.id, description);
    }
  }, [activeSlideIndex, orderedSlides, updateSlideDescription]);

  const ActiveSlideComponent = orderedSlides[activeSlideIndex]?.component || demoSlides[0].component;

  // Undo handler
  const handleUndo = useCallback(async () => {
    if (actionHistory.isProcessing) return;
    
    const action = actionHistory.undo();
    if (!action) return;

    actionHistory.setProcessing(true);
    try {
      switch (action.type) {
        case 'delete':
          const slidesToRestore = action.undoData.slides as SlideMetadata[];
          for (const slide of slidesToRestore) {
            await restoreSlide(slide);
          }
          toast.success(`Restored ${slidesToRestore.length} slide${slidesToRestore.length > 1 ? 's' : ''}`);
          break;
        case 'duplicate':
          await removeDuplicatedSlide(action.undoData.slideId);
          toast.success('Undid duplicate');
          break;
        case 'reorder':
        case 'bulk-move':
          await restoreOrder(action.undoData.previousOrder);
          toast.success('Undid move');
          break;
      }
    } finally {
      actionHistory.setProcessing(false);
    }
  }, [actionHistory, restoreSlide, removeDuplicatedSlide, restoreOrder]);

  // Redo handler
  const handleRedo = useCallback(async () => {
    if (actionHistory.isProcessing) return;
    
    const action = actionHistory.redo();
    if (!action) return;

    actionHistory.setProcessing(true);
    try {
      switch (action.type) {
        case 'delete':
          const slidesToDelete = action.undoData.slides as SlideMetadata[];
          for (const slide of [...slidesToDelete].reverse()) {
            const currentIndex = slideOrder.findIndex(s => s.id === slide.id);
            if (currentIndex >= 0) {
              await deleteSlide(currentIndex);
            }
          }
          toast.success(`Deleted ${slidesToDelete.length} slide${slidesToDelete.length > 1 ? 's' : ''}`);
          break;
        case 'duplicate':
          await duplicateSlide(action.redoData.sourceIndex, action.redoData.targetPosition);
          toast.success('Redid duplicate');
          break;
        case 'reorder':
        case 'bulk-move':
          await restoreOrder(action.redoData.newOrder);
          toast.success('Redid move');
          break;
      }
    } finally {
      actionHistory.setProcessing(false);
    }
  }, [actionHistory, slideOrder, deleteSlide, duplicateSlide, restoreOrder]);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Toolbar */}
      <Toolbar
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid(!showGrid)}
        showNotes={showNotes}
        onToggleNotes={() => setShowNotes(!showNotes)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          slides={orderedSlides.map((slide) => ({
            id: slide.id,
            content: <slide.component />,
          }))}
          activeSlideIndex={activeSlideIndex}
          onSlideClick={setActiveSlideIndex}
          onBulkDelete={async (indices) => {
            const sortedIndices = [...indices].sort((a, b) => b - a);
            const deletedSlides: SlideMetadata[] = [];
            
            for (const index of sortedIndices) {
              const deletedSlide = await deleteSlide(index);
              if (deletedSlide) deletedSlides.push(deletedSlide);
            }
            
            if (deletedSlides.length > 0) {
              actionHistory.pushAction({
                type: 'delete',
                undoData: { slides: deletedSlides.reverse() },
                redoData: { indices: [...indices].sort((a, b) => a - b) },
                description: `Delete ${deletedSlides.length} slide${deletedSlides.length > 1 ? 's' : ''}`,
              });
            }
            
            const minDeleted = Math.min(...indices);
            if (activeSlideIndex >= minDeleted) {
              setActiveSlideIndex(Math.max(0, minDeleted - 1));
            }
            toast.success(`Deleted ${deletedSlides.length} slides`);
          }}
          onReorder={handleReorder}
          onBulkMove={handleBulkMove}
          onDuplicateSlide={async (index, targetPosition) => {
            const newSlideId = await duplicateSlide(index, targetPosition);
            if (newSlideId) {
              const insertPos = targetPosition !== undefined ? targetPosition : index + 1;
              setActiveSlideIndex(insertPos);
              
              actionHistory.pushAction({
                type: 'duplicate',
                undoData: { slideId: newSlideId },
                redoData: { sourceIndex: index, targetPosition },
                description: 'Duplicate slide',
              });
            }
          }}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={actionHistory.canUndo}
          canRedo={actionHistory.canRedo}
          width={sidebarWidth}
          onWidthChange={setSidebarWidth}
        />

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 relative overflow-hidden">
            <SlideCanvas
              showGrid={false}
              zoom={zoom}
              onZoomChange={setZoom}
              currentSlide={activeSlideIndex + 1}
              totalSlides={orderedSlides.length}
              onPrevSlide={() => setActiveSlideIndex(Math.max(0, activeSlideIndex - 1))}
              onNextSlide={() => setActiveSlideIndex(Math.min(orderedSlides.length - 1, activeSlideIndex + 1))}
              onStartPresentation={() => setIsPresentationMode(true)}
              isDarkMode={isDarkMode}
              onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            >
              {orderedSlides[activeSlideIndex]?.isWIP ? (
                <WIPSlide 
                  description={orderedSlides[activeSlideIndex]?.description || ''}
                  onDescriptionChange={handleDescriptionChange}
                />
              ) : (
                <ActiveSlideComponent />
              )}
            </SlideCanvas>

            {/* Grid View Overlay */}
            {showGrid && (
              <SlideOverviewGrid
                slides={orderedSlides}
                activeSlideIndex={activeSlideIndex}
                onSlideClick={setActiveSlideIndex}
                onClose={() => setShowGrid(false)}
              />
            )}
          </div>

          {/* Presenter Notes Panel - Bottom */}
          {showNotes && (
            <PresenterNotesPanel
              slideId={currentSlideId}
              slideIndex={activeSlideIndex}
              onClose={() => setShowNotes(false)}
            />
          )}
        </div>
      </div>

      {/* Presentation Mode */}
      {isPresentationMode && (
        <PresentationMode
          slides={orderedSlides.map(slide => ({
            id: slide.id,
            component: slide.component,
            isWIP: slide.isWIP,
            description: slide.description,
          }))}
          activeIndex={activeSlideIndex}
          onIndexChange={setActiveSlideIndex}
          onExit={() => setIsPresentationMode(false)}
        />
      )}
    </div>
  );
}
