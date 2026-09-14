'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ReceiptText } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export function Navigation() {
  const pathname = usePathname();
  const onHome = pathname === '/' || pathname?.startsWith('/history');

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass pb-safe z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-6">
        <Link 
          href="/" 
          className={twMerge(
            "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200",
            onHome ? "text-emerald-400" : "text-slate-400 hover:text-slate-300"
          )}
        >
          <Home size={24} strokeWidth={onHome ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link 
          href="/purchases" 
          className={twMerge(
            "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200",
            pathname?.startsWith('/purchases') ? "text-blue-400" : "text-slate-400 hover:text-slate-300"
          )}
        >
          <ReceiptText size={24} strokeWidth={pathname?.startsWith('/purchases') ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Purchases</span>
        </Link>
      </div>
    </nav>
  );
}
