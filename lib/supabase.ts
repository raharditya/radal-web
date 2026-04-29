import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type User = {
  id: string;
  name: string;
};

export type Purchase = {
  id: string;
  title: string;
  total_amount: number;
  paid_by: string;
  purchased_at: string;
};

export type PurchaseSplit = {
  id: string;
  purchase_id: string;
  user_id: string;
  share_amount: number;
};
