import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingBag, Zap, ShieldCheck, Truck, Minus, Plus } from 'lucide-react'
import { useProductStore } from '@/stores/productStore'
import { useCartStore } from '@/stores/cartStore'
import { formatPrice, getDiscountPercent } from '@/lib/utils'
import ProductGrid from '@/components/product/ProductGrid'

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const products = useProductStore((s) => s.products)
  const categories = useProductStore((s) => s.categories)
  const addItem = useCartStore((s) => s.addItem)

  const product = products.find((p) => p.slug === slug && p.is_active)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'desc' | 'guide'>('desc')

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-warm-gray text-lg">找不到此商品</p>
        <Link to="/category/all" className="text-primary mt-4 inline-block no-underline">← 返回商品列表</Link>
      </div>
    )
  }

  const category = categories.find((c) => c.id === product.category_id)
  const related = products.filter((p) => p.category_id === product.category_id && p.id !== product.id && p.is_active).slice(0, 4)
  const primaryImage = product.images.find((i) => i.is_primary)?.image_url || product.images[0]?.image_url

  const handleAddToCart = () => {
    addItem(product, quantity)
    setQuantity(1)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-warm-gray mb-6">
        <Link to="/" className="hover:text-primary no-underline text-warm-gray">首頁</Link>
        <span className="mx-2">/</span>
        {category && (
          <>
            <Link to={`/category/${category.slug}`} className="hover:text-primary no-underline text-warm-gray">{category.name}</Link>
            <span className="mx-2">/</span>
          </>
        )}
        <span className="text-navy">{product.name}</span>
      </nav>

      {/* Product info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Image */}
        <div className="aspect-square bg-white rounded-xl overflow-hidden border border-gray-100">
          <img src={primaryImage} alt={product.name} className="w-full h-full object-cover" />
        </div>

        {/* Info */}
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy mb-2">{product.name}</h1>
          <p className="text-sm text-warm-gray mb-4">商品編號：{product.sku}</p>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            {product.sale_price ? (
              <>
                <span className="text-3xl font-bold text-sale">{formatPrice(product.sale_price)}</span>
                <span className="text-lg text-warm-gray line-through">{formatPrice(product.price)}</span>
                <span className="text-xs bg-sale/10 text-sale px-2 py-1 rounded font-medium">
                  省 {getDiscountPercent(product.price, product.sale_price)}%
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold text-navy">{formatPrice(product.price)}</span>
            )}
          </div>

          {/* Warranty */}
          <div className="flex items-center gap-2 text-sm text-success mb-4">
            <ShieldCheck size={16} />
            <span>6 個月保固</span>
          </div>

          <p className="text-warm-gray text-sm mb-6 leading-relaxed">{product.short_desc}</p>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm text-navy font-medium">數量</span>
            <div className="flex items-center border border-gray-200 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-gray-50 text-navy cursor-pointer"
              >
                <Minus size={16} />
              </button>
              <span className="px-4 py-2 min-w-[3rem] text-center text-sm font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="p-2 hover:bg-gray-50 text-navy cursor-pointer"
              >
                <Plus size={16} />
              </button>
            </div>
            <span className="text-xs text-warm-gray">庫存 {product.stock} 件</span>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-primary text-primary rounded-lg font-medium hover:bg-primary-bg transition-colors cursor-pointer"
            >
              <ShoppingBag size={18} />
              加入購物車
            </button>
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-light transition-colors cursor-pointer shadow-lg shadow-primary/20"
            >
              <Zap size={18} />
              立即購買
            </button>
          </div>

          {/* Shipping info */}
          <div className="space-y-2 p-4 bg-primary-bg rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Truck size={14} className="text-primary" />
              <span className="text-navy">全台免運費 · 1-3 天送達</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <ShieldCheck size={14} className="text-primary" />
              <span className="text-navy font-medium">隱密包裝：外箱無任何情趣字樣，保障您的隱私</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <div className="flex border-b border-gray-200">
          {[
            { key: 'desc', label: '商品描述' },
            { key: 'guide', label: '購物說明' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`px-6 py-3 text-sm font-medium transition-colors cursor-pointer ${
                activeTab === tab.key
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-warm-gray hover:text-navy'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="py-6">
          {activeTab === 'desc' && (
            <div className="prose prose-sm max-w-none text-warm-gray leading-relaxed whitespace-pre-line">
              {product.description}
            </div>
          )}
          {activeTab === 'guide' && (
            <div className="text-sm text-warm-gray space-y-3">
              <p>・享有7天鑑賞期（非試用期），商品未拆封可辦理退換貨</p>
              <p>・已拆封或使用過之商品，基於衛生考量恕不接受退換</p>
              <p>・商品享有6個月保固服務</p>
              <p>・如有瑕疵請於收貨後3日內聯繫客服</p>
            </div>
          )}
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-12">
          <ProductGrid products={related} title="相關商品推薦" />
        </div>
      )}
    </div>
  )
}
