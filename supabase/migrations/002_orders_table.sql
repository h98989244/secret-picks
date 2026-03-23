-- =============================================
-- 秘境選物 — Orders Table
-- =============================================

-- 訂單表
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,

  -- 顧客資訊
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,

  -- 配送資訊
  shipping_method TEXT NOT NULL CHECK (shipping_method IN ('home_delivery', 'convenience_store')),
  shipping_address TEXT,
  convenience_store_name TEXT,
  convenience_store_address TEXT,
  shipping_fee INTEGER NOT NULL DEFAULT 0,

  -- 付款方式
  payment_method TEXT NOT NULL CHECK (payment_method IN ('atm_transfer', 'convenience_store_code')),

  -- 商品快照 (JSONB)
  items JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- 金額
  subtotal INTEGER NOT NULL CHECK (subtotal >= 0),
  total INTEGER NOT NULL CHECK (total >= 0),

  -- 訂單狀態
  status TEXT NOT NULL DEFAULT 'pending_payment'
    CHECK (status IN ('pending_payment', 'paid', 'processing', 'shipped', 'completed', 'cancelled')),

  -- 備註
  customer_notes TEXT DEFAULT '',
  admin_notes TEXT DEFAULT '',

  -- 時間戳
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_orders_tracking ON orders (order_number, customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders (created_at DESC);

-- 自動更新 updated_at
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_orders_updated_at();

-- RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 任何人都可以建立訂單（下單）
CREATE POLICY "Anyone can place orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- 任何人都可以查詢訂單（需知道 order_number）
CREATE POLICY "Anyone can view orders"
  ON orders FOR SELECT
  USING (true);

-- 任何人都可以更新訂單（admin 功能，之後可加強權限）
CREATE POLICY "Anyone can update orders"
  ON orders FOR UPDATE
  USING (true);
