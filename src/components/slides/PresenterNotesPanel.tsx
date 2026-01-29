import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { X, Save, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { usePresenterNotes } from '@/hooks/usePresenterNotes';
import { toast } from 'sonner';

interface PresenterNotesPanelProps {
  slideId: string | undefined;
  onClose: () => void;
  className?: string;
}

export function PresenterNotesPanel({ slideId, onClose, className }: PresenterNotesPanelProps) {
  const { notes, loading, saveNotes } = usePresenterNotes(slideId);
  const [content, setContent] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync content when notes load
  useEffect(() => {
    if (notes) {
      setContent(notes.content);
      setIsDirty(false);
    } else {
      setContent('');
      setIsDirty(false);
    }
  }, [notes]);

  const handleSave = async () => {
    const success = await saveNotes(content);
    if (success) {
      setIsDirty(false);
      toast.success('Notes saved');
    } else {
      toast.error('Failed to save notes');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Cmd/Ctrl + S to save
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
    // Escape to close
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className={cn(
      'flex flex-col h-full border-l bg-card',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-medium text-sm">Presenter Notes</h3>
        </div>
        <div className="flex items-center gap-2">
          {isDirty && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className="h-7 px-2 text-xs"
            >
              <Save className="w-3 h-3 mr-1" />
              Save
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-7 w-7"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-hidden">
        {loading ? (
          <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
            Loading...
          </div>
        ) : (
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setIsDirty(true);
            }}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            placeholder="Add notes for this slide... (Visible only to you during presentation)"
            className="h-full resize-none text-sm leading-relaxed"
          />
        )}
      </div>

      {/* Footer hint */}
      <div className="px-4 py-2 border-t text-xs text-muted-foreground">
        ⌘S to save • Esc to close
      </div>
    </div>
  );
}
