'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { fetcher, SUCCESS_CODE } from '@/utils/api';
import FilmPoster from '@/components/FilmPoster';
import { auth } from '@/utils/auth';
import ScrollNav from '@/components/ScrollNav';

import { ApiResponse, Arrange, Film } from '@/types/api';

export default function BookingClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const filmId = searchParams.get('filmId');

  const [film, setFilm] = useState<Film | null>(null);
  // Extend Arrange to include remainingSeats if the API returns it, otherwise TS might complain
  // For now assuming API returns what matches the type, but let's see.
  // The previous code had remainingSeats, let's keep it as an optional property if we can't find it in Api types.
  // We can use an intersection type for local state if needed.
  const [arranges, setArranges] = useState<(Arrange & { remainingSeats?: number })[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [arrangesLoading, setArrangesLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchArrangements = useCallback(async (id: string, date: string) => {
    try {
      setArrangesLoading(true);
      setError('');
      const res = await fetcher<ApiResponse<Arrange[]>>(`/arrange/film/${id}?date=${encodeURIComponent(date)}`);
      if (res.code === SUCCESS_CODE) {
        setArranges((res.data || []) as (Arrange & { remainingSeats?: number })[]);
      } else {
        setError(res.msg || '获取排片失败');
        setArranges([]);
      }
    } catch (e: unknown) {
      console.error(e);
      const message = e instanceof Error ? e.message : '获取排片失败';
      setError(message);
      setArranges([]);
    } finally {
      setArrangesLoading(false);
    }
  }, []);

  const loadInitialData = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError('');
      const [filmRes, datesRes] = await Promise.all([
        fetcher<ApiResponse<Film>>(`/film/${id}`),
        fetcher<ApiResponse<string[]>>(`/arrange/film/${id}/dates`)
      ]);

      if (filmRes.code === SUCCESS_CODE) {
        setFilm(filmRes.data);
      } else {
        throw new Error(filmRes.msg || '获取影片信息失败');
      }

      const availableDates = datesRes.code === SUCCESS_CODE ? (datesRes.data || []) : [];
      setDates(availableDates);

      if (availableDates.length > 0) {
        const firstDate = availableDates[0];
        setSelectedDate(firstDate);
        await fetchArrangements(id, firstDate);
      } else {
        setArranges([]);
      }
    } catch (e: unknown) {
      console.error(e);
      const message = e instanceof Error ? e.message : '加载排片信息失败';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [fetchArrangements]);

  useEffect(() => {
    if (!auth.getToken()) {
      router.push('/login');
      return;
    }

    if (filmId) {
      void loadInitialData(filmId);
    } else {
      setLoading(false);
    }
  }, [filmId, loadInitialData, router]);

  const handleDateClick = (date: string) => {
    if (date === selectedDate || !filmId) return;
    setSelectedDate(date);
    void fetchArrangements(filmId, date);
  };

  if (loading) return <div className="p-20 text-center font-serif text-ink-medium animate-pulse">正在为您研墨准备...</div>;
  if (!film && error) return <div className="p-20 text-center font-serif text-cinnabar">{error}</div>;
  if (!film) return <div className="p-20 text-center font-serif text-ink-medium">未找到影片信息</div>;

  return (
    <div className="min-h-screen bg-paper pb-20">
      {/* Header */}
      <div className="bg-ink-black text-paper py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(${film.poster})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(20px)' }}></div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-8">
           <div className="w-32 h-48 relative shadow-2xl border-2 border-white/10 rotate-3 transform hover:rotate-0 transition-all duration-500">
             <FilmPoster src={film.poster} alt={film.filmName} className="w-full h-full object-cover" />
           </div>
           <div className="text-center md:text-left">
             <h1 className="text-4xl md:text-5xl font-calligraphy mb-2">{film.filmName}</h1>
             <p className="text-ink-light font-serif tracking-widest">选座购票</p>
           </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 -mt-8 relative z-20">
        <div className="bg-white/80 backdrop-blur-sm rounded-sm shadow-xl border border-ink-black/5 min-h-[500px] flex flex-col overflow-hidden">
          
          {/* Date Scroll Navigation */}
          <div className="border-b border-ink-black/10 bg-ink-faint/50 p-4">
             <ScrollNav 
                items={dates}
                activeItem={selectedDate}
                onSelect={handleDateClick}
                disabled={arrangesLoading}
                className="w-full"
             />
          </div>

          {/* Arrangements List */}
          <div className="flex-1 p-6 md:p-10 bg-paper">
             <h2 className="text-2xl font-calligraphy text-ink-black mb-8 border-b border-ink-black/10 pb-4 flex items-center justify-between">
               <span>场次列表</span>
               <span className="text-sm font-serif text-ink-medium">{arranges.length} 场可选</span>
             </h2>

             {error && !loading && film ? (
                <div className="text-center py-20 text-cinnabar font-serif">
                   <div className="text-4xl mb-4">⚠️</div>
                   {error}
                   <div className="mt-4">
                     <button 
                       onClick={() => fetchArrangements(filmId!, selectedDate)} 
                       className="px-6 py-2 border border-cinnabar text-cinnabar rounded-full hover:bg-cinnabar hover:text-white transition-colors text-sm"
                     >
                       重试
                     </button>
                   </div>
                </div>
             ) : arrangesLoading ? (
               <div className="text-center py-20 text-ink-medium font-serif animate-pulse">正在获取场次信息...</div>
             ) : arranges.length === 0 ? (
               <div className="text-center py-20 text-ink-medium font-serif">
                 <div className="text-4xl mb-4 opacity-30">🈳</div>
                 今日暂无场次
               </div>
             ) : (
               <div className="space-y-4">
                 {arranges.map((item) => (
                   <div 
                     key={item.arrangeId}
                     className="group bg-white border border-ink-black/10 rounded-sm p-6 flex flex-col md:flex-row items-center justify-between hover:shadow-lg hover:border-cinnabar/30 transition-all duration-300 relative overflow-hidden"
                   >
                     {/* Hover Ink Effect */}
                     <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cinnabar/5 to-transparent rounded-bl-full translate-x-16 -translate-y-16 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500 pointer-events-none"></div>

                     <div className="flex items-center gap-8 mb-4 md:mb-0 relative z-10">
                       <div className="text-center min-w-[80px]">
                         <div className="text-2xl font-bold font-title text-ink-black">{item.start}</div>
                         <div className="text-sm text-ink-medium font-serif">散场 {item.end}</div>
                       </div>
                       <div className="flex-1 min-w-[120px]">
                        <div className="text-lg font-bold font-serif text-ink-dark mb-1">{item.filmroom?.roomName || '未知影厅'}</div>
                        <div className="text-sm text-ink-medium">剩余 {item.remainingSeats ?? '充足'} 座</div>
                      </div>
                     </div>

                     <div className="flex items-center gap-6 relative z-10">
                       <div className="text-right">
                         <div className="text-2xl font-bold font-title text-cinnabar">
                           <span className="text-sm align-top opacity-70">¥</span>{item.price}
                         </div>
                       </div>
                       <button
                         onClick={() => router.push(`/booking/seat?arrangeId=${item.arrangeId}`)}
                         className="px-8 py-2 bg-white border-2 border-cinnabar text-cinnabar rounded-full hover:bg-cinnabar hover:text-white transition-all font-bold font-serif shadow-sm hover:shadow-md active:scale-95"
                       >
                         购票
                       </button>
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
