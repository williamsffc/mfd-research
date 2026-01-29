import React from 'react';
import { cn } from '@/lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SlideThumbnailProps {
  id: string;
  slideNumber: number;
  isActive?: boolean;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onDuplicate?: () => void;
  children: React.ReactNode;
}

export function SlideThumbnail({
  id,
  slideNumber,
  isActive = false,
  isSelected = false,
  onClick,
  onDuplicate,
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
          <span className="text-xs text-muted-foreground font-mono">{slideNumber}</span>
        </div>
        
        <div
          className={cn(
            'slide-thumbnail relative flex-1 aspect-video bg-[hsl(var(--slide-bg))] rounded-md overflow-hidden border cursor-grab active:cursor-grabbing',
            isActive ? 'active ring-2 ring-primary' : 'border-border hover:border-primary/50',
            isDragging && 'ring-2 ring-primary/50'
          )}
          onClick={onClick}
        >
          <div className="absolute inset-0 bg-white dark:bg-slate-900" />
          <div className="absolute inset-0 overflow-hidden pointer-events-none isolate">
            <div className="origin-top-left" style={{ transform: 'scale(0.125)', width: '800%', height: '800%' }}>
              {children}
            </div>
          </div>
          
          {isSelected && <div className="absolute inset-0 bg-primary/10 pointer-events-none" />}
          
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
        </div>
      </div>
    </div>
  );
}
