'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState, useRef } from 'react';
import { fetcher, SUCCESS_CODE } from '@/utils/api';
import { auth } from '@/utils/auth';
import InkSeal from '@/components/InkSeal';
import { ApiResponse } from '@/types/api';

interface SeatInfo {
  arrangeId: string;
  filmName: string;
  roomName: string;
  date: string;
  start: string;
  price: number;
  row: number;
  column: number;
  bookedSeats: number[][];
}

export default function SeatSelectionClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const arrangeId = searchParams.get('arrangeId');

  const [info, setInfo] = useState<SeatInfo | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[][]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const loadData = useCallback(async (id: string) => {
    try {
      const res = await fetcher<ApiResponse<SeatInfo>>(`/arrange/${id}`);
      if (res.code === SUCCESS_CODE) {
        setInfo(res.data);
      } else {
        alert(res.msg || '加载座位信息失败');
      }
    } catch {
      alert('加载座位信息失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!auth.getToken()) {
      router.push('/login');
      return;
    }

    if (arrangeId) {
      void loadData(arrangeId);
    } else {
      setLoading(false);
    }
  }, [arrangeId, loadData, router]);

  const toggleSeat = (r: number, c: number) => {
    const isSelected = selectedSeats.some(([sr, sc]) => sr === r && sc === c);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(([sr, sc]) => !(sr === r && sc === c)));
    } else {
      if (selectedSeats.length >= 4) {
        alert('一次最多选择4个座位');
        return;
      }
      setSelectedSeats([...selectedSeats, [r, c]]);
    }
  };

  const isBooked = useCallback((r: number, c: number) => {
    return info?.bookedSeats.some(([br, bc]) => br === r && bc === c);
  }, [info]);

  // Canvas Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !info) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Config
    const padding = 60;
    const seatSize = 40;
    const gap = 12;
    const screenHeight = 120;
    
    // Calculate total size
    const totalWidth = Math.max(800, info.column * (seatSize + gap) + padding * 2);
    const totalHeight = info.row * (seatSize + gap) + padding + screenHeight;

    canvas.width = totalWidth;
    canvas.height = totalHeight;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Screen Area
    ctx.save();
    ctx.fillStyle = '#f3f4f6'; // Gray-100
    // Draw curved screen path
    ctx.beginPath();
    ctx.moveTo(totalWidth/2 - 250, 60);
    ctx.bezierCurveTo(totalWidth/2, 20, totalWidth/2, 20, totalWidth/2 + 250, 60);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#d1d5db';
    ctx.stroke();
    
    // Screen Text
    ctx.font = '16px "Noto Serif SC", serif';
    ctx.fillStyle = '#9ca3af';
    ctx.textAlign = 'center';
    ctx.fillText('银幕中央', totalWidth/2, 90);
    ctx.restore();

    // Draw Seats
    const startY = screenHeight;
    // Center the seats horizontally
    const seatsBlockWidth = info.column * (seatSize + gap) - gap;
    const startX = (totalWidth - seatsBlockWidth) / 2;

    for (let r = 1; r <= info.row; r++) {
      // Row Number
      ctx.fillStyle = '#9ca3af';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(r.toString(), startX - 10, startY + (r - 1) * (seatSize + gap) + seatSize/2 + 4);

      for (let c = 1; c <= info.column; c++) {
        const x = startX + (c - 1) * (seatSize + gap);
        const y = startY + (r - 1) * (seatSize + gap);
        
        const booked = isBooked(r, c);
        const selected = selectedSeats.some(([sr, sc]) => sr === r && sc === c);

        ctx.beginPath();
        // Rounded rectangle manually for better compatibility
        const radius = 6;
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + seatSize - radius, y);
        ctx.quadraticCurveTo(x + seatSize, y, x + seatSize, y + radius);
        ctx.lineTo(x + seatSize, y + seatSize - radius);
        ctx.quadraticCurveTo(x + seatSize, y + seatSize, x + seatSize - radius, y + seatSize);
        ctx.lineTo(x + radius, y + seatSize);
        ctx.quadraticCurveTo(x, y + seatSize, x, y + seatSize - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();

        if (booked) {
           // Booked: Dry brush effect (simple hatch)
           ctx.save();
           ctx.fillStyle = '#fecaca';
           ctx.fill();
           ctx.strokeStyle = '#f87171';
           ctx.lineWidth = 1;
           ctx.moveTo(x + 5, y + 5);
           ctx.lineTo(x + seatSize - 5, y + seatSize - 5);
           ctx.moveTo(x + seatSize - 5, y + 5);
           ctx.lineTo(x + 5, y + seatSize - 5);
           ctx.stroke();
           ctx.restore();
        } else if (selected) {
           // Selected: Cinnabar
           ctx.fillStyle = '#E74C3C';
           ctx.fill();
           // Inner detail
           ctx.strokeStyle = 'rgba(255,255,255,0.2)';
           ctx.lineWidth = 2;
           ctx.stroke();
           
           // Text
           ctx.fillStyle = '#fff';
           ctx.font = '12px serif';
           ctx.textAlign = 'center';
           ctx.textBaseline = 'middle';
           ctx.fillText(`${r}-${c}`, x + seatSize/2, y + seatSize/2);
        } else {
           // Available: Ink outline
           ctx.strokeStyle = 'rgba(0,0,0,0.4)'; // Ink black with opacity
           ctx.lineWidth = 1.5;
           ctx.stroke();
           ctx.fillStyle = '#fff';
           ctx.fill();
        }
      }
    }
  }, [info, selectedSeats, isBooked]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!info) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    const seatSize = 40;
    const gap = 12;
    const screenHeight = 120;
    const seatsBlockWidth = info.column * (seatSize + gap) - gap;
    const startX = (canvas.width - seatsBlockWidth) / 2;
    const startY = screenHeight;

    // Check which seat
    // x = startX + (c-1)*(size+gap)
    // c - 1 = (x - startX) / (size+gap)
    const colIndex = Math.floor((clickX - startX) / (seatSize + gap));
    const rowIndex = Math.floor((clickY - startY) / (seatSize + gap));
    
    // Check if click is actually inside the seat rect (accounting for gap)
    const seatX = startX + colIndex * (seatSize + gap);
    const seatY = startY + rowIndex * (seatSize + gap);
    
    if (clickX >= seatX && clickX <= seatX + seatSize && 
        clickY >= seatY && clickY <= seatY + seatSize) {
      
      const r = rowIndex + 1;
      const c = colIndex + 1;
      
      if (r >= 1 && r <= info.row && c >= 1 && c <= info.column) {
        if (!isBooked(r, c)) {
          toggleSeat(r, c);
        }
      }
    }
  };

  const handleSubmit = async () => {
    if (!arrangeId || selectedSeats.length === 0) return;

    try {
      setSubmitting(true);

      const seats = selectedSeats.map(([row, col]) => ({ row, col }));
      const res = await fetcher<ApiResponse>('/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.getToken()}`
        },
        body: JSON.stringify({
          arrangeId: Number(arrangeId),
          seats
        })
      });

      if (res.code === SUCCESS_CODE) {
        setShowSuccess(true);
        setTimeout(() => {
          router.push('/profile');
        }, 2000);
      } else {
        alert(res.msg || '购票失败');
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : '系统繁忙，请稍后再试';
      alert(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-serif text-ink-medium animate-pulse">正在布置座位...</div>;
  if (!info) return <div className="p-20 text-center font-serif text-ink-medium">场次不存在</div>;

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-paper flex flex-col items-center relative">
      {/* Success Overlay */}
      {showSuccess && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-paper/80 backdrop-blur-sm animate-fade-in">
          <div className="flex flex-col items-center gap-6">
            <div className="animate-bounce">
              <InkSeal text="购票成功" size={120} type="square" variant="filled" />
            </div>
            <p className="text-2xl font-calligraphy text-ink-black mt-4">出票中，请稍候...</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-6xl bg-white/90 backdrop-blur-sm rounded-sm shadow-xl overflow-hidden flex flex-col lg:flex-row border border-ink-black/5 ink-shadow">
        
        {/* Left: Canvas Seat Map */}
        <div className="flex-1 p-8 bg-paper flex flex-col items-center justify-start relative overflow-auto max-h-[80vh]">
          <canvas 
            ref={canvasRef} 
            onClick={handleCanvasClick}
            className="cursor-pointer max-w-full h-auto shadow-sm bg-white rounded-sm border border-ink-black/5"
          />

          <div className="flex gap-8 text-sm text-ink-dark mt-6 font-serif">
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-white border border-ink-black/40 rounded-sm"></div> 可选</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-cinnabar rounded-sm shadow-sm"></div> 已选</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-100 border border-red-200 rounded-sm relative overflow-hidden"><div className="absolute inset-0 flex items-center justify-center text-red-400 text-xs">×</div></div> 已售</div>
          </div>
        </div>

        {/* Right: Info Panel */}
        <div className="lg:w-96 bg-white p-8 border-l border-ink-black/5 flex flex-col z-10 shadow-[-10px_0_20px_-10px_rgba(0,0,0,0.05)]">
          <div className="mb-8 pb-6 border-b border-dashed border-ink-black/10">
            <h2 className="text-3xl font-calligraphy text-ink-black mb-3">{info.filmName}</h2>
            <div className="text-ink-dark font-serif space-y-2">
              <div className="flex justify-between">
                <span className="text-ink-medium">日期</span>
                <span className="font-bold">{info.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-medium">时间</span>
                <span className="font-bold">{info.start}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-medium">影厅</span>
                <span className="font-bold">{info.roomName}</span>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-ink-black font-title mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-cinnabar"></span>
              已选座位
            </h3>
            {selectedSeats.length === 0 ? (
              <p className="text-ink-light text-sm font-serif italic text-center py-8">
                请在左侧点击选择座位
              </p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {selectedSeats.map(([r, c]) => (
                  <span key={`${r}-${c}`} className="px-3 py-1 bg-cinnabar/10 text-cinnabar rounded-sm text-sm font-medium border border-cinnabar/20 font-serif">
                    {r}排{c}座
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 pt-6">
            <div className="flex justify-between items-end mb-6">
              <span className="text-ink-dark font-serif">总计</span>
              <span className="text-4xl font-calligraphy text-cinnabar">
                <span className="text-lg font-serif">¥</span>{selectedSeats.length * info.price}
              </span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={selectedSeats.length === 0 || submitting}
              className="w-full bg-cinnabar text-white py-4 rounded-sm font-bold font-title text-xl tracking-widest shadow-lg hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-transparent relative overflow-hidden group"
            >
              <span className="relative z-10">{submitting ? '出票中...' : '确认支付'}</span>
              <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
