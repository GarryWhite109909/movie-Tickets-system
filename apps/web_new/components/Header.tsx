'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { auth } from '@/utils/auth';
import { useAuthUser } from '@/hooks/useAuthUser';
import { fetcher, SUCCESS_CODE } from '@/utils/api';
import { ApiResponse } from '@/types/api';
import { Search, LogOut, Film, Home as HomeIcon, X, User } from 'lucide-react';

interface FilmSearchItem {
  filmId: string;
  filmName: string;
  englishName?: string;
}

export default function Header() {
  const router = useRouter();
  const user = useAuthUser();
  const [hidden, setHidden] = useState(false);
  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [films, setFilms] = useState<FilmSearchItem[]>([]);
  const [loadError, setLoadError] = useState<string>('');

  const handleLogout = () => {
    auth.logout();
    router.push('/login');
  };

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => window.clearTimeout(t);
  }, [query]);

  const results = useMemo(() => {
    const q = debouncedQuery.toLowerCase();
    if (!q) return [];

    const matched = films
      .map((f) => {
        const haystack = `${f.filmName || ''} ${f.englishName || ''}`.toLowerCase();
        return { film: f, haystack };
      })
      .filter((x) => x.haystack.includes(q))
      .slice(0, 8)
      .map((x) => x.film);

    return matched;
  }, [debouncedQuery, films]);

  const normalizedActiveIndex = results.length > 0 ? Math.min(Math.max(activeIndex, 0), results.length - 1) : -1;

  const loadFilmsIfNeeded = () => {
    if (loading) return;
    if (films.length > 0) return;

    setLoading(true);
    setLoadError('');

    fetcher<ApiResponse<FilmSearchItem[]>>('/film/all')
      .then((res) => {
        if (res.code === SUCCESS_CODE && Array.isArray(res.data)) {
          setFilms(res.data);
        } else {
          setFilms([]);
        }
      })
      .catch(() => {
        setLoadError('搜索数据加载失败');
        setFilms([]);
      })
      .finally(() => setLoading(false));
  };

  const jumpToFilm = (filmId: string) => {
    setOpen(false);
    setQuery('');
    setDebouncedQuery('');
    router.push(`/films/${filmId}`);
  };

  const jumpToFilmsSearch = (q: string) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    setOpen(false);
    router.push(`/films${params.toString() ? `?${params.toString()}` : ''}`);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    lastScrollYRef.current = window.scrollY;

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      window.requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const lastY = lastScrollYRef.current;
        const delta = currentY - lastY;

        if (currentY < 10) {
          setHidden(false);
        } else if (delta > 10 && currentY > 60) {
          setHidden(true);
        } else if (delta < -10) {
          setHidden(false);
        }

        lastScrollYRef.current = currentY;
        tickingRef.current = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 px-4 pt-4 transition-all duration-500 ease-in-out ${
        hidden ? '-translate-y-[120%] opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
      }`}
    >
      <div className="container mx-auto max-w-7xl">
        <div className="relative flex items-center justify-between h-16 px-3 sm:px-6 rounded-full border border-ink-black/10 bg-paper/80 backdrop-blur-md shadow-sm ink-shadow">
          {/* Logo Section */}
          <Link href="/" className="group flex items-center gap-3 shrink-0">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-ink-black text-white shadow-md group-hover:scale-110 transition-transform duration-300">
              <span className="text-xl font-serif">墨</span>
            </div>
            <span className="hidden sm:inline text-lg font-bold font-title text-ink-black tracking-tight">
              墨映光影
            </span>
          </Link>

          {/* Search Section */}
          <div className="flex-1 max-w-[200px] sm:max-w-md mx-4 lg:mx-12">
            <div className={`relative group transition-all duration-300 ${open ? 'z-50' : ''}`}>
              <div
                className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-full transition-all duration-300 border ${
                  open || query
                    ? 'bg-white border-stone-blue/50 shadow-md ring-1 ring-stone-blue/30'
                    : 'bg-ink-faint border-transparent hover:bg-white hover:border-ink-black/10'
                }`}
              >
                <Search
                  className={`w-4 h-4 transition-colors ${
                    open || query ? 'text-stone-blue' : 'text-ink-light group-hover:text-ink-medium'
                  }`}
                />
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (!open) setOpen(true);
                    if (e.target.value.trim()) {
                      loadFilmsIfNeeded();
                      if (activeIndex !== 0) setActiveIndex(0);
                    } else {
                      if (activeIndex !== -1) setActiveIndex(-1);
                    }
                  }}
                  onFocus={() => {
                    setOpen(true);
                    if (query.trim()) loadFilmsIfNeeded();
                    if (results.length > 0 && normalizedActiveIndex === -1) setActiveIndex(0);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      if (results.length === 0) return;
                      setActiveIndex((i) => {
                        const base = results.length > 0 ? Math.min(Math.max(i, 0), results.length - 1) : -1;
                        return (base + 1) % results.length;
                      });
                      return;
                    }
                    if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      if (results.length === 0) return;
                      setActiveIndex((i) => {
                        const base = results.length > 0 ? Math.min(Math.max(i, 0), results.length - 1) : -1;
                        return (base - 1 + results.length) % results.length;
                      });
                      return;
                    }
                    if (e.key === 'Enter') {
                      if (results.length > 0 && normalizedActiveIndex >= 0) {
                        e.preventDefault();
                        jumpToFilm(results[normalizedActiveIndex].filmId);
                        return;
                      }
                      const q = query.trim();
                      if (q) {
                        e.preventDefault();
                        jumpToFilmsSearch(q);
                      }
                      return;
                    }
                    if (e.key === 'Escape') {
                      setOpen(false);
                      return;
                    }
                  }}
                  onBlur={() => {
                    window.setTimeout(() => setOpen(false), 200);
                  }}
                  placeholder="搜索精彩影片..."
                  className="w-full min-w-0 bg-transparent text-sm text-ink-black placeholder:text-ink-light focus:outline-none"
                  role="combobox"
                  aria-expanded={open}
                  aria-controls="header-film-search-list"
                  aria-autocomplete="list"
                />
                {query.trim() && (
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setQuery('');
                      setDebouncedQuery('');
                      setActiveIndex(-1);
                    }}
                    className="p-1 rounded-full hover:bg-ink-black/10 text-ink-light hover:text-ink-black transition shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Search Results Dropdown */}
              {open && debouncedQuery && (
                <div
                  id="header-film-search-list"
                  role="listbox"
                  className="absolute top-full left-0 right-0 mt-3 p-2 bg-paper/95 backdrop-blur-2xl rounded-2xl border border-ink-black/10 shadow-xl overflow-hidden transform origin-top transition-all duration-200 animate-in fade-in slide-in-from-top-2"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {loading ? (
                    <div className="flex items-center justify-center py-8 text-ink-medium text-sm">
                      <div className="w-4 h-4 border-2 border-stone-blue border-t-transparent rounded-full animate-spin mr-3"></div>
                      正在搜索...
                    </div>
                  ) : loadError ? (
                    <div className="py-4 text-center text-sm text-cinnabar bg-red-50 rounded-xl mx-2 my-2 border border-red-100">
                      {loadError}
                    </div>
                  ) : results.length > 0 ? (
                    <>
                      <div className="max-h-[320px] overflow-y-auto custom-scrollbar px-1">
                        {results.map((film, idx) => {
                          const selected = idx === normalizedActiveIndex;
                          return (
                            <button
                              key={film.filmId}
                              type="button"
                              role="option"
                              aria-selected={selected}
                              className={`w-full text-left px-4 py-3 my-1 rounded-xl text-sm transition-all duration-200 flex flex-col gap-0.5 group ${
                                selected
                                  ? 'bg-stone-blue/10 border border-stone-blue/20 text-stone-blue translate-x-1'
                                  : 'text-ink-medium hover:bg-ink-faint border border-transparent'
                              }`}
                              onMouseEnter={() => setActiveIndex(idx)}
                              onClick={() => jumpToFilm(film.filmId)}
                            >
                              <div className="font-semibold font-title group-hover:text-stone-blue transition-colors">
                                {film.filmName}
                              </div>
                              {film.englishName && (
                                <div className="text-xs text-ink-light group-hover:text-ink-medium transition-colors">
                                  {film.englishName}
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      <div className="mt-2 pt-2 border-t border-ink-black/5 px-1">
                        <button
                          type="button"
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-stone-blue bg-stone-blue/5 hover:bg-stone-blue/10 border border-stone-blue/20 rounded-xl transition-all active:scale-[0.98]"
                          onClick={() => jumpToFilmsSearch(query.trim())}
                        >
                      查看所有 &quot;{query.trim()}&quot; 的结果
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="py-8 text-center text-sm text-ink-light">
                      未找到相关影片
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Navigation & Auth */}
          <nav aria-label="主导航" className="shrink-0">
            <ul className="flex items-center gap-1 sm:gap-2">
              <li className="hidden md:block">
                <Link
                  href="/"
                  className="px-4 py-2 text-sm font-medium text-ink-medium hover:text-ink-black rounded-full hover:bg-ink-black/5 transition-all duration-300 flex items-center gap-2"
                >
                  <HomeIcon className="w-4 h-4" />
                  首页
                </Link>
              </li>
              <li className="hidden md:block">
                <Link
                  href="/films"
                  className="px-4 py-2 text-sm font-medium text-ink-medium hover:text-ink-black rounded-full hover:bg-ink-black/5 transition-all duration-300 flex items-center gap-2"
                >
                  <Film className="w-4 h-4" />
                  影片
                </Link>
              </li>

              {user ? (
                <li className="flex items-center gap-3 ml-2 pl-2 sm:border-l sm:border-ink-black/10">
                  <div className="hidden lg:flex flex-col items-end mr-1 select-none">
                    <span className="text-xs font-semibold text-ink-black max-w-[100px] truncate">
                      {user.userName}
                    </span>
                    <span className="text-[10px] text-stone-blue">已登录</span>
                  </div>
                  <div className="relative group cursor-pointer">
                    <div className="w-9 h-9 rounded-full bg-ink-faint border border-ink-black/10 flex items-center justify-center text-ink-black font-bold text-sm group-hover:bg-ink-black group-hover:text-white transition-all duration-300">
                      {user.userName ? user.userName[0].toUpperCase() : <User className="w-4 h-4" />}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    aria-label="退出登录"
                    className="p-2 text-ink-light hover:text-cinnabar hover:bg-red-50 rounded-full transition-all duration-300 active:scale-90"
                    title="退出登录"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </li>
              ) : (
                <li className="flex items-center gap-2 ml-1">
                  <Link
                    href="/login"
                    className="hidden sm:inline-block px-5 py-2 text-sm font-medium text-ink-medium hover:text-ink-black rounded-full hover:bg-ink-black/5 transition-all duration-300 font-serif"
                  >
                    登录
                  </Link>
                  <Link href="/register">
                    <span className="px-6 py-2 text-sm font-bold text-white bg-cinnabar hover:bg-red-600 rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 inline-block font-serif">
                      注册
                    </span>
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
