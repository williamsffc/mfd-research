import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Toolbar } from '@/components/layout/Toolbar';
import { SlideCanvas } from '@/components/slides/SlideCanvas';
import { SlideOverviewGrid } from '@/components/slides/SlideOverviewGrid';
import { PresentationMode } from '@/components/slides/PresentationMode';
import { PresenterNotesPanel } from '@/components/slides/PresenterNotesPanel';
import { demoSlides } from '@/slides/demo';

interface SlideData {
  id: string;
  component: React.ComponentType<any>;
  name: string;
  isWIP: boolean;
  description?: string;
}

export default function Index() {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [showGrid, setShowGrid] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(256);
  
  // Local slide order state (no database) - generate stable UUIDs for presenter notes
  const [slides, setSlides] = useState<SlideData[]>(() => 
    demoSlides.map((s, i) => ({
      id: crypto.randomUUID(),
      component: s.component,
      name: s.name,
      isWIP: false,
      description: undefined,
    }))
  );

  // Get current slide ID for presenter notes
  const currentSlideId = slides[activeSlideIndex]?.id ?? null;

  // Toggle dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (isPresentationMode) return;

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        setActiveSlideIndex(prev => Math.min(slides.length - 1, prev + 1));
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setActiveSlideIndex(prev => Math.max(0, prev - 1));
      } else if (e.key === 'G' && e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowGrid(prev => !prev);
      } else if (e.key === 'N' && e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowNotes(prev => !prev);
      } else if (e.key === 'P' && e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setIsPresentationMode(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length, isPresentationMode]);


  const ActiveSlideComponent = slides[activeSlideIndex]?.component || demoSlides[0].component;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Toolbar */}
      <Toolbar
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid(!showGrid)}
        showNotes={showNotes}
        onToggleNotes={() => setShowNotes(!showNotes)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          slides={slides.map((slide) => ({
            id: slide.id,
            content: <slide.component />,
          }))}
          activeSlideIndex={activeSlideIndex}
          onSlideClick={setActiveSlideIndex}
          width={sidebarWidth}
          onWidthChange={setSidebarWidth}
        />

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 relative overflow-hidden">
            <SlideCanvas
              showGrid={false}
              zoom={zoom}
              onZoomChange={setZoom}
              currentSlide={activeSlideIndex + 1}
              totalSlides={slides.length}
              onPrevSlide={() => setActiveSlideIndex(Math.max(0, activeSlideIndex - 1))}
              onNextSlide={() => setActiveSlideIndex(Math.min(slides.length - 1, activeSlideIndex + 1))}
              onStartPresentation={() => setIsPresentationMode(true)}
              isDarkMode={isDarkMode}
              onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            >
              <ActiveSlideComponent />
            </SlideCanvas>

            {/* Grid View Overlay */}
            {showGrid && (
              <SlideOverviewGrid
                slides={slides}
                activeSlideIndex={activeSlideIndex}
                onSlideClick={setActiveSlideIndex}
                onClose={() => setShowGrid(false)}
              />
            )}
          </div>

          {/* Presenter Notes Panel - Bottom */}
          {showNotes && (
            <PresenterNotesPanel
              slideId={currentSlideId}
              slideIndex={activeSlideIndex}
              onClose={() => setShowNotes(false)}
            />
          )}
        </div>
      </div>

      {/* Presentation Mode */}
      {isPresentationMode && (
        <PresentationMode
          slides={slides.map(slide => ({
            id: slide.id,
            component: slide.component,
            isWIP: slide.isWIP,
            description: slide.description,
          }))}
          activeIndex={activeSlideIndex}
          onIndexChange={setActiveSlideIndex}
          onExit={() => setIsPresentationMode(false)}
        />
      )}
    </div>
  );
}
