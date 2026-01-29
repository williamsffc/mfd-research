import React from 'react';
import { Viewer } from '@/hooks/useSlidePresence';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ViewerAvatarsProps {
  viewers: Viewer[];
  size?: 'sm' | 'md' | 'lg';
  maxDisplay?: number;
  className?: string;
}

const sizeClasses = {
  sm: 'w-5 h-5 text-[10px]',
  md: 'w-7 h-7 text-xs',
  lg: 'w-9 h-9 text-sm',
};

const overlapClasses = {
  sm: '-ml-1.5',
  md: '-ml-2',
  lg: '-ml-2.5',
};

export function ViewerAvatars({ 
  viewers, 
  size = 'md', 
  maxDisplay = 3,
  className 
}: ViewerAvatarsProps) {
  if (viewers.length === 0) return null;

  const displayedViewers = viewers.slice(0, maxDisplay);
  const remainingCount = viewers.length - maxDisplay;

  return (
    <TooltipProvider>
      <div className={cn('flex items-center', className)}>
        {displayedViewers.map((viewer, index) => (
          <Tooltip key={viewer.id}>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  'rounded-full flex items-center justify-center font-medium text-white ring-2 ring-background cursor-default',
                  sizeClasses[size],
                  index > 0 && overlapClasses[size]
                )}
                style={{ backgroundColor: viewer.color }}
              >
                {viewer.name.split(' ')[1]?.[0] || viewer.name[0]}
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              {viewer.name}
            </TooltipContent>
          </Tooltip>
        ))}
        
        {remainingCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  'rounded-full flex items-center justify-center font-medium bg-muted text-muted-foreground ring-2 ring-background cursor-default',
                  sizeClasses[size],
                  overlapClasses[size]
                )}
              >
                +{remainingCount}
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              <div className="flex flex-col gap-0.5">
                {viewers.slice(maxDisplay).map(v => (
                  <span key={v.id}>{v.name}</span>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}

// Compact indicator for thumbnails
interface ViewerIndicatorProps {
  count: number;
  className?: string;
}

export function ViewerIndicator({ count, className }: ViewerIndicatorProps) {
  if (count === 0) return null;

  return (
    <div className={cn(
      'flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-background/90 backdrop-blur-sm border border-border/50 shadow-sm',
      className
    )}>
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
      <span className="text-[10px] font-medium text-muted-foreground">
        {count}
      </span>
    </div>
  );
}
