import React, { useState, useEffect, useRef } from 'react';
import { Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useSlideScale } from '@/components/slides/SlideCanvas';

interface AddCommentOverlayProps {
  isOpen: boolean;
  position: { x: number; y: number };
  onSubmit: (authorName: string, content: string) => void;
  onClose: () => void;
}

export function AddCommentOverlay({
  isOpen,
  position,
  onSubmit,
  onClose,
}: AddCommentOverlayProps) {
  const scale = useSlideScale();
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const overlayRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
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
    if (authorName.trim() && content.trim()) {
      onSubmit(authorName.trim(), content.trim());
      setAuthorName('');
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
        "absolute z-50 w-64 bg-popover border border-border rounded-md shadow-lg p-3 animate-in fade-in-0 zoom-in-95",
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
        className="absolute w-2.5 h-2.5 bg-popover border-l border-t border-border rotate-[-45deg]"
        style={{
          left: '-5px',
          top: '12px',
        }}
      />
      
      <div className="space-y-2">
        <Input
          ref={inputRef}
          placeholder="Your name"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          className="h-8 text-sm"
        />
        <Textarea
          placeholder="Add a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[60px] text-sm resize-none"
        />
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">⌘+Enter</span>
          <div className="flex gap-1.5">
            <Button variant="ghost" size="sm" onClick={onClose} className="h-7 w-7 p-0">
              <X className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!authorName.trim() || !content.trim()}
              className="h-7 w-7 p-0"
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
