import React from 'react';
import { cn } from '@/lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Bot, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ViewerIndicator } from './ViewerAvatars';

interface SlideThumbnailProps {
  id: string;
  slideNumber: number;
  isActive?: boolean;
  isSelected?: boolean;
  pendingAgentAction?: boolean;
  changeCount?: number;
  viewerCount?: number;
  onClick?: (e: React.MouseEvent) => void;
  onDuplicate?: () => void;
  onAgentClick?: () => void;
  children: React.ReactNode;
}

export function SlideThumbnail({
  id,
  slideNumber,
  isActive = false,
  isSelected = false,
  pendingAgentAction = false,
  changeCount = 0,
  viewerCount = 0,
  onClick,
  onDuplicate,
  onAgentClick,
  children,
}: SlideThumbnailProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  // When dragging, hide this item (DragOverlay shows the preview)
  // Keep the space occupied to prevent layout shift
  const style = {
    transform: isDragging ? undefined : CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDuplicate?.();
  };

  return (
    <div
        ref={setNodeRef}
        style={style}
        className="group relative"
        {...attributes}
        {...listeners}
      >
        <div className="flex items-start gap-2">
          <div className="flex flex-col items-center gap-1 pt-2">
            <GripVertical className="w-4 h-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
            <span className="text-xs text-muted-foreground font-mono">
              {slideNumber}
            </span>
          </div>
          
          <div
            className={cn(
              'slide-thumbnail relative flex-1 aspect-video bg-[hsl(var(--slide-bg))] rounded-md overflow-hidden border cursor-grab active:cursor-grabbing',
              isActive ? 'active ring-2 ring-primary' : 'border-border hover:border-primary/50',
              isDragging && 'ring-2 ring-primary/50'
            )}
            onClick={onClick}
          >
            {/* Solid background to prevent bleed-through */}
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
                {children}
              </div>
            </div>
            
            {/* Selection overlay for first selected slide */}
            {isSelected && (
              <div className="absolute inset-0 bg-primary/10 pointer-events-none" />
            )}
            
            {/* Viewer indicator */}
            <ViewerIndicator count={viewerCount} className="absolute top-1 left-1 z-10" />
            
            {/* Hover actions */}
            <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              {onDuplicate && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-6 w-6 bg-background/90 hover:bg-background shadow-sm"
                        onClick={handleDuplicate}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="text-xs">Duplicate slide</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            
            {/* Agent action indicator - filled Bot when changes exist, outline when none */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    className={cn(
                      "absolute bottom-1 right-1 z-10 flex items-center justify-center h-5 rounded transition-all",
                      pendingAgentAction || changeCount > 0
                        ? "bg-primary/90 text-primary-foreground hover:bg-primary px-1.5 gap-1"
                        : "bg-transparent border border-muted-foreground/40 text-muted-foreground/60 hover:border-muted-foreground hover:text-muted-foreground w-5 opacity-0 group-hover:opacity-100"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAgentClick?.();
                    }}
                  >
                    <Bot className="h-3 w-3" strokeWidth={pendingAgentAction || changeCount > 0 ? 2 : 1.5} />
                    {(pendingAgentAction || changeCount > 0) && changeCount > 0 && (
                      <span className="text-[10px] font-medium">{changeCount}</span>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-[200px]">
                  {pendingAgentAction || changeCount > 0 ? (
                    <>
                      <p className="text-xs font-medium">{changeCount} pending change{changeCount !== 1 ? 's' : ''}</p>
                      <p className="text-xs text-muted-foreground">Click to view/edit</p>
                    </>
                  ) : (
                    <p className="text-xs">Add agent edit</p>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
  );
}
