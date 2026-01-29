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
import { Check, Layers, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SlideThumbnail } from '@/components/slides/SlideThumbnail';

interface SlideItem {
  id: string;
  content: React.ReactNode;
}

interface SidebarProps {
  slides: SlideItem[];
  activeSlideIndex: number;
  onSlideClick: (index: number) => void;
  onReorder?: (oldIndex: number, newIndex: number) => void;
  onBulkMove?: (slideIndices: number[], targetIndex: number) => void;
  onBulkDelete?: (slideIndices: number[]) => void;
  onDuplicateSlide?: (index: number, targetPosition?: number) => void;
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
  onReorder,
  onBulkMove,
  onBulkDelete,
  onDuplicateSlide,
  onUndo,
  onRedo,
  className,
}: SidebarProps) {
  const [selectedSlides, setSelectedSlides] = useState<Set<number>>(new Set());
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isOverDeleteZone, setIsOverDeleteZone] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);
  const [copiedSlideIndices, setCopiedSlideIndices] = useState<number[]>([]);
  const thumbnailRefs = useRef<Map<number, HTMLElement>>(new Map());
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const deleteZoneRef = useRef<HTMLDivElement>(null);

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
      
      if (selectedSlides.size > 1 && selectedSlides.has(oldIndex)) {
        const indices = Array.from(selectedSlides).sort((a, b) => a - b);
        onBulkMove?.(indices, newIndex);
        setSelectedSlides(new Set());
      } else {
        onReorder?.(oldIndex, newIndex);
      }
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isTextInput = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;
      const isEmptyTextInput = isTextInput && (e.target as HTMLInputElement | HTMLTextAreaElement).value.trim() === '';
      const isDeleteOrEscape = e.key === 'Delete' || e.key === 'Backspace' || e.key === 'Escape';
      
      if (isTextInput && !(isEmptyTextInput && isDeleteOrEscape)) {
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        if (pendingDelete) {
          setPendingDelete(null);
        } else if (selectedSlides.size > 0) {
          setSelectedSlides(new Set());
        }
      }

      if (e.key === 'Enter' && pendingDelete) {
        e.preventDefault();
        onBulkDelete?.(pendingDelete.indices);
        setSelectedSlides(new Set());
        setPendingDelete(null);
      }

      if ((e.key === 'Delete' || e.key === 'Backspace') && !pendingDelete) {
        e.preventDefault();
        const indices = selectedSlides.size > 0 
          ? Array.from(selectedSlides).sort((a, b) => a - b)
          : [activeSlideIndex];
        const firstSlide = slides[indices[0]];
        setPendingDelete({ indices, slideContent: firstSlide?.content });
      }

      if ((e.ctrlKey || e.metaKey) && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        const allIndices = new Set(slides.map((_, i) => i));
        setSelectedSlides(allIndices);
      }

      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        if (selectedSlides.size > 0) {
          const indices = Array.from(selectedSlides).sort((a, b) => a - b);
          setCopiedSlideIndices(indices);
        } else {
          setCopiedSlideIndices([activeSlideIndex]);
        }
      }

      if ((e.ctrlKey || e.metaKey) && (e.key === 'v' || e.key === 'V')) {
        e.preventDefault();
        if (copiedSlideIndices.length > 0 && onDuplicateSlide) {
          let insertPosition = activeSlideIndex + 1;
          for (const sourceIndex of copiedSlideIndices) {
            onDuplicateSlide(sourceIndex, insertPosition);
            insertPosition++;
          }
          setSelectedSlides(new Set());
        }
      }

      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        onUndo?.();
      }

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

  const shouldCollapse = (index: number) => {
    if (!isDragging || draggedIndex === null) return false;
    if (index === draggedIndex) return false;
    if (selectedSlides.size > 1 && selectedSlides.has(index)) return true;
    return false;
  };

  const draggedSlide = draggedIndex !== null ? slides[draggedIndex] : null;
  const isMultiDrag = isDragging && selectedSlides.size > 1 && draggedIndex !== null && selectedSlides.has(draggedIndex);

  const selectedIndices = Array.from(selectedSlides).sort((a, b) => a - b);
  const firstSelectedIndex = selectedIndices.length > 0 ? selectedIndices[0] : -1;

  const sidebarRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (selectedSlides.size > 0 && sidebarRef.current) {
      sidebarRef.current.focus();
    }
  }, [selectedSlides.size]);

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
                      onClick={(e) => handleSlideClick(index, e)}
                      onDuplicate={() => onDuplicateSlide?.(index)}
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
                  <div className="absolute inset-0 bg-primary/20 rounded-md transform rotate-2 translate-x-1 -translate-y-1 border-2 border-primary/30" />
                  <div className="absolute inset-0 bg-primary/10 rounded-md transform -rotate-1 translate-x-2 -translate-y-2 border-2 border-primary/20" />
                  
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
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-[hsl(var(--sidebar-border))]">
        <p className="text-xs text-muted-foreground text-center">
          {selectedSlides.size > 0 ? 'Delete to remove, Esc to deselect' : 'Shift+click to select range'}
        </p>
      </div>

      {/* Delete zone portal */}
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
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setPendingDelete(null)}
            style={{ animation: 'fadeIn 150ms ease-out' }}
          />
          
          <div 
            className="relative bg-card border rounded-2xl shadow-2xl overflow-hidden max-w-sm w-full mx-4"
            style={{ animation: 'scaleIn 200ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          >
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
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, hsl(var(--destructive)) 10px, hsl(var(--destructive)) 20px)'
                }}
              />
            </div>
            
            <div className="p-5">
              <h3 className="text-lg font-semibold mb-1">
                Delete {pendingDelete.indices.length === 1 ? 'slide' : `${pendingDelete.indices.length} slides`}?
              </h3>
              <p className="text-sm text-muted-foreground mb-5">
                This action cannot be undone. The {pendingDelete.indices.length === 1 ? 'slide' : 'slides'} will be permanently removed.
              </p>
              
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
