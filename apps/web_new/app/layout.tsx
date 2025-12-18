import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import InkDefs from "@/components/InkDefs";

export const metadata: Metadata = {
  title: "墨映光影 | 电影票务系统",
  description: "沉浸式水墨风电影购票体验",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-paper text-ink-black selection:bg-cinnabar selection:text-white">
        <InkDefs />
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-12 relative z-10 animate-fade-in">
          {children}
        </main>
        <footer className="relative z-10 border-t border-ink-black/10 bg-paper/80 backdrop-blur-md text-ink-medium py-12 mt-20">
           <div className="container mx-auto px-4 text-center">
             <p className="mb-2 font-serif">&copy; 2025 墨映光影. All rights reserved.</p>
             <p className="text-sm text-ink-light">纸间影院 · 沉浸体验</p>
           </div>
        </footer>
      </body>
    </html>
  );
}
