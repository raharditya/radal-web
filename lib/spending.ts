import { supabase, User, Purchase, PurchaseSplit } from './supabase';
import { getCurrentMonthInTZ, getMonthBoundaries, getYearMonthInTZ } from './timezone';

export type PersonSpending = {
  userId: string;
  name: string;
  amountPaid: number;
};

export type PaymentDelta = {
  topPayerName: string;
  otherName: string;
  amount: number;
};

export type MonthSpending = {
  year: number;
  month: number;
  total: number;
  people: PersonSpending[];
  delta: PaymentDelta | null;
};

export type MonthHistoryItem = {
  year: number;
  month: number;
  total: number;
};

export type MonthPurchase = Purchase & {
  radal_users: { name: string } | null;
};

export type PurchaseForEdit = Purchase & {
  splits: PurchaseSplit[];
};

export async function getPurchaseForEdit(id: string): Promise<PurchaseForEdit | null> {
  const { data: purchase, error } = await supabase
    .from('radal_purchases')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !purchase) return null;

  const { data: splits, error: splitsError } = await supabase
    .from('radal_purchase_splits')
    .select('*')
    .eq('purchase_id', id);

  if (splitsError) return null;

  return { ...(purchase as Purchase), splits: (splits ?? []) as PurchaseSplit[] };
}

export async function getUsers(): Promise<User[] | null> {
  const { data, error } = await supabase.from('radal_users').select('*');
  if (error || !data) return null;
  return data;
}

export async function getPurchasesForMonth(year: number, month: number): Promise<MonthPurchase[] | null> {
  const { start, end } = getMonthBoundaries(year, month);

  const { data, error } = await supabase
    .from('radal_purchases')
    .select(`
      *,
      radal_users!paid_by (name)
    `)
    .gte('purchased_at', start)
    .lte('purchased_at', end)
    .order('purchased_at', { ascending: false });

  if (error || !data) return null;
  return data as MonthPurchase[];
}

function buildSpending(year: number, month: number, users: User[], purchases: { paid_by: string; total_amount: number }[]): MonthSpending {
  const people: PersonSpending[] = users.map((user) => ({
    userId: user.id,
    name: user.name,
    amountPaid: purchases
      .filter((p) => p.paid_by === user.id)
      .reduce((sum, p) => sum + Number(p.total_amount), 0),
  }));

  const total = purchases.reduce((sum, p) => sum + Number(p.total_amount), 0);

  let delta: PaymentDelta | null = null;
  if (people.length === 2) {
    const [top, other] = [...people].sort((a, b) => b.amountPaid - a.amountPaid);
    delta = {
      topPayerName: top.name,
      otherName: other.name,
      amount: top.amountPaid - other.amountPaid,
    };
  }

  return { year, month, total, people, delta };
}

export async function getMonthSpending(year: number, month: number): Promise<MonthSpending | null> {
  const users = await getUsers();
  if (!users) return null;

  const { start, end } = getMonthBoundaries(year, month);
  const { data: purchases, error } = await supabase
    .from('radal_purchases')
    .select('paid_by, total_amount')
    .gte('purchased_at', start)
    .lte('purchased_at', end);

  if (error || !purchases) return null;

  return buildSpending(year, month, users, purchases);
}

export async function getHistoricalMonths(): Promise<MonthHistoryItem[] | null> {
  const { data: purchases, error } = await supabase
    .from('radal_purchases')
    .select('purchased_at, total_amount');

  if (error || !purchases) return null;

  const totals = new Map<string, number>();
  for (const purchase of purchases) {
    const { year, month } = getYearMonthInTZ(new Date(purchase.purchased_at));
    const key = `${year}-${month}`;
    totals.set(key, (totals.get(key) ?? 0) + Number(purchase.total_amount));
  }

  const current = getCurrentMonthInTZ();

  return [...totals.entries()]
    .map(([key, total]) => {
      const [year, month] = key.split('-').map(Number);
      return { year, month, total };
    })
    .filter(
      (item) =>
        item.year < current.year || (item.year === current.year && item.month < current.month)
    )
    .sort((a, b) => b.year - a.year || b.month - a.month);
}
