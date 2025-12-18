'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import InkButton from '@/components/InkButton';
import InkSeal from '@/components/InkSeal';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(''); // Clear error on typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic Validation
    if (!formData.username || !formData.password || !formData.confirmPassword || !formData.phone) {
      setError('请填写所有必填项');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    setLoading(true);

    // Mock API Call
    try {
      console.log('Registering user:', formData);
      
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess('注册成功，正在跳转登录页...');
      
      // Redirect after 1.5s
      setTimeout(() => {
        router.push('/login');
      }, 1500);

    } catch {
      setError('注册失败，请稍后重试');
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
            <h2 className="text-3xl font-calligraphy text-ink-black mb-3">注册成功</h2>
            <p className="text-ink-medium font-serif">正在跳转至登录页...</p>
          </div>
        </div>
      );
    }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center relative overflow-hidden">
      {/* Landscape Background (SVG) - Flipped for variety */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 opacity-20 pointer-events-none select-none">
         <svg viewBox="0 0 1440 320" className="w-full h-full preserve-3d" style={{ transform: 'scaleX(-1)' }}>
            <path fill="#2c3e50" fillOpacity="0.4" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            <path fill="#2c3e50" fillOpacity="0.6" d="M0,96L48,128C96,160,192,224,288,240C384,256,480,224,576,197.3C672,171,768,149,864,160C960,171,1056,213,1152,224C1248,235,1344,213,1440,192L1440,320L1152,320L864,320L576,320L288,320L0,320Z"></path>
         </svg>
      </div>

       {/* Decorative Ink Drops */}
       <div className="absolute top-10 left-10 opacity-10">
         <div className="w-32 h-32 rounded-full bg-ink-black blur-2xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-4 py-10">
        <div className="bg-white/60 backdrop-blur-md p-10 rounded-sm shadow-xl border border-ink-black/5 relative overflow-hidden">
           {/* Top Decorative Line */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-cinnabar/50 to-transparent"></div>
           
          <div className="text-center mb-8">
            <h2 className="text-4xl font-calligraphy text-ink-black mb-3">
              注册新账户
            </h2>
            <p className="text-sm text-ink-medium font-serif">
              已有账号？{' '}
              <Link href="/login" className="font-bold text-cinnabar hover:text-red-700 border-b border-cinnabar/30 hover:border-cinnabar transition-colors">
                立即登录
              </Link>
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
               <div className="bg-red-50 text-cinnabar p-4 rounded-sm text-sm text-center border border-cinnabar/20 font-serif">
                 {error}
               </div>
            )}

            <div className="space-y-5">
              <div className="group">
                <label htmlFor="username" className="block text-sm font-bold text-ink-dark mb-1 ml-1 font-serif group-focus-within:text-cinnabar transition-colors">
                  用户名
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="w-full px-4 py-2 bg-transparent border-b-2 border-ink-black/20 focus:border-cinnabar focus:outline-none transition-all text-ink-black placeholder:text-ink-light font-serif"
                  placeholder="请输入用户名"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              
              <div className="group">
                <label htmlFor="phone" className="block text-sm font-bold text-ink-dark mb-1 ml-1 font-serif group-focus-within:text-cinnabar transition-colors">
                  手机号
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="w-full px-4 py-2 bg-transparent border-b-2 border-ink-black/20 focus:border-cinnabar focus:outline-none transition-all text-ink-black placeholder:text-ink-light font-serif"
                  placeholder="请输入手机号"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

               <div className="group">
                <label htmlFor="password" className="block text-sm font-bold text-ink-dark mb-1 ml-1 font-serif group-focus-within:text-cinnabar transition-colors">
                  密码
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-2 bg-transparent border-b-2 border-ink-black/20 focus:border-cinnabar focus:outline-none transition-all text-ink-black placeholder:text-ink-light font-serif"
                  placeholder="请输入密码"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

               <div className="group">
                <label htmlFor="confirmPassword" className="block text-sm font-bold text-ink-dark mb-1 ml-1 font-serif group-focus-within:text-cinnabar transition-colors">
                  确认密码
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="w-full px-4 py-2 bg-transparent border-b-2 border-ink-black/20 focus:border-cinnabar focus:outline-none transition-all text-ink-black placeholder:text-ink-light font-serif"
                  placeholder="请再次输入密码"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <InkButton 
              type="submit" 
              variant="primary" 
              size="lg" 
              className="w-full text-xl py-3 mt-4 shadow-lg"
              disabled={loading}
            >
              {loading ? '注册中...' : '立即注册'}
            </InkButton>
          </form>
        </div>
      </div>
    </div>
  );
}
