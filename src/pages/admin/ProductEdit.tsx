import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Save, ArrowLeft, ImagePlus, X } from 'lucide-react'
import { useProductStore } from '@/stores/productStore'

const placeholderImg = 'https://placehold.co/400x400/E8A0B4/8B2252?text=SecretPicks'

export default function ProductEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const products = useProductStore((s) => s.products)
  const categories = useProductStore((s) => s.categories)
  const addProduct = useProductStore((s) => s.addProduct)
  const updateProduct = useProductStore((s) => s.updateProduct)
  const isNew = id === 'new'
  const existing = !isNew ? products.find((p) => p.id === id) : null

  const [form, setForm] = useState({
    name: '',
    sku: '',
    slug: '',
    description: '',
    short_desc: '',
    price: 0,
    sale_price: '' as string | number,
    category_id: categories[0]?.id || '',
    brand: 'SecretPicks',
    stock: 0,
    is_active: true,
    is_featured: false,
    image_url: placeholderImg,
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (existing) {
      setForm({
        name: existing.name,
        sku: existing.sku,
        slug: existing.slug,
        description: existing.description,
        short_desc: existing.short_desc,
        price: existing.price,
        sale_price: existing.sale_price ?? '',
        category_id: existing.category_id,
        brand: existing.brand,
        stock: existing.stock,
        is_active: existing.is_active,
        is_featured: existing.is_featured,
        image_url: existing.images[0]?.image_url || placeholderImg,
      })
    }
  }, [existing])

  const handleChange = (field: string, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, '-')

    if (isNew) {
      const result = await addProduct(
        {
          sku: form.sku,
          name: form.name,
          slug,
          description: form.description,
          short_desc: form.short_desc,
          price: Number(form.price),
          sale_price: form.sale_price !== '' ? Number(form.sale_price) : null,
          category_id: form.category_id,
          brand: form.brand,
          stock: Number(form.stock),
          is_active: form.is_active,
          is_featured: form.is_featured,
        },
        form.image_url ? [form.image_url] : []
      )
      if (!result) return
    } else if (id) {
      await updateProduct(id, {
        name: form.name,
        sku: form.sku,
        slug,
        description: form.description,
        short_desc: form.short_desc,
        price: Number(form.price),
        sale_price: form.sale_price !== '' ? Number(form.sale_price) : null,
        category_id: form.category_id,
        brand: form.brand,
        stock: Number(form.stock),
        is_active: form.is_active,
        is_featured: form.is_featured,
      })
    }

    setSaved(true)
    setTimeout(() => navigate('/admin/products'), 1000)
  }

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/admin/products')}
          className="p-2 text-warm-gray hover:text-navy transition-colors cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-serif text-2xl font-bold text-navy">
          {isNew ? '新增商品' : '編輯商品'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
              <h2 className="font-medium text-navy">基本資訊</h2>

              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">商品名稱 *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy mb-1.5">SKU 編號 *</label>
                  <input
                    type="text"
                    value={form.sku}
                    onChange={(e) => handleChange('sku', e.target.value)}
                    placeholder="SP-XXX"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-1.5">網址代稱 (slug)</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => handleChange('slug', e.target.value)}
                    placeholder="auto-generated"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">簡短描述</label>
                <input
                  type="text"
                  value={form.short_desc}
                  onChange={(e) => handleChange('short_desc', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">商品描述</label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={5}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y"
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
              <h2 className="font-medium text-navy">價格與庫存</h2>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy mb-1.5">原價 (NT$) *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => handleChange('price', e.target.value)}
                    min={0}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-1.5">特價 (NT$)</label>
                  <input
                    type="number"
                    value={form.sale_price}
                    onChange={(e) => handleChange('sale_price', e.target.value)}
                    min={0}
                    placeholder="留空 = 無特價"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-1.5">庫存數量 *</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => handleChange('stock', e.target.value)}
                    min={0}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
              <h2 className="font-medium text-navy">商品圖片</h2>

              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">圖片網址</label>
                <input
                  type="url"
                  value={form.image_url}
                  onChange={(e) => handleChange('image_url', e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex items-start gap-4">
                {form.image_url ? (
                  <div className="relative w-32 h-32">
                    <img
                      src={form.image_url}
                      alt="preview"
                      className="w-full h-full object-cover rounded-lg border border-gray-100"
                    />
                    <button
                      type="button"
                      onClick={() => handleChange('image_url', '')}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-error text-white rounded-full flex items-center justify-center text-xs cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-warm-gray">
                    <ImagePlus size={24} />
                    <span className="text-xs mt-1">上傳圖片</span>
                  </div>
                )}
                <p className="text-xs text-warm-gray">
                  建議使用 1:1 比例的正方形圖片<br />
                  支援 JPG、PNG、WebP 格式<br />
                  未來可整合 Supabase Storage 上傳
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
              <h2 className="font-medium text-navy">分類與品牌</h2>

              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">商品分類 *</label>
                <select
                  value={form.category_id}
                  onChange={(e) => handleChange('category_id', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">品牌</label>
                <input
                  type="text"
                  value={form.brand}
                  onChange={(e) => handleChange('brand', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h2 className="font-medium text-navy">狀態設定</h2>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => handleChange('is_active', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary"
                />
                <span className="text-sm text-navy">上架販售</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) => handleChange('is_featured', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary"
                />
                <span className="text-sm text-navy">店長推薦（精選）</span>
              </label>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light transition-colors cursor-pointer"
              >
                <Save size={16} />
                {isNew ? '建立商品' : '儲存變更'}
              </button>

              {saved && (
                <p className="text-center text-sm text-success mt-3">
                  儲存成功！正在跳轉...
                </p>
              )}

              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="w-full mt-2 py-2.5 text-sm text-warm-gray hover:text-navy transition-colors cursor-pointer"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
