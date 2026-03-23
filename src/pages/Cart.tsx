import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useCartStore, getTotalPrice } from '@/stores/cartStore'
import { formatPrice } from '@/lib/utils'

export default function Cart() {
  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)
  const removeItem = useCartStore((s) => s.removeItem)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const clearCart = useCartStore((s) => s.clearCart)
  const totalPrice = getTotalPrice(items)

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-200 mb-4" />
        <h2 className="font-serif text-2xl text-navy mb-2">購物車是空的</h2>
        <p className="text-warm-gray mb-6">快去挑選喜歡的商品吧！</p>
        <Link
          to="/category/all"
          className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-medium hover:bg-primary-light transition-colors no-underline"
        >
          開始購物
        </Link>
      </div>
    )
  }

  const shipping = totalPrice >= 999 ? 0 : 80
  const grandTotal = totalPrice + shipping

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-serif text-2xl font-bold text-navy mb-8">購物車商品</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart items */}
        <div className="flex-1">
          {/* Desktop table header */}
          <div className="hidden md:grid grid-cols-12 gap-4 pb-3 border-b border-gray-200 text-sm text-warm-gray font-medium">
            <div className="col-span-5">商品</div>
            <div className="col-span-2 text-center">單價</div>
            <div className="col-span-2 text-center">數量</div>
            <div className="col-span-2 text-center">小計</div>
            <div className="col-span-1" />
          </div>

          {items.map((item) => {
            const price = item.product.sale_price ?? item.product.price
            const image = item.product.images[0]?.image_url
            return (
              <div key={item.product.id} className="grid grid-cols-12 gap-4 py-4 border-b border-gray-100 items-center">
                {/* Product info */}
                <div className="col-span-12 md:col-span-5 flex gap-4">
                  <Link to={`/product/${item.product.slug}`} className="shrink-0">
                    <img src={image} alt={item.product.name} className="w-20 h-20 object-cover rounded-lg border border-gray-100" />
                  </Link>
                  <div className="min-w-0">
                    <Link to={`/product/${item.product.slug}`} className="text-sm font-medium text-navy hover:text-primary no-underline line-clamp-2">
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-warm-gray mt-1">SKU: {item.product.sku}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-4 md:col-span-2 text-center text-sm">
                  <span className="md:hidden text-warm-gray text-xs">單價 </span>
                  {formatPrice(price)}
                </div>

                {/* Quantity */}
                <div className="col-span-4 md:col-span-2 flex justify-center">
                  <div className="flex items-center border border-gray-200 rounded">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-1.5 hover:bg-gray-50 cursor-pointer">
                      <Minus size={14} />
                    </button>
                    <span className="px-3 text-sm min-w-[2rem] text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-1.5 hover:bg-gray-50 cursor-pointer">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="col-span-3 md:col-span-2 text-center text-sm font-medium text-primary">
                  {formatPrice(price * item.quantity)}
                </div>

                {/* Delete */}
                <div className="col-span-1 text-center">
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="p-1.5 text-warm-gray hover:text-error transition-colors cursor-pointer"
                    title="移除"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )
          })}

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={clearCart}
              className="text-sm text-warm-gray hover:text-error transition-colors cursor-pointer"
            >
              清空購物車
            </button>
            <Link to="/category/all" className="text-sm text-primary hover:text-primary-light no-underline">
              ← 繼續購物
            </Link>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-28">
            <h3 className="font-serif text-lg font-bold text-navy mb-4">訂單摘要</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-warm-gray">商品合計</span>
                <span className="text-navy">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-warm-gray">運費</span>
                <span className={shipping === 0 ? 'text-success font-medium' : 'text-navy'}>
                  {shipping === 0 ? '免運費' : formatPrice(shipping)}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-gold">再消費 {formatPrice(999 - totalPrice)} 即享免運</p>
              )}
              <div className="border-t border-gray-100 pt-3 flex justify-between">
                <span className="font-medium text-navy">應付總額</span>
                <span className="text-xl font-bold text-primary">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full mt-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-light transition-colors cursor-pointer shadow-lg shadow-primary/20"
            >
              前往結帳
            </button>

            <p className="text-xs text-warm-gray text-center mt-3">
              🔒 安全加密結帳 · 隱密包裝配送
            </p>
            <p className="text-xs text-warm-gray text-center mt-1">
              實際運費依結帳時選擇的配送方式計算
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
