'use client';

import React, { useRef, useEffect } from 'react';
import InkRipple from './InkRipple';

interface ScrollNavProps<T> {
  items: T[];
  activeItem: T;
  onSelect: (item: T) => void;
  renderItem?: (item: T, isActive: boolean) => React.ReactNode;
  getItemKey?: (item: T) => string | number;
  className?: string;
  disabled?: boolean;
}

export default function ScrollNav<T extends string | number | { id: string | number }>({
  items,
  activeItem,
  onSelect,
  renderItem,
  getItemKey,
  className = '',
  disabled = false,
}: ScrollNavProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to active item
  useEffect(() => {
    if (containerRef.current) {
      const activeElement = containerRef.current.querySelector('[data-active="true"]');
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeItem]);

  const getKey = (item: T) => {
    if (getItemKey) return getItemKey(item);
    if (typeof item === 'string' || typeof item === 'number') return item;
    return (item as { id: string | number }).id ?? String(item);
  };

  const defaultRender = (item: T) => (
    <span className="relative z-10">{String(item)}</span>
  );

  const renderContent = renderItem || defaultRender;

  return (
    <div className={`relative max-w-full overflow-hidden ${className}`}>
      {/* Scrollable Container */}
      <div 
        ref={containerRef}
        className="flex gap-4 overflow-x-auto px-4 pb-4 snap-x snap-mandatory custom-scrollbar items-center md:justify-center scroll-smooth"
        role="tablist"
      >
        {items.map((item) => {
          const key = getKey(item);
          // Simple equality check; for objects, reference equality or rely on parent to pass correct activeItem reference
          const isActive = item === activeItem;

          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={isActive}
              data-active={isActive}
              onClick={() => !disabled && onSelect(item)}
              disabled={disabled}
              className={`flex-shrink-0 snap-center px-6 py-2 rounded-full text-sm font-medium font-serif transition-all duration-300 border backdrop-blur-sm relative overflow-hidden group ${
                isActive
                  ? 'bg-cinnabar text-white border-cinnabar shadow-lg transform scale-105'
                  : 'bg-white text-ink-medium border-ink-black/10 hover:bg-ink-faint hover:text-ink-black hover:border-ink-black/30'
              } ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {renderContent(item, isActive)}
              
              {/* Ink Hover Effect for inactive items */}
              {!isActive && !disabled && (
                <div className="absolute inset-0 bg-ink-black/5 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out"></div>
              )}
              
              {/* Ripple for active item */}
              {!disabled && <InkRipple color={isActive ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'} />}
            </button>
          );
        })}
      </div>
      
      {/* Fade Gradients for Scroll Indication on Mobile */}
      <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-paper to-transparent pointer-events-none md:hidden"></div>
      <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-paper to-transparent pointer-events-none md:hidden"></div>
    </div>
  );
}
