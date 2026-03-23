import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { useProductStore } from '@/stores/productStore'
import { formatPrice } from '@/lib/utils'

export default function ProductList() {
  const products = useProductStore((s) => s.products)
  const deleteProduct = useProductStore((s) => s.deleteProduct)
  const toggleActive = useProductStore((s) => s.toggleActive)
  const [search, setSearch] = useState('')

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="font-serif text-2xl font-bold text-navy">商品管理</h1>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-light transition-colors no-underline"
        >
          <Plus size={16} />
          新增商品
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜尋商品名稱或 SKU..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-5 py-3 text-warm-gray font-medium">商品</th>
                <th className="text-left px-5 py-3 text-warm-gray font-medium">SKU</th>
                <th className="text-right px-5 py-3 text-warm-gray font-medium">原價</th>
                <th className="text-right px-5 py-3 text-warm-gray font-medium">特價</th>
                <th className="text-center px-5 py-3 text-warm-gray font-medium">庫存</th>
                <th className="text-center px-5 py-3 text-warm-gray font-medium">狀態</th>
                <th className="text-center px-5 py-3 text-warm-gray font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0]?.image_url}
                        alt={product.name}
                        className="w-10 h-10 rounded object-cover border border-gray-100"
                      />
                      <span className="font-medium text-navy line-clamp-1">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-warm-gray">{product.sku}</td>
                  <td className="px-5 py-3 text-right text-navy">{formatPrice(product.price)}</td>
                  <td className="px-5 py-3 text-right">
                    {product.sale_price ? (
                      <span className="text-sale font-medium">{formatPrice(product.sale_price)}</span>
                    ) : (
                      <span className="text-warm-gray">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={product.stock <= 10 ? 'text-warning font-medium' : 'text-navy'}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <button
                      onClick={() => toggleActive(product.id)}
                      className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full cursor-pointer ${
                        product.is_active
                          ? 'bg-success/10 text-success'
                          : 'bg-gray-100 text-warm-gray'
                      }`}
                    >
                      {product.is_active ? <Eye size={12} /> : <EyeOff size={12} />}
                      {product.is_active ? '上架' : '下架'}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Link
                        to={`/admin/products/${product.id}`}
                        className="p-2 text-warm-gray hover:text-primary transition-colors rounded hover:bg-primary-bg"
                        title="編輯"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => {
                          if (window.confirm(`確定要刪除「${product.name}」嗎？`))
                            deleteProduct(product.id)
                        }}
                        className="p-2 text-warm-gray hover:text-error transition-colors rounded hover:bg-red-50 cursor-pointer"
                        title="刪除"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-warm-gray">
            <p>沒有找到商品</p>
          </div>
        )}
      </div>

      <p className="text-xs text-warm-gray mt-4">共 {filtered.length} 件商品</p>
    </div>
  )
}
