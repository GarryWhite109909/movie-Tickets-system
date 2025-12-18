'use client';

import Image from 'next/image';
import { useState } from 'react';
import { API_BASE_URL } from '@/utils/api';

interface FilmPosterProps {
  src?: string;
  alt: string;
  className?: string;
  bleedIntensity?: 'none' | 'low' | 'medium' | 'high';
}

export default function FilmPoster({ src, alt, className = '', bleedIntensity = 'medium' }: FilmPosterProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Map intensity to styles
  const bleedStyles = {
    none: {},
    low: { maskImage: 'radial-gradient(circle at center, black 90%, transparent 100%)', WebkitMaskImage: 'radial-gradient(circle at center, black 90%, transparent 100%)' },
    medium: { maskImage: 'radial-gradient(circle at center, black 85%, transparent 100%)', WebkitMaskImage: 'radial-gradient(circle at center, black 85%, transparent 100%)' },
    high: { maskImage: 'radial-gradient(circle at center, black 70%, transparent 100%)', WebkitMaskImage: 'radial-gradient(circle at center, black 70%, transparent 100%)' }
  };

  if (!src || error) {
    return (
      <div className={`flex items-center justify-center bg-paper text-ink-medium/30 border-2 border-ink-black/10 rounded-sm relative overflow-hidden ${className}`}>
        {/* Ink Noise Background */}
        <div className="absolute inset-0 opacity-10 bg-repeat" style={{ backgroundImage: 'url("/noise.png")' }}></div>
        <div className="z-10 flex flex-col items-center">
          <span className="text-4xl filter grayscale opacity-50 mb-2">🎬</span>
          <span className="font-calligraphy text-ink-light">暂无海报</span>
        </div>
      </div>
    );
  }

  const imageUrl = src.startsWith('/')
    ? `${API_BASE_URL.replace('/api', '')}${src}`
    : src;

  return (
    <div className={`relative overflow-hidden group ${className}`}>
      {/* Main Image with Ink Filter and Mask */}
      <div 
        className={`relative w-full h-full transition-all duration-700 ${loaded ? 'opacity-100 grayscale-[0.2] sepia-[0.1]' : 'opacity-0'}`}
        style={{ 
          ...(bleedStyles[bleedIntensity] as React.CSSProperties),
          filter: bleedIntensity !== 'none' ? 'url(#rough-edge)' : 'none'
        }}
      >
        <Image
          src={imageUrl}
          alt={alt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
          onError={() => setError(true)}
          onLoad={() => setLoaded(true)}
        />
        
        {/* Ink Bleed Overlay (Vignette) */}
        {bleedIntensity !== 'none' && (
          <div className="absolute inset-0 pointer-events-none transition-opacity duration-500 group-hover:opacity-60"
               style={{
                 background: 'radial-gradient(circle at center, transparent 60%, rgba(0,0,0,0.1) 85%, rgba(0,0,0,0.3) 100%)'
               }}
          />
        )}
      </div>

      {/* Loading Placeholder */}
      {!loaded && (
        <div className="absolute inset-0 bg-paper flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-ink-light border-t-cinnabar rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
