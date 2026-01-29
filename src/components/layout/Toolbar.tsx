import { cn } from '@/lib/utils';
import {
  Grid3X3,
  MessageCircle,
  ListTodo,
  Wand2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ToolbarProps {
  showGrid: boolean;
  onToggleGrid: () => void;
  showComments: boolean;
  onToggleComments: () => void;
  isEditMode?: boolean;
  onToggleEditMode?: () => void;
  showQueue?: boolean;
  onToggleQueue?: () => void;
  queueCount?: number;
  className?: string;
}

export function Toolbar({
  showGrid,
  onToggleGrid,
  showComments,
  onToggleComments,
  isEditMode,
  onToggleEditMode,
  showQueue,
  onToggleQueue,
  queueCount = 0,
  className,
}: ToolbarProps) {
  return (
    <TooltipProvider>
      <div
        className={cn(
          'h-12 border-b bg-background flex items-center px-4',
          className
        )}
      >
        {/* Left section - Title (matches sidebar width w-64 = 256px) */}
        <div className="w-64 flex items-center gap-2 flex-shrink-0 px-4">
          <span className="font-semibold text-lg">SlideForge</span>
          <span className="text-xs text-muted-foreground font-mono">v1.0</span>
        </div>

        {/* Center section - Tools aligned to slide area */}
        <div className="flex-1 flex items-center justify-center gap-1">
          {/* Comment / Edit Mode - mutually exclusive */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={showComments ? 'secondary' : 'ghost'}
                size="icon"
                onClick={onToggleComments}
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Comments (⇧C)</TooltipContent>
          </Tooltip>

          {onToggleEditMode && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isEditMode ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={onToggleEditMode}
                >
                  <Wand2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>AI Edit Mode (⇧E)</TooltipContent>
            </Tooltip>
          )}

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* Grid / Queue */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={showGrid ? 'secondary' : 'ghost'}
                size="icon"
                onClick={onToggleGrid}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Grid (⇧G)</TooltipContent>
          </Tooltip>

          {onToggleQueue && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={showQueue ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={onToggleQueue}
                  className="relative"
                >
                  <ListTodo className="h-4 w-4" />
                  {queueCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                      {queueCount}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Queue (⇧Q)</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
