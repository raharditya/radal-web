export const dynamic = 'force-dynamic';

import { calculateBalancesForMonth, generateSettlementMessage } from '@/lib/balances';
import { format } from 'date-fns';
import { Wallet, TrendingUp, TrendingDown, ArrowRightLeft } from 'lucide-react';

export default async function SummaryPage() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // 1-12
  const currentYear = currentDate.getFullYear();
  const monthName = format(currentDate, 'MMMM yyyy');

  const balances = await calculateBalancesForMonth(currentMonth, currentYear);

  if (!balances) {
    return (
      <div className="p-6 flex items-center justify-center h-[50vh]">
        <p className="text-slate-400">Failed to load balances or no data yet. Check Supabase connection.</p>
      </div>
    );
  }

  const settlementMessage = generateSettlementMessage(balances);

  return (
    <main className="p-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Monthly Summary</h1>
        <p className="text-emerald-400 font-medium">{monthName}</p>
      </header>

      {balances.length === 2 ? (
        <div className="space-y-6">
          {/* Main Settlement Card */}
          <div className="rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 shadow-xl shadow-emerald-900/20 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2 opacity-90">
                <Wallet size={20} />
                <span className="font-medium text-sm tracking-wide uppercase">Settlement</span>
              </div>
              <h2 className="text-2xl font-bold leading-tight mb-1">
                {settlementMessage}
              </h2>
            </div>
          </div>

          <h3 className="text-sm font-semibold tracking-wider text-slate-400 uppercase mt-8 mb-4">Individual Breakdown</h3>
          
          <div className="grid grid-cols-1 gap-4">
            {balances.map((user) => (
              <div key={user.userId} className="glass-card rounded-2xl p-5 border border-slate-800">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-slate-200">{user.name}</h3>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${user.balance >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                    {user.balance >= 0 ? 'To Receive' : 'To Pay'}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 flex items-center gap-2">
                      <TrendingUp size={16} className="text-emerald-500" />
                      Amount Paid
                    </span>
                    <span className="font-semibold text-slate-200">
                      Rp {user.amountPaid.toLocaleString('id-ID')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 flex items-center gap-2">
                      <TrendingDown size={16} className="text-blue-500" />
                      Fair Share
                    </span>
                    <span className="font-semibold text-slate-200">
                      Rp {user.amountShouldPay.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-800 flex justify-between items-center">
                    <span className="text-slate-500 font-medium text-sm">Net Balance</span>
                    <span className={`font-bold text-lg ${user.balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {user.balance >= 0 ? '+' : '-'}Rp {Math.abs(user.balance).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center p-8 glass-card rounded-3xl border border-slate-800 border-dashed">
          <p className="text-slate-400 mb-2">Need exactly 2 users in the database to calculate split.</p>
        </div>
      )}
    </main>
  );
}
