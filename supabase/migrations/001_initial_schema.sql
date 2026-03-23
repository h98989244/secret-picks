-- =============================================
-- 秘境選物 — Database Schema
-- =============================================

-- 店家資訊（單筆）
CREATE TABLE IF NOT EXISTS store_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL DEFAULT 'service@secretpicks.com',
  phone TEXT NOT NULL DEFAULT '02-2345-6789',
  address TEXT NOT NULL DEFAULT '台北市大安區忠孝東路四段100號5樓',
  tax_id TEXT NOT NULL DEFAULT '12345678',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 商品分類
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 商品
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT DEFAULT '',
  short_desc TEXT DEFAULT '',
  price INTEGER NOT NULL CHECK (price >= 0),
  sale_price INTEGER CHECK (sale_price IS NULL OR sale_price >= 0),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  brand TEXT DEFAULT '',
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 商品圖片
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT false
);

-- Banner 輪播
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  link_url TEXT DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);

-- RLS Policies
ALTER TABLE store_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public can read active products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read product images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public can read active banners" ON banners FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read store info" ON store_info FOR SELECT USING (true);

-- Admin full access (authenticated users with admin role)
CREATE POLICY "Admin can manage store_info" ON store_info FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can manage categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can manage products" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can manage product_images" ON product_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can manage banners" ON banners FOR ALL USING (auth.role() = 'authenticated');

-- Insert initial store info
INSERT INTO store_info (email, phone, address, tax_id) VALUES
  ('service@secretpicks.com', '02-2345-6789', '台北市大安區忠孝東路四段100號5樓', '12345678')
ON CONFLICT DO NOTHING;
