import React, { useEffect, useCallback, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { SLIDE_WIDTH, SLIDE_HEIGHT } from './ScaledSlide';
interface PresentationModeProps {
  slides: Array<{
    id: string;
    component: React.ComponentType<any>;
    isWIP?: boolean;
    description?: string;
  }>;
  activeIndex: number;
  onIndexChange: (index: number) => void;
  onExit: () => void;
}

export function PresentationMode({
  slides,
  activeIndex,
  onIndexChange,
  onExit,
}: PresentationModeProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          if (activeIndex < slides.length - 1) {
            onIndexChange(activeIndex + 1);
          }
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          if (activeIndex > 0) {
            onIndexChange(activeIndex - 1);
          }
          break;
        case 'Escape':
        case 'p':
        case 'P':
          e.preventDefault();
          onExit();
          break;
        case 'Home':
          e.preventDefault();
          onIndexChange(0);
          break;
        case 'End':
          e.preventDefault();
          onIndexChange(slides.length - 1);
          break;
      }
    },
    [activeIndex, slides.length, onIndexChange, onExit]
  );

  // Request fullscreen on mount
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        await document.documentElement.requestFullscreen();
      } catch (err) {
        console.log('Fullscreen not available:', err);
      }
    };
    enterFullscreen();

    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, []);

  // Handle fullscreen exit via browser controls
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        onExit();
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [onExit]);

  // Keyboard controls
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const currentSlide = slides[activeIndex];
  const SlideComponent = currentSlide?.component;

  if (!SlideComponent) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
      {/* Slide container - 16:9 aspect ratio with iframe */}
      <div className="relative w-full h-full flex items-center justify-center">
        <PresentationIframeSlide SlideComponent={SlideComponent} />
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-4 right-4 text-white/60 text-sm font-medium">
        {activeIndex + 1} / {slides.length}
      </div>

      {/* Navigation hints */}
      <div className="absolute bottom-4 left-4 text-white/40 text-xs">
        ← → to navigate • Esc or P to exit
      </div>
    </div>
  );
}

/**
 * Fullscreen iframe slide for presentation mode.
 * Uses the viewport to calculate max scale while maintaining aspect ratio.
 */
function PresentationIframeSlide({ SlideComponent }: { SlideComponent: React.ComponentType<any> }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [scale, setScale] = useState(1);
  const [iframeReady, setIframeReady] = useState(false);
  const [iframeDocument, setIframeDocument] = useState<Document | null>(null);

  // Calculate scale to fit viewport
  useEffect(() => {
    const updateScale = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const scaleX = vw / SLIDE_WIDTH;
      const scaleY = vh / SLIDE_HEIGHT;
      setScale(Math.min(scaleX, scaleY));
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
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

  const portalRoot = iframeDocument?.getElementById('slide-root');

  return (
    <iframe
      ref={iframeRef}
      onLoad={handleIframeLoad}
      title="Presentation Slide"
      className="border-0"
      style={{
        width: SLIDE_WIDTH,
        height: SLIDE_HEIGHT,
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
      }}
    >
      {iframeReady && portalRoot && ReactDOM.createPortal(<SlideComponent />, portalRoot)}
    </iframe>
  );
}
