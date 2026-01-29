import React, { useState, useEffect, useRef } from 'react';
import { SlideLayout } from '@/components/slides/SlideLayout';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  velocity: { x: number; y: number };
  life: number;
}

const colors = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'];

export default function Slide03CursorSimulation() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const particleId = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      
      // Account for the scale transform - the slide is 1920x1080 but scaled down
      const scaleX = 1920 / rect.width;
      const scaleY = 1080 / rect.height;
      
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      
      setMousePos({ x, y });
      
      // Create new particles
      const newParticles: Particle[] = Array.from({ length: 3 }, () => ({
        id: particleId.current++,
        x,
        y,
        size: Math.random() * 12 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        velocity: {
          x: (Math.random() - 0.5) * 6,
          y: (Math.random() - 0.5) * 6,
        },
        life: 1,
      }));
      
      setParticles(prev => [...prev, ...newParticles].slice(-150));
    };

    // Use document-level listener to capture all mouse movements over the slide
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animate particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            x: p.x + p.velocity.x,
            y: p.y + p.velocity.y,
            life: p.life - 0.02,
            size: p.size * 0.98,
          }))
          .filter(p => p.life > 0)
      );
    }, 16);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <SlideLayout variant="dark">
      <div 
        ref={containerRef}
        className="relative h-full w-full overflow-hidden cursor-none"
      >
        {/* Header - positioned absolutely */}
        <div className="absolute top-16 left-20 z-10">
          <p className="text-purple-400 text-sm font-semibold uppercase tracking-widest mb-2">
            Real-time Effects
          </p>
          <h2 className="text-4xl font-bold text-white mb-2">
            Move Your Cursor
          </h2>
          <p className="text-lg text-white/60 font-light">
            Watch the particles follow in real-time
          </p>
        </div>

        {/* Particles */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              opacity: particle.life,
              transform: 'translate(-50%, -50%)',
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            }}
          />
        ))}

        {/* Custom cursor */}
        <div
          className="absolute pointer-events-none z-20"
          style={{
            left: mousePos.x,
            top: mousePos.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="w-6 h-6 rounded-full border-2 border-white/80 bg-white/10 backdrop-blur-sm" />
          <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-white -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Hint at bottom */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center">
          <p className="text-white/40 text-sm">
            Move your mouse around the slide area
          </p>
        </div>
      </div>
    </SlideLayout>
  );
}
