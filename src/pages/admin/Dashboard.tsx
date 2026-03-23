import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, Eye, ShoppingCart, Clock } from 'lucide-react'
import { useProductStore } from '@/stores/productStore'
import { useOrderStore } from '@/stores/orderStore'
import { formatPrice, ORDER_STATUS_MAP, PAYMENT_METHOD_LABEL } from '@/lib/utils'

export default function Dashboard() {
  const products = useProductStore((s) => s.products)
  const activeProducts = products.filter((p) => p.is_active)
  const orders = useOrderStore((s) => s.orders)
  const fetchOrders = useOrderStore((s) => s.fetchOrders)

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const pendingOrders = orders.filter((o) => o.status === 'pending_payment')

  const stats = [
    { label: '總商品數', value: products.length, icon: Package, color: 'bg-primary' },
    { label: '上架中', value: activeProducts.length, icon: Eye, color: 'bg-success' },
    { label: '總訂單數', value: orders.length, icon: ShoppingCart, color: 'bg-gold' },
    { label: '待付款', value: pendingOrders.length, icon: Clock, color: 'bg-amber-500' },
  ]

  return (
    <div className="p-6 md:p-8">
      <h1 className="font-serif text-2xl font-bold text-navy mb-8">儀表板</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon size={20} className="text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-navy">{stat.value}</p>
            <p className="text-sm text-warm-gray mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-8">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-navy">最近訂單</h2>
          <Link to="/admin/orders" className="text-xs text-primary no-underline hover:text-primary-light">查看全部 →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-5 py-3 text-warm-gray font-medium">訂單編號</th>
                <th className="text-left px-5 py-3 text-warm-gray font-medium">顧客</th>
                <th className="text-right px-5 py-3 text-warm-gray font-medium">金額</th>
                <th className="text-center px-5 py-3 text-warm-gray font-medium">付款方式</th>
                <th className="text-center px-5 py-3 text-warm-gray font-medium">狀態</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-warm-gray">尚無訂單</td>
                </tr>
              ) : (
                orders.slice(0, 5).map((o) => {
                  const statusInfo = ORDER_STATUS_MAP[o.status]
                  return (
                    <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-5 py-3 font-mono text-navy">{o.order_number}</td>
                      <td className="px-5 py-3 text-navy">{o.customer_name}</td>
                      <td className="px-5 py-3 text-right text-primary font-medium">{formatPrice(o.total)}</td>
                      <td className="px-5 py-3 text-center text-warm-gray">{PAYMENT_METHOD_LABEL[o.payment_method]}</td>
                      <td className="px-5 py-3 text-center">
                        <span className={`text-xs px-2 py-1 rounded-full border ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent products */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-serif text-lg font-bold text-navy">最近新增商品</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-5 py-3 text-warm-gray font-medium">商品名稱</th>
                <th className="text-left px-5 py-3 text-warm-gray font-medium">SKU</th>
                <th className="text-right px-5 py-3 text-warm-gray font-medium">售價</th>
                <th className="text-center px-5 py-3 text-warm-gray font-medium">庫存</th>
                <th className="text-center px-5 py-3 text-warm-gray font-medium">狀態</th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 5).map((p) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-5 py-3 text-navy font-medium">{p.name}</td>
                  <td className="px-5 py-3 text-warm-gray">{p.sku}</td>
                  <td className="px-5 py-3 text-right text-navy">
                    NT$ {(p.sale_price ?? p.price).toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={p.stock <= 10 ? 'text-warning font-medium' : 'text-navy'}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      p.is_active
                        ? 'bg-success/10 text-success'
                        : 'bg-gray-100 text-warm-gray'
                    }`}>
                      {p.is_active ? '上架中' : '已下架'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
