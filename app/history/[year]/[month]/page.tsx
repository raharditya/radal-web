export const dynamic = 'force-dynamic';

import { PaymentDelta } from '@/components/PaymentDelta';
import { PurchaseList } from '@/components/PurchaseList';
import { SpendingBreakdown } from '@/components/SpendingBreakdown';
import { formatRp } from '@/lib/format';
import { getMonthSpending, getPurchasesForMonth } from '@/lib/spending';
import { format } from 'date-fns';
import { ArrowLeft, PiggyBank } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function MonthHistoryPage({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const { year: yearParam, month: monthParam } = await params;
  const year = Number(yearParam);
  const month = Number(monthParam);

  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    notFound();
  }

  const monthName = format(new Date(year, month - 1), 'MMMM yyyy');
  const [spending, purchases] = await Promise.all([
    getMonthSpending(year, month),
    getPurchasesForMonth(year, month),
  ]);

  if (!spending || !purchases) {
    return (
      <div className="p-6 flex items-center justify-center h-[50vh]">
        <p className="text-slate-400">Failed to load this month. Check the Supabase connection.</p>
      </div>
    );
  }

  return (
    <main className="p-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-4"
        >
          <ArrowLeft size={16} />
          Back to this month
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-white mb-1">{monthName}</h1>
        <p className="text-emerald-400 font-medium">Historical spending</p>
      </header>

      <div className="space-y-6">
        <div className="rounded-3xl bg-linear-to-br from-emerald-500 to-emerald-700 p-6 shadow-xl shadow-emerald-900/20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2 opacity-90">
              <PiggyBank size={20} />
              <span className="font-medium text-sm tracking-wide uppercase">Total spent</span>
            </div>
            <h2 className="text-3xl font-bold leading-tight tracking-tight">
              {formatRp(spending.total)}
            </h2>
          </div>
        </div>

        {spending.total > 0 && <PaymentDelta delta={spending.delta} />}

        <div>
          <h3 className="text-sm font-semibold tracking-wider text-slate-400 uppercase mb-4">
            Individual spending
          </h3>
          <SpendingBreakdown people={spending.people} total={spending.total} />
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-wider text-slate-400 uppercase mb-4">
            Purchases
          </h3>
          <PurchaseList purchases={purchases} />
        </div>
      </div>
    </main>
  );
}
