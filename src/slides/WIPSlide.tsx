import React, { useState, useEffect, useRef, useCallback } from 'react';

interface WIPSlideProps {
  description?: string;
  onDescriptionChange?: (description: string) => void;
  autoFocus?: boolean;
}

// Calculate optimal font size based on text length and container
function calculateFontSize(text: string, containerWidth: number): number {
  const len = text.length;
  
  // Dynamic sizing thresholds
  if (len === 0) return 72; // Huge placeholder
  if (len <= 10) return 64;
  if (len <= 20) return 56;
  if (len <= 35) return 48;
  if (len <= 50) return 40;
  if (len <= 80) return 32;
  if (len <= 120) return 28;
  if (len <= 180) return 24;
  if (len <= 280) return 20;
  return 18; // Minimum for very long text
}

const DEBOUNCE_DELAY = 500; // Save after 500ms of no typing

export function WIPSlide({ 
  description = '', 
  onDescriptionChange,
  autoFocus = false 
}: WIPSlideProps) {
  const [text, setText] = useState(description);
  const [fontSize, setFontSize] = useState(72);
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef(description);

  // Update font size when text changes
  const updateFontSize = useCallback(() => {
    const containerWidth = containerRef.current?.clientWidth || 800;
    const newSize = calculateFontSize(text, containerWidth);
    setFontSize(newSize);
  }, [text]);

  useEffect(() => {
    updateFontSize();
  }, [updateFontSize]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => updateFontSize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateFontSize]);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  // Sync external description changes (only if different from what we last saved)
  useEffect(() => {
    if (description !== lastSavedRef.current && description !== text) {
      setText(description);
      lastSavedRef.current = description;
    }
  }, [description]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    
    // Update local state immediately (optimistic)
    setText(newText);
    
    // Clear existing debounce timer
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // Debounce the save to database
    debounceRef.current = setTimeout(() => {
      if (newText !== lastSavedRef.current) {
        lastSavedRef.current = newText;
        onDescriptionChange?.(newText);
      }
    }, DEBOUNCE_DELAY);
  };

  // Calculate line height based on font size
  const lineHeight = fontSize < 32 ? 1.6 : fontSize < 48 ? 1.4 : 1.2;

  return (
    <div 
      ref={containerRef}
      className="w-full h-full flex items-center justify-center bg-[hsl(var(--slide-bg))] p-12 md:p-16"
    >
      <div className="relative w-full max-w-4xl flex items-center justify-center">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          placeholder="Describe your slide..."
          className="w-full min-h-[200px] text-center bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/40 text-foreground focus:ring-0 transition-all duration-200 ease-out"
          style={{
            fontSize: `${fontSize}px`,
            fontWeight: fontSize >= 40 ? 600 : fontSize >= 28 ? 500 : 400,
            lineHeight,
            fontFamily: 'inherit',
            letterSpacing: fontSize >= 48 ? '-0.02em' : '0',
          }}
          rows={Math.max(3, Math.ceil(text.length / (fontSize > 40 ? 20 : fontSize > 28 ? 35 : 50)))}
        />
      </div>
    </div>
  );
}

export default WIPSlide;
