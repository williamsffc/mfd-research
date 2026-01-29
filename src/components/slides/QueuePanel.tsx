import React, { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { X, MessageSquare, Bot, ChevronRight, Check, Clock, Sparkles, FileText, Layers, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAllComments, CommentWithSlide } from '@/hooks/useAllComments';
import { formatDistanceToNow } from 'date-fns';

interface SlideInfo {
  id: string;
  position: number;
  name: string;
  description?: string;
  pendingAgentAction?: boolean;
  component: React.ComponentType;
}

interface QueuePanelProps {
  slides: SlideInfo[];
  onClose: () => void;
  onSlideClick: (index: number) => void;
  onResolveComment?: (commentId: string, resolved: boolean) => void;
  onMarkEditDone?: (slideId: string) => void;
}

interface EditGroup {
  description: string;
  rawDescription: string;
  slides: SlideInfo[];
  isNew?: boolean;
  isBulkEdit?: boolean;
}

type ViewMode = 'byEdit' | 'bySlide';

export function QueuePanel({
  slides,
  onClose,
  onSlideClick,
  onResolveComment,
  onMarkEditDone,
}: QueuePanelProps) {
  const { comments, loading: commentsLoading } = useAllComments();
  const [viewMode, setViewMode] = useState<ViewMode>('byEdit');

  // Get all pending slides
  const pendingSlides = useMemo(() => 
    slides.filter(s => s.pendingAgentAction).sort((a, b) => a.position - b.position),
    [slides]
  );

  // Group slides by their edit description
  const editGroups = useMemo(() => {
    const groups = new Map<string, SlideInfo[]>();

    pendingSlides.forEach(slide => {
      // Parse out the actual instructions from joint edit format
      let key = slide.description || '';
      
      // If empty or just whitespace, mark as "New slide"
      if (!key.trim()) {
        key = '🆕 New slide (needs content)';
      } else if (key.startsWith('Joint edit for slides')) {
        // Extract the actual comment from joint edit format
        const match = key.match(/Comment: (.+)$/);
        key = match ? `✏️ ${match[1]}` : `✏️ ${key}`;
      } else {
        key = `✏️ ${key}`;
      }
      
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(slide);
    });

    // Sort each group by position
    const result: EditGroup[] = [];
    groups.forEach((slideGroup, description) => {
      slideGroup.sort((a, b) => a.position - b.position);
      const isNew = description.includes('New slide');
      const isBulkEdit = slideGroup.length > 1;
      const rawDescription = slideGroup[0]?.description || '';
      result.push({ description, rawDescription, slides: slideGroup, isNew, isBulkEdit });
    });

    // Sort groups: new slides first, then by first slide position
    result.sort((a, b) => {
      if (a.isNew && !b.isNew) return -1;
      if (!a.isNew && b.isNew) return 1;
      return a.slides[0].position - b.slides[0].position;
    });

    return result;
  }, [pendingSlides]);

  // Stats
  const bulkEditCount = editGroups.filter(g => g.isBulkEdit).length;
  const singleEditCount = editGroups.filter(g => !g.isBulkEdit && !g.isNew).length;
  const newSlideCount = editGroups.filter(g => g.isNew).reduce((acc, g) => acc + g.slides.length, 0);

  // Group comments by slide
  const commentsBySlide = useMemo(() => {
    const grouped = new Map<number, CommentWithSlide[]>();
    comments.forEach(comment => {
      if (!grouped.has(comment.slidePosition)) {
        grouped.set(comment.slidePosition, []);
      }
      grouped.get(comment.slidePosition)!.push(comment);
    });
    return grouped;
  }, [comments]);

  const unresolvedCount = comments.filter(c => !c.resolved).length;
  const pendingEditCount = pendingSlides.length;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-background/95 backdrop-blur-xl border-l border-border shadow-2xl z-50 flex flex-col animate-slide-in-right">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-lg">Queue</h2>
          <div className="flex items-center gap-2">
            {unresolvedCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 text-xs font-medium">
                {unresolvedCount} comments
              </span>
            )}
            {pendingEditCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium">
                {pendingEditCount} edits
              </span>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Edit Queue Section */}
          {pendingSlides.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    AI Edit Queue
                  </h3>
                </div>
                
                {/* View mode toggle */}
                <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-0.5">
                  <button
                    onClick={() => setViewMode('byEdit')}
                    className={cn(
                      "flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors",
                      viewMode === 'byEdit' 
                        ? "bg-background text-foreground shadow-sm" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Layers className="h-3 w-3" />
                    By Edit
                  </button>
                  <button
                    onClick={() => setViewMode('bySlide')}
                    className={cn(
                      "flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors",
                      viewMode === 'bySlide' 
                        ? "bg-background text-foreground shadow-sm" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <List className="h-3 w-3" />
                    By Slide
                  </button>
                </div>
              </div>

              {/* Stats summary */}
              <div className="flex items-center gap-3 mb-4 text-xs text-muted-foreground">
                {bulkEditCount > 0 && (
                  <span className="flex items-center gap-1">
                    <Layers className="h-3 w-3 text-primary" />
                    {bulkEditCount} bulk {bulkEditCount === 1 ? 'edit' : 'edits'}
                  </span>
                )}
                {singleEditCount > 0 && (
                  <span className="flex items-center gap-1">
                    <Bot className="h-3 w-3 text-primary" />
                    {singleEditCount} single {singleEditCount === 1 ? 'edit' : 'edits'}
                  </span>
                )}
                {newSlideCount > 0 && (
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3 text-amber-500" />
                    {newSlideCount} new {newSlideCount === 1 ? 'slide' : 'slides'}
                  </span>
                )}
              </div>

              {viewMode === 'byEdit' ? (
                // Group by edit instruction
                <div className="space-y-3">
                  {editGroups.map((group, groupIndex) => (
                    <div
                      key={groupIndex}
                      className={cn(
                        "rounded-xl p-4 border transition-all",
                        group.isNew 
                          ? "bg-amber-500/5 border-amber-500/30" 
                          : group.isBulkEdit
                            ? "bg-violet-500/5 border-violet-500/30"
                            : "bg-primary/5 border-primary/20"
                      )}
                    >
                      {/* Bulk edit badge */}
                      {group.isBulkEdit && (
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-600 text-[10px] font-semibold uppercase tracking-wide">
                            Bulk Edit
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {group.slides.length} slides
                          </span>
                        </div>
                      )}

                      {/* Edit description with icon */}
                      <div className="flex items-start gap-2 mb-3">
                        {group.isNew ? (
                          <FileText className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                        ) : group.isBulkEdit ? (
                          <Layers className="h-4 w-4 text-violet-500 mt-0.5 shrink-0" />
                        ) : (
                          <Bot className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        )}
                        <p className="text-sm font-medium text-foreground leading-tight">
                          {group.description}
                        </p>
                      </div>

                      {/* Grouped slides as horizontal list */}
                      <div className="flex flex-wrap gap-2">
                        {group.slides.map((slide) => (
                          <button
                            key={slide.id}
                            onClick={() => onSlideClick(slide.position)}
                            className="group relative bg-background rounded-lg border border-border overflow-hidden hover:border-primary transition-all duration-200 hover:shadow-md"
                            style={{ width: 72, height: 40 }}
                          >
                            {/* Mini slide preview */}
                            <div className="absolute inset-0 bg-white dark:bg-slate-900 overflow-hidden pointer-events-none">
                              <div
                                className="origin-top-left"
                                style={{
                                  transform: 'scale(0.0375)',
                                  width: `${100 / 0.0375}%`,
                                  height: `${100 / 0.0375}%`,
                                }}
                              >
                                <slide.component />
                              </div>
                            </div>

                            {/* Slide number overlay */}
                            <div className="absolute bottom-0.5 left-0.5 bg-foreground/80 text-background text-[9px] font-bold px-1 py-0.5 rounded">
                              {slide.position + 1}
                            </div>

                            {/* Hover indicator */}
                            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors" />
                          </button>
                        ))}
                      </div>

                      {/* Slide count and action */}
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/30">
                        <span className="text-xs text-muted-foreground">
                          {group.slides.length} {group.slides.length === 1 ? 'slide' : 'slides'}
                          {group.slides.length > 1 && ` (${group.slides[0].position + 1}–${group.slides[group.slides.length - 1].position + 1})`}
                        </span>
                        <button
                          onClick={() => onSlideClick(group.slides[0].position)}
                          className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                        >
                          View
                          <ChevronRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // By slide view - individual slide list
                <div className="space-y-2">
                  {pendingSlides.map((slide) => {
                    // Find which group this slide belongs to
                    const group = editGroups.find(g => g.slides.some(s => s.id === slide.id));
                    const isBulkEdit = group?.isBulkEdit;
                    const isNew = group?.isNew;
                    
                    return (
                      <button
                        key={slide.id}
                        onClick={() => onSlideClick(slide.position)}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-lg border transition-all hover:shadow-md",
                          isNew 
                            ? "bg-amber-500/5 border-amber-500/30 hover:border-amber-500/50" 
                            : isBulkEdit
                              ? "bg-violet-500/5 border-violet-500/30 hover:border-violet-500/50"
                              : "bg-primary/5 border-primary/20 hover:border-primary/40"
                        )}
                      >
                        {/* Slide thumbnail */}
                        <div 
                          className="relative bg-background rounded border border-border overflow-hidden shrink-0"
                          style={{ width: 64, height: 36 }}
                        >
                          <div className="absolute inset-0 bg-white dark:bg-slate-900 overflow-hidden pointer-events-none">
                            <div
                              className="origin-top-left"
                              style={{
                                transform: 'scale(0.0333)',
                                width: `${100 / 0.0333}%`,
                                height: `${100 / 0.0333}%`,
                              }}
                            >
                              <slide.component />
                            </div>
                          </div>
                        </div>

                        {/* Slide info */}
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-medium text-sm">Slide {slide.position + 1}</span>
                            {isBulkEdit && (
                              <span className="px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-600 text-[9px] font-semibold uppercase">
                                Bulk
                              </span>
                            )}
                            {isNew && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 text-[9px] font-semibold uppercase">
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {group?.description || 'Pending edit'}
                          </p>
                        </div>

                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {/* Comments Section */}
          {comments.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="h-4 w-4 text-amber-500" />
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  Comments
                </h3>
              </div>

              <div className="space-y-2">
                {Array.from(commentsBySlide.entries()).map(([slidePosition, slideComments]) => (
                  <div key={slidePosition} className="space-y-2">
                    {/* Slide header */}
                    <button
                      onClick={() => onSlideClick(slidePosition)}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-full"
                    >
                      <span className="font-medium">Slide {slidePosition + 1}</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>

                    {/* Comments for this slide */}
                    {slideComments.map((comment) => (
                      <CommentCard
                        key={comment.id}
                        comment={comment}
                        onResolve={onResolveComment}
                        onClick={() => onSlideClick(slidePosition)}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Empty state */}
          {pendingSlides.length === 0 && comments.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <Check className="h-6 w-6" />
              </div>
              <p className="font-medium">All caught up!</p>
              <p className="text-sm mt-1">No pending edits or comments</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

interface CommentCardProps {
  comment: CommentWithSlide;
  onResolve?: (commentId: string, resolved: boolean) => void;
  onClick: () => void;
}

function CommentCard({ comment, onResolve, onClick }: CommentCardProps) {
  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });

  return (
    <div
      className={cn(
        "rounded-lg p-3 border transition-all duration-200 cursor-pointer",
        comment.resolved
          ? "bg-muted/30 border-border/50 opacity-60"
          : "bg-background border-border hover:border-primary/50 hover:shadow-sm"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm truncate">{comment.authorName}</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {timeAgo}
            </span>
          </div>
          <p className="text-sm text-foreground/80 line-clamp-2">{comment.content}</p>
          
          {comment.replies && comment.replies.length > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
            </p>
          )}
        </div>

        {onResolve && (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-6 w-6 shrink-0",
              comment.resolved
                ? "text-green-500 hover:text-green-600"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onResolve(comment.id, !comment.resolved);
            }}
          >
            <Check className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
