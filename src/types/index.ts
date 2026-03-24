export interface Product {
  id: string
  sku: string
  name: string
  slug: string
  description: string
  short_desc: string
  price: number
  sale_price: number | null
  category_id: string
  brand: string
  stock: number
  is_active: boolean
  is_featured: boolean
  images: ProductImage[]
  created_at: string
  updated_at: string
}

export interface ProductImage {
  id: string
  product_id: string
  image_url: string
  sort_order: number
  is_primary: boolean
}

export interface Category {
  id: string
  name: string
  slug: string
  parent_id: string | null
  sort_order: number
  image_url: string | null
  is_active: boolean
  children?: Category[]
}

export interface Banner {
  id: string
  title: string
  image_url: string
  link_url: string
  sort_order: number
  is_active: boolean
}

export interface StoreInfo {
  id: string
  email: string
  phone: string
  address: string
  tax_id: string
  updated_at: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface AdminUser {
  email: string
  role: 'admin'
}

export interface UserProfile {
  id: string
  email: string
  name: string
  phone: string
  created_at: string
}

// ─── Order Types ───

export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'completed'
  | 'cancelled'

export type ShippingMethod = 'home_delivery' | 'convenience_store'
export type PaymentMethod = 'atm_transfer' | 'convenience_store_code'

export interface OrderItem {
  product_id: string
  sku: string
  name: string
  image_url: string
  price: number
  quantity: number
  subtotal: number
}

export interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_method: ShippingMethod
  shipping_address: string | null
  convenience_store_name: string | null
  convenience_store_address: string | null
  shipping_fee: number
  payment_method: PaymentMethod
  items: OrderItem[]
  subtotal: number
  total: number
  status: OrderStatus
  customer_notes: string
  admin_notes: string
  created_at: string
  updated_at: string
}

export interface Partner {
  id: string
  company_name: string
  contact_name: string
  address: string
  tax_id: string
  phone: string
  mobile: string
  email: string
  description: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CheckoutFormData {
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_method: ShippingMethod
  shipping_address: string
  convenience_store_name: string
  convenience_store_address: string
  payment_method: PaymentMethod
  customer_notes: string
}
