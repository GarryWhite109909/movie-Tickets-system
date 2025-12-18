import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative py-24 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-3xl text-white overflow-hidden shadow-2xl">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
          开启您的<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">光影之旅</span>
        </h1>
        <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-2xl mx-auto">
          沉浸式观影体验，从这里开始。探索最新大片，一键选座购票。
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/films" className="bg-white text-blue-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition transform hover:-translate-y-1 shadow-lg">
            立即购票
          </Link>
          <Link href="/login" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition transform hover:-translate-y-1">
            登录账户
          </Link>
        </div>
      </div>
    </section>
  );
}
