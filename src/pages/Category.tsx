import { useState, useMemo } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { SlidersHorizontal, ChevronDown } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import { useProductStore } from '@/stores/productStore'

type SortType = 'default' | 'price-asc' | 'price-desc' | 'newest'

export default function Category() {
  const { slug } = useParams<{ slug: string }>()
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')?.toLowerCase() || ''

  const products = useProductStore((s) => s.products)
  const categories = useProductStore((s) => s.categories)
  const [sort, setSort] = useState<SortType>('default')
  const [showFilter, setShowFilter] = useState(false)

  const currentCategory = slug !== 'all' ? categories.find((c) => c.slug === slug) : null
  const pageTitle = currentCategory?.name || (query ? `搜尋「${searchParams.get('q')}」` : '全部商品')

  const filtered = useMemo(() => {
    let result = products.filter((p) => p.is_active)

    if (currentCategory) {
      result = result.filter((p) => p.category_id === currentCategory.id)
    }

    if (query) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query)
      )
    }

    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => (a.sale_price ?? a.price) - (b.sale_price ?? b.price))
        break
      case 'price-desc':
        result.sort((a, b) => (b.sale_price ?? b.price) - (a.sale_price ?? a.price))
        break
      case 'newest':
        result.sort((a, b) => b.created_at.localeCompare(a.created_at))
        break
    }

    return result
  }, [products, currentCategory, query, sort])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-warm-gray mb-6">
        <Link to="/" className="hover:text-primary cursor-pointer no-underline text-warm-gray">首頁</Link>
        <span className="mx-2">/</span>
        <span className="text-navy font-medium">{pageTitle}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar - desktop */}
        <aside className="hidden lg:block w-56 shrink-0">
          <h3 className="font-serif text-lg font-bold text-navy mb-4">商品分類</h3>
          <ul className="space-y-1 list-none p-0">
            <li>
              <Link
                to="/category/all"
                className={`block px-3 py-2 rounded text-sm transition-colors no-underline ${
                  !currentCategory ? 'bg-primary text-white' : 'text-navy hover:bg-primary-bg'
                }`}
              >
                全部商品
              </Link>
            </li>
            {categories.filter(c => c.is_active).map((cat) => (
              <li key={cat.id}>
                <Link
                  to={`/category/${cat.slug}`}
                  className={`block px-3 py-2 rounded text-sm transition-colors no-underline ${
                    currentCategory?.id === cat.id ? 'bg-primary text-white' : 'text-navy hover:bg-primary-bg'
                  }`}
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-serif text-2xl font-bold text-navy">{pageTitle}</h1>
            <div className="flex items-center gap-3">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="lg:hidden flex items-center gap-1 text-sm text-warm-gray border border-gray-200 px-3 py-2 rounded-lg"
              >
                <SlidersHorizontal size={14} /> 篩選
              </button>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortType)}
                  className="appearance-none text-sm border border-gray-200 px-3 py-2 pr-8 rounded-lg bg-white text-navy focus:outline-none focus:border-primary"
                >
                  <option value="default">綜合排序</option>
                  <option value="price-asc">價格低到高</option>
                  <option value="price-desc">價格高到低</option>
                  <option value="newest">最新上架</option>
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-warm-gray pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Mobile filter */}
          {showFilter && (
            <div className="lg:hidden mb-6 p-4 bg-white rounded-lg border border-gray-100">
              <h3 className="font-medium text-sm text-navy mb-3">商品分類</h3>
              <div className="flex flex-wrap gap-2">
                <Link
                  to="/category/all"
                  className={`text-xs px-3 py-1.5 rounded-full no-underline ${
                    !currentCategory ? 'bg-primary text-white' : 'bg-gray-100 text-navy'
                  }`}
                >
                  全部
                </Link>
                {categories.filter(c => c.is_active).map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    className={`text-xs px-3 py-1.5 rounded-full no-underline ${
                      currentCategory?.id === cat.id ? 'bg-primary text-white' : 'bg-gray-100 text-navy'
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Results count */}
          <p className="text-sm text-warm-gray mb-4">共 {filtered.length} 件商品</p>

          {/* Product grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-warm-gray text-lg">沒有找到符合條件的商品</p>
              <Link to="/category/all" className="text-primary text-sm mt-2 inline-block no-underline">
                瀏覽全部商品 →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
