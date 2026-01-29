import React, { useState } from 'react';
import { Wand2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useSlideScale } from '@/components/slides/SlideCanvas';

interface EditPinProps {
  id: string;
  content: string;
  xPosition: number;
  yPosition: number;
  createdAt: string;
  onDelete: (id: string) => void;
}

export function EditPin({
  id,
  content,
  xPosition,
  yPosition,
  createdAt,
  onDelete,
}: EditPinProps) {
  const scale = useSlideScale();
  const [isOpen, setIsOpen] = useState(false);

  // Inverse scale to maintain consistent pin size
  const inverseScale = 1 / scale;

  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className="edit-pin absolute z-30"
      style={{
        left: `${xPosition}%`,
        top: `${yPosition}%`,
        transform: `translate(-50%, -50%) scale(${inverseScale})`,
      }}
    >
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center transition-all",
              "bg-primary text-primary-foreground shadow-lg",
              "hover:scale-110 hover:shadow-xl",
              "ring-2 ring-background"
            )}
          >
            <Wand2 className="h-3.5 w-3.5" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-72 p-3"
          side="right"
          align="start"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <Wand2 className="h-4 w-4" />
                <span>AI Edit</span>
              </div>
              <span className="text-xs text-muted-foreground">{formattedDate}</span>
            </div>
            
            <p className="text-sm text-foreground whitespace-pre-wrap">
              {content}
            </p>
            
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(id)}
                className="h-8 px-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
