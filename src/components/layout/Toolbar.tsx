import { cn } from '@/lib/utils';
import { Grid3X3, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ToolbarProps {
  showGrid: boolean;
  onToggleGrid: () => void;
  showNotes?: boolean;
  onToggleNotes?: () => void;
  className?: string;
}

export function Toolbar({
  showGrid,
  onToggleGrid,
  showNotes,
  onToggleNotes,
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
          <span className="text-xs text-muted-foreground font-mono">v2.0</span>
        </div>

        {/* Center section - Tools aligned to slide area */}
        <div className="flex-1 flex items-center justify-center gap-1">
          {/* Grid */}
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
            <TooltipContent>Grid View (⇧G)</TooltipContent>
          </Tooltip>

          {/* Presenter Notes */}
          {onToggleNotes && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={showNotes ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={onToggleNotes}
                >
                  <FileText className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Presenter Notes (⇧N)</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
