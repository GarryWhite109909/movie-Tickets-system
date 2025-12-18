"use client";

import { useMemo, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ScrollNav from './ScrollNav';

const GENRES = [
  "爱情",
  "喜剧",
  "动画",
  "剧情",
  "恐怖",
  "惊悚",
  "科幻",
  "动作",
  "悬疑",
  "犯罪",
  "冒险",
  "战争",
  "奇幻",
  "运动",
  "家庭",
  "古装",
  "武侠",
  "西部",
  "历史",
  "传记",
  "情色",
  "歌舞",
  "黑色电影",
  "短片",
  "纪录片",
  "其他"
];

type Props = {
  genres?: string[];
};

export default function FilmFilter({ genres }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeGenre = searchParams.get('genre') || '';
  const [isPending, startTransition] = useTransition();

  const items = useMemo(() => {
    const incoming = Array.isArray(genres) ? genres.filter(Boolean) : [];
    const merged = incoming.length > 0 ? incoming : GENRES;
    return ['全部', ...Array.from(new Set(merged))];
  }, [genres]);
  const activeItem = items.includes(activeGenre) ? activeGenre : (activeGenre === '' ? '全部' : activeGenre);

  const updateQuery = (genre: string) => {
    const nextGenre = !genre || genre === '全部' ? '' : genre;
    if (nextGenre === activeGenre) return;

    const params = new URLSearchParams(searchParams.toString());
    if (!nextGenre) params.delete('genre');
    else params.set('genre', nextGenre);

    startTransition(() => {
      router.push(`/films${params.toString() ? `?${params.toString()}` : ''}`);
    });
  };

  return (
    <ScrollNav 
      items={items}
      activeItem={activeItem}
      onSelect={updateQuery}
      disabled={isPending}
      className="my-8"
    />
  );
}
