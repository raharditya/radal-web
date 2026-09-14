import { formatRp } from '@/lib/format';
import type { PaymentDelta as PaymentDeltaType } from '@/lib/spending';
import { ArrowRightLeft } from 'lucide-react';

export function PaymentDelta({ delta }: { delta: PaymentDeltaType | null }) {
  if (!delta) return null;

  const even = delta.amount === 0;

  return (
    <details className="glass-card rounded-2xl border border-slate-800 group">
      <summary className="cursor-pointer list-none p-4 flex items-center justify-between gap-3 text-sm text-slate-300">
        <span className="flex items-center gap-2 font-medium">
          <ArrowRightLeft size={16} className="text-slate-500" />
          Who paid more
        </span>
        <span className="text-xs text-slate-500 group-open:hidden">Tap to see</span>
      </summary>
      <div className="px-4 pb-4 pt-0 text-sm text-slate-300 border-t border-slate-800/80">
        <p className="pt-3">
          {even
            ? `Paid evenly — ${delta.topPayerName} and ${delta.otherName} put in the same amount.`
            : `${delta.topPayerName} paid ${formatRp(delta.amount)} more than ${delta.otherName}.`}
        </p>
        <p className="text-xs text-slate-500 mt-2">
          This is just the difference in who covered purchases, not an amount to settle.
        </p>
      </div>
    </details>
  );
}
