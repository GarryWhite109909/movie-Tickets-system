import React from 'react';

interface GoldVipLabelProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export default function GoldVipLabel({ className = '', size = 'md', text = 'VIP' }: GoldVipLabelProps) {
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3.5 py-1.5',
  };

  return (
    <span 
      className={`inline-flex items-center justify-center font-serif font-bold text-white rounded-sm shadow-sm relative overflow-hidden ${sizeClasses[size]} ${className}`}
      style={{
        background: 'linear-gradient(135deg, #F1C40F 0%, #D4AC0D 100%)',
        boxShadow: '0 2px 4px rgba(241, 196, 15, 0.3)',
        border: '1px solid #B7950B'
      }}
    >
      {/* Gold Texture Overlay */}
      <span className="absolute inset-0 bg-white/20" style={{ mixBlendMode: 'overlay', backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'4\' height=\'4\' viewBox=\'0 0 4 4\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 3h1v1H1V3zm2-2h1v1H3V1z\' fill=\'%23ffffff\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }}></span>
      {/* Shine Effect */}
      <span className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent transform -translate-x-full animate-shine"></span>
      <span className="relative z-10 tracking-widest drop-shadow-sm">{text}</span>
    </span>
  );
}
