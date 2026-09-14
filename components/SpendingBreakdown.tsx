import { formatRp } from '@/lib/format';
import type { PersonSpending } from '@/lib/spending';
import { Wallet } from 'lucide-react';

export function SpendingBreakdown({ people, total }: { people: PersonSpending[]; total: number }) {
  return (
    <div className="space-y-3">
      {people.map((person) => {
        const share = total > 0 ? Math.round((person.amountPaid / total) * 100) : 0;
        return (
          <div key={person.userId} className="glass-card rounded-2xl p-5 border border-slate-800">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-slate-200">{person.name}</h3>
              <span className="text-xs font-medium text-slate-500">{share}% of total</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400 flex items-center gap-2">
                <Wallet size={16} className="text-emerald-500" />
                Covered
              </span>
              <span className="font-semibold text-slate-200">{formatRp(person.amountPaid)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}