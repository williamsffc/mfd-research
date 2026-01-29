import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { Bot, Plus, Trash2, Send } from 'lucide-react';
import { useSlideChanges, SlideChange } from '@/hooks/useSlideChanges';

interface SlideChangesPanelProps {
  slideId: string;
  slideIndex: number;
  thumbnailRef: HTMLElement | null;
  containerRef: React.RefObject<HTMLElement>;
  onClose: () => void;
  pendingDescription?: string;
  onClearPendingEdit?: () => void;
}

export function SlideChangesPanel({
  slideId,
  slideIndex,
  thumbnailRef,
  containerRef,
  onClose,
  pendingDescription,
  onClearPendingEdit,
}: SlideChangesPanelProps) {
  const { changes, loading, addChange, updateChange, deleteChange } = useSlideChanges(slideId);
  const [newChangeText, setNewChangeText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const positionRef = useRef({ top: 0, left: 0 });
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const updatePosition = () => {
      if (!thumbnailRef) return;

      const thumbRect = thumbnailRef.getBoundingClientRect();
      const bottomY = thumbRect.bottom - 12;

      positionRef.current = { 
        top: bottomY, 
        left: thumbRect.right + 8
      };
      forceUpdate(n => n + 1);
    };

    updatePosition();
    
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

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

  // Auto-focus input
  useEffect(() => {
    if (!loading) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [loading]);

  // Focus edit input when editing starts
  useEffect(() => {
    if (editingId) {
      setTimeout(() => editInputRef.current?.focus(), 50);
    }
  }, [editingId]);

  const handleAddChange = async () => {
    if (!newChangeText.trim()) return;
    await addChange(newChangeText);
    setNewChangeText('');
    inputRef.current?.focus();
  };

  const handleUpdateChange = async (changeId: string) => {
    if (!editingText.trim()) return;
    await updateChange(changeId, editingText);
    setEditingId(null);
    setEditingText('');
  };

  const handleDeleteChange = async (changeId: string) => {
    await deleteChange(changeId);
    if (changes.length === 1) {
      onClose();
    }
  };

  const startEditing = (change: SlideChange) => {
    setEditingId(change.id);
    setEditingText(change.content);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (editingId) {
        setEditingId(null);
        setEditingText('');
      } else {
        onClose();
      }
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddChange();
    }
    handleKeyDown(e);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent, changeId: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUpdateChange(changeId);
    }
    handleKeyDown(e);
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
        className="flex flex-col shadow-xl overflow-hidden rounded-2xl bg-primary text-primary-foreground"
        style={{ width: 300 }}
      >
        {/* Compact header */}
        <div className="flex items-center gap-2 px-4 py-2.5">
          <Bot className="h-4 w-4 opacity-70" />
          <span className="text-sm font-medium flex-1">Slide {slideIndex + 1}</span>
          {changes.length > 0 && (
            <span className="text-xs opacity-60">{changes.length}</span>
          )}
          <button 
            className="ml-1 text-primary-foreground/50 hover:text-primary-foreground transition-colors"
            onClick={onClose}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Pending bulk edit description */}
        {pendingDescription && (
          <div className="px-3 pb-2">
            <div className="flex items-start gap-2 py-2 px-2 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20">
              <span className="flex-1 text-sm italic opacity-80">
                {pendingDescription}
              </span>
              {onClearPendingEdit && (
                <button
                  className="opacity-60 hover:opacity-100 transition-opacity flex-shrink-0"
                  onClick={onClearPendingEdit}
                  title="Clear pending edit"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Changes list - minimal styling */}
        {changes.length > 0 && (
          <div className="px-3 pb-2 space-y-1 max-h-[200px] overflow-y-auto">
            {changes.map((change) => (
              <div
                key={change.id}
                className="group flex items-center gap-2 py-1.5 px-2 -mx-1 rounded-lg hover:bg-primary-foreground/10 transition-colors"
              >
                {editingId === change.id ? (
                  <input
                    ref={editInputRef}
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyDown={(e) => handleEditKeyDown(e, change.id)}
                    onBlur={() => {
                      if (editingText.trim()) {
                        handleUpdateChange(change.id);
                      } else {
                        setEditingId(null);
                        setEditingText('');
                      }
                    }}
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-primary-foreground/40"
                  />
                ) : (
                  <>
                    <span 
                      className="flex-1 text-sm cursor-text"
                      onClick={() => startEditing(change)}
                    >
                      {change.content}
                    </span>
                    <button
                      className="opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity"
                      onClick={() => handleDeleteChange(change.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Input area - always visible */}
        <div className="flex items-center gap-2 px-3 py-2.5 border-t border-primary-foreground/10">
          <Plus className="w-4 h-4 opacity-40" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Add a change..."
            value={newChangeText}
            onChange={(e) => setNewChangeText(e.target.value)}
            onKeyDown={handleInputKeyDown}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-primary-foreground/40"
          />
          {newChangeText.trim() && (
            <button
              className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              onClick={handleAddChange}
            >
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
