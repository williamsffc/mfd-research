import React from 'react';
import { MSSlideLayout } from '@/components/slides/MSSlideLayout';

/**
 * Typography Demo Slide
 * Shows all available type classes for review
 */
export default function Slide15TypographyDemo() {
  return (
    <MSSlideLayout variant="default">
      <div className="flex flex-col h-full px-20 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="type-h2 text-slide-gray-900 mb-2">Typography Scale</h1>
          <p className="type-body text-slide-gray-600">Choose your hierarchy</p>
        </div>

        {/* Typography samples */}
        <div className="flex-1 grid grid-cols-2 gap-x-16 gap-y-8">
          {/* Left column - Large sizes */}
          <div className="space-y-8">
            <div className="border-b border-slide-gray-200 pb-4">
              <span className="type-caption text-slide-accent font-mono">type-display · 96px</span>
              <p className="type-display text-slide-gray-900 leading-none mt-2">Display</p>
            </div>
            
            <div className="border-b border-slide-gray-200 pb-4">
              <span className="type-caption text-slide-accent font-mono">type-h1 · 60px</span>
              <p className="type-h1 text-slide-gray-900 leading-tight mt-2">Heading One</p>
            </div>
            
            <div className="border-b border-slide-gray-200 pb-4">
              <span className="type-caption text-slide-accent font-mono">type-h2 · 36px</span>
              <p className="type-h2 text-slide-gray-900 leading-tight mt-2">Heading Two</p>
            </div>
            
            <div className="border-b border-slide-gray-200 pb-4">
              <span className="type-caption text-slide-accent font-mono">type-h3 · 24px</span>
              <p className="type-h3 text-slide-gray-900 leading-snug mt-2">Heading Three</p>
            </div>
          </div>

          {/* Right column - Body sizes + special */}
          <div className="space-y-8">
            <div className="border-b border-slide-gray-200 pb-4">
              <span className="type-caption text-slide-accent font-mono">type-metric · 48px</span>
              <p className="type-metric text-slide-gray-900 mt-2">$2.4M</p>
            </div>
            
            <div className="border-b border-slide-gray-200 pb-4">
              <span className="type-caption text-slide-accent font-mono">type-body-lg · 20px</span>
              <p className="type-body-lg text-slide-gray-900 mt-2">Body Large - Used for subtitles and important callouts</p>
            </div>
            
            <div className="border-b border-slide-gray-200 pb-4">
              <span className="type-caption text-slide-accent font-mono">type-body · 18px (default)</span>
              <p className="type-body text-slide-gray-900 mt-2">Body - The standard reading size for all slide content and descriptions</p>
            </div>
            
            <div className="border-b border-slide-gray-200 pb-4">
              <span className="type-caption text-slide-accent font-mono">type-caption · 16px (minimum!)</span>
              <p className="type-caption text-slide-gray-900 mt-2">Caption - The smallest allowed size. Use sparingly for labels and metadata.</p>
            </div>

            {/* Warning box */}
            <div className="bg-slide-error/10 border-2 border-slide-error/50 rounded-lg p-6 mt-4">
              <p className="type-body font-semibold text-slide-error">⚠️ Nothing smaller than 16px!</p>
              <p className="type-caption text-slide-error/80 mt-2">Any text below this size will be unreadable when projected.</p>
            </div>
          </div>
        </div>
      </div>
    </MSSlideLayout>
  );
}
