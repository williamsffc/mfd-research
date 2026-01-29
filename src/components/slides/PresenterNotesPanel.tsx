import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { FileText, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { usePresenterNotes } from '@/hooks/usePresenterNotes';
import { toast } from 'sonner';

interface PresenterNotesPanelProps {
  slideId: string | null;
  slideIndex: number;
  onClose: () => void;
  className?: string;
}

export function PresenterNotesPanel({
  slideId,
  slideIndex,
  onClose,
  className,
}: PresenterNotesPanelProps) {
  const { note, loading, saveNote } = usePresenterNotes(slideId);
  const [content, setContent] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync content when note loads
  useEffect(() => {
    setContent(note?.content || '');
    setIsDirty(false);
  }, [note]);

  const handleSave = async () => {
    const success = await saveNote(content);
    if (success) {
      toast.success('Notes saved');
      setIsDirty(false);
    } else {
      toast.error('Failed to save notes');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className={cn(
        'h-48 bg-card border-t border-border flex flex-col w-full',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-sm">Presenter Notes</span>
          <span className="text-xs text-muted-foreground">Slide {slideIndex + 1}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {isDirty ? 'Unsaved' : 'Saved'} • ⌘S to save
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSave}
            disabled={!isDirty}
            className="h-7 gap-1"
          >
            <Save className="h-3.5 w-3.5" />
            Save
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-3 overflow-hidden">
        {loading ? (
          <div className="flex-1 flex items-center justify-center h-full">
            <div className="text-sm text-muted-foreground">Loading...</div>
          </div>
        ) : (
          <Textarea
            ref={textareaRef}
            placeholder="Add notes for this slide..."
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setIsDirty(true);
            }}
            onKeyDown={handleKeyDown}
            className="h-full resize-none text-sm"
          />
        )}
      </div>
    </div>
  );
}
