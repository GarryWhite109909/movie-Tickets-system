'use client';

import React, { useState, useLayoutEffect, MouseEvent } from 'react';

interface Ripple {
  x: number;
  y: number;
  size: number;
  key: number;
}

interface InkRippleProps {
  color?: string;
  duration?: number;
}

export default function InkRipple({ color = 'rgba(0, 0, 0, 0.1)', duration = 600 }: InkRippleProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useLayoutEffect(() => {
    let bounce: number | null = null;
    if (ripples.length > 0) {
      clearTimeout(bounce!);
      bounce = window.setTimeout(() => {
        setRipples([]);
      }, duration * 4);
    }
    return () => clearTimeout(bounce!);
  }, [ripples.length, duration]);

  const addRipple = (event: MouseEvent) => {
    const container = event.currentTarget.getBoundingClientRect();
    const size = container.width > container.height ? container.width : container.height;
    const x = event.clientX - container.left - size / 2;
    const y = event.clientY - container.top - size / 2;
    
    const newRipple = { x, y, size, key: Date.now() };
    setRipples((prev) => [...prev, newRipple]);
  };

  return (
    <div 
      className="absolute inset-0 overflow-hidden rounded-inherit pointer-events-none"
      onMouseDown={addRipple}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.key}
          className="absolute rounded-full bg-current opacity-20 animate-ripple"
          style={{
            top: ripple.y,
            left: ripple.x,
            width: ripple.size,
            height: ripple.size,
            backgroundColor: color,
            animationDuration: `${duration}ms`,
            transform: 'scale(0)',
          }}
        />
      ))}
    </div>
  );
}
