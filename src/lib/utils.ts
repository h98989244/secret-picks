import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return `NT$ ${price.toLocaleString()}`
}

export function getDiscountPercent(original: number, sale: number): number {
  return Math.round(((original - sale) / original) * 100)
}

export function getShippingFee(method: 'home_delivery' | 'convenience_store', subtotal: number): number {
  if (subtotal >= 999) return 0
  return method === 'home_delivery' ? 80 : 60
}

export const ORDER_STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending_payment: { label: '待付款', color: 'bg-amber-50 text-amber-600 border-amber-200' },
  paid: { label: '已付款', color: 'bg-blue-50 text-blue-600 border-blue-200' },
  processing: { label: '處理中', color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
  shipped: { label: '配送中', color: 'bg-purple-50 text-purple-600 border-purple-200' },
  completed: { label: '已完成', color: 'bg-green-50 text-green-600 border-green-200' },
  cancelled: { label: '已取消', color: 'bg-gray-50 text-gray-500 border-gray-200' },
}

export const PAYMENT_METHOD_LABEL: Record<string, string> = {
  atm_transfer: 'ATM 轉帳',
  convenience_store_code: '超商代碼',
}

export const SHIPPING_METHOD_LABEL: Record<string, string> = {
  home_delivery: '宅配到府',
  convenience_store: '超商取貨',
}
