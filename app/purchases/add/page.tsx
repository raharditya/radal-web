'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, User } from '@/lib/supabase';
import { ArrowLeft, Loader2, Check } from 'lucide-react';
import Link from 'next/link';

export default function AddPurchasePage() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [title, setTitle] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');

  // Splits
  const [splitA, setSplitA] = useState('');
  const [splitB, setSplitB] = useState('');

  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
      const { data } = await supabase.from('radal_users').select('*');
      if (data) {
        setUsers(data);
        if (data.length > 0) setPaidBy(data[0].id);
      }
      setFetchingUsers(false);
    }
    loadUsers();
  }, []);

  const totalStrNum = parseInt(totalAmount.replace(/\D/g, '') || '0', 10);
  const splitANum = parseInt(splitA.replace(/\D/g, '') || '0', 10);
  const splitBNum = parseInt(splitB.replace(/\D/g, '') || '0', 10);

  const isSplitValid = totalStrNum > 0 && splitANum + splitBNum === totalStrNum;

  // Split equally helper
  const splitEqually = () => {
    if (totalStrNum > 0) {
      const half = Math.floor(totalStrNum / 2);
      const remaining = totalStrNum - half;
      setSplitA(half.toString());
      setSplitB(remaining.toString());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title || !totalStrNum || !paidBy || !isSplitValid || users.length !== 2) {
      setError("Please fill all fields correctly. Splits must equal the total amount.");
      return;
    }

    setLoading(true);

    try {
      // 1. Insert Purchase
      const { data: purchaseData, error: purchaseError } = await supabase
        .from('radal_purchases')
        .insert({
          title,
          total_amount: totalStrNum,
          paid_by: paidBy
        })
        .select()
        .single();

      if (purchaseError) throw purchaseError;

      // 2. Insert Splits
      const splitsPayload = [
        {
          purchase_id: purchaseData.id,
          user_id: users[0].id,
          share_amount: splitANum
        },
        {
          purchase_id: purchaseData.id,
          user_id: users[1].id,
          share_amount: splitBNum
        }
      ];

      const { error: splitsError } = await supabase
        .from('radal_purchase_splits')
        .insert(splitsPayload);

      if (splitsError) throw splitsError;

      router.push('/purchases');
      router.refresh(); // Refresh data on standard pages
    } catch (err: any) {
      setError(err.message || 'Failed to insert purchase. Please try again.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 p-6 pb-24 animate-in slide-in-from-right-8 duration-300">
      <header className="flex items-center gap-4 mb-8">
        <Link href="/purchases" className="p-2 -ml-2 rounded-full hover:bg-slate-800 transition-colors text-slate-400 hover:text-white">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold text-white tracking-tight">Add Purchase</h1>
      </header>

      {fetchingUsers ? (
        <div className="flex justify-center p-12">
          <Loader2 className="animate-spin text-blue-500" />
        </div>
      ) : users.length !== 2 ? (
        <div className="p-4 bg-red-500/10 text-red-400 rounded-2xl border border-red-500/20 text-sm">
          Please add exactly 2 users to the database using the SQL schema file.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Groceries, Electricity..."
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">Total Amount (Rp)</label>
              <input
                type="number"
                required
                value={totalAmount}
                onChange={e => setTotalAmount(e.target.value)}
                placeholder="0"
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-base font-semibold"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">Paid By</label>
              <div className="grid grid-cols-2 gap-3">
                {users.map(user => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => setPaidBy(user.id)}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all ${paidBy === user.id
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25 ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-950'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                  >
                    {paidBy === user.id && <Check size={16} />}
                    {user.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-slate-800/50">
            <div className="flex justify-between items-end mb-4">
              <label className="block text-sm font-medium text-slate-400 ml-1">Split Amount</label>
              <button
                type="button"
                onClick={splitEqually}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full transition-colors"
                disabled={!totalStrNum}
              >
                Split Equally
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1 ml-1">{users[0].name}</label>
                <input
                  type="number"
                  required
                  value={splitA}
                  onChange={e => setSplitA(e.target.value)}
                  placeholder="0"
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1 ml-1">{users[1].name}</label>
                <input
                  type="number"
                  required
                  value={splitB}
                  onChange={e => setSplitB(e.target.value)}
                  placeholder="0"
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm"
                />
              </div>
            </div>

            {totalStrNum > 0 && splitA && splitB && !isSplitValid && (
              <p className="text-red-400 text-xs mt-3 flex items-center justify-center bg-red-500/10 py-2 rounded-lg">
                Sum of splits ({splitANum + splitBNum}) must equal total ({totalStrNum})
              </p>
            )}

            {totalStrNum > 0 && isSplitValid && (
              <p className="text-emerald-400 text-xs mt-3 flex items-center justify-center bg-emerald-500/10 py-2 rounded-lg gap-1.5">
                <Check size={14} /> Splits match total amount perfectly
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !isSplitValid}
            className="w-full bg-white hover:bg-slate-200 text-slate-950 font-semibold py-4 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex justify-center items-center gap-2 mt-8 shadow-xl shadow-white/5"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : 'Save Purchase'}
          </button>
        </form>
      )}
    </main>
  );
}
