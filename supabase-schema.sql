-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- radal_Users Table
CREATE TABLE radal_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL
);

-- Purchases Table
CREATE TABLE radal_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  total_amount NUMERIC NOT NULL,
  paid_by UUID NOT NULL REFERENCES radal_users(id) ON DELETE CASCADE,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Purchase Splits Table
CREATE TABLE radal_purchase_splits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  purchase_id UUID NOT NULL REFERENCES radal_purchases(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES radal_users(id) ON DELETE CASCADE,
  share_amount NUMERIC NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_radal_purchases_paid_by ON radal_purchases(paid_by);
CREATE INDEX idx_radal_purchases_purchased_at ON radal_purchases(purchased_at);
CREATE INDEX idx_radal_purchase_splits_purchase_id ON radal_purchase_splits(purchase_id);
CREATE INDEX idx_radal_purchase_splits_user_id ON radal_purchase_splits(user_id);

-- Optional: Add two default radal_users for easy setup
-- INSERT INTO radal_users (name) VALUES ('Roommate A'), ('Roommate B');
