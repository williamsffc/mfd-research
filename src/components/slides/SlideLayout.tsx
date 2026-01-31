import React from 'react';
import { cn } from '@/lib/utils';

interface SlideLayoutProps {
  children: React.ReactNode;
  variant?: 'default' | 'dark' | 'gradient';
  className?: string;
}

export function SlideLayout({ children, variant = 'default', className }: SlideLayoutProps) {
  return (
    <div 
      className={cn(
        'w-full h-full relative font-sans overflow-hidden',
        variant === 'default' && 'bg-white text-slate-900',
        variant === 'dark' && 'bg-slate-900 text-white',
        variant === 'gradient' && 'bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white',
        className
      )}
    >
      {/* Content - overflow-hidden prevents internal scrolling at any scale */}
      <div className="w-full h-full overflow-hidden">
        {children}
      </div>
      
      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
    </div>
  );
}
