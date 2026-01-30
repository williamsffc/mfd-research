import { cn } from '@/lib/utils';
import { Grid3X3, FileText, MoreVertical, Play, Monitor, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
interface ToolbarProps {
  showGrid: boolean;
  onToggleGrid: () => void;
  showNotes?: boolean;
  onToggleNotes?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  onStartPresentation?: () => void;
  onStartPresenterView?: () => void;
  className?: string;
}
export function Toolbar({
  showGrid,
  onToggleGrid,
  showNotes,
  onToggleNotes,
  isDarkMode,
  onToggleDarkMode,
  onStartPresentation,
  onStartPresenterView,
  className
}: ToolbarProps) {
  return <TooltipProvider>
      <div className={cn('h-12 border-b bg-background flex items-center', className)}>
        {/* Left section - Title (matches sidebar width w-64 = 256px) */}
        <div className="w-64 flex items-center gap-2 flex-shrink-0 px-4">
          
          
        </div>

        {/* Center section - Tools aligned to slide area */}
        <div className="flex-1 flex items-center justify-center gap-1">
          {/* Grid toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={showGrid ? 'secondary' : 'ghost'} size="icon" onClick={onToggleGrid}>
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Grid (⇧G)</TooltipContent>
          </Tooltip>

          {/* Presenter Notes toggle */}
          {onToggleNotes && <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={showNotes ? 'secondary' : 'ghost'} size="icon" onClick={onToggleNotes}>
                  <FileText className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Presenter Notes (⇧N)</TooltipContent>
            </Tooltip>}
        </div>

        {/* Right section - More options menu (matches left section width for centering) */}
        <div className="w-64 flex items-center justify-end flex-shrink-0 px-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onStartPresentation && <DropdownMenuItem onClick={onStartPresentation}>
                  <Play className="h-4 w-4 mr-2" />
                  Present
                  <span className="ml-auto text-xs text-muted-foreground">⇧P</span>
                </DropdownMenuItem>}
              {onStartPresenterView && <DropdownMenuItem onClick={onStartPresenterView}>
                  <Monitor className="h-4 w-4 mr-2" />
                  Presenter View
                  <span className="ml-auto text-xs text-muted-foreground">⇧V</span>
                </DropdownMenuItem>}
              {(onStartPresentation || onStartPresenterView) && onToggleDarkMode && <DropdownMenuSeparator />}
              {onToggleDarkMode && <DropdownMenuItem onClick={onToggleDarkMode}>
                  {isDarkMode ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </DropdownMenuItem>}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </TooltipProvider>;
}