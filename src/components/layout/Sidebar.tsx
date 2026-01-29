import React, { useState, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  DragMoveEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import { Plus, Check, Layers, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SlideThumbnail } from '@/components/slides/SlideThumbnail';
import { FloatingSelectionActions } from '@/components/slides/FloatingSelectionActions';
import { SlideChangesPanel } from '@/components/slides/SlideChangesPanel';
import { useAllSlideChanges } from '@/hooks/useSlideChanges';

interface SlideItem {
  id: string;
  content: React.ReactNode;
  pendingAgentAction?: boolean;
  description?: string;
  viewerCount?: number;
}

interface SidebarProps {
  slides: SlideItem[];
  activeSlideIndex: number;
  onSlideClick: (index: number) => void;
  onAddSlide: () => void;
  onBulkEdit?: (slideIndices: number[], instructions: string) => void;
  onBulkDelete?: (slideIndices: number[]) => void;
  onReorder?: (oldIndex: number, newIndex: number) => void;
  onBulkMove?: (slideIndices: number[], targetIndex: number) => void;
  onDuplicateSlide?: (index: number, targetPosition?: number) => void;
  onAgentEdit?: (index: number, instructions: string) => void;
  onClearPendingEdit?: (slideId: string) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  className?: string;
}

// Pending delete confirmation state
interface PendingDelete {
  indices: number[];
  slideContent: React.ReactNode;
}

export function Sidebar({
  slides,
  activeSlideIndex,
  onSlideClick,
  onAddSlide,
  onBulkEdit,
  onBulkDelete,
  onReorder,
  onBulkMove,
  onDuplicateSlide,
  onAgentEdit,
  onClearPendingEdit,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  className,
}: SidebarProps) {
  const [selectedSlides, setSelectedSlides] = useState<Set<number>>(new Set());
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [changesEditIndex, setChangesEditIndex] = useState<number | null>(null);
  const [isOverDeleteZone, setIsOverDeleteZone] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);
  const [copiedSlideIndices, setCopiedSlideIndices] = useState<number[]>([]);
  const thumbnailRefs = useRef<Map<number, HTMLElement>>(new Map());
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const deleteZoneRef = useRef<HTMLDivElement>(null);

  // Get change counts for all slides
  const { changeCounts } = useAllSlideChanges();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const activeIndex = slides.findIndex((s) => s.id === event.active.id);
    setDraggedIndex(activeIndex);
    setIsDragging(true);
    setIsOverDeleteZone(false);
  };

  const handleDragMove = (event: DragMoveEvent) => {
    if (!deleteZoneRef.current) return;
    
    // Get drag position from the event
    const { activatorEvent, delta } = event;
    if (!(activatorEvent instanceof PointerEvent)) return;
    
    const currentX = activatorEvent.clientX + delta.x;
    const currentY = activatorEvent.clientY + delta.y;
    
    const deleteZoneRect = deleteZoneRef.current.getBoundingClientRect();
    const isOver = 
      currentX >= deleteZoneRect.left &&
      currentX <= deleteZoneRect.right &&
      currentY >= deleteZoneRect.top &&
      currentY <= deleteZoneRect.bottom;
    
    setIsOverDeleteZone(isOver);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    // Check if dropped on delete zone - show confirmation instead of immediate delete
    if (isOverDeleteZone && draggedIndex !== null) {
      const draggedSlide = slides[draggedIndex];
      if (selectedSlides.size > 1 && selectedSlides.has(draggedIndex)) {
        const indices = Array.from(selectedSlides).sort((a, b) => a - b);
        setPendingDelete({ indices, slideContent: draggedSlide?.content });
      } else {
        setPendingDelete({ indices: [draggedIndex], slideContent: draggedSlide?.content });
      }
      setIsDragging(false);
      setDraggedIndex(null);
      setIsOverDeleteZone(false);
      return;
    }
    
    setIsDragging(false);
    setDraggedIndex(null);
    setIsOverDeleteZone(false);

    if (over && active.id !== over.id) {
      const oldIndex = slides.findIndex((s) => s.id === active.id);
      const newIndex = slides.findIndex((s) => s.id === over.id);
      
      // If we have multiple slides selected and we're dragging one of them
      if (selectedSlides.size > 1 && selectedSlides.has(oldIndex)) {
        const indices = Array.from(selectedSlides).sort((a, b) => a - b);
        onBulkMove?.(indices, newIndex);
        setSelectedSlides(new Set());
      } else {
        onReorder?.(oldIndex, newIndex);
      }
    }
  };

  // Keyboard shortcuts for selection, copy, paste
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle if typing in an input, UNLESS it's Delete/Escape in an empty field
      const isTextInput = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;
      const isEmptyTextInput = isTextInput && (e.target as HTMLInputElement | HTMLTextAreaElement).value.trim() === '';
      const isDeleteOrEscape = e.key === 'Delete' || e.key === 'Backspace' || e.key === 'Escape';
      
      if (isTextInput && !(isEmptyTextInput && isDeleteOrEscape)) {
        return;
      }

      // Escape to deselect slides or close confirmation dialog
      if (e.key === 'Escape') {
        e.preventDefault();
        if (pendingDelete) {
          setPendingDelete(null);
        } else if (selectedSlides.size > 0) {
          setSelectedSlides(new Set());
        }
      }

      // Enter to confirm deletion when dialog is open
      if (e.key === 'Enter' && pendingDelete) {
        e.preventDefault();
        onBulkDelete?.(pendingDelete.indices);
        setSelectedSlides(new Set());
        setPendingDelete(null);
      }

      // Delete/Backspace to show delete confirmation for selected slides or active slide
      if ((e.key === 'Delete' || e.key === 'Backspace') && !pendingDelete) {
        e.preventDefault();
        // If slides are selected, delete those; otherwise delete the active slide
        const indices = selectedSlides.size > 0 
          ? Array.from(selectedSlides).sort((a, b) => a - b)
          : [activeSlideIndex];
        const firstSlide = slides[indices[0]];
        setPendingDelete({ indices, slideContent: firstSlide?.content });
      }

      // Ctrl/Cmd + A to select all slides
      if ((e.ctrlKey || e.metaKey) && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        const allIndices = new Set(slides.map((_, i) => i));
        setSelectedSlides(allIndices);
      }

      // Ctrl/Cmd + C to copy selected slides (or active slide)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        if (selectedSlides.size > 0) {
          const indices = Array.from(selectedSlides).sort((a, b) => a - b);
          setCopiedSlideIndices(indices);
        } else {
          setCopiedSlideIndices([activeSlideIndex]);
        }
      }

      // Ctrl/Cmd + V to paste (duplicate) copied slides after active slide
      if ((e.ctrlKey || e.metaKey) && (e.key === 'v' || e.key === 'V')) {
        e.preventDefault();
        if (copiedSlideIndices.length > 0 && onDuplicateSlide) {
          // Insert copies after the current active slide
          let insertPosition = activeSlideIndex + 1;
          for (const sourceIndex of copiedSlideIndices) {
            onDuplicateSlide(sourceIndex, insertPosition);
            insertPosition++;
          }
          // Clear selection after paste
          setSelectedSlides(new Set());
        }
      }

      // Cmd/Ctrl + Z to undo
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        onUndo?.();
      }

      // Cmd/Ctrl + Shift + Z to redo
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        onRedo?.();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedSlides, onBulkDelete, slides, activeSlideIndex, copiedSlideIndices, onDuplicateSlide, pendingDelete, onUndo, onRedo]);

  const handleSlideClick = useCallback((index: number, event: React.MouseEvent) => {
    if (event.shiftKey && lastClickedIndex !== null) {
      const start = Math.min(lastClickedIndex, index);
      const end = Math.max(lastClickedIndex, index);
      const newSelection = new Set(selectedSlides);
      for (let i = start; i <= end; i++) {
        newSelection.add(i);
      }
      setSelectedSlides(newSelection);
    } else if (event.ctrlKey || event.metaKey) {
      const newSelection = new Set(selectedSlides);
      if (newSelection.has(index)) {
        newSelection.delete(index);
      } else {
        newSelection.add(index);
      }
      setSelectedSlides(newSelection);
      setLastClickedIndex(index);
    } else {
      setSelectedSlides(new Set());
      setLastClickedIndex(index);
      onSlideClick(index);
    }
  }, [lastClickedIndex, selectedSlides, onSlideClick]);

  const clearSelection = useCallback(() => {
    setSelectedSlides(new Set());
  }, []);

  // For multi-drag: collapse OTHER selected items (not the one being dragged)
  // The dragged item is handled by dnd-kit's sortable - it gets opacity/transform applied automatically
  const shouldCollapse = (index: number) => {
    if (!isDragging || draggedIndex === null) return false;
    // Don't collapse the actively dragged slide - dnd-kit handles it
    if (index === draggedIndex) return false;
    // Collapse other selected slides in multi-select
    if (selectedSlides.size > 1 && selectedSlides.has(index)) return true;
    return false;
  };

  const draggedSlide = draggedIndex !== null ? slides[draggedIndex] : null;
  const isMultiDrag = isDragging && selectedSlides.size > 1 && draggedIndex !== null && selectedSlides.has(draggedIndex);

  // Get sorted selected indices
  const selectedIndices = Array.from(selectedSlides).sort((a, b) => a - b);
  const firstSelectedIndex = selectedIndices.length > 0 ? selectedIndices[0] : -1;

  // Focus sidebar on mount and when selection changes
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Focus sidebar when slides are selected to capture keyboard events
    if (selectedSlides.size > 0 && sidebarRef.current) {
      sidebarRef.current.focus();
    }
  }, [selectedSlides.size]);

  // Close changes panel when active slide changes
  useEffect(() => {
    setChangesEditIndex(null);
  }, [activeSlideIndex]);

  return (
    <div
      ref={sidebarRef}
      tabIndex={0}
      className={cn(
        'w-64 bg-[hsl(var(--sidebar-bg))] border-r border-[hsl(var(--sidebar-border))] flex flex-col outline-none',
        className
      )}
    >

      {/* Slide list with drag and drop */}
      <ScrollArea className="flex-1 relative" ref={scrollAreaRef}>
        <div className="p-3">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={slides.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {slides.map((slide, index) => {
                const isCollapsed = shouldCollapse(index);
                return (
                  <div 
                    key={slide.id} 
                    ref={(el) => {
                      if (el) {
                        thumbnailRefs.current.set(index, el);
                      } else {
                        thumbnailRefs.current.delete(index);
                      }
                    }}
                    className={cn(
                      'relative',
                      selectedSlides.has(index) && !isDragging && 'ring-2 ring-primary rounded-md',
                      !isCollapsed && 'mb-3'
                    )}
                    style={{
                      maxHeight: isCollapsed ? 0 : undefined,
                      marginBottom: isCollapsed ? 0 : 12,
                      opacity: isCollapsed ? 0 : 1,
                      overflow: isCollapsed ? 'hidden' : undefined,
                      pointerEvents: isCollapsed ? 'none' : undefined,
                      transition: 'max-height 200ms ease-out, margin-bottom 200ms ease-out, opacity 150ms ease-out',
                    }}
                  >
                  <SlideThumbnail
                    id={slide.id}
                    slideNumber={index + 1}
                    isActive={index === activeSlideIndex}
                    isSelected={selectedSlides.has(index) && index === firstSelectedIndex}
                    pendingAgentAction={slide.pendingAgentAction}
                    changeCount={changeCounts[slide.id] || 0}
                    viewerCount={slide.viewerCount || 0}
                    onClick={(e) => handleSlideClick(index, e)}
                    onDuplicate={() => onDuplicateSlide?.(index)}
                    onAgentClick={() => setChangesEditIndex(index)}
                  >
                    {slide.content}
                  </SlideThumbnail>
                  {selectedSlides.has(index) && !isDragging && (
                    <div className="absolute top-2 left-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center z-10">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
                );
              })}
            </SortableContext>

            {/* Custom drag overlay */}
            <DragOverlay
              modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
              dropAnimation={null}
            >
              {draggedSlide && isMultiDrag ? (
                <div className="relative animate-stack-pulse">
                  {/* Stacked cards behind */}
                  <div className="absolute inset-0 bg-primary/20 rounded-md transform rotate-2 translate-x-1 -translate-y-1 border-2 border-primary/30" />
                  <div className="absolute inset-0 bg-primary/10 rounded-md transform -rotate-1 translate-x-2 -translate-y-2 border-2 border-primary/20" />
                  
                  {/* Main card */}
                  <div className="relative bg-[hsl(var(--slide-bg))] rounded-md border-2 border-primary shadow-lg overflow-hidden aspect-video w-48">
                    <div className="absolute inset-0 bg-white dark:bg-slate-900" />
                    <div className="absolute inset-0 overflow-hidden pointer-events-none isolate">
                      <div 
                        className="origin-top-left"
                        style={{ 
                          transform: 'scale(0.125)', 
                          width: '800%', 
                          height: '800%' 
                        }}
                      >
                        {draggedSlide.content}
                      </div>
                    </div>
                    
                    {/* Badge showing count */}
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
                      <Layers className="w-3 h-3" />
                      {selectedSlides.size}
                    </div>
                  </div>
                </div>
              ) : draggedSlide ? (
                <div className="relative bg-[hsl(var(--slide-bg))] rounded-md border-2 border-primary shadow-lg overflow-hidden aspect-video w-48">
                  <div className="absolute inset-0 bg-white dark:bg-slate-900" />
                  <div className="absolute inset-0 overflow-hidden pointer-events-none isolate">
                    <div 
                      className="origin-top-left"
                      style={{ 
                        transform: 'scale(0.125)', 
                        width: '800%', 
                        height: '800%' 
                      }}
                    >
                      {draggedSlide.content}
                    </div>
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
          
          {selectedSlides.size > 1 && !isDragging && (
            <p className="text-xs text-muted-foreground text-center pt-2 animate-fade-in">
              Drag any selected slide to move all
            </p>
          )}
        </div>

        {/* Floating selection actions */}
        <FloatingSelectionActions
          selectedCount={selectedSlides.size}
          thumbnailRefs={thumbnailRefs.current}
          selectedIndices={selectedIndices}
          containerRef={scrollAreaRef}
          onBulkEdit={(indices, instructions) => {
            onBulkEdit?.(indices, instructions);
            clearSelection();
          }}
        />
        
        {/* Slide changes panel */}
        {changesEditIndex !== null && slides[changesEditIndex] && (
          <SlideChangesPanel
            slideId={slides[changesEditIndex].id}
            slideIndex={changesEditIndex}
            thumbnailRef={thumbnailRefs.current.get(changesEditIndex) || null}
            containerRef={scrollAreaRef}
            onClose={() => setChangesEditIndex(null)}
            pendingDescription={slides[changesEditIndex].pendingAgentAction ? slides[changesEditIndex].description : undefined}
            onClearPendingEdit={onClearPendingEdit ? () => onClearPendingEdit(slides[changesEditIndex].id) : undefined}
          />
        )}
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-[hsl(var(--sidebar-border))]">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={onAddSlide}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Slide
        </Button>
        <p className="text-xs text-muted-foreground text-center mt-2">
          {selectedSlides.size > 0 ? 'Delete to remove, Esc to deselect' : 'Shift+click to select range'}
        </p>
      </div>

      {/* Delete zone portal - bottom right of viewport */}
      {isDragging && createPortal(
        <div
          ref={deleteZoneRef}
          className={cn(
            "fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 shadow-2xl",
            isOverDeleteZone 
              ? "bg-destructive text-destructive-foreground scale-110 shadow-destructive/30" 
              : "bg-card text-muted-foreground border border-border shadow-lg"
          )}
          style={{
            animation: 'slideInUp 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200",
            isOverDeleteZone 
              ? "bg-destructive-foreground/20" 
              : "bg-muted"
          )}>
            <Trash2 className={cn(
              "w-6 h-6 transition-transform duration-200",
              isOverDeleteZone && "scale-110"
            )} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">
              {isOverDeleteZone ? 'Release to delete' : 'Drop here to delete'}
            </span>
            <span className={cn(
              "text-xs transition-colors",
              isOverDeleteZone ? "text-destructive-foreground/70" : "text-muted-foreground"
            )}>
              {selectedSlides.size > 1 && draggedIndex !== null && selectedSlides.has(draggedIndex)
                ? `${selectedSlides.size} slides will be removed`
                : '1 slide will be removed'
              }
            </span>
          </div>
        </div>,
        document.body
      )}

      {/* Delete confirmation dialog */}
      {pendingDelete && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setPendingDelete(null)}
            style={{ animation: 'fadeIn 150ms ease-out' }}
          />
          
          {/* Dialog */}
          <div 
            className="relative bg-card border rounded-2xl shadow-2xl overflow-hidden max-w-sm w-full mx-4"
            style={{ animation: 'scaleIn 200ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          >
            {/* Preview thumbnail */}
            <div className="aspect-video bg-muted relative overflow-hidden">
              <div 
                className="origin-top-left pointer-events-none"
                style={{ 
                  transform: 'scale(0.2)', 
                  width: '500%', 
                  height: '500%' 
                }}
              >
                {pendingDelete.slideContent}
              </div>
              {pendingDelete.indices.length > 1 && (
                <div className="absolute top-3 right-3 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-lg">
                  <Layers className="w-4 h-4" />
                  {pendingDelete.indices.length}
                </div>
              )}
              {/* Diagonal stripes overlay to indicate deletion */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, hsl(var(--destructive)) 10px, hsl(var(--destructive)) 20px)'
                }}
              />
            </div>
            
            {/* Content */}
            <div className="p-5">
              <h3 className="text-lg font-semibold mb-1">
                Delete {pendingDelete.indices.length === 1 ? 'slide' : `${pendingDelete.indices.length} slides`}?
              </h3>
              <p className="text-sm text-muted-foreground mb-5">
                This action cannot be undone. The {pendingDelete.indices.length === 1 ? 'slide' : 'slides'} will be permanently removed.
              </p>
              
              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setPendingDelete(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1 gap-2"
                  onClick={() => {
                    onBulkDelete?.(pendingDelete.indices);
                    setSelectedSlides(new Set());
                    setPendingDelete(null);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
