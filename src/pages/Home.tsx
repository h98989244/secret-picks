import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Truck, ShieldCheck, Gift } from 'lucide-react'
import ProductGrid from '@/components/product/ProductGrid'
import { useProductStore } from '@/stores/productStore'

export default function Home() {
  const allProducts = useProductStore((s) => s.products)
  const products = useMemo(() => allProducts.filter((p) => p.is_active), [allProducts])
  const featured = useMemo(() => products.filter((p) => p.is_featured).slice(0, 4), [products])

  // Shuffle helper — pick random items from different categories
  const shuffle = (arr: typeof products) => {
    const shuffled = [...arr].sort(() => Math.random() - 0.5)
    return shuffled
  }

  const newest = useMemo(() => shuffle(products).slice(0, 4), [products])
  const hot = useMemo(() => shuffle(products).slice(0, 8), [products])

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative bg-navy overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-[#2D1B3D] to-navy" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32 text-center">
          <p className="text-gold text-sm tracking-widest uppercase mb-4">Elegant • Private • Curated</p>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-white mb-6">
            秘境選物
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-lg mx-auto mb-8">
            優雅私密的情趣用品精選電商<br />
            嚴選好物，隱密包裝，安心探索
          </p>
          <Link
            to="/category/all"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-medium hover:bg-primary-light transition-colors shadow-lg shadow-primary/30 no-underline"
          >
            探索商品 <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      {/* Trust badges */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {[
              { icon: ShieldCheck, title: '隱密包裝', desc: '外箱無任何情趣字樣' },
              { icon: Truck, title: '全台免運', desc: '消費滿 $999 享免運' },
              { icon: Gift, title: '滿額好禮', desc: '消費滿 $1,000 送精美小禮品' },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3 justify-center md:justify-start">
                <div className="w-10 h-10 rounded-full bg-primary-bg flex items-center justify-center shrink-0">
                  <item.icon size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm text-navy">{item.title}</p>
                  <p className="text-xs text-warm-gray">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <ProductGrid products={featured} title="店長推薦" subtitle="精選好物，為您嚴選" />
        <div className="text-center mt-6">
          <Link
            to="/category/all"
            className="text-primary text-sm hover:text-primary-light transition-colors inline-flex items-center gap-1 no-underline"
          >
            查看更多 <ChevronRight size={14} />
          </Link>
        </div>
      </section>

      {/* New arrivals */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <ProductGrid products={newest} title="新品上架" subtitle="最新商品搶先看" />
        </div>
      </section>

      {/* Hot products */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <ProductGrid products={hot} title="熱門商品" subtitle="大家都在買" />
      </section>

      {/* Promo banner */}
      <section className="bg-gradient-to-r from-primary to-primary-light text-white">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p className="font-serif text-xl md:text-2xl font-bold">
            🎁 消費滿 1,000 元送精美小禮品！
          </p>
          <p className="text-white/80 text-sm mt-2">活動期間限定，送完為止</p>
        </div>
      </section>
    </div>
  )
}
