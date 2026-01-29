import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useSlideScale } from '@/components/slides/SlideCanvas';

interface AddEditOverlayProps {
  isOpen: boolean;
  position: { x: number; y: number };
  onSubmit: (content: string) => void;
  onClose: () => void;
}

export function AddEditOverlay({
  isOpen,
  position,
  onSubmit,
  onClose,
}: AddEditOverlayProps) {
  const scale = useSlideScale();
  const [content, setContent] = useState('');
  const overlayRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content.trim());
      setContent('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  // Inverse scale to maintain consistent size
  const inverseScale = 1 / scale;

  // Calculate position - offset from click point
  const left = `${Math.min(position.x, 70)}%`;
  const top = `${Math.min(position.y, 60)}%`;

  return (
    <div
      ref={overlayRef}
      className={cn(
        "absolute z-50 w-80 bg-popover border border-primary/30 rounded-lg shadow-lg p-4 animate-in fade-in-0 zoom-in-95",
      )}
      style={{
        left,
        top,
        transform: `translate(8px, 8px) scale(${inverseScale})`,
        transformOrigin: 'top left',
      }}
      onKeyDown={handleKeyDown}
    >
      {/* Small arrow pointing to click location */}
      <div 
        className="absolute w-3 h-3 bg-popover border-l border-t border-primary/30 rotate-[-45deg]"
        style={{
          left: '-6px',
          top: '16px',
        }}
      />
      
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <Wand2 className="h-4 w-4" />
          <span>AI Edit Request</span>
        </div>
        <Textarea
          ref={textareaRef}
          placeholder="Describe what you want the AI to change at this location..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[100px] text-base resize-none border-primary/20 focus:border-primary/50"
        />
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">⌘+Enter to submit</span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onClose} className="h-9 px-3">
              <X className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!content.trim()}
              className="h-9 px-3"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
