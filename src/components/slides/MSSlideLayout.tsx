import React from 'react';
import { cn } from '@/lib/utils';

interface MSSlideLayoutProps {
  children: React.ReactNode;
  variant?: 'default' | 'title' | 'dark';
  className?: string;
}

export function MSSlideLayout({ children, variant = 'default', className }: MSSlideLayoutProps) {
  const isDark = variant === 'dark';
  
  return (
    <div 
      className={cn(
        'w-full h-full relative font-ms',
        isDark ? 'bg-ms-navy text-white' : 'bg-white text-ms-navy',
        className
      )}
    >
      {/* Morgan Stanley Logo - Top Right */}
      <div className="absolute top-8 right-10 z-10">
        <MSLogo variant={isDark ? 'white' : 'navy'} />
      </div>
      
      {/* Content */}
      <div className="w-full h-full">
        {children}
      </div>
      
      {/* Bottom border accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-ms-blue" />
    </div>
  );
}

interface MSLogoProps {
  variant?: 'navy' | 'white';
  className?: string;
}

export function MSLogo({ variant = 'navy', className }: MSLogoProps) {
  const color = variant === 'white' ? '#FFFFFF' : '#002B51';
  
  return (
    <svg
      viewBox="0 0 200 24"
      className={cn('h-6 w-auto', className)}
      fill={color}
    >
      {/* Morgan Stanley text logo approximation */}
      <text
        x="0"
        y="18"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="16"
        fontWeight="600"
        letterSpacing="0.5"
      >
        MORGAN STANLEY
      </text>
    </svg>
  );
}
