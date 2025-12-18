'use client';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-paper text-ink-black backdrop-blur-sm bg-paper/90">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full" viewBox="0 0 100 100">
             <defs>
               <filter id="ink-blur">
                 <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
               </filter>
               <linearGradient id="ink-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                 <stop offset="0%" stopColor="var(--color-ink-black)" />
                 <stop offset="100%" stopColor="var(--color-ink-medium)" />
               </linearGradient>
             </defs>
             {/* Background Circle (Faint) */}
             <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-ink-faint)" strokeWidth="8" />
             
             {/* Ink Brush Stroke Animation */}
             <path d="M50,10 A40,40 0 0,1 50,90 A40,40 0 0,1 50,10" 
                   fill="none" 
                   stroke="url(#ink-gradient)" 
                   strokeWidth="6" 
                   strokeLinecap="round"
                   strokeDasharray="251" 
                   strokeDashoffset="251"
                   style={{ animation: 'draw 2s ease-in-out infinite' }}
                   filter="url(#ink-blur)"
                   />
          </svg>
          
          {/* Center Character */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-calligraphy text-cinnabar animate-pulse drop-shadow-sm">
              墨
            </span>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <div className="text-xl font-serif font-bold tracking-[0.3em] text-ink-dark">
            加载中
          </div>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-ink-medium animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 rounded-full bg-ink-dark animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 rounded-full bg-cinnabar animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
