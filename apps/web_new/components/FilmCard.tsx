'use client';

import Link from 'next/link';
import FilmPoster from './FilmPoster';
import InkButton from './InkButton';
import InkSeal from './InkSeal';
import { Film } from '@/types/api';

interface FilmCardProps {
  film: Film;
}

export default function FilmCard({ film }: FilmCardProps) {
  // Simulate "Hot" status based on tickets count > 1000 or random for demo
  const isHot = (film.tickets || 0) > 1000;

  return (
    <div className="group relative bg-white rounded-sm overflow-hidden border border-ink-black/10 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ink-shadow h-full flex flex-col">
      {/* Hot Seal */}
      {isHot && (
        <div className="absolute top-4 right-4 z-20 transform rotate-45 opacity-90 drop-shadow-md pointer-events-none">
          <InkSeal text="热映" size={48} type="circle" variant="outline" className="bg-paper/80 backdrop-blur-sm !border-cinnabar !text-cinnabar" />
        </div>
      )}

      <div className="aspect-[3/4] relative overflow-hidden">
        <FilmPoster 
          src={film.poster || ''} 
          alt={film.filmName} 
          bleedIntensity="low"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-ink-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6 backdrop-blur-[1px]">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
            <Link href={`/films/${film.filmId}`} className="block w-full">
              <InkButton variant="primary" className="w-full shadow-lg border-2 border-white/20">
                立即购票
              </InkButton>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="p-5 relative z-10 bg-white flex-1 flex flex-col justify-between">
        <Link href={`/films/${film.filmId}`} className="block group/title">
          <h3 className="text-xl font-title font-bold text-ink-black mb-2 truncate group-hover/title:text-cinnabar transition-all duration-300">
            {film.filmName}
          </h3>
        </Link>
        <div className="flex justify-between items-center text-sm font-medium font-serif mt-auto pt-2 border-t border-dashed border-ink-black/10">
          <div className="flex items-center gap-1 text-cinnabar font-calligraphy">
            <span className="text-lg">★</span>
            <span className="text-xl">9.0</span>
          </div>
          <span className="text-stone-blue group-hover:text-stone-blue/80 transition-colors">
            {film.tickets ? film.tickets.toLocaleString() : 0} 人想看
          </span>
        </div>
      </div>
    </div>
  );
}
