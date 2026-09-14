export const dynamic = 'force-dynamic';

import { PurchaseList } from '@/components/PurchaseList';
import { getPurchasesForMonth } from '@/lib/spending';
import { getCurrentMonthInTZ } from '@/lib/timezone';
import { format } from 'date-fns';
import { Calendar, Plus } from 'lucide-react';
import Link from 'next/link';

export default async function PurchasesPage() {
  const { year, month } = getCurrentMonthInTZ();
  const monthName = format(new Date(year, month - 1), 'MMMM yyyy');
  const purchases = await getPurchasesForMonth(year, month);

  return (
    <main className="p-6 pb-24 min-h-screen relative animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Purchases</h1>
          <p className="text-blue-400 font-medium flex items-center gap-2">
            <Calendar size={14} />
            {monthName}
          </p>
        </div>
      </header>

      <div className="relative z-10">
        <PurchaseList purchases={purchases ?? []} />
        {purchases === null && (
          <p className="text-center text-slate-400 text-sm mt-4">Could not load purchases.</p>
        )}
      </div>

      <Link
        href="/purchases/add"
        className="fixed bottom-24 right-6 w-14 h-14 bg-blue-500 hover:bg-blue-400 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 transition-transform hover:scale-105 active:scale-95 z-50 group"
      >
        <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
      </Link>
    </main>
  );
}
