export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { supabase, Purchase } from '@/lib/supabase';
import { format } from 'date-fns';
import { Plus, ShoppingBag, Calendar } from 'lucide-react';

export default async function PurchasesPage() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const monthName = format(currentDate, 'MMMM yyyy');

  const startDate = new Date(currentYear, currentMonth - 1, 1).toISOString();
  const endDate = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999).toISOString();

  const { data: purchases, error } = await supabase
    .from('radal_purchases')
    .select(`
      *,
      radal_users!paid_by (name)
    `)
    .gte('purchased_at', startDate)
    .lte('purchased_at', endDate)
    .order('purchased_at', { ascending: false });

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

      <div className="space-y-3 relative z-10">
        {!purchases || purchases.length === 0 ? (
          <div className="text-center py-12 px-4 glass-card rounded-3xl border border-slate-800 border-dashed">
            <div className="bg-slate-800/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="text-slate-500" size={24} />
            </div>
            <p className="text-slate-300 font-medium mb-1">No purchases yet</p>
            <p className="text-slate-500 text-sm">Add your first expense for this month.</p>
          </div>
        ) : (
          purchases.map(purchase => (
            <div key={purchase.id} className="glass-card rounded-2xl p-4 border border-slate-800/50 hover:bg-slate-800/20 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-slate-200 text-lg leading-tight line-clamp-2">
                  {purchase.title}
                </h3>
                <span className="font-bold text-white whitespace-nowrap ml-4">
                  Rp {Number(purchase.total_amount).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span className="bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-full font-medium">
                  By {purchase.radal_users?.name || 'Unknown'}
                </span>
                <span>
                  {format(new Date(purchase.purchased_at), 'MMM d, h:mm a')}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Action Button */}
      <Link
        href="/purchases/add"
        className="fixed bottom-24 right-6 w-14 h-14 bg-blue-500 hover:bg-blue-400 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 transition-transform hover:scale-105 active:scale-95 z-50 group"
      >
        <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
      </Link>
    </main>
  );
}
