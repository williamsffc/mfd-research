import React, { useState, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SlideThumbnail } from '@/components/slides/SlideThumbnail';

interface SlideItem {
  id: string;
  content: React.ReactNode;
}

interface SidebarProps {
  slides: SlideItem[];
  activeSlideIndex: number;
  onSlideClick: (index: number) => void;
  width: number;
  onWidthChange: (width: number) => void;
  className?: string;
}

export function Sidebar({
  slides,
  activeSlideIndex,
  onSlideClick,
  width,
  onWidthChange,
  className,
}: SidebarProps) {
  const [isResizing, setIsResizing] = useState(false);

  // Handle resize
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    
    const startX = e.clientX;
    const startWidth = width;
    
    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - startX;
      const newWidth = Math.max(200, Math.min(400, startWidth + delta));
      onWidthChange(newWidth);
    };
    
    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [width, onWidthChange]);

  return (
    <div
      className={cn(
        'bg-[hsl(var(--sidebar-bg))] border-r border-[hsl(var(--sidebar-border))] flex flex-col outline-none relative',
        className
      )}
      style={{ width }}
    >
      {/* Resize handle */}
      <div
        className={cn(
          'absolute top-0 right-0 w-1 h-full cursor-ew-resize hover:bg-primary/50 transition-colors z-30',
          isResizing && 'bg-primary'
        )}
        onMouseDown={handleResizeStart}
      />

      {/* Slide list */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {slides.map((slide, index) => (
            <SlideThumbnail
              key={slide.id}
              slideNumber={index + 1}
              isActive={index === activeSlideIndex}
              onClick={() => onSlideClick(index)}
            >
              {slide.content}
            </SlideThumbnail>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
