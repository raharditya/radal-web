import { supabase, User, Purchase, PurchaseSplit } from './supabase';

export type UserBalance = {
  userId: string;
  name: string;
  amountPaid: number;
  amountShouldPay: number;
  balance: number;
};

export async function calculateBalancesForMonth(month: number, year: number): Promise<UserBalance[] | null> {
  // 1. Get all users
  const { data: users, error: usersErr } = await supabase.from('radal_users').select('*');
  
  if (usersErr || !users) return null;

  // 2. Get purchases for the month
  const startDate = new Date(year, month - 1, 1).toISOString();
  const endDate = new Date(year, month, 0, 23, 59, 59, 999).toISOString();

  const { data: purchases, error: purError } = await supabase
    .from('radal_purchases')
    .select('*')
    .gte('purchased_at', startDate)
    .lte('purchased_at', endDate);

  if (purError || !purchases) return null;

  // 3. Get purchase splits
  const purchaseIds = purchases.map(p => p.id);

  const { data: splits, error: splitError } = purchaseIds.length > 0 ? await supabase
    .from('radal_purchase_splits')
    .select('*')
    .in('purchase_id', purchaseIds) : { data: [], error: null };

  if (splitError || !splits) return null;

  // Calculate totals
  const userBalances: UserBalance[] = users.map((user: User) => {
    const amountPaid = purchases
      .filter((p: Purchase) => p.paid_by === user.id)
      .reduce((sum, p) => sum + Number(p.total_amount), 0);

    const amountShouldPay = splits
      .filter((s: PurchaseSplit) => s.user_id === user.id)
      .reduce((sum, s) => sum + Number(s.share_amount), 0);

    const balance = amountPaid - amountShouldPay;

    return {
      userId: user.id,
      name: user.name,
      amountPaid,
      amountShouldPay,
      balance
    };
  });

  return userBalances;
}

export function generateSettlementMessage(userBalances: UserBalance[]) {
  if (userBalances.length !== 2) return null;

  // Sort to easily know who is positive and who is negative
  const [u1, u2] = [...userBalances].sort((a, b) => b.balance - a.balance);

  if (u1.balance > 0) {
    // Assuming Math.abs(u1.balance) === Math.abs(u2.balance) in a 2-person scenario
    return `${u2.name} owes ${u1.name} Rp ${u1.balance.toLocaleString('id-ID')}`;
  } else {
    return "Balances are settled!";
  }
}
