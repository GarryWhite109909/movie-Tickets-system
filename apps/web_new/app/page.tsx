import { fetcher, SUCCESS_CODE } from '@/utils/api';
import { ApiResponse } from '@/types/api';
import Link from 'next/link';
import FilmCard from '@/components/FilmCard';
import { Film } from 'lucide-react';

interface Overview {
  filmCount: number;
  userCount: number;
  bookingCount: number;
}

interface TopFilm {
  filmId: number;
  filmName: string;
  englishName: string;
  introduction: string;
  directors: string;
  performers: string;
  filmTime: string;
  onTime: string;
  poster?: string;
  tickets?: number; // Added to match API response for TopFilm which might include ticket count/revenue
  revenue?: string;
}

export default async function Home() {
  const overviewPromise = fetcher<ApiResponse<Overview>>('/stats/overview').catch(() => null);
  const topFilmsPromise = fetcher<ApiResponse<TopFilm[]>>('/stats/topFilms?from=2018-01-01&to=2025-12-31&limit=6').catch(() => null);
  const [overviewRes, topFilmsRes] = await Promise.all([overviewPromise, topFilmsPromise]);

  const overview = overviewRes?.code === SUCCESS_CODE ? overviewRes.data : null;
  const topFilms = topFilmsRes?.code === SUCCESS_CODE ? topFilmsRes.data : [];

  // Transform TopFilm to match FilmCardProps
  // Ensure topFilms is an array before mapping
  const filmsArray = Array.isArray(topFilms) ? topFilms : [];
  const transformedFilms = filmsArray.map(f => ({
    filmId: String(f.filmId),
    filmName: f.filmName,
    poster: f.poster || '',
    tickets: f.tickets || 0
  }));

  return (
    <div className="space-y-24">
      {/* Hero Content Overlay */}
      <section className="relative min-h-[60vh] flex flex-col justify-center items-center text-center z-10 py-20 animate-fade-in">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-ink-black/5 to-transparent rounded-full blur-3xl -z-10 pointer-events-none"></div>
        
        <h1 className="text-6xl md:text-8xl font-title font-black mb-8 tracking-tight ink-shadow text-ink-black">
          开启您的
          <span className="block mt-4 text-transparent bg-clip-text bg-gradient-to-b from-ink-black to-ink-medium text-8xl md:text-9xl font-calligraphy">
            光影之旅
          </span>
        </h1>
        <p className="text-xl md:text-2xl mb-12 text-ink-medium max-w-3xl mx-auto font-serif leading-relaxed">
          墨映光影，纸间影院。沉浸式观影体验，从这里开始。
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link 
            href="/films" 
            className="group relative px-10 py-4 overflow-hidden rounded-md bg-ink-black text-white font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <span className="relative z-10 flex items-center gap-2 font-serif">
              立即购票 <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Link>
          <Link 
            href="/login" 
            className="group px-10 py-4 rounded-md border-2 border-ink-black text-ink-black font-bold text-lg hover:bg-ink-black hover:text-white transition-all duration-300 font-serif"
          >
            登录账户
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      {overview && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          <Link href="/films" className="block group">
            <div className="bg-white p-8 rounded-sm border border-ink-black/10 shadow-sm hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-stone-blue/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500"></div>
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="p-4 bg-stone-blue/10 rounded-full text-stone-blue group-hover:bg-stone-blue group-hover:text-white transition-colors duration-300">
                  <Film className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-ink-light group-hover:text-stone-blue transition font-serif">点击查看</span>
              </div>
              <div className="text-5xl font-title font-bold text-ink-black mb-2">{overview.filmCount}</div>
              <div className="text-ink-medium font-medium tracking-wide font-serif">在线影片</div>
            </div>
          </Link>
          
          <Link href="/login" className="block group">
            <div className="bg-white p-8 rounded-sm border border-ink-black/10 shadow-sm hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-20 h-20 bg-cinnabar/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500"></div>
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="p-4 bg-cinnabar/10 rounded-full text-cinnabar group-hover:bg-cinnabar group-hover:text-white transition-colors duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                </div>
                <span className="text-sm font-medium text-ink-light group-hover:text-cinnabar transition font-serif">加入我们</span>
              </div>
              <div className="text-5xl font-title font-bold text-ink-black mb-2">{overview.userCount}</div>
              <div className="text-ink-medium font-medium tracking-wide font-serif">注册用户</div>
            </div>
          </Link>

          <Link href="/profile" className="block group">
             <div className="bg-white p-8 rounded-sm border border-ink-black/10 shadow-sm hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gold-leaf/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500"></div>
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="p-4 bg-gold-leaf/10 rounded-full text-gold-leaf group-hover:bg-gold-leaf group-hover:text-white transition-colors duration-300">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
                </div>
                <span className="text-sm font-medium text-ink-light group-hover:text-gold-leaf transition font-serif">累计出票</span>
              </div>
              <div className="text-5xl font-title font-bold text-ink-black mb-2">{overview.bookingCount}</div>
              <div className="text-ink-medium font-medium tracking-wide font-serif">累计订单</div>
            </div>
          </Link>
        </section>
      )}

      {/* Top Films */}
      <section className="relative z-10">
        <div className="flex items-center justify-between mb-12 border-b border-ink-black/10 pb-4">
          <h2 className="text-3xl md:text-4xl font-title font-bold text-ink-black flex items-center gap-4">
            <span className="w-1.5 h-10 bg-cinnabar rounded-full shadow-sm"></span>
            热门推荐
          </h2>
          <Link href="/films" className="flex items-center gap-2 text-ink-medium hover:text-stone-blue transition-colors group px-4 py-2 rounded-full hover:bg-ink-faint font-serif">
            <span className="font-medium">查看更多</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
          {transformedFilms.length > 0 ? (
             transformedFilms.map((film) => (
              <FilmCard key={film.filmId} film={film} />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white border border-dashed border-ink-black/20 rounded-sm">
               <span className="text-5xl mb-4 opacity-30 grayscale">🎬</span>
               <p className="text-xl text-ink-medium font-medium font-serif">暂无热门推荐</p>
               <p className="text-ink-light text-sm mt-2">精彩大片即将上映</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
