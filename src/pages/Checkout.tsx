import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AlertCircle, Truck, Store, Wallet, Receipt, ShieldCheck, User } from 'lucide-react'
import { useCartStore, getTotalPrice } from '@/stores/cartStore'
import { useOrderStore } from '@/stores/orderStore'
import { useAuthStore } from '@/stores/authStore'
import { formatPrice, getShippingFee } from '@/lib/utils'
import type { ShippingMethod, PaymentMethod, CheckoutFormData } from '@/types'

interface FormErrors {
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  shipping_address?: string
  convenience_store_name?: string
  convenience_store_address?: string
}

export default function Checkout() {
  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)
  const clearCart = useCartStore((s) => s.clearCart)
  const totalPrice = getTotalPrice(items)
  const createOrder = useOrderStore((s) => s.createOrder)
  const loading = useOrderStore((s) => s.loading)
  const orderError = useOrderStore((s) => s.error)
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const user = useAuthStore((s) => s.user)

  const [form, setForm] = useState<CheckoutFormData>({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_method: 'home_delivery',
    shipping_address: '',
    convenience_store_name: '',
    convenience_store_address: '',
    payment_method: 'atm_transfer',
    customer_notes: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)

  const shippingFee = getShippingFee(form.shipping_method, totalPrice)
  const grandTotal = totalPrice + shippingFee

  // Redirect to login if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login?redirect=/checkout', { replace: true })
    }
  }, [isLoggedIn, navigate])

  // Auto-fill user data
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        customer_name: prev.customer_name || user.name || '',
        customer_email: prev.customer_email || user.email || '',
        customer_phone: prev.customer_phone || user.phone || '',
      }))
    }
  }, [user])

  useEffect(() => {
    if (items.length === 0 && !submitted) {
      navigate('/cart')
    }
  }, [items, navigate, submitted])

  // Don't render if not logged in (will redirect)
  if (!isLoggedIn) return null

  const updateField = (field: keyof CheckoutFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    if (!form.customer_name.trim()) {
      newErrors.customer_name = '請輸入姓名'
    }

    if (!form.customer_email.trim()) {
      newErrors.customer_email = '請輸入 Email'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customer_email)) {
      newErrors.customer_email = '請輸入有效的 Email 格式'
    }

    if (!form.customer_phone.trim()) {
      newErrors.customer_phone = '請輸入手機號碼'
    } else if (!/^0[0-9]{8,9}$/.test(form.customer_phone.replace(/-/g, ''))) {
      newErrors.customer_phone = '請輸入有效的台灣電話號碼'
    }

    if (form.shipping_method === 'home_delivery') {
      if (!form.shipping_address.trim()) {
        newErrors.shipping_address = '請輸入配送地址'
      }
    } else {
      if (!form.convenience_store_name.trim()) {
        newErrors.convenience_store_name = '請輸入超商門市名稱'
      }
      if (!form.convenience_store_address.trim()) {
        newErrors.convenience_store_address = '請輸入超商門市地址'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    if (items.length === 0) return

    setSubmitted(true)
    const order = await createOrder(form, items, shippingFee)
    if (order) {
      clearCart()
      navigate(`/order/confirmation/${order.order_number}`)
    }
  }

  if (items.length === 0 && !submitted) return null

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-sm text-warm-gray mb-6">
        <Link to="/cart" className="hover:text-primary no-underline text-warm-gray">購物車</Link>
        <span className="mx-2">/</span>
        <span className="text-navy font-medium">結帳</span>
      </nav>

      <h1 className="font-serif text-2xl font-bold text-navy mb-8">結帳</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Form */}
        <div className="flex-1 space-y-8">
          {/* Customer Info */}
          <section className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-serif text-lg font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-primary text-white text-sm flex items-center justify-center">1</span>
              顧客資訊
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-1">姓名 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.customer_name}
                  onChange={(e) => updateField('customer_name', e.target.value)}
                  placeholder="請輸入收件人姓名"
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:border-primary ${errors.customer_name ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                />
                {errors.customer_name && <p className="text-xs text-red-500 mt-1">{errors.customer_name}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">Email <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    value={form.customer_email}
                    onChange={(e) => updateField('customer_email', e.target.value)}
                    placeholder="example@email.com"
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:border-primary ${errors.customer_email ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                  />
                  {errors.customer_email && <p className="text-xs text-red-500 mt-1">{errors.customer_email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">手機 <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    value={form.customer_phone}
                    onChange={(e) => updateField('customer_phone', e.target.value)}
                    placeholder="0912-345-678"
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:border-primary ${errors.customer_phone ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                  />
                  {errors.customer_phone && <p className="text-xs text-red-500 mt-1">{errors.customer_phone}</p>}
                </div>
              </div>
            </div>
          </section>

          {/* Shipping */}
          <section className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-serif text-lg font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-primary text-white text-sm flex items-center justify-center">2</span>
              配送方式
            </h2>
            <div className="space-y-3">
              <label
                className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                  form.shipping_method === 'home_delivery' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="shipping"
                  checked={form.shipping_method === 'home_delivery'}
                  onChange={() => updateField('shipping_method', 'home_delivery')}
                  className="mt-1 accent-primary"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-navy flex items-center gap-1.5">
                      <Truck size={16} className="text-primary" /> 宅配到府
                    </span>
                    <span className="text-sm text-primary font-medium">
                      {totalPrice >= 999 ? '免運費' : 'NT$ 80'}
                    </span>
                  </div>
                  <p className="text-xs text-warm-gray mt-1">黑貓宅急便 / 新竹物流，1-3 個工作天出貨</p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                  form.shipping_method === 'convenience_store' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="shipping"
                  checked={form.shipping_method === 'convenience_store'}
                  onChange={() => updateField('shipping_method', 'convenience_store')}
                  className="mt-1 accent-primary"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-navy flex items-center gap-1.5">
                      <Store size={16} className="text-primary" /> 超商取貨
                    </span>
                    <span className="text-sm text-primary font-medium">
                      {totalPrice >= 999 ? '免運費' : 'NT$ 60'}
                    </span>
                  </div>
                  <p className="text-xs text-warm-gray mt-1">7-ELEVEN / 全家，2-4 天送達門市</p>
                </div>
              </label>

              {/* Conditional address fields */}
              <div className="mt-4 pl-2">
                {form.shipping_method === 'home_delivery' ? (
                  <div>
                    <label className="block text-sm font-medium text-navy mb-1">配送地址 <span className="text-red-500">*</span></label>
                    <textarea
                      value={form.shipping_address}
                      onChange={(e) => updateField('shipping_address', e.target.value)}
                      placeholder="請輸入完整配送地址（含郵遞區號）"
                      rows={2}
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:border-primary resize-none ${errors.shipping_address ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                    />
                    {errors.shipping_address && <p className="text-xs text-red-500 mt-1">{errors.shipping_address}</p>}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-navy mb-1">超商門市名稱 <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={form.convenience_store_name}
                        onChange={(e) => updateField('convenience_store_name', e.target.value)}
                        placeholder="例：全家 信義店"
                        className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:border-primary ${errors.convenience_store_name ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                      />
                      {errors.convenience_store_name && <p className="text-xs text-red-500 mt-1">{errors.convenience_store_name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy mb-1">超商門市地址 <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={form.convenience_store_address}
                        onChange={(e) => updateField('convenience_store_address', e.target.value)}
                        placeholder="請輸入超商門市完整地址"
                        className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:border-primary ${errors.convenience_store_address ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                      />
                      {errors.convenience_store_address && <p className="text-xs text-red-500 mt-1">{errors.convenience_store_address}</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Payment */}
          <section className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-serif text-lg font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-primary text-white text-sm flex items-center justify-center">3</span>
              付款方式
            </h2>
            <div className="space-y-3">
              <label
                className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                  form.payment_method === 'atm_transfer' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={form.payment_method === 'atm_transfer'}
                  onChange={() => updateField('payment_method', 'atm_transfer')}
                  className="mt-1 accent-primary"
                />
                <div>
                  <span className="text-sm font-medium text-navy flex items-center gap-1.5">
                    <Wallet size={16} className="text-primary" /> ATM 轉帳
                  </span>
                  <p className="text-xs text-warm-gray mt-1">下單後聯繫客服取得虛擬帳號，至 ATM 或網路銀行轉帳</p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                  form.payment_method === 'convenience_store_code' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={form.payment_method === 'convenience_store_code'}
                  onChange={() => updateField('payment_method', 'convenience_store_code')}
                  className="mt-1 accent-primary"
                />
                <div>
                  <span className="text-sm font-medium text-navy flex items-center gap-1.5">
                    <Receipt size={16} className="text-primary" /> 超商代碼繳費
                  </span>
                  <p className="text-xs text-warm-gray mt-1">下單後聯繫客服取得繳費代碼，至 7-ELEVEN 或全家繳費</p>
                </div>
              </label>
            </div>

            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
              <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-800">付款提醒</p>
                <p className="text-amber-700 mt-1">
                  下單後請聯繫客服取得付款資訊（虛擬帳號或超商繳費代碼）。
                  收到付款資訊後請於 <strong>3 天內</strong> 完成繳費，逾期訂單將自動取消。
                </p>
              </div>
            </div>
          </section>

          {/* Notes */}
          <section className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-serif text-lg font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-primary text-white text-sm flex items-center justify-center">4</span>
              訂單備註
            </h2>
            <textarea
              value={form.customer_notes}
              onChange={(e) => updateField('customer_notes', e.target.value)}
              placeholder="有任何特殊需求嗎？（選填）"
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary resize-none"
            />
          </section>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:w-96 shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-28">
            <h3 className="font-serif text-lg font-bold text-navy mb-4">訂單摘要</h3>

            {/* Items */}
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {items.map((item) => {
                const price = item.product.sale_price ?? item.product.price
                const image = item.product.images[0]?.image_url
                return (
                  <div key={item.product.id} className="flex gap-3">
                    <img src={image} alt={item.product.name} className="w-14 h-14 object-cover rounded-lg border border-gray-100 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-navy line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-warm-gray">x{item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-navy shrink-0">{formatPrice(price * item.quantity)}</p>
                  </div>
                )
              })}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-warm-gray">商品合計</span>
                <span className="text-navy">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-warm-gray">
                  運費（{form.shipping_method === 'home_delivery' ? '宅配' : '超商取貨'}）
                </span>
                <span className={shippingFee === 0 ? 'text-green-600 font-medium' : 'text-navy'}>
                  {shippingFee === 0 ? '免運費' : formatPrice(shippingFee)}
                </span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between">
                <span className="font-medium text-navy">應付總額</span>
                <span className="text-xl font-bold text-primary">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {orderError && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg text-sm text-red-600 flex gap-2">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                {orderError}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-light transition-colors cursor-pointer shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '訂單處理中...' : '確認下單'}
            </button>

            <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-warm-gray">
              <ShieldCheck size={12} />
              <span>安全加密 · 隱密包裝配送</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
