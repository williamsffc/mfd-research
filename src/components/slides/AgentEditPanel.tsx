import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { Bot, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface AgentEditPanelProps {
  slideIndex: number;
  currentDescription?: string;
  thumbnailRef: HTMLElement | null;
  containerRef: React.RefObject<HTMLElement>;
  onSubmit: (index: number, instructions: string) => void;
  onClose: () => void;
}

export function AgentEditPanel({
  slideIndex,
  currentDescription,
  thumbnailRef,
  containerRef,
  onSubmit,
  onClose,
}: AgentEditPanelProps) {
  const [editInstructions, setEditInstructions] = useState(currentDescription || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const positionRef = useRef({ top: 0, left: 0 });
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const updatePosition = () => {
      if (!thumbnailRef) return;

      const thumbRect = thumbnailRef.getBoundingClientRect();

      // Position at the bottom of the thumbnail (where the icon is), to the right of it
      const bottomY = thumbRect.bottom - 12; // Slight offset from very bottom

      positionRef.current = { 
        top: bottomY, 
        left: thumbRect.right + 8  // Position to the right of the thumbnail with gap
      };
      forceUpdate(n => n + 1);
    };

    updatePosition();
    
    // Listen to scroll and resize
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    // Also listen to scroll area if available
    const scrollArea = containerRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollArea) {
      scrollArea.addEventListener('scroll', updatePosition);
    }

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      if (scrollArea) {
        scrollArea.removeEventListener('scroll', updatePosition);
      }
    };
  }, [thumbnailRef, containerRef]);

  useEffect(() => {
    setTimeout(() => textareaRef.current?.focus(), 50);
  }, []);

  const handleSubmitEdit = () => {
    if (editInstructions.trim()) {
      onSubmit(slideIndex, editInstructions.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmitEdit();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const content = (
    <div
      className="fixed z-50 -translate-y-1/2"
      style={{ 
        top: positionRef.current.top, 
        left: positionRef.current.left,
      }}
    >
      <div 
        className={cn(
          "flex items-center shadow-lg transition-all duration-300 ease-out overflow-hidden",
          "rounded-full bg-primary text-primary-foreground"
        )}
        style={{ width: 340 }}
      >
        <div className="flex items-center w-full">
          {/* Left section - bot icon */}
          <div className="flex items-center px-3 py-2 shrink-0">
            <Bot className="h-4 w-4" />
          </div>
          
          {/* Divider */}
          <div className="w-px self-stretch bg-primary-foreground/20 shrink-0" />
          
          {/* Content area */}
          <div className="flex-1 flex items-center gap-2 px-3 py-1.5">
            <Textarea
              ref={textareaRef}
              placeholder="Describe the changes..."
              value={editInstructions}
              onChange={(e) => setEditInstructions(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 min-h-[28px] max-h-[60px] text-xs resize-none border-0 bg-primary-foreground/10 rounded-md focus-visible:ring-0 px-2 py-1.5 text-primary-foreground placeholder:text-primary-foreground/50"
              rows={1}
            />
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 shrink-0 hover:bg-primary-foreground/20"
              onClick={handleSubmitEdit}
              disabled={!editInstructions.trim()}
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 shrink-0 hover:bg-primary-foreground/20 text-primary-foreground/70"
              onClick={onClose}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
