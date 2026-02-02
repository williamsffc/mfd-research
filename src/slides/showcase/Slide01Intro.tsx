import React from 'react';
import { SlideLayout } from '@/components/slides/SlideLayout';
import { Presentation } from 'lucide-react';

export default function Slide01Intro() {
  return (
    <SlideLayout variant="default">
      <div className="flex flex-col justify-center items-center h-full px-20 py-16 text-center">
        {/* Logo/Icon */}
        <div className="w-20 h-20 rounded-2xl bg-slide-accent-muted flex items-center justify-center mb-8 border border-slide-gray-200">
          <Presentation className="w-10 h-10 text-slide-accent" strokeWidth={1.5} />
        </div>
        
        {/* Main title */}
        <h1 className="type-display text-slide-gray-900 mb-4">
          Lovable<span className="text-slide-accent">Slides</span>
        </h1>
        
        <p className="type-body-lg text-slide-gray-500 max-w-2xl mb-12">
          Build stunning, interactive presentations with the power of code
        </p>
        
        {/* Keyboard hint */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <p className="type-caption text-slide-gray-400">
            Press <kbd className="px-2 py-1 rounded bg-slide-gray-100 text-slide-gray-600 type-mono mx-1 border border-slide-gray-200">→</kbd> to continue
          </p>
        </div>
      </div>
    </SlideLayout>
  );
}
