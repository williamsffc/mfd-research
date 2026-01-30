import { Grid3X3, FileText, MoreVertical, Play, Monitor, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
}: ToolbarProps) {
  return (
    <div className="absolute top-3 right-3 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="bg-background/80 backdrop-blur-sm shadow-sm border">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
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
  );
}