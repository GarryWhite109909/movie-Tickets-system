import { fetcher, API_BASE_URL, SUCCESS_CODE } from '@/utils/api';
import { ApiResponse } from '@/types/api';
import Link from 'next/link';
import FilmPoster from '@/components/FilmPoster';
import InkSeal from '@/components/InkSeal';

import InkButton from '@/components/InkButton';

interface FilmDetail {
  filmId: string;
  filmName: string;
  englishName?: string;
  introduction: string;
  directors: string;
  performers: string;
  filmTime: string;
  onTime: string;
  poster: string;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function FilmDetailPage({ params }: PageProps) {
  const { id } = await params;
  let film: FilmDetail | null = null;
  let error = null;

  try {
    const res = await fetcher<ApiResponse<FilmDetail>>(`/film/${id}`);
    if (res.code === SUCCESS_CODE) {
      film = res.data;
    } else {
      error = 'Film not found';
    }
  } catch {
    error = 'Failed to load film details';
  }

  if (error || !film) {
    return (
      <div className="container mx-auto px-4 py-20 text-center min-h-screen bg-paper flex flex-col items-center justify-center">
        <h1 className="text-4xl font-calligraphy text-ink-black mb-4">出错啦</h1>
        <p className="text-ink-medium mb-8 font-serif">{error || '未找到相关影片信息'}</p>
        <Link href="/films">
          <InkButton variant="secondary">返回影片列表</InkButton>
        </Link>
      </div>
    );
  }

  // Construct background image URL safely
  const baseUrl = API_BASE_URL.replace('/api', '');
  const bgImageUrl = film.poster && film.poster.startsWith('/') ? `${baseUrl}${film.poster}` : film.poster;

  return (
    <div className="min-h-screen bg-paper pb-20 overflow-x-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 opacity-5 pointer-events-none select-none overflow-hidden">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-current text-ink-black">
          <path d="M45.7,-76.3C58.9,-69.3,69.1,-55.6,76.5,-41.3C83.9,-27,88.5,-12.1,86.2,1.8C83.9,15.7,74.7,28.6,65.3,40.2C55.9,51.8,46.3,62.1,34.8,68.9C23.3,75.7,9.9,79,-2.7,78.2C-15.3,77.4,-29.4,72.5,-42.1,64.8C-54.8,57.1,-66.1,46.6,-74.4,33.9C-82.7,21.2,-88,6.3,-86.3,-8C-84.6,-22.3,-75.9,-36,-64.5,-46.8C-53.1,-57.6,-39,-65.5,-25.1,-69.5C-11.2,-73.5,2.5,-73.6,16.2,-73.7" transform="translate(100 100)" />
        </svg>
      </div>

      {/* Top Blur Area */}
      <div className="relative h-[450px] w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center blur-2xl opacity-40 grayscale sepia-[0.3] scale-110 transform transition-transform duration-[20s] hover:scale-125"
          style={{ backgroundImage: `url(${bgImageUrl})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-paper/50 to-paper"></div>
      </div>

      <div className="container mx-auto px-4 -mt-80 relative z-10">
        <div className="bg-paper/90 backdrop-blur-sm rounded-sm shadow-2xl overflow-hidden flex flex-col md:flex-row border border-ink-black/5 p-8 gap-10 ink-shadow relative">
           {/* Decorative corner */}
           <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-ink-black/10 rounded-tl-lg pointer-events-none"></div>
           <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-ink-black/10 rounded-br-lg pointer-events-none"></div>

          {/* Left: Poster & Actions */}
          <div className="md:w-1/3 lg:w-1/4 flex flex-col gap-8">
            <div className="relative aspect-[3/4] shadow-2xl p-3 bg-white rotate-1 hover:rotate-0 transition-transform duration-700 group">
              <FilmPoster 
                src={film.poster} 
                alt={film.filmName} 
                bleedIntensity="medium"
                className="w-full h-full object-cover filter contrast-110 group-hover:sepia-[0.2] transition-all duration-500"
              />
              {/* Seal on poster */}
              <div className="absolute -top-4 -right-4 z-20 animate-float">
                <InkSeal text="热映" type="circle" size={50} variant="filled" />
              </div>
              <div className="absolute inset-0 border border-ink-black/10 pointer-events-none"></div>
            </div>
            
            <Link href={`/booking?filmId=${film.filmId}`} className="block w-full">
              <InkButton variant="primary" size="lg" className="w-full text-2xl py-4 shadow-xl">
                立即购票
              </InkButton>
            </Link>
          </div>

          {/* Right: Info & Vertical Text */}
          <div className="flex-1 flex flex-col relative">
            {/* Header */}
            <div className="mb-10 border-b border-ink-black/10 pb-6 flex flex-col items-start relative">
              <h1 className="text-5xl md:text-6xl font-calligraphy text-ink-black mb-3 drop-shadow-sm">{film.filmName}</h1>
              <h2 className="text-xl font-serif text-ink-medium italic tracking-wider">{film.englishName}</h2>
              
              {/* Score Badge (Mockup) */}
              <div className="absolute right-0 top-0 hidden md:flex flex-col items-center">
                 <span className="text-4xl font-title font-bold text-cinnabar">9.0</span>
                 <div className="flex text-cinnabar text-xs">★★★★★</div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-12 flex-1">
              {/* Vertical Introduction (Desktop) */}
              <div className="lg:w-1/3 h-[450px] relative overflow-hidden hidden lg:block border-r border-ink-black/10 pr-8">
                {/* Ink Dot Separator Pseudo-element equivalent */}
                <div className="absolute top-0 right-0 w-1 h-full flex flex-col justify-around opacity-20">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-1 h-1 rounded-full bg-ink-black"></div>
                  ))}
                </div>
                <div className="text-vertical h-full text-lg font-serif text-ink-dark leading-loose tracking-widest overflow-y-auto custom-scrollbar select-none hover:text-ink-black transition-colors">
                  {film.introduction}
                </div>
              </div>
              
              {/* Mobile Introduction (Horizontal) */}
              <div className="lg:hidden mb-8">
                 <h3 className="text-lg font-bold font-title mb-2 text-ink-black">剧情简介</h3>
                 <p className="font-serif text-ink-dark leading-loose text-justify indent-8 relative">
                   <span className="absolute -left-4 top-2 w-2 h-2 rounded-full bg-ink-medium/50"></span>
                   {film.introduction}
                 </p>
              </div>

              {/* Meta Info & Cast */}
              <div className="flex-1 space-y-10 font-serif">
                <div className="space-y-4 text-ink-dark text-lg">
                   <div className="flex items-baseline gap-4 border-b border-dashed border-ink-black/10 pb-2">
                     <span className="text-ink-medium font-bold min-w-[60px]">导演</span>
                     <span className="font-medium text-ink-black">{film.directors}</span>
                   </div>
                   <div className="flex items-baseline gap-4 border-b border-dashed border-ink-black/10 pb-2">
                     <span className="text-ink-medium font-bold min-w-[60px]">上映</span>
                     <span>{new Date(film.onTime).toLocaleDateString()}</span>
                   </div>
                   <div className="flex items-baseline gap-4 border-b border-dashed border-ink-black/10 pb-2">
                     <span className="text-ink-medium font-bold min-w-[60px]">片长</span>
                     <span>{film.filmTime}</span>
                   </div>
                </div>

                {/* Cast List with Seals */}
                <div>
                  <h3 className="text-xl font-title font-bold text-ink-black mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-cinnabar rounded-full"></span>
                    主要演员
                  </h3>
                  <div className="flex flex-wrap gap-6">
                    {film.performers.split(/,|，|、/).filter(Boolean).map((actor, idx) => (
                      <div key={idx} className="group relative flex flex-col items-center gap-3">
                        <div className="w-[60px] h-[60px] rounded-full bg-ink-faint border-2 border-ink-black/10 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:border-cinnabar group-hover:shadow-lg group-hover:scale-110 relative">
                          <span className="text-xl font-calligraphy text-ink-medium/50 select-none group-hover:opacity-0 transition-opacity">
                            {actor.trim()[0]}
                          </span>
                          {/* Hover Seal Effect - 20px Seal as requested */}
                          <div className="absolute inset-0 bg-paper opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <InkSeal 
                              text={actor.trim()} 
                              type="circle" 
                              size={24} 
                              variant="outline"
                              className="!border-[1px]" 
                            />
                          </div>
                        </div>
                        <span className="text-sm text-ink-dark font-medium group-hover:text-cinnabar transition-colors font-serif">{actor.trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
