'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/utils/auth';
import InkButton from '@/components/InkButton';
import InkSeal from '@/components/InkSeal';

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({ userName: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:3003/api/web/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.code === 1) {
        auth.login(data.data.token, data.data);
        setSuccess(true);
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        setError(data.msg || '登录失败，请检查账号密码');
      }
    } catch {
      setError('网络请求失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center relative overflow-hidden">
        {/* Ink Wash Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
             <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="w-full h-full">
               <filter id="noise">
                 <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
               </filter>
               <rect width="100%" height="100%" filter="url(#noise)" opacity="0.5"/>
             </svg>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-12 rounded-sm shadow-2xl w-full max-w-md border border-ink-black/10 text-center animate-fade-in relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-ink-black/20 to-transparent"></div>
          
          <div className="w-24 h-24 mx-auto mb-8 relative flex items-center justify-center">
            <InkSeal text="成功" type="square" size={80} variant="filled" className="animate-pulse" />
          </div>
          <h2 className="text-3xl font-calligraphy text-ink-black mb-3">登录成功</h2>
          <p className="text-ink-medium font-serif">正在跳转至首页...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center relative overflow-hidden">
      {/* Landscape Background (SVG) */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 opacity-20 pointer-events-none select-none">
         <svg viewBox="0 0 1440 320" className="w-full h-full preserve-3d">
            <path fill="#2c3e50" fillOpacity="0.4" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            <path fill="#2c3e50" fillOpacity="0.6" d="M0,96L48,128C96,160,192,224,288,240C384,256,480,224,576,197.3C672,171,768,149,864,160C960,171,1056,213,1152,224C1248,235,1344,213,1440,192L1440,320L1152,320L864,320L576,320L288,320L0,320Z"></path>
         </svg>
      </div>

      {/* Decorative Ink Drops */}
      <div className="absolute top-10 right-10 opacity-10">
         <div className="w-32 h-32 rounded-full bg-ink-black blur-2xl"></div>
      </div>
      <div className="absolute bottom-10 left-10 opacity-10">
         <div className="w-48 h-48 rounded-full bg-ink-medium blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-white/60 backdrop-blur-md p-10 rounded-sm shadow-xl border border-ink-black/5 relative overflow-hidden">
          {/* Top Decorative Line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-cinnabar/50 to-transparent"></div>

          <div className="text-center mb-10 relative">
            <h1 className="text-5xl font-calligraphy text-ink-black mb-4">欢迎回来</h1>
            <p className="text-ink-medium font-serif italic">登录您的账户以开始购票</p>
            <div className="w-16 h-1 bg-ink-black/10 mx-auto mt-4 rounded-full"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-50 text-cinnabar p-4 rounded-sm text-sm text-center border border-cinnabar/20 font-serif">
                {error}
              </div>
            )}
            
            <div className="space-y-6">
              <div className="group">
                <label className="block text-sm font-bold text-ink-dark mb-2 ml-1 font-serif group-focus-within:text-cinnabar transition-colors">用户名 / 手机号</label>
                <input
                  type="text"
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  className="w-full px-4 py-3 bg-transparent border-b-2 border-ink-black/20 focus:border-cinnabar focus:outline-none transition-all text-ink-black placeholder:text-ink-light font-serif text-lg"
                  placeholder="请输入用户名"
                  required
                />
              </div>
              
              <div className="group">
                <label className="block text-sm font-bold text-ink-dark mb-2 ml-1 font-serif group-focus-within:text-cinnabar transition-colors">密码</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-transparent border-b-2 border-ink-black/20 focus:border-cinnabar focus:outline-none transition-all text-ink-black placeholder:text-ink-light font-serif text-lg"
                  placeholder="请输入密码"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm px-1 font-serif">
              <label className="flex items-center text-ink-medium cursor-pointer hover:text-ink-black transition">
                <input type="checkbox" className="mr-2 rounded border-ink-black/30 text-cinnabar focus:ring-cinnabar/50" />
                记住我
              </label>
              <a href="#" className="text-ink-medium hover:text-cinnabar transition-colors border-b border-transparent hover:border-cinnabar">忘记密码?</a>
            </div>

            <InkButton 
              type="submit" 
              variant="primary" 
              size="lg" 
              className="w-full text-xl py-4 shadow-lg"
              disabled={loading}
            >
              {loading ? '登录中...' : '立即登录'}
            </InkButton>

            <div className="text-center text-sm text-ink-medium mt-6 font-serif">
              还没有账户? 
              <Link href="/register" className="text-cinnabar hover:text-red-700 transition-colors font-bold ml-2 border-b border-cinnabar/30 hover:border-cinnabar">
                立即注册
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
