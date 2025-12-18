import React from 'react';

interface InkSealProps {
  text: string;
  className?: string;
  size?: number;
  type?: 'square' | 'circle' | 'irregular';
  variant?: 'filled' | 'outline';
}

export default function InkSeal({ 
  text, 
  className = '', 
  size = 40, 
  type = 'square',
  variant = 'filled'
}: InkSealProps) {
  const baseStyles = "flex items-center justify-center font-calligraphy select-none transition-transform duration-300 hover:scale-105";
  
  const typeStyles = {
    square: "rounded-sm border-2",
    circle: "rounded-full border-2",
    irregular: "rounded-[30%_70%_70%_30%/30%_30%_70%_70%] border-2"
  };

  const variantStyles = {
    filled: "bg-cinnabar border-cinnabar text-paper shadow-sm",
    outline: "bg-transparent border-cinnabar text-cinnabar"
  };

  // Limit text length to fit in the seal
  const displayText = text.length > 4 ? text.slice(0, 4) : text;
  
  // Calculate font size based on text length
  const fontSize = displayText.length > 2 ? size * 0.35 : size * 0.5;
  const gridTemplate = displayText.length === 4 ? 'grid-cols-2' : 'grid-cols-1';

  return (
    <div 
      className={`${baseStyles} ${typeStyles[type]} ${variantStyles[variant]} ${className}`}
      style={{ width: size, height: size }}
    >
      <div 
        className={`grid ${gridTemplate} gap-0 leading-none text-center`}
        style={{ fontSize: `${fontSize}px` }}
      >
        {displayText.split('').map((char, i) => (
          <span key={i} className="transform hover:scale-110 transition-transform block">{char}</span>
        ))}
      </div>
    </div>
  );
}
