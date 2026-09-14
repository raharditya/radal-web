import { formatRp } from '@/lib/format';
import type { MonthPurchase } from '@/lib/spending';
import { format } from 'date-fns';
import { ShoppingBag } from 'lucide-react';

export function PurchaseList({ purchases }: { purchases: MonthPurchase[] }) {
  if (purchases.length === 0) {
    return (
      <div className="text-center py-12 px-4 glass-card rounded-3xl border border-slate-800 border-dashed">
        <div className="bg-slate-800/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="text-slate-500" size={24} />
        </div>
        <p className="text-slate-300 font-medium mb-1">No purchases yet</p>
        <p className="text-slate-500 text-sm">Nothing recorded for this month.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {purchases.map((purchase) => (
        <div
          key={purchase.id}
          className="glass-card rounded-2xl p-4 border border-slate-800/50 hover:bg-slate-800/20 transition-colors"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-slate-200 text-lg leading-tight line-clamp-2">
              {purchase.title}
            </h3>
            <span className="font-bold text-white whitespace-nowrap ml-4">
              {formatRp(Number(purchase.total_amount))}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span className="bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-full font-medium">
              Paid by {purchase.radal_users?.name || 'Unknown'}
            </span>
            <span>{format(new Date(purchase.purchased_at), 'MMM d, h:mm a')}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
