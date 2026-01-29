import React, { useEffect, useState } from 'react';
import { usePresenterSync } from '@/hooks/usePresenterSync';
import { demoSlides } from '@/slides/demo';
import { WIPSlide } from '@/slides/WIPSlide';

interface SlideInfo {
  id: string;
  component: React.ComponentType<any>;
  isWIP?: boolean;
  description?: string;
}

// This component is rendered in the popup window for the audience
export default function AudienceWindow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slides] = useState<SlideInfo[]>(() =>
    demoSlides.map((s, i) => ({
      id: `slide-${i}`,
      component: s.component,
      isWIP: false,
    }))
  );

  const { sendPing, sendClose } = usePresenterSync(
    (index) => setCurrentIndex(index),
    undefined,
    undefined
  );

  // Ping presenter on mount to establish connection
  useEffect(() => {
    sendPing();
    
    // Send close message when window closes
    const handleBeforeUnload = () => {
      sendClose();
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      sendClose();
    };
  }, [sendPing, sendClose]);

  // Enter fullscreen on mount
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        await document.documentElement.requestFullscreen();
      } catch (err) {
        console.log('Fullscreen not available:', err);
      }
    };
    
    // Small delay to ensure DOM is ready
    const timer = setTimeout(enterFullscreen, 100);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard navigation (for audience window too)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentSlide = slides[currentIndex];
  const SlideComponent = currentSlide?.component;

  if (!SlideComponent) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center">
        <p className="text-white text-2xl">No slides available</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-black flex items-center justify-center overflow-hidden">
      <div 
        className="relative bg-white"
        style={{
          width: '100vw',
          height: '56.25vw', // 16:9 aspect ratio
          maxHeight: '100vh',
          maxWidth: '177.78vh', // 16:9 aspect ratio
        }}
      >
        <div 
          className="absolute inset-0 origin-top-left"
          style={{
            width: '1920px',
            height: '1080px',
            transform: `scale(${Math.min(
              (typeof window !== 'undefined' ? window.innerWidth : 1920) / 1920,
              (typeof window !== 'undefined' ? window.innerHeight : 1080) / 1080
            )})`,
          }}
        >
          {currentSlide.isWIP ? (
            <WIPSlide description={currentSlide.description || ''} onDescriptionChange={() => {}} />
          ) : (
            <SlideComponent />
          )}
        </div>
      </div>
    </div>
  );
}
