'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/utils/auth';
import { User } from '@/types/api';
import FilmPoster from '@/components/FilmPoster';
import Link from 'next/link';
import { useAuthUser } from '@/hooks/useAuthUser';
import Image from 'next/image';

interface Booking {
  orderId: string;
  filmName: string;
  poster: string;
  roomName: string;
  row: number;
  col: number;
  price: number;
  status: number; // 0: unpaid, 1: paid, 2: cancelled
  createTime: string;
  showTime: string;
}

export default function ProfileClient() {
  const router = useRouter();
  const authUser = useAuthUser();
  const bookings: Booking[] = [];
  const hasToken = Boolean(auth.getToken());

  useEffect(() => {
    if (!hasToken) {
      router.push('/login');
    }
  }, [hasToken, router]);

  const maskPhone = (phone?: string) => {
    if (!phone) return '未绑定';
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  };

  const maskEmail = (email?: string) => {
    if (!email) return '未绑定';
    const parts = email.split('@');
    if (parts.length !== 2) return email;
    const name = parts[0];
    const domain = parts[1];
    if (name.length <= 1) return `${name}***@${domain}`;
    return `${name.substring(0, 1)}***@${domain}`;
  };

  if (!hasToken) {
    return <div className="p-20 text-center font-serif text-ink-medium animate-pulse">正在读取档案...</div>;
  }

  const user: User | null = authUser
    ? {
        userId: Number(authUser.userId || 0),
        userName: String(authUser.userName || authUser.username || ''),
        name: typeof authUser.name === 'string' ? authUser.name : undefined,
        phone: typeof authUser.phone === 'string' ? authUser.phone : undefined,
        email: typeof authUser.email === 'string' ? authUser.email : undefined,
        avatar: typeof authUser.avatar === 'string' ? authUser.avatar : undefined,
      }
    : null;

  if (!user || !user.userName) {
    return <div className="p-20 text-center font-serif text-ink-medium">无法获取用户信息</div>;
  }

  return (
     <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* User Info Card */}
        <div className="w-full md:w-1/3">
           <div className="bg-paper rounded-sm shadow-lg border border-ink-black/10 overflow-hidden sticky top-24">
             <div className="bg-ink-black h-24 relative">
               <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                 <div className="w-24 h-24 rounded-full border-4 border-paper bg-white overflow-hidden">
                    <Image
                      src={
                        user.avatar ||
                        `https://api.dicebear.com/7.x/adventurer/png?seed=${encodeURIComponent(user.userName)}`
                      }
                      alt={user.userName}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                 </div>
               </div>
             </div>
             <div className="pt-16 pb-8 px-6 text-center">
               <h2 className="text-2xl font-bold font-title text-ink-black mb-1">{user.userName}</h2>
               <p className="text-ink-medium font-serif text-sm mb-6">{user.name || '未设置昵称'}</p>
               
               <div className="space-y-4 text-left border-t border-dashed border-ink-black/10 pt-6">
                 <div className="flex justify-between items-center">
                   <span className="text-ink-light font-serif">手机号</span>
                   <span className="text-ink-black font-mono">{maskPhone(user.phone)}</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-ink-light font-serif">邮箱</span>
                   <span className="text-ink-black font-mono">{maskEmail(user.email)}</span>
                 </div>
               </div>
             </div>
           </div>
        </div>

        {/* Bookings List */}
        <div className="w-full md:w-2/3">
           <h3 className="text-2xl font-calligraphy text-ink-black mb-6 flex items-center gap-2">
             <span>我的戏票</span>
             <span className="text-sm font-serif text-ink-medium border border-ink-black/20 rounded-full px-3 py-0.5">{bookings.length}</span>
           </h3>

           {bookings.length === 0 ? (
             <div className="bg-paper rounded-sm border border-dashed border-ink-black/20 p-12 text-center">
                <div className="text-4xl mb-4 opacity-30">🎫</div>
                <p className="text-ink-medium font-serif mb-6">暂无购票记录</p>
                <Link href="/" className="inline-block px-8 py-2 bg-ink-black text-paper rounded-full hover:bg-ink-dark transition-colors font-serif">
                  去逛逛
                </Link>
             </div>
           ) : (
             <div className="space-y-4">
               {bookings.map(booking => (
                 <div key={booking.orderId} className="bg-white rounded-sm border border-ink-black/10 p-4 flex gap-4 hover:shadow-md transition-shadow">
                    <div className="w-24 aspect-[2/3] flex-shrink-0 relative bg-gray-100">
                      <FilmPoster src={booking.poster} alt={booking.filmName} bleedIntensity="none" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h4 className="text-lg font-bold font-title text-ink-black mb-2">{booking.filmName}</h4>
                        <div className="text-sm text-ink-medium font-serif space-y-1">
                          <p>时间：{booking.showTime}</p>
                          <p>影厅：{booking.roomName} <span className="mx-2">|</span> 座位：{booking.row}排{booking.col}座</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-end mt-4">
                        <div className="text-cinnabar font-bold font-mono">¥{booking.price}</div>
                        <div className={`text-xs px-2 py-1 rounded-sm border ${
                          booking.status === 1 
                            ? 'border-emerald-500 text-emerald-600 bg-emerald-50' 
                            : 'border-ink-light text-ink-medium'
                        }`}>
                          {booking.status === 1 ? '出票成功' : '待支付'}
                        </div>
                      </div>
                    </div>
                 </div>
               ))}
             </div>
           )}
        </div>
      </div>
     </div>
  );
}
