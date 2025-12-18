import { fetcher, SUCCESS_CODE } from '@/utils/api';
import { ApiResponse } from '@/types/api';
import FilmCard from '@/components/FilmCard';
import FilmFilter from '@/components/FilmFilter';
import { Suspense } from 'react';

interface Film {
  filmId: string;
  filmName: string;
  poster: string;
  englishName?: string;
  genres?: string[];
  areas?: string[];
  tickets?: number;
  revenue?: string;
}

interface PageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

function normalizeQueryValue(value: string | string[] | undefined): string {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value[0] ?? '';
  return '';
}

export default async function Films({ searchParams }: PageProps) {
  const sp = (await searchParams) || {};
  const genre = decodeURIComponent(normalizeQueryValue(sp.genre));
  const q = normalizeQueryValue(sp.q).trim();

  const res = await fetcher<ApiResponse<Film[]>>('/film/all').catch(() => ({ code: 0, msg: '', data: [] }));
  const films = res.code === SUCCESS_CODE ? res.data : [];

  const genreItems = Array.from(
    new Set(
      films
        .flatMap((f) => (Array.isArray(f.genres) ? f.genres : []))
        .map((x) => String(x).trim())
        .filter(Boolean)
    )
  );

  const filteredFilms = films.filter((film) => {
    const genreOk = !genre || genre === '全部' ? true : (film.genres || []).includes(genre);
    if (!genreOk) return false;
    if (!q) return true;
    const haystack = `${film.filmName || ''} ${film.englishName || ''}`.toLowerCase();
    return haystack.includes(q.toLowerCase());
  });

  return (
    <div className="space-y-12 min-h-screen bg-paper py-10">
      {/* Ink Decoration Background */}
      <div className="fixed top-20 right-0 w-64 h-64 opacity-5 pointer-events-none select-none">
        <svg viewBox="0 0 200 200" className="w-full h-full fill-ink-black">
          <path d="M45.7,-76.3C58.9,-69.3,69.1,-55.6,76.5,-41.3C83.9,-27,88.5,-12.1,86.2,1.8C83.9,15.7,74.7,28.6,65.3,40.2C55.9,51.8,46.3,62.1,34.8,68.9C23.3,75.7,9.9,79,-2.7,78.2C-15.3,77.4,-29.4,72.5,-42.1,64.8C-54.8,57.1,-66.1,46.6,-74.4,33.9C-82.7,21.2,-88,6.3,-86.3,-8C-84.6,-22.3,-75.9,-36,-64.5,-46.8C-53.1,-57.6,-39,-65.5,-25.1,-69.5C-11.2,-73.5,2.5,-73.6,16.2,-73.7" transform="translate(100 100)" />
        </svg>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col items-start gap-4 mb-10 border-b border-ink-black/10 pb-6 relative">
          <div className="absolute -left-6 top-0 w-2 h-16 bg-cinnabar rounded-full opacity-80"></div>
          <h1 className="text-5xl font-calligraphy text-ink-black flex items-center gap-4 pl-4">
            正在热映
          </h1>
          <p className="text-ink-medium font-serif pl-4 italic">
             {q ? `搜索 "${q}"` : genre ? `分类: ${genre}` : '精选当下最热门的影片'}
          </p>
        </div>

        <Suspense fallback={<div className="h-16 my-8 animate-pulse bg-ink-black/5 rounded-sm" />}>
          <FilmFilter genres={genreItems} />
        </Suspense>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 relative z-10 mt-8">
          {filteredFilms.length > 0 ? (
            filteredFilms.map((film) => (
              <FilmCard key={film.filmId} film={film} />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-32 bg-white/50 border-2 border-dashed border-ink-black/10 rounded-sm">
              <span className="text-6xl mb-6 opacity-30 grayscale">🎬</span>
              <div className="text-2xl text-ink-light font-calligraphy mb-4">
                暂无相关影片
              </div>
              <p className="text-ink-medium font-serif">
                {genre ? `没有找到「${genre}」分类下的电影` : '近期暂无影片上映'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
