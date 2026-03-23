import { create } from 'zustand'
import type { Product, CartItem } from '@/types'

interface CartState {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],
  addItem: (product, quantity = 1) => {
    const items = get().items
    const existing = items.find((i) => i.product.id === product.id)
    if (existing) {
      set({
        items: items.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        ),
      })
    } else {
      set({ items: [...items, { product, quantity }] })
    }
  },
  removeItem: (productId) => {
    set({ items: get().items.filter((i) => i.product.id !== productId) })
  },
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId)
      return
    }
    set({
      items: get().items.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i
      ),
    })
  },
  clearCart: () => set({ items: [] }),
}))

export function getTotalItems(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0)
}

export function getTotalPrice(items: CartItem[]): number {
  return items.reduce(
    (sum, i) => sum + (i.product.sale_price ?? i.product.price) * i.quantity,
    0
  )
}
