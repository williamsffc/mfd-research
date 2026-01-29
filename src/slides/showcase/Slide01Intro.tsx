import React from 'react';
import { SlideLayout } from '@/components/slides/SlideLayout';
import { Presentation, Sparkles, Zap, MousePointer2 } from 'lucide-react';

const features = [
  { icon: Sparkles, label: 'AI-Powered' },
  { icon: Zap, label: 'Real-time Sync' },
  { icon: MousePointer2, label: 'Interactive' },
];

export default function Slide01Intro() {
  return (
    <SlideLayout variant="gradient">
      <div className="flex flex-col justify-center items-center h-full px-20 py-16 text-center">
        {/* Logo/Icon */}
        <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-8 border border-white/20">
          <Presentation className="w-10 h-10 text-white" strokeWidth={1.5} />
        </div>
        
        {/* Main title */}
        <h1 className="text-7xl font-bold tracking-tight text-white mb-4">
          Slide<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Forge</span>
        </h1>
        
        <p className="text-2xl text-white/70 font-light max-w-2xl mb-12">
          Build stunning, interactive presentations with the power of code
        </p>
        
        {/* Feature badges */}
        <div className="flex gap-4">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
            >
              <feature.icon className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium text-white">{feature.label}</span>
            </div>
          ))}
        </div>
        
        {/* Keyboard hint */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <p className="text-sm text-white/40">
            Press <kbd className="px-2 py-1 rounded bg-white/10 text-white/60 font-mono text-xs mx-1">→</kbd> to continue
          </p>
        </div>
      </div>
    </SlideLayout>
  );
}
