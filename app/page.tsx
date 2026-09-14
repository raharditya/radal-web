export const dynamic = 'force-dynamic';

import { PaymentDelta } from '@/components/PaymentDelta';
import { SpendingBreakdown } from '@/components/SpendingBreakdown';
import { formatRp } from '@/lib/format';
import { getHistoricalMonths, getMonthSpending } from '@/lib/spending';
import { getCurrentMonthInTZ } from '@/lib/timezone';
import { format } from 'date-fns';
import { ChevronRight, PiggyBank } from 'lucide-react';
import Link from 'next/link';

export default async function HomePage() {
  const { year, month } = getCurrentMonthInTZ();
  const monthName = format(new Date(year, month - 1), 'MMMM yyyy');

  const [spending, history] = await Promise.all([
    getMonthSpending(year, month),
    getHistoricalMonths(),
  ]);

  if (!spending || history === null) {
    return (
      <div className="p-6 flex items-center justify-center h-[50vh]">
        <p className="text-slate-400">Failed to load spending. Check the Supabase connection.</p>
      </div>
    );
  }

  return (
    <main className="p-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Collective spending</h1>
        <p className="text-emerald-400 font-medium">{monthName}</p>
      </header>

      <div className="space-y-6">
        <div className="rounded-3xl bg-linear-to-br from-emerald-500 to-emerald-700 p-6 shadow-xl shadow-emerald-900/20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2 opacity-90">
              <PiggyBank size={20} />
              <span className="font-medium text-sm tracking-wide uppercase">This month together</span>
            </div>
            <h2 className="text-3xl font-bold leading-tight tracking-tight">
              {formatRp(spending.total)}
            </h2>
            <p className="text-emerald-100/80 text-sm mt-2">
              Total of everything purchased this month.
            </p>
          </div>
        </div>

        {spending.total > 0 && <PaymentDelta delta={spending.delta} />}

        <div>
          <h3 className="text-sm font-semibold tracking-wider text-slate-400 uppercase mb-4">
            Who covered what
          </h3>
          <SpendingBreakdown people={spending.people} total={spending.total} />
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-wider text-slate-400 uppercase mb-4">
            Previous months
          </h3>
          {history.length === 0 ? (
            <div className="text-center p-8 glass-card rounded-3xl border border-slate-800 border-dashed">
              <p className="text-slate-400 text-sm">No earlier months recorded yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => {
                const label = format(new Date(item.year, item.month - 1), 'MMMM yyyy');
                return (
                  <Link
                    key={`${item.year}-${item.month}`}
                    href={`/history/${item.year}/${item.month}`}
                    className="glass-card rounded-2xl p-4 border border-slate-800/50 hover:bg-slate-800/20 transition-colors flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="font-semibold text-slate-200">{label}</p>
                      <p className="text-sm text-slate-400 mt-0.5">{formatRp(item.total)}</p>
                    </div>
                    <ChevronRight size={18} className="text-slate-500 shrink-0" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
