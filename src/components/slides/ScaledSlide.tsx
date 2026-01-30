import React, { useRef, useState, useEffect, createContext, useContext } from 'react';
import { cn } from '@/lib/utils';

// Fixed slide resolution - single source of truth
export const SLIDE_WIDTH = 1920;
export const SLIDE_HEIGHT = 1080;
export const SLIDE_ASPECT_RATIO = SLIDE_WIDTH / SLIDE_HEIGHT;

// Context to share scale with child components (for WebGL/Canvas)
export const SlideScaleContext = createContext<number>(1);

export function useSlideScale() {
  return useContext(SlideScaleContext);
}

interface ScaledSlideProps {
  children?: React.ReactNode;
  SlideComponent?: React.ComponentType<any>;
  className?: string;
  containerClassName?: string;
  showGrid?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * Universal slide scaling component.
 * 
 * Renders content at fixed 1920×1080 resolution and scales it to fit
 * the container while maintaining aspect ratio. Uses Math.min(scaleX, scaleY)
 * to ensure the slide always fits without overflow.
 * 
 * This component is the SINGLE source of truth for slide scaling across:
 * - Main editor canvas
 * - Presenter view (current + next slides)
 * - Thumbnails
 * - Audience window
 */
export function ScaledSlide({
  children,
  SlideComponent,
  className,
  containerClassName,
  showGrid = false,
  onClick,
}: ScaledSlideProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.1);

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;
      
      if (containerWidth === 0 || containerHeight === 0) return;
      
      // Calculate scale to fit BOTH dimensions (never overflow)
      const scaleX = containerWidth / SLIDE_WIDTH;
      const scaleY = containerHeight / SLIDE_HEIGHT;
      const fitScale = Math.min(scaleX, scaleY);
      
      setScale(fitScale);
    };

    // Use RAF to ensure layout is complete before measuring
    const rafId = requestAnimationFrame(updateScale);

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(updateScale);
    });
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  const content = SlideComponent ? <SlideComponent /> : children;

  return (
    <SlideScaleContext.Provider value={scale}>
      <div 
        ref={containerRef}
        className={cn(
          "relative w-full overflow-hidden",
          containerClassName
        )}
        style={{ aspectRatio: `${SLIDE_WIDTH}/${SLIDE_HEIGHT}` }}
      >
        <div 
          className={cn(
            "absolute bg-white dark:bg-slate-900 rounded-lg shadow-xl overflow-hidden",
            showGrid && "grid-overlay",
            className
          )}
          style={{
            width: SLIDE_WIDTH,
            height: SLIDE_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
          onClick={onClick}
        >
          {content}
        </div>
      </div>
    </SlideScaleContext.Provider>
  );
}

/**
 * Centered variant - centers the scaled slide in its container
 * Used in the main editor where slides float in the middle
 */
export function CenteredScaledSlide({
  children,
  SlideComponent,
  className,
  containerClassName,
  showGrid = false,
  onClick,
  zoom = 100,
}: ScaledSlideProps & { zoom?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [baseScale, setBaseScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;
      
      if (containerWidth === 0 || containerHeight === 0) return;
      
      const scaleX = containerWidth / SLIDE_WIDTH;
      const scaleY = containerHeight / SLIDE_HEIGHT;
      const fitScale = Math.min(scaleX, scaleY);
      
      setBaseScale(fitScale);
    };

    const rafId = requestAnimationFrame(updateScale);

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(updateScale);
    });
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  const zoomMultiplier = zoom / 100;
  const finalScale = baseScale * zoomMultiplier;
  const content = SlideComponent ? <SlideComponent /> : children;

  return (
    <SlideScaleContext.Provider value={finalScale}>
      <div 
        ref={containerRef}
        className={cn(
          "flex items-center justify-center w-full h-full overflow-hidden",
          containerClassName
        )}
      >
        <div 
          className={cn(
            "slide-canvas relative shadow-2xl rounded-lg overflow-hidden flex-shrink-0 isolate",
            showGrid && "grid-overlay",
            className
          )}
          style={{
            width: SLIDE_WIDTH,
            height: SLIDE_HEIGHT,
            transform: `scale(${finalScale})`,
            transformOrigin: 'center center',
          }}
          onClick={onClick}
        >
          <div className="absolute inset-0 bg-white dark:bg-slate-900">
            {content}
          </div>
        </div>
      </div>
    </SlideScaleContext.Provider>
  );
}
