import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, Search, Save } from 'lucide-react'
import { useOrderStore } from '@/stores/orderStore'
import { formatPrice, ORDER_STATUS_MAP, PAYMENT_METHOD_LABEL, SHIPPING_METHOD_LABEL } from '@/lib/utils'
import type { OrderStatus } from '@/types'

const ALL_STATUSES: OrderStatus[] = ['pending_payment', 'paid', 'processing', 'shipped', 'completed', 'cancelled']

export default function AdminOrderList() {
  const orders = useOrderStore((s) => s.orders)
  const loading = useOrderStore((s) => s.loading)
  const fetchOrders = useOrderStore((s) => s.fetchOrders)
  const updateOrderStatus = useOrderStore((s) => s.updateOrderStatus)
  const updateAdminNotes = useOrderStore((s) => s.updateAdminNotes)

  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({})
  const [savingStatus, setSavingStatus] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const filtered = orders.filter((order) => {
    if (filterStatus !== 'all' && order.status !== filterStatus) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return (
        order.order_number.toLowerCase().includes(q) ||
        order.customer_name.toLowerCase().includes(q) ||
        order.customer_email.toLowerCase().includes(q)
      )
    }
    return true
  })

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setSavingStatus((prev) => ({ ...prev, [orderId]: true }))
    await updateOrderStatus(orderId, newStatus)
    setSavingStatus((prev) => ({ ...prev, [orderId]: false }))
  }

  const handleSaveNotes = async (orderId: string) => {
    const notes = editingNotes[orderId]
    if (notes === undefined) return
    setSavingStatus((prev) => ({ ...prev, [`notes-${orderId}`]: true }))
    await updateAdminNotes(orderId, notes)
    setSavingStatus((prev) => ({ ...prev, [`notes-${orderId}`]: false }))
  }

  const toggleExpand = (orderId: string) => {
    if (expandedId === orderId) {
      setExpandedId(null)
    } else {
      setExpandedId(orderId)
      const order = orders.find((o) => o.id === orderId)
      if (order && editingNotes[orderId] === undefined) {
        setEditingNotes((prev) => ({ ...prev, [orderId]: order.admin_notes || '' }))
      }
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy">訂單管理</h1>
        <span className="text-sm text-warm-gray">共 {filtered.length} 筆訂單</span>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜尋訂單編號、顧客姓名或 Email..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:border-primary"
        >
          <option value="all">全部狀態</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>{ORDER_STATUS_MAP[s].label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-warm-gray">載入中...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-warm-gray">
          {orders.length === 0 ? '目前沒有任何訂單' : '沒有符合條件的訂單'}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const isExpanded = expandedId === order.id
            const statusInfo = ORDER_STATUS_MAP[order.status]
            return (
              <div key={order.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                {/* Summary row */}
                <button
                  onClick={() => toggleExpand(order.id)}
                  className="w-full p-4 flex items-center gap-4 text-left hover:bg-gray-50/50 transition-colors cursor-pointer"
                >
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-4 items-center text-sm">
                    <div>
                      <p className="font-mono text-navy font-medium">{order.order_number}</p>
                      <p className="text-xs text-warm-gray md:hidden">{new Date(order.created_at).toLocaleDateString('zh-TW')}</p>
                    </div>
                    <div>
                      <p className="text-navy">{order.customer_name}</p>
                      <p className="text-xs text-warm-gray truncate">{order.customer_email}</p>
                    </div>
                    <div className="hidden md:block">
                      <span className="font-medium text-primary">{formatPrice(order.total)}</span>
                    </div>
                    <div className="hidden md:block text-warm-gray">
                      {PAYMENT_METHOD_LABEL[order.payment_method]}
                    </div>
                    <div>
                      <span className={`inline-block text-xs px-2.5 py-1 rounded-full border ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                    <div className="hidden md:block text-warm-gray text-xs">
                      {new Date(order.created_at).toLocaleString('zh-TW')}
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp size={16} className="text-gray-400 shrink-0" /> : <ChevronDown size={16} className="text-gray-400 shrink-0" />}
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t border-gray-100 p-4 md:p-6 bg-gray-50/30">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* Customer info */}
                      <div>
                        <h4 className="text-sm font-medium text-navy mb-2">顧客資訊</h4>
                        <div className="text-sm text-warm-gray space-y-1">
                          <p>姓名：{order.customer_name}</p>
                          <p>Email：{order.customer_email}</p>
                          <p>電話：{order.customer_phone}</p>
                        </div>
                      </div>

                      {/* Shipping info */}
                      <div>
                        <h4 className="text-sm font-medium text-navy mb-2">配送資訊</h4>
                        <div className="text-sm text-warm-gray space-y-1">
                          <p>方式：{SHIPPING_METHOD_LABEL[order.shipping_method]}</p>
                          {order.shipping_method === 'home_delivery' ? (
                            <p>地址：{order.shipping_address}</p>
                          ) : (
                            <>
                              <p>門市：{order.convenience_store_name}</p>
                              <p>地址：{order.convenience_store_address}</p>
                            </>
                          )}
                          <p>運費：{order.shipping_fee === 0 ? '免運費' : formatPrice(order.shipping_fee)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-navy mb-2">訂購商品</h4>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex gap-3 items-center text-sm">
                            <img src={item.image_url} alt={item.name} className="w-10 h-10 object-cover rounded border border-gray-100" />
                            <div className="flex-1 min-w-0">
                              <span className="text-navy line-clamp-1">{item.name}</span>
                              <span className="text-warm-gray text-xs ml-2">({item.sku})</span>
                            </div>
                            <span className="text-warm-gray">x{item.quantity}</span>
                            <span className="text-navy font-medium">{formatPrice(item.subtotal)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="text-right mt-3 text-sm">
                        <span className="text-warm-gray">商品合計 {formatPrice(order.subtotal)} + 運費 {order.shipping_fee === 0 ? '免運' : formatPrice(order.shipping_fee)} = </span>
                        <span className="text-primary font-bold text-lg">{formatPrice(order.total)}</span>
                      </div>
                    </div>

                    {/* Customer notes */}
                    {order.customer_notes && (
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-navy mb-1">顧客備註</h4>
                        <p className="text-sm text-warm-gray bg-white rounded-lg p-3 border border-gray-100">{order.customer_notes}</p>
                      </div>
                    )}

                    {/* Admin controls */}
                    <div className="border-t border-gray-200 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Status update */}
                      <div>
                        <label className="block text-sm font-medium text-navy mb-1">更新訂單狀態</label>
                        <div className="flex gap-2">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                            disabled={savingStatus[order.id]}
                            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:border-primary disabled:opacity-50"
                          >
                            {ALL_STATUSES.map((s) => (
                              <option key={s} value={s}>{ORDER_STATUS_MAP[s].label}</option>
                            ))}
                          </select>
                          {savingStatus[order.id] && <span className="text-xs text-warm-gray self-center">儲存中...</span>}
                        </div>
                      </div>

                      {/* Admin notes */}
                      <div>
                        <label className="block text-sm font-medium text-navy mb-1">管理備註</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editingNotes[order.id] ?? order.admin_notes ?? ''}
                            onChange={(e) => setEditingNotes((prev) => ({ ...prev, [order.id]: e.target.value }))}
                            placeholder="內部備註..."
                            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary"
                          />
                          <button
                            onClick={() => handleSaveNotes(order.id)}
                            disabled={savingStatus[`notes-${order.id}`]}
                            className="px-3 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-light transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <Save size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
