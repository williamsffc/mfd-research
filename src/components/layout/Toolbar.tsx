import { cn } from '@/lib/utils';
import { Grid3X3, FileText, MoreVertical, Play, Monitor, Moon, Sun, PanelLeftClose, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface ToolbarProps {
  showGrid: boolean;
  onToggleGrid: () => void;
  showNotes?: boolean;
  onToggleNotes?: () => void;
  showSidebar?: boolean;
  onToggleSidebar?: () => void;
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
  showSidebar,
  onToggleSidebar,
  isDarkMode,
  onToggleDarkMode,
  onStartPresentation,
  onStartPresenterView,
  className
}: ToolbarProps) {
  return (
    <div className={cn('h-12 border-b bg-background flex items-center', className)}>
      {/* Left section - matches sidebar width */}
      <div className="w-64 flex items-center gap-2 flex-shrink-0 px-4" />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right section - All options in menu */}
      <div className="flex items-center justify-end flex-shrink-0 px-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onToggleSidebar && (
              <DropdownMenuItem onClick={onToggleSidebar}>
                {showSidebar ? <PanelLeftClose className="h-4 w-4 mr-2" /> : <PanelLeft className="h-4 w-4 mr-2" />}
                {showSidebar ? 'Hide Sidebar' : 'Show Sidebar'}
                <span className="ml-auto text-xs text-muted-foreground">⇧S</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={onToggleGrid}>
              <Grid3X3 className="h-4 w-4 mr-2" />
              {showGrid ? 'Hide Grid' : 'Show Grid'}
              <span className="ml-auto text-xs text-muted-foreground">⇧G</span>
            </DropdownMenuItem>
            {onToggleNotes && (
              <DropdownMenuItem onClick={onToggleNotes}>
                <FileText className="h-4 w-4 mr-2" />
                {showNotes ? 'Hide Notes' : 'Show Notes'}
                <span className="ml-auto text-xs text-muted-foreground">⇧N</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {onStartPresentation && (
              <DropdownMenuItem onClick={onStartPresentation}>
                <Play className="h-4 w-4 mr-2" />
                Present
                <span className="ml-auto text-xs text-muted-foreground">⇧P</span>
              </DropdownMenuItem>
            )}
            {onStartPresenterView && (
              <DropdownMenuItem onClick={onStartPresenterView}>
                <Monitor className="h-4 w-4 mr-2" />
                Presenter View
                <span className="ml-auto text-xs text-muted-foreground">⇧V</span>
              </DropdownMenuItem>
            )}
            {onToggleDarkMode && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onToggleDarkMode}>
                  {isDarkMode ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}