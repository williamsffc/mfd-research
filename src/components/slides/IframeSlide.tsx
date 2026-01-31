import React, { useRef, useState, useCallback, useEffect, createContext, useContext } from 'react';
import ReactDOM from 'react-dom';
import { cn } from '@/lib/utils';

// Fixed slide resolution - single source of truth
export const SLIDE_WIDTH = 1920;
export const SLIDE_HEIGHT = 1080;

// Context to share scale with child components (for WebGL/Canvas)
export const IframeSlideScaleContext = createContext<number>(1);

export function useIframeSlideScale() {
  return useContext(IframeSlideScaleContext);
}

interface IframeSlideProps {
  children?: React.ReactNode;
  SlideComponent?: React.ComponentType<any>;
  className?: string;
  containerClassName?: string;
  showGrid?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

/**
 * Bulletproof slide scaling using an iframe.
 * 
 * The slide content renders inside an iframe with a fixed 1920×1080 viewport.
 * The iframe element itself is scaled with CSS transform.
 * This means NOTHING inside the slide can detect the scale - 
 * getBoundingClientRect(), ResizeObserver, etc. all see 1920×1080.
 * 
 * It's like zooming in on a PNG - pure visual scaling.
 */
export function IframeSlide({
  children,
  SlideComponent,
  className,
  containerClassName,
  showGrid = false,
  onClick,
}: IframeSlideProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [scale, setScale] = useState(0.1);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [iframeReady, setIframeReady] = useState(false);
  const [iframeDocument, setIframeDocument] = useState<Document | null>(null);

  // Calculate scale based on parent container
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      
      const parent = containerRef.current.parentElement;
      if (!parent) return;
      
      const availableWidth = parent.clientWidth;
      const availableHeight = parent.clientHeight;
      
      if (availableWidth === 0 || availableHeight === 0) return;
      
      const scaleX = availableWidth / SLIDE_WIDTH;
      const scaleY = availableHeight / SLIDE_HEIGHT;
      const fitScale = Math.min(scaleX, scaleY);
      
      const renderedWidth = SLIDE_WIDTH * fitScale;
      const renderedHeight = SLIDE_HEIGHT * fitScale;
      
      setScale(fitScale);
      setDimensions({ width: renderedWidth, height: renderedHeight });
    };

    const rafId = requestAnimationFrame(updateScale);

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(updateScale);
    });
    
    const parent = containerRef.current?.parentElement;
    if (parent) {
      observer.observe(parent);
    }

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  // Initialize iframe when it loads
  const handleIframeLoad = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument;
    if (!doc) return;

    // Copy all stylesheets from parent document to iframe
    const parentStyles = document.querySelectorAll('style, link[rel="stylesheet"]');
    parentStyles.forEach(style => {
      const clone = style.cloneNode(true) as HTMLElement;
      doc.head.appendChild(clone);
    });

    // Add base styles for the iframe body
    const baseStyle = doc.createElement('style');
    baseStyle.textContent = `
      html, body {
        margin: 0;
        padding: 0;
        width: ${SLIDE_WIDTH}px;
        height: ${SLIDE_HEIGHT}px;
        overflow: hidden;
        background: white;
      }
      #slide-root {
        width: ${SLIDE_WIDTH}px;
        height: ${SLIDE_HEIGHT}px;
        overflow: hidden;
        position: relative;
      }
    `;
    doc.head.appendChild(baseStyle);

    // Create root element for React portal
    let root = doc.getElementById('slide-root');
    if (!root) {
      root = doc.createElement('div');
      root.id = 'slide-root';
      doc.body.appendChild(root);
    }

    setIframeDocument(doc);
    setIframeReady(true);
  }, []);

  const content = SlideComponent ? <SlideComponent /> : children;
  const portalRoot = iframeDocument?.getElementById('slide-root');

  return (
    <IframeSlideScaleContext.Provider value={scale}>
      <div 
        ref={containerRef}
        className={cn(
          "relative overflow-hidden flex-shrink-0",
          containerClassName
        )}
        style={{ 
          width: dimensions.width || '100%',
          height: dimensions.height || 'auto',
        }}
      >
        <iframe
          ref={iframeRef}
          onLoad={handleIframeLoad}
          title="Slide Content"
          className={cn(
            "border-0 rounded-lg shadow-xl",
            showGrid && "grid-overlay",
            className
          )}
          style={{
            width: SLIDE_WIDTH,
            height: SLIDE_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            pointerEvents: 'auto',
          }}
          onClick={onClick as any}
        />
        {iframeReady && portalRoot && ReactDOM.createPortal(content, portalRoot)}
      </div>
    </IframeSlideScaleContext.Provider>
  );
}

/**
 * Centered variant - centers the scaled slide in its container
 * Used in the main editor where slides float in the middle
 */
export function CenteredIframeSlide({
  children,
  SlideComponent,
  className,
  containerClassName,
  showGrid = false,
  onClick,
  zoom = 100,
}: IframeSlideProps & { zoom?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [baseScale, setBaseScale] = useState(1);
  const [iframeReady, setIframeReady] = useState(false);
  const [iframeDocument, setIframeDocument] = useState<Document | null>(null);

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

  // Initialize iframe when it loads
  const handleIframeLoad = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument;
    if (!doc) return;

    // Copy all stylesheets from parent document to iframe
    const parentStyles = document.querySelectorAll('style, link[rel="stylesheet"]');
    parentStyles.forEach(style => {
      const clone = style.cloneNode(true) as HTMLElement;
      doc.head.appendChild(clone);
    });

    // Add base styles for the iframe body
    const baseStyle = doc.createElement('style');
    baseStyle.textContent = `
      html, body {
        margin: 0;
        padding: 0;
        width: ${SLIDE_WIDTH}px;
        height: ${SLIDE_HEIGHT}px;
        overflow: hidden;
        background: white;
      }
      #slide-root {
        width: ${SLIDE_WIDTH}px;
        height: ${SLIDE_HEIGHT}px;
        overflow: hidden;
        position: relative;
      }
    `;
    doc.head.appendChild(baseStyle);

    // Create root element for React portal
    let root = doc.getElementById('slide-root');
    if (!root) {
      root = doc.createElement('div');
      root.id = 'slide-root';
      doc.body.appendChild(root);
    }

    setIframeDocument(doc);
    setIframeReady(true);
  }, []);

  const zoomMultiplier = zoom / 100;
  const finalScale = baseScale * zoomMultiplier;
  const content = SlideComponent ? <SlideComponent /> : children;
  const portalRoot = iframeDocument?.getElementById('slide-root');

  return (
    <IframeSlideScaleContext.Provider value={finalScale}>
      <div 
        ref={containerRef}
        className={cn(
          "flex items-center justify-center w-full h-full overflow-hidden",
          containerClassName
        )}
      >
        <iframe
          ref={iframeRef}
          onLoad={handleIframeLoad}
          title="Slide Content"
          className={cn(
            "slide-canvas border-0 shadow-2xl rounded-lg flex-shrink-0",
            showGrid && "grid-overlay",
            className
          )}
          style={{
            width: SLIDE_WIDTH,
            height: SLIDE_HEIGHT,
            transform: `scale(${finalScale})`,
            transformOrigin: 'center center',
            pointerEvents: 'auto',
          }}
          onClick={onClick as any}
        />
        {iframeReady && portalRoot && ReactDOM.createPortal(content, portalRoot)}
      </div>
    </IframeSlideScaleContext.Provider>
  );
}
