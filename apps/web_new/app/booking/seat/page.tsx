import { Suspense } from 'react';
import SeatSelectionClient from './SeatSelectionClient';

export default function SeatSelectionPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center">加载中...</div>}>
      <SeatSelectionClient />
    </Suspense>
  );
}

