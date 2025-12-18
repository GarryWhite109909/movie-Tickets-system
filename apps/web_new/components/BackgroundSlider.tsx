'use client';

import { useEffect, useState } from 'react';

const POSTERS = [
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=3425&auto=format&fit=crop", // Cinema
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop", // Movie theater
  "https://images.unsplash.com/photo-1517604931442-71053e6e7466?q=80&w=2070&auto=format&fit=crop", // Film reel
  "https://images.unsplash.com/photo-1478720568477-152d9b164e63?q=80&w=2000&auto=format&fit=crop", // Camera
  "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=3456&auto=format&fit=crop"  // Projector
];

export default function BackgroundSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % POSTERS.length);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      {POSTERS.map((poster, index) => (
        <div
          key={poster}
          className={`absolute inset-0 bg-cover bg-center transition-all duration-[2000ms] ease-in-out ${
            index === currentIndex ? 'opacity-40 scale-105' : 'opacity-0 scale-100'
          }`}
          style={{ backgroundImage: `url(${poster})` }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-cinema-dark/90 via-cinema-dark/80 to-cinema-dark" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_var(--color-cinema-dark)_100%)] opacity-80" />
    </div>
  );
}
