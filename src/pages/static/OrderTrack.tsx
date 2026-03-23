import { useState } from 'react'
import { Search, Package, Clock, Truck, CheckCircle, Mail, Phone, AlertCircle, XCircle, Wallet } from 'lucide-react'
import { useStoreInfoStore } from '@/stores/storeInfoStore'
import { useOrderStore } from '@/stores/orderStore'
import { formatPrice, ORDER_STATUS_MAP, PAYMENT_METHOD_LABEL, SHIPPING_METHOD_LABEL } from '@/lib/utils'
import type { Order, OrderStatus } from '@/types'

const STATUS_STEPS: OrderStatus[] = ['pending_payment', 'paid', 'processing', 'shipped', 'completed']

function StatusTimeline({ current }: { current: OrderStatus }) {
  if (current === 'cancelled') {
    return (
      <div className="flex items-center gap-2 text-sm text-red-500">
        <XCircle size={18} />
        <span className="font-medium">此訂單已取消</span>
      </div>
    )
  }

  const currentIdx = STATUS_STEPS.indexOf(current)

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-2">
      {STATUS_STEPS.map((step, idx) => {
        const info = ORDER_STATUS_MAP[step]
        const isActive = idx <= currentIdx
        const isCurrent = idx === currentIdx
        return (
          <div key={step} className="flex items-center">
            {idx > 0 && (
              <div className={`w-6 md:w-10 h-0.5 ${isActive ? 'bg-primary' : 'bg-gray-200'}`} />
            )}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  isCurrent
                    ? 'bg-primary text-white ring-4 ring-primary/20'
                    : isActive
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {idx + 1}
              </div>
              <span className={`text-xs mt-1.5 whitespace-nowrap ${isCurrent ? 'text-primary font-medium' : isActive ? 'text-navy' : 'text-gray-400'}`}>
                {info.label}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function OrderDetail({ order }: { order: Order }) {
  const storeInfo = useStoreInfoStore((s) => s.info)
  const statusInfo = ORDER_STATUS_MAP[order.status]

  return (
    <div className="space-y-6">
      {/* Status & Timeline */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg font-bold text-navy">訂單狀態</h3>
          <span className={`text-xs px-3 py-1 rounded-full border ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>
        <StatusTimeline current={order.status} />
      </div>

      {/* Payment reminder for pending */}
      {order.status === 'pending_payment' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <div className="flex gap-3">
            <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-800">尚未付款</p>
              <p className="text-amber-700 mt-1">
                {order.payment_method === 'atm_transfer'
                  ? '請聯繫客服取得虛擬帳號進行 ATM 轉帳付款。'
                  : '請聯繫客服取得超商繳費代碼後至超商繳費。'}
              </p>
              <div className="flex flex-col sm:flex-row gap-2 mt-3">
                <a href={`mailto:${storeInfo.email}`} className="flex items-center gap-1.5 text-amber-700 hover:text-amber-900 no-underline">
                  <Mail size={13} /> {storeInfo.email}
                </a>
                <a href={`tel:${storeInfo.phone}`} className="flex items-center gap-1.5 text-amber-700 hover:text-amber-900 no-underline">
                  <Phone size={13} /> {storeInfo.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order info */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="font-serif text-lg font-bold text-navy mb-4">訂單資訊</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm mb-6">
          <div className="space-y-2">
            <p className="text-warm-gray">訂單編號：<span className="text-navy font-mono">{order.order_number}</span></p>
            <p className="text-warm-gray">下單時間：<span className="text-navy">{new Date(order.created_at).toLocaleString('zh-TW')}</span></p>
            <p className="text-warm-gray">付款方式：<span className="text-navy">{PAYMENT_METHOD_LABEL[order.payment_method]}</span></p>
          </div>
          <div className="space-y-2">
            <p className="text-warm-gray">收件人：<span className="text-navy">{order.customer_name}</span></p>
            <p className="text-warm-gray">配送方式：<span className="text-navy">{SHIPPING_METHOD_LABEL[order.shipping_method]}</span></p>
            <p className="text-warm-gray">
              {order.shipping_method === 'home_delivery'
                ? <>配送地址：<span className="text-navy">{order.shipping_address}</span></>
                : <>取貨門市：<span className="text-navy">{order.convenience_store_name}</span></>
              }
            </p>
          </div>
        </div>

        {/* Items */}
        <div className="border-t border-gray-100 pt-4">
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex gap-3 items-center">
                <img src={item.image_url} alt={item.name} className="w-12 h-12 object-cover rounded border border-gray-100" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-navy line-clamp-1">{item.name}</p>
                  <p className="text-xs text-warm-gray">{formatPrice(item.price)} x {item.quantity}</p>
                </div>
                <p className="text-sm font-medium text-navy">{formatPrice(item.subtotal)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 mt-4 pt-4 space-y-1 text-sm">
            <div className="flex justify-between text-warm-gray">
              <span>商品合計</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-warm-gray">
              <span>運費</span>
              <span>{order.shipping_fee === 0 ? '免運費' : formatPrice(order.shipping_fee)}</span>
            </div>
            <div className="flex justify-between font-medium text-navy pt-2 border-t border-gray-100">
              <span>應付總額</span>
              <span className="text-primary text-lg font-bold">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OrderTrack() {
  const info = useStoreInfoStore((s) => s.info)
  const getOrderByTracking = useOrderStore((s) => s.getOrderByTracking)
  const currentOrder = useOrderStore((s) => s.currentOrder)
  const loading = useOrderStore((s) => s.loading)
  const error = useOrderStore((s) => s.error)
  const clearError = useOrderStore((s) => s.clearError)

  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [searched, setSearched] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    setSearched(true)
    await getOrderByTracking(orderNumber, email)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <p className="text-gold text-sm tracking-widest uppercase mb-3">Order Tracking</p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy mb-4">訂單查詢</h1>
        <div className="w-16 h-0.5 bg-gold mx-auto mb-6" />
        <p className="text-warm-gray">輸入您的訂單編號與電子郵件，即可查詢訂單狀態。</p>
      </div>

      {/* Search form */}
      <div className="max-w-lg mx-auto mb-12">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">訂單編號</label>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => { setOrderNumber(e.target.value); setSearched(false) }}
              placeholder="例：SP-20260301-0001"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">電子郵件</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setSearched(false) }}
              placeholder="下單時使用的 Email"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light transition-colors cursor-pointer disabled:opacity-50"
          >
            <Search size={16} />
            {loading ? '查詢中...' : '查詢訂單'}
          </button>
        </form>

        {/* Error message */}
        {searched && error && !loading && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-5 flex gap-3">
            <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-red-700">{error}</p>
              <p className="text-red-500 mt-1">如有疑問，請聯繫客服：{info.email}</p>
            </div>
          </div>
        )}
      </div>

      {/* Order result */}
      {searched && currentOrder && !loading && (
        <div className="mb-12">
          <OrderDetail order={currentOrder} />
        </div>
      )}

      {/* Order status guide */}
      <section>
        <h2 className="font-serif text-2xl font-bold text-navy mb-6 text-center">訂單狀態說明</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: Clock, status: '待付款', desc: '訂單已成立，等待您完成付款。請聯繫客服取得付款資訊，收到後請於期限內繳費，逾期訂單將自動取消。', color: 'text-warning' },
            { icon: Wallet, status: '已付款', desc: '已確認收到您的付款，訂單即將進入處理階段。', color: 'text-primary' },
            { icon: Package, status: '處理中', desc: '商品正在揀貨包裝中。我們將於 1-3 個工作天內完成出貨。', color: 'text-primary' },
            { icon: Truck, status: '配送中', desc: '您的包裹已交由物流夥伴配送。可透過物流追蹤編號查詢即時配送進度。', color: 'text-primary-light' },
            { icon: CheckCircle, status: '已完成', desc: '商品已送達。如有任何問題，請於收貨後 7 天內聯繫我們。感謝您的購買！', color: 'text-success' },
            { icon: XCircle, status: '已取消', desc: '訂單已取消。如為逾期未付款自動取消，歡迎重新下單。', color: 'text-gray-400' },
          ].map((item) => (
            <div key={item.status} className="bg-white rounded-xl border border-gray-100 p-5 flex gap-4">
              <div className={`shrink-0 ${item.color}`}>
                <item.icon size={24} />
              </div>
              <div>
                <h3 className="font-medium text-navy mb-1">{item.status}</h3>
                <p className="text-warm-gray text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
