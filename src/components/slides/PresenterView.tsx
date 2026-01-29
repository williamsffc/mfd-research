import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Monitor, 
  MonitorOff,
  Play,
  Pause,
  RotateCcw,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePresenterSync } from '@/hooks/usePresenterSync';
import { usePresenterNotes } from '@/hooks/usePresenterNotes';

interface SlideInfo {
  id: string;
  component: React.ComponentType<any>;
  isWIP?: boolean;
  description?: string;
}

interface PresenterViewProps {
  slides: SlideInfo[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
  onExit: () => void;
}

const SLIDE_WIDTH = 1920;
const SLIDE_HEIGHT = 1080;

/**
 * Scaled slide preview component - handles the transform scaling properly
 */
function ScaledSlide({ 
  SlideComponent, 
  className 
}: { 
  SlideComponent: React.ComponentType<any> | undefined;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.4);

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      setScale(containerWidth / SLIDE_WIDTH);
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (!SlideComponent) return null;

  return (
    <div 
      ref={containerRef}
      className={cn("relative bg-white rounded-lg shadow-2xl overflow-hidden", className)}
      style={{ aspectRatio: '16/9' }}
    >
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: SLIDE_WIDTH,
          height: SLIDE_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        <SlideComponent />
      </div>
    </div>
  );
}

export function PresenterView({
  slides,
  activeIndex,
  onIndexChange,
  onExit,
}: PresenterViewProps) {
  const [audienceConnected, setAudienceConnected] = useState(false);
  const [audienceWindow, setAudienceWindow] = useState<Window | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  
  const currentSlideId = slides[activeIndex]?.id ?? null;
  const { note } = usePresenterNotes(currentSlideId);

  const { broadcastSlideChange } = usePresenterSync(
    undefined,
    () => setAudienceConnected(true),
    () => setAudienceConnected(false)
  );

  // Timer
  useEffect(() => {
    if (!isTimerRunning) return;
    
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Open audience window
  const openAudienceWindow = useCallback(() => {
    const width = 1280;
    const height = 720;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    const popup = window.open(
      '/audience',
      'SlideForge Audience',
      `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no`
    );
    
    if (popup) {
      setAudienceWindow(popup);
      const checkInterval = setInterval(() => {
        if (popup.closed) {
          setAudienceWindow(null);
          setAudienceConnected(false);
          clearInterval(checkInterval);
        }
      }, 1000);
    }
  }, []);

  // Close audience window
  const closeAudienceWindow = useCallback(() => {
    if (audienceWindow && !audienceWindow.closed) {
      audienceWindow.close();
    }
    setAudienceWindow(null);
    setAudienceConnected(false);
  }, [audienceWindow]);

  // Broadcast slide changes
  useEffect(() => {
    broadcastSlideChange(activeIndex);
  }, [activeIndex, broadcastSlideChange]);

  // Cleanup on exit
  useEffect(() => {
    return () => {
      if (audienceWindow && !audienceWindow.closed) {
        audienceWindow.close();
      }
    };
  }, [audienceWindow]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        onIndexChange(Math.min(slides.length - 1, activeIndex + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        onIndexChange(Math.max(0, activeIndex - 1));
      } else if (e.key === 'Escape') {
        onExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, slides.length, onIndexChange, onExit]);

  const CurrentSlide = slides[activeIndex]?.component;
  const NextSlide = slides[activeIndex + 1]?.component;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-slate-800 border-b border-slate-700 shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-white font-semibold">Presenter View</h1>
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
            audienceConnected 
              ? "bg-green-500/20 text-green-400" 
              : "bg-slate-700 text-slate-400"
          )}>
            {audienceConnected ? (
              <>
                <Monitor className="w-4 h-4" />
                Audience Connected
              </>
            ) : (
              <>
                <MonitorOff className="w-4 h-4" />
                No Audience
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Timer */}
          <div className="flex items-center gap-2 bg-slate-700 rounded-lg px-3 py-1.5">
            <span className="text-white font-mono text-lg">{formatTime(elapsedTime)}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-slate-400 hover:text-white hover:bg-slate-600"
              onClick={() => setIsTimerRunning(!isTimerRunning)}
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-slate-400 hover:text-white hover:bg-slate-600"
              onClick={() => setElapsedTime(0)}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Audience window control */}
          {!audienceWindow || audienceWindow.closed ? (
            <Button
              variant="outline"
              size="sm"
              onClick={openAudienceWindow}
              className="gap-2 bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            >
              <Monitor className="w-4 h-4" />
              Open Audience Window
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={closeAudienceWindow}
              className="gap-2 bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            >
              <MonitorOff className="w-4 h-4" />
              Close Audience
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onExit}
            className="text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex min-h-0 p-6 gap-6">
        {/* Left: Current slide + controls */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Current slide */}
          <div className="flex-1 bg-slate-800 rounded-xl relative flex items-center justify-center p-6 min-h-0">
            <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur px-3 py-1 rounded-full text-sm text-white font-medium z-10">
              Slide {activeIndex + 1} of {slides.length}
            </div>
            
            {/* Slide container - constrained by available space */}
            <div className="w-full h-full flex items-center justify-center">
              <ScaledSlide 
                SlideComponent={CurrentSlide} 
                className="max-w-full max-h-full w-auto h-auto"
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 shrink-0">
            <Button
              variant="outline"
              size="lg"
              onClick={() => onIndexChange(Math.max(0, activeIndex - 1))}
              disabled={activeIndex === 0}
              className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700 disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => onIndexChange(Math.min(slides.length - 1, activeIndex + 1))}
              disabled={activeIndex === slides.length - 1}
              className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700 disabled:opacity-50"
            >
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Right: Notes + Next slide */}
        <div className="w-80 flex flex-col gap-4 shrink-0">
          {/* Notes */}
          <div className="flex-1 bg-slate-800 rounded-xl p-4 flex flex-col min-h-0">
            <div className="flex items-center gap-2 mb-3 text-slate-400 shrink-0">
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">Presenter Notes</span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {note?.content ? (
                <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                  {note.content}
                </p>
              ) : (
                <p className="text-slate-500 text-sm italic">
                  No notes for this slide
                </p>
              )}
            </div>
          </div>

          {/* Next slide preview */}
          <div className="bg-slate-800 rounded-xl p-4 shrink-0">
            <p className="text-slate-400 text-sm font-medium mb-3">Up Next</p>
            {NextSlide ? (
              <ScaledSlide SlideComponent={NextSlide} />
            ) : (
              <div 
                className="bg-slate-700 rounded-lg flex items-center justify-center text-slate-500 text-sm"
                style={{ aspectRatio: '16/9' }}
              >
                End of presentation
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
