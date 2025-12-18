import { Suspense } from 'react';
import BookingClient from './BookingClient';

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center">加载中...</div>}>
      <BookingClient />
    </Suspense>
  );
}

