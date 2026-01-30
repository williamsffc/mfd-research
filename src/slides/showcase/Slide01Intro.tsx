import React from 'react';
import { SlideLayout } from '@/components/slides/SlideLayout';
import { Presentation, Sparkles, Zap, MousePointer2 } from 'lucide-react';
const features = [{
  icon: Sparkles,
  label: 'AI-Powered'
}, {
  icon: MousePointer2,
  label: 'Interactive'
}];
export default function Slide01Intro() {
  return <SlideLayout variant="default">
      <div className="flex flex-col justify-center items-center h-full px-20 py-16 text-center">
        {/* Logo/Icon */}
        <div className="w-20 h-20 rounded-2xl bg-indigo-100 flex items-center justify-center mb-8 border border-indigo-200">
          <Presentation className="w-10 h-10 text-indigo-600" strokeWidth={1.5} />
        </div>
        
        {/* Main title */}
        <h1 className="text-7xl font-bold tracking-tight text-slate-900 mb-4">
          Lovable<span className="text-indigo-600">Slides</span>
        </h1>
        
        <p className="text-2xl text-slate-500 font-light max-w-2xl mb-12">
          Build stunning, interactive presentations with the power of code
        </p>
        
        {/* Feature badges */}
        <div className="flex gap-4">
          {features.map((feature, index) => {})}
        </div>
        
        {/* Keyboard hint */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <p className="text-sm text-slate-400">
            Press <kbd className="px-2 py-1 rounded bg-slate-100 text-slate-600 font-mono text-xs mx-1 border border-slate-200">→</kbd> to continue
          </p>
        </div>
      </div>
    </SlideLayout>;
}