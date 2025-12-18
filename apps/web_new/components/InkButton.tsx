'use client';

import React, { ButtonHTMLAttributes } from 'react';
import InkRipple from './InkRipple';

interface InkButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  inkColor?: string;
}

export default function InkButton({ 
  children, 
  className = '', 
  variant = 'primary', 
  size = 'md',
  inkColor,
  disabled,
  ...props 
}: InkButtonProps) {
  
  const baseStyles = "relative overflow-hidden font-title transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center";
  
  const variants = {
    primary: "bg-cinnabar text-white hover:bg-red-700 shadow-md hover:shadow-lg",
    secondary: "bg-stone text-white hover:bg-blue-700 shadow-md hover:shadow-lg",
    outline: "border-2 border-cinnabar text-cinnabar hover:bg-cinnabar/5",
    ghost: "text-ink-dark hover:bg-ink-black/5"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-sm",
    md: "px-6 py-2.5 text-base rounded-sm",
    lg: "px-8 py-3.5 text-lg rounded-md"
  };

  // Determine ripple color based on variant if not provided
  const rippleColor = inkColor || (variant === 'outline' || variant === 'ghost' ? 'rgba(231, 76, 60, 0.2)' : 'rgba(255, 255, 255, 0.3)');

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {!disabled && <InkRipple color={rippleColor} />}
    </button>
  );
}
