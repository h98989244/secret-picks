import { create } from 'zustand'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import type { Order, OrderStatus, OrderItem, CheckoutFormData, CartItem } from '@/types'

function generateOrderNumber(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const rand = String(Math.floor(1000 + Math.random() * 9000))
  return `SP-${y}${m}${d}-${rand}`
}

function cartToOrderItems(items: CartItem[]): OrderItem[] {
  return items.map((item) => {
    const price = item.product.sale_price ?? item.product.price
    return {
      product_id: item.product.id,
      sku: item.product.sku,
      name: item.product.name,
      image_url: item.product.images[0]?.image_url || '',
      price,
      quantity: item.quantity,
      subtotal: price * item.quantity,
    }
  })
}

interface OrderState {
  orders: Order[]
  currentOrder: Order | null
  loading: boolean
  error: string | null

  createOrder: (form: CheckoutFormData, items: CartItem[], shippingFee: number) => Promise<Order | null>
  getOrderByTracking: (orderNumber: string, email: string) => Promise<Order | null>
  fetchOrders: () => Promise<void>
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<boolean>
  updateAdminNotes: (orderId: string, notes: string) => Promise<boolean>
  clearError: () => void
}

export const useOrderStore = create<OrderState>()((set, get) => ({
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  createOrder: async (form, cartItems, shippingFee) => {
    set({ loading: true, error: null })

    const orderItems = cartToOrderItems(cartItems)
    const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0)
    const total = subtotal + shippingFee

    const orderData = {
      order_number: generateOrderNumber(),
      customer_name: form.customer_name,
      customer_email: form.customer_email,
      customer_phone: form.customer_phone,
      shipping_method: form.shipping_method,
      shipping_address: form.shipping_method === 'home_delivery' ? form.shipping_address : null,
      convenience_store_name: form.shipping_method === 'convenience_store' ? form.convenience_store_name : null,
      convenience_store_address: form.shipping_method === 'convenience_store' ? form.convenience_store_address : null,
      shipping_fee: shippingFee,
      payment_method: form.payment_method,
      items: orderItems,
      subtotal,
      total,
      status: 'pending_payment' as const,
      customer_notes: form.customer_notes || '',
      admin_notes: '',
    }

    const { data, error } = await supabaseAdmin
      .from('orders')
      .insert(orderData)
      .select()
      .single()

    if (error) {
      // If unique constraint violation on order_number, retry once
      if (error.code === '23505') {
        orderData.order_number = generateOrderNumber()
        const retry = await supabaseAdmin.from('orders').insert(orderData).select().single()
        if (retry.error) {
          set({ loading: false, error: '訂單建立失敗，請稍後再試。' })
          return null
        }
        const order = retry.data as Order
        set({ loading: false, currentOrder: order })
        return order
      }
      set({ loading: false, error: '訂單建立失敗，請稍後再試。' })
      return null
    }

    const order = data as Order
    set({ loading: false, currentOrder: order })
    return order
  },

  getOrderByTracking: async (orderNumber, email) => {
    set({ loading: true, error: null, currentOrder: null })

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber.trim().toUpperCase())
      .eq('customer_email', email.trim().toLowerCase())
      .single()

    if (error || !data) {
      set({ loading: false, error: '找不到符合的訂單，請確認訂單編號與電子郵件是否正確。' })
      return null
    }

    const order = data as Order
    set({ loading: false, currentOrder: order })
    return order
  },

  fetchOrders: async () => {
    set({ loading: true, error: null })

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      set({ loading: false, error: '無法載入訂單列表。' })
      return
    }

    set({ loading: false, orders: (data as Order[]) || [] })
  },

  updateOrderStatus: async (orderId, status) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)

    if (error) {
      set({ error: '狀態更新失敗。' })
      return false
    }

    set({
      orders: get().orders.map((o) =>
        o.id === orderId ? { ...o, status, updated_at: new Date().toISOString() } : o
      ),
    })
    return true
  },

  updateAdminNotes: async (orderId, notes) => {
    const { error } = await supabase
      .from('orders')
      .update({ admin_notes: notes })
      .eq('id', orderId)

    if (error) {
      set({ error: '備註更新失敗。' })
      return false
    }

    set({
      orders: get().orders.map((o) =>
        o.id === orderId ? { ...o, admin_notes: notes, updated_at: new Date().toISOString() } : o
      ),
    })
    return true
  },
}))
