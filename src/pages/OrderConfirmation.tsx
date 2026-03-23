import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle, Copy, Phone, Mail, Search, ShoppingBag } from 'lucide-react'
import { useOrderStore } from '@/stores/orderStore'
import { useStoreInfoStore } from '@/stores/storeInfoStore'
import { formatPrice, ORDER_STATUS_MAP, PAYMENT_METHOD_LABEL, SHIPPING_METHOD_LABEL } from '@/lib/utils'

export default function OrderConfirmation() {
  const { orderNumber } = useParams<{ orderNumber: string }>()
  const currentOrder = useOrderStore((s) => s.currentOrder)
  const loading = useOrderStore((s) => s.loading)
  const storeInfo = useStoreInfoStore((s) => s.info)

  const order = currentOrder

  useEffect(() => {
    // If page was refreshed and we lost the store data, try to fetch
    // For now we rely on the store's currentOrder set during createOrder
  }, [orderNumber])

  const copyOrderNumber = () => {
    if (order?.order_number) {
      navigator.clipboard.writeText(order.order_number)
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="animate-pulse text-warm-gray">載入中...</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-warm-gray mb-4">找不到訂單資料</p>
        <Link to="/" className="text-primary text-sm no-underline">返回首頁</Link>
      </div>
    )
  }

  const statusInfo = ORDER_STATUS_MAP[order.status]

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Success header */}
      <div className="text-center mb-10">
        <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
        <h1 className="font-serif text-3xl font-bold text-navy mb-2">訂單已成立！</h1>
        <p className="text-warm-gray">感謝您的訂購，以下是您的訂單資訊</p>
      </div>

      {/* Order number */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 text-center mb-6">
        <p className="text-sm text-warm-gray mb-2">訂單編號</p>
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl font-bold text-navy font-mono tracking-wider">{order.order_number}</span>
          <button
            onClick={copyOrderNumber}
            className="p-1.5 text-warm-gray hover:text-primary transition-colors cursor-pointer"
            title="複製訂單編號"
          >
            <Copy size={16} />
          </button>
        </div>
        <span className={`inline-block mt-3 text-xs px-3 py-1 rounded-full border ${statusInfo.color}`}>
          {statusInfo.label}
        </span>
      </div>

      {/* Payment reminder - KEY section */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
        <h2 className="font-serif text-lg font-bold text-amber-800 mb-3">⚠️ 付款提醒</h2>
        <div className="text-sm text-amber-700 space-y-2">
          {order.payment_method === 'atm_transfer' ? (
            <p>您選擇的付款方式為 <strong>ATM 轉帳</strong>，請聯繫客服取得<strong>虛擬帳號</strong>進行轉帳付款。</p>
          ) : (
            <p>您選擇的付款方式為<strong>超商代碼繳費</strong>，請聯繫客服取得<strong>繳費代碼</strong>後至超商繳費。</p>
          )}
          <p>收到付款資訊後請於 <strong>3 天內</strong> 完成繳費，逾期訂單將自動取消。</p>
        </div>

        <div className="mt-4 pt-4 border-t border-amber-200 space-y-2">
          <p className="text-sm font-medium text-amber-800">聯繫客服：</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`mailto:${storeInfo.email}`}
              className="flex items-center gap-2 text-sm text-amber-700 hover:text-amber-900 no-underline"
            >
              <Mail size={14} /> {storeInfo.email}
            </a>
            <a
              href={`tel:${storeInfo.phone}`}
              className="flex items-center gap-2 text-sm text-amber-700 hover:text-amber-900 no-underline"
            >
              <Phone size={14} /> {storeInfo.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Order details */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h2 className="font-serif text-lg font-bold text-navy mb-4">訂單明細</h2>

        {/* Customer & Shipping info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-medium text-navy mb-2">顧客資訊</h3>
            <div className="text-sm text-warm-gray space-y-1">
              <p>{order.customer_name}</p>
              <p>{order.customer_email}</p>
              <p>{order.customer_phone}</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-navy mb-2">配送資訊</h3>
            <div className="text-sm text-warm-gray space-y-1">
              <p>{SHIPPING_METHOD_LABEL[order.shipping_method]}</p>
              {order.shipping_method === 'home_delivery' ? (
                <p>{order.shipping_address}</p>
              ) : (
                <>
                  <p>{order.convenience_store_name}</p>
                  <p>{order.convenience_store_address}</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="border-t border-gray-100 pt-4">
          <h3 className="text-sm font-medium text-navy mb-3">訂購商品</h3>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex gap-3 items-center">
                <img src={item.image_url} alt={item.name} className="w-12 h-12 object-cover rounded border border-gray-100" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-navy line-clamp-1">{item.name}</p>
                  <p className="text-xs text-warm-gray">x{item.quantity}</p>
                </div>
                <p className="text-sm font-medium text-navy">{formatPrice(item.subtotal)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="border-t border-gray-100 mt-4 pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-warm-gray">商品合計</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-warm-gray">運費</span>
            <span className={order.shipping_fee === 0 ? 'text-green-600' : ''}>
              {order.shipping_fee === 0 ? '免運費' : formatPrice(order.shipping_fee)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-warm-gray">付款方式</span>
            <span>{PAYMENT_METHOD_LABEL[order.payment_method]}</span>
          </div>
          <div className="border-t border-gray-100 pt-3 flex justify-between">
            <span className="font-medium text-navy">應付總額</span>
            <span className="text-xl font-bold text-primary">{formatPrice(order.total)}</span>
          </div>
        </div>

        {order.customer_notes && (
          <div className="border-t border-gray-100 mt-4 pt-4">
            <p className="text-sm text-warm-gray"><span className="font-medium text-navy">備註：</span>{order.customer_notes}</p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/order/track"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-light transition-colors no-underline"
        >
          <Search size={16} /> 查詢訂單狀態
        </Link>
        <Link
          to="/category/all"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-navy rounded-lg font-medium hover:bg-gray-50 transition-colors no-underline"
        >
          <ShoppingBag size={16} /> 繼續購物
        </Link>
      </div>
    </div>
  )
}
