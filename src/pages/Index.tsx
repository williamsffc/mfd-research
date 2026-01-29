import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Toolbar } from '@/components/layout/Toolbar';
import { SlideCanvas, useSlideScale } from '@/components/slides/SlideCanvas';
import { SlideOverviewGrid } from '@/components/slides/SlideOverviewGrid';
import { CommentPin } from '@/components/slides/CommentPin';
import { AddCommentOverlay } from '@/components/slides/AddCommentOverlay';
import { AddEditOverlay } from '@/components/slides/AddEditOverlay';
import { EditPin } from '@/components/slides/EditPin';
import { QueuePanel } from '@/components/slides/QueuePanel';
import { PresentationMode } from '@/components/slides/PresentationMode';
import { ViewerAvatars } from '@/components/slides/ViewerAvatars';
import { demoSlides } from '@/slides/demo';
import { WIPSlide } from '@/slides/WIPSlide';
import { useComments } from '@/hooks/useComments';
import { useSlideChanges } from '@/hooks/useSlideChanges';
import { useSlideOrder } from '@/hooks/useSlideOrder';
import { useActionHistory, Action } from '@/hooks/useActionHistory';
import { useSlidePresence } from '@/hooks/useSlidePresence';
import { toast } from 'sonner';
import type { SlideMetadata } from '@/types/slide';

export default function Index() {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [showGrid, setShowGrid] = useState(false);
  const [showComments, setShowComments] = useState(true);
  const [showQueue, setShowQueue] = useState(false);
  const [zoom, setZoom] = useState(75);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [newCommentPosition, setNewCommentPosition] = useState({ x: 0, y: 0 });
  const [newSlideId, setNewSlideId] = useState<string | null>(null);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddingEdit, setIsAddingEdit] = useState(false);
  const [newEditPosition, setNewEditPosition] = useState({ x: 0, y: 0 });

  // Slide order from database
  const { slideOrder, initialized, initializeSlides, reorderSlides, bulkMoveSlides, restoreOrder, getSlideId, addWIPSlide, updateSlideDescription, duplicateSlide, deleteSlide, restoreSlide, removeDuplicatedSlide, markSlidesForAgentEdit, clearPendingEdit } = useSlideOrder();

  // Undo/redo action history
  const actionHistory = useActionHistory();

  // Real-time presence tracking
  const { updateSlide, getViewersOnSlide, getAllViewers, currentUser } = useSlidePresence('demo');

  // Get current slide ID for comments
  const currentSlideId = getSlideId(activeSlideIndex);

  // Comments from database
  const { comments, addComment, resolveComment, deleteComment } = useComments(currentSlideId);

  // Slide changes/edits from database
  const { changes: slideEdits, addChange: addSlideEdit, deleteChange: deleteSlideEdit } = useSlideChanges(currentSlideId);

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
      // Fallback to demo order if not loaded yet
      return demoSlides.map((s, i) => ({
        id: `temp-${i}`,
        component: s.component,
        name: s.name,
        isWIP: false,
        description: undefined,
        pendingAgentAction: false,
      }));
    }

    return slideOrder.map((meta) => {
      // Check if it's a WIP slide (by file path, since template_type now stores user text)
      if (meta.filePath.includes('WIPSlide')) {
        return {
          id: meta.id,
          component: WIPSlide,
          name: 'WIP Slide',
          isWIP: true,
          description: meta.description || meta.templateType,
          pendingAgentAction: meta.pendingAgentAction ?? false,
        };
      }
      
      // Find matching demo slide by file path
      const index = parseInt(meta.filePath.match(/Slide(\d+)/)?.[1] || '1') - 1;
      const slide = demoSlides[index] || demoSlides[0];
      return {
        id: meta.id,
        component: slide.component,
        name: slide.name,
        isWIP: false,
        description: undefined,
        pendingAgentAction: meta.pendingAgentAction ?? false,
      };
    });
  }, [slideOrder]);

  // Toggle dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  // Update presence when active slide changes
  useEffect(() => {
    updateSlide(activeSlideIndex);
  }, [activeSlideIndex, updateSlide]);

  // Keyboard navigation for slides
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't navigate if user is typing in an input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Don't handle navigation keys if in presentation mode (handled by PresentationMode)
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
      } else if (e.key === 'C' && e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowComments(prev => {
          if (!prev) setIsEditMode(false); // Turn off edit mode when enabling comments
          return !prev;
        });
      } else if (e.key === 'E' && e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setIsEditMode(prev => {
          if (!prev) setShowComments(false); // Turn off comments when enabling edit mode
          return !prev;
        });
      } else if (e.key === 'Q' && e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowQueue(prev => !prev);
      } else if (e.key === 'P' && e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setIsPresentationMode(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [orderedSlides.length, isPresentationMode]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Don't open if clicking on existing comment or edit pin
    if ((e.target as HTMLElement).closest('.comment-pin') || (e.target as HTMLElement).closest('.edit-pin')) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // If in edit mode, add an edit instead of a comment
    if (isEditMode) {
      if (!currentSlideId) {
        toast.error('Slide not ready for edits yet');
        return;
      }
      setNewEditPosition({ x, y });
      setIsAddingEdit(true);
      return;
    }

    // Otherwise, add a comment if comments are enabled
    if (!showComments) return;
    if (!currentSlideId) {
      toast.error('Slide not ready for comments yet');
      return;
    }

    setNewCommentPosition({ x, y });
    setIsAddingComment(true);
  };

  const handleAddComment = async (authorName: string, content: string) => {
    if (!currentSlideId) return;
    
    const result = await addComment(
      newCommentPosition.x,
      newCommentPosition.y,
      authorName,
      content
    );

    if (result) {
      toast.success('Comment added');
    }
    setIsAddingComment(false);
  };

  const handleAddEdit = async (content: string) => {
    if (!currentSlideId) return;
    
    const result = await addSlideEdit(content, newEditPosition.x, newEditPosition.y);

    if (result) {
      toast.success('AI edit added');
    }
    setIsAddingEdit(false);
  };

  const handleDeleteEdit = async (editId: string) => {
    const result = await deleteSlideEdit(editId);
    if (result) {
      toast.success('Edit deleted');
    }
  };

  const handleResolveComment = async (commentId: string, resolved: boolean) => {
    await resolveComment(commentId, resolved);
    toast.success(resolved ? 'Comment resolved' : 'Comment reopened');
  };

  const handleDeleteComment = async (commentId: string) => {
    await deleteComment(commentId);
    toast.success('Comment deleted');
  };

  const handleReplyToComment = async (commentId: string, authorName: string, content: string) => {
    if (!currentSlideId) return;
    
    // Find parent comment position
    const parentComment = comments.find((c) => c.id === commentId);
    if (!parentComment) return;

    await addComment(
      parentComment.xPosition,
      parentComment.yPosition,
      authorName,
      content,
      commentId
    );
    toast.success('Reply added');
  };

  const handleReorder = async (oldIndex: number, newIndex: number) => {
    const previousOrder = await reorderSlides(oldIndex, newIndex);
    
    if (previousOrder) {
      // Track for undo
      const currentOrder = slideOrder.map(s => s.id);
      // Compute current order after the move (same logic as reorderSlides)
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
    
    // Adjust active slide index if needed
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
      // Capture current order after the move for redo
      // We need to wait a tick for state to update, so compute it manually
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

  const handleAddSlide = useCallback(async () => {
    const slideId = await addWIPSlide();
    if (slideId) {
      setNewSlideId(slideId);
      // Navigate to the new slide (it's at the end)
      setActiveSlideIndex(slideOrder.length);
    } else {
      toast.error('Failed to add slide');
    }
  }, [addWIPSlide, slideOrder.length]);

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
          // Restore deleted slides
          const slidesToRestore = action.undoData.slides as SlideMetadata[];
          for (const slide of slidesToRestore) {
            await restoreSlide(slide);
          }
          toast.success(`Restored ${slidesToRestore.length} slide${slidesToRestore.length > 1 ? 's' : ''}`);
          break;
        case 'duplicate':
          // Remove the duplicated slide
          await removeDuplicatedSlide(action.undoData.slideId);
          toast.success('Undid duplicate');
          break;
        case 'reorder':
        case 'bulk-move':
          // Restore to previous order
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
          // Re-delete the slides by IDs stored in undoData
          const slidesToDelete = action.undoData.slides as SlideMetadata[];
          for (const slide of [...slidesToDelete].reverse()) {
            // Find current index of this slide
            const currentIndex = slideOrder.findIndex(s => s.id === slide.id);
            if (currentIndex >= 0) {
              await deleteSlide(currentIndex);
            }
          }
          toast.success(`Deleted ${slidesToDelete.length} slide${slidesToDelete.length > 1 ? 's' : ''}`);
          break;
        case 'duplicate':
          // Re-duplicate the slide
          await duplicateSlide(action.redoData.sourceIndex, action.redoData.targetPosition);
          toast.success('Redid duplicate');
          break;
        case 'reorder':
        case 'bulk-move':
          // Restore to new order (redo the move)
          await restoreOrder(action.redoData.newOrder);
          toast.success('Redid move');
          break;
      }
    } finally {
      actionHistory.setProcessing(false);
    }
  }, [actionHistory, slideOrder, deleteSlide, duplicateSlide, restoreOrder]);

  // Count pending items for queue badge
  const queueCount = useMemo(() => {
    return orderedSlides.filter(s => s.pendingAgentAction).length;
  }, [orderedSlides]);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Toolbar */}
      <Toolbar
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid(!showGrid)}
        showComments={showComments}
        onToggleComments={() => {
          if (!showComments) setIsEditMode(false);
          setShowComments(!showComments);
        }}
        isEditMode={isEditMode}
        onToggleEditMode={() => {
          if (!isEditMode) setShowComments(false);
          setIsEditMode(!isEditMode);
        }}
        showQueue={showQueue}
        onToggleQueue={() => setShowQueue(!showQueue)}
        queueCount={queueCount}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          slides={orderedSlides.map((slide, index) => ({
            id: slide.id,
            content: <slide.component />,
            pendingAgentAction: slide.pendingAgentAction,
            description: slide.description,
            viewerCount: getViewersOnSlide(index).length,
          }))}
          activeSlideIndex={activeSlideIndex}
          onSlideClick={setActiveSlideIndex}
          onAddSlide={handleAddSlide}
          onBulkEdit={async (indices, instructions) => {
            const sortedIndices = [...indices].sort((a, b) => a - b);
            const slideRange = sortedIndices.length > 1 
              ? `${sortedIndices[0] + 1}-${sortedIndices[sortedIndices.length - 1] + 1}`
              : `${sortedIndices[0] + 1}`;
            const jointDescription = `Joint edit for slides ${slideRange}. Comment: ${instructions}`;
            
            // Update all selected slides with pending status and joint description
            const slideIds = sortedIndices.map(i => orderedSlides[i]?.id).filter(Boolean);
            await markSlidesForAgentEdit(slideIds, jointDescription);
            
            toast.success(`Edit requested for ${slideIds.length} slides`);
          }}
          onBulkDelete={async (indices) => {
            // Delete in reverse order to maintain correct indices
            const sortedIndices = [...indices].sort((a, b) => b - a);
            const deletedSlides: SlideMetadata[] = [];
            
            for (const index of sortedIndices) {
              const deletedSlide = await deleteSlide(index);
              if (deletedSlide) deletedSlides.push(deletedSlide);
            }
            
            if (deletedSlides.length > 0) {
              // Track for undo - store in original order (reverse of delete order)
              actionHistory.pushAction({
                type: 'delete',
                undoData: { slides: deletedSlides.reverse() },
                redoData: { indices: [...indices].sort((a, b) => a - b) },
                description: `Delete ${deletedSlides.length} slide${deletedSlides.length > 1 ? 's' : ''}`,
              });
            }
            
            // Adjust active index
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
              
              // Track for undo
              actionHistory.pushAction({
                type: 'duplicate',
                undoData: { slideId: newSlideId },
                redoData: { sourceIndex: index, targetPosition },
                description: 'Duplicate slide',
              });
            }
          }}
          onAgentEdit={async (index, instructions) => {
            const slide = orderedSlides[index];
            if (slide) {
              await markSlidesForAgentEdit([slide.id], instructions);
              toast.success('Agent edit updated');
            }
          }}
          onClearPendingEdit={async (slideId) => {
            await clearPendingEdit(slideId);
            toast.success('Pending edit cleared');
          }}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={actionHistory.canUndo}
          canRedo={actionHistory.canRedo}
        />

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Viewer avatars for current slide */}
          {getViewersOnSlide(activeSlideIndex).length > 0 && (
            <div className="absolute top-3 left-3 z-20">
              <ViewerAvatars 
                viewers={getViewersOnSlide(activeSlideIndex)} 
                size="md"
                maxDisplay={5}
              />
            </div>
          )}
          
          <SlideCanvas
            showGrid={false}
            zoom={zoom}
            onZoomChange={setZoom}
            onClick={handleCanvasClick}
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
                autoFocus={orderedSlides[activeSlideIndex]?.id === newSlideId}
              />
            ) : (
              <ActiveSlideComponent />
            )}

            {/* Comment pins */}
            {showComments &&
              !showGrid &&
              comments.map((comment) => (
                <CommentPin
                  key={comment.id}
                  comment={comment}
                  onResolve={(resolved) => handleResolveComment(comment.id, resolved)}
                  onDelete={() => handleDeleteComment(comment.id)}
                  onReply={(authorName, content) =>
                    handleReplyToComment(comment.id, authorName, content)
                  }
                />
              ))}

            {/* Inline add comment overlay */}
            <AddCommentOverlay
              isOpen={isAddingComment}
              position={newCommentPosition}
              onSubmit={handleAddComment}
              onClose={() => setIsAddingComment(false)}
            />

            {/* Edit pins */}
            {(isEditMode || slideEdits.length > 0) &&
              !showGrid &&
              slideEdits.map((edit) => (
                <EditPin
                  key={edit.id}
                  id={edit.id}
                  content={edit.content}
                  xPosition={edit.xPosition}
                  yPosition={edit.yPosition}
                  createdAt={edit.createdAt}
                  onDelete={handleDeleteEdit}
                />
              ))}

            {/* Inline add edit overlay */}
            <AddEditOverlay
              isOpen={isAddingEdit}
              position={newEditPosition}
              onSubmit={handleAddEdit}
              onClose={() => setIsAddingEdit(false)}
            />
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
      </div>

      {/* Queue Panel */}
      {showQueue && (
        <QueuePanel
          slides={orderedSlides.map((slide, index) => ({
            id: slide.id,
            position: index,
            name: slide.name,
            description: slide.description,
            pendingAgentAction: slide.pendingAgentAction,
            component: slide.component,
          }))}
          onClose={() => setShowQueue(false)}
          onSlideClick={(index) => {
            setActiveSlideIndex(index);
            setShowQueue(false);
          }}
          onResolveComment={async (commentId, resolved) => {
            await resolveComment(commentId, resolved);
          }}
        />
      )}

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
