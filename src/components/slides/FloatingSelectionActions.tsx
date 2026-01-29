import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { Pencil, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface FloatingSelectionActionsProps {
  selectedCount: number;
  thumbnailRefs: Map<number, HTMLElement>;
  selectedIndices: number[];
  containerRef: React.RefObject<HTMLElement>;
  onBulkEdit: (indices: number[], instructions: string) => void;
}

export function FloatingSelectionActions({
  selectedCount,
  thumbnailRefs,
  selectedIndices,
  containerRef,
  onBulkEdit,
}: FloatingSelectionActionsProps) {
  const [editInstructions, setEditInstructions] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef({
    top: 0,
    left: 0
  });
  const [, forceUpdate] = useState(0);

  // Position calculation
  useEffect(() => {
    const updatePosition = () => {
      if (!containerRef.current || selectedIndices.length === 0) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const selectedRects: DOMRect[] = [];
      selectedIndices.forEach(index => {
        const el = thumbnailRefs.get(index);
        if (el) {
          selectedRects.push(el.getBoundingClientRect());
        }
      });
      if (selectedRects.length === 0) return;

      // Find the vertical center of all selected slides
      const minTop = Math.min(...selectedRects.map(r => r.top));
      const maxBottom = Math.max(...selectedRects.map(r => r.bottom));
      const centerY = (minTop + maxBottom) / 2;

      // Clamp to visible area of container
      const clampedY = Math.max(containerRect.top + 40, Math.min(containerRect.bottom - 40, centerY));

      // Position at the right edge of the sidebar
      positionRef.current = {
        top: clampedY,
        left: containerRect.right - 8
      };
      forceUpdate(n => n + 1);
    };
    updatePosition();
    const scrollArea = containerRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollArea) {
      scrollArea.addEventListener('scroll', updatePosition);
    }
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      if (scrollArea) {
        scrollArea.removeEventListener('scroll', updatePosition);
      }
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [selectedIndices, thumbnailRefs, containerRef]);

  // Auto-focus textarea when multiselect becomes active
  useEffect(() => {
    if (selectedCount >= 2 && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [selectedCount]);

  // Reset instructions when selection changes
  useEffect(() => {
    setEditInstructions('');
  }, [selectedCount]);

  // Only show for multi-select (2+ slides)
  if (selectedCount < 2) return null;
  
  const handleSubmitEdit = () => {
    if (editInstructions.trim()) {
      onBulkEdit(selectedIndices, editInstructions.trim());
      setEditInstructions('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmitEdit();
    }
    // For Delete/Backspace/Escape when textarea is empty, blur and let parent handle
    if ((e.key === 'Delete' || e.key === 'Backspace' || e.key === 'Escape') && !editInstructions.trim()) {
      textareaRef.current?.blur();
      // Don't stop propagation - let the event bubble to trigger deletion/deselection
      return;
    }
    // Stop propagation for typing keys to prevent slide navigation
    e.stopPropagation();
  };

  const panelWidth = 320;
  const panelHeight = 44;

  const content = (
    <div 
      ref={panelRef}
      className="fixed z-50 -translate-y-1/2" 
      style={{
        top: positionRef.current.top,
        left: positionRef.current.left
      }}
    >
      {/* Background pill */}
      <div 
        className="absolute top-1/2 -translate-y-1/2 rounded-full bg-primary shadow-lg"
        style={{
          width: panelWidth,
          height: panelHeight,
          left: 0,
        }}
      />

      {/* Content layer */}
      <div 
        className="absolute top-1/2 -translate-y-1/2 z-10 flex items-center gap-2 px-3"
        style={{
          height: panelHeight,
          width: panelWidth,
        }}
      >
        {/* Count badge */}
        <div className="flex items-center gap-1.5 shrink-0 text-primary-foreground">
          <span className="text-xs font-semibold tabular-nums bg-primary-foreground/20 rounded-full px-2 py-0.5">
            {selectedCount}
          </span>
          <Pencil className="h-3.5 w-3.5 opacity-70" />
        </div>
        
        {/* Text input */}
        <div className="flex-1">
          <Textarea 
            ref={textareaRef} 
            placeholder="Describe changes..." 
            value={editInstructions} 
            onChange={e => setEditInstructions(e.target.value)} 
            onKeyDown={handleKeyDown} 
            className="w-full min-h-[28px] max-h-[28px] text-xs resize-none border-0 bg-primary-foreground/15 rounded-md focus-visible:ring-1 focus-visible:ring-primary-foreground/30 px-2 py-1.5 text-primary-foreground placeholder:text-primary-foreground/50" 
            style={{
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
            }} 
            rows={1} 
          />
        </div>
        
        {/* Send button */}
        <Button 
          size="icon" 
          variant="ghost" 
          className={cn(
            "h-7 w-7 rounded-md shrink-0 active:scale-90 transition-all",
            editInstructions.trim() 
              ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90" 
              : "text-primary-foreground/50 hover:bg-primary-foreground/20"
          )} 
          onClick={handleSubmitEdit} 
          disabled={!editInstructions.trim()}
        >
          <Send className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}