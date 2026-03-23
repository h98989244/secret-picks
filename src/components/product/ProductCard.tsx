import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import type { Product } from '@/types'
import { formatPrice, getDiscountPercent } from '@/lib/utils'
import { useCartStore } from '@/stores/cartStore'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem)
  const primaryImage = product.images.find((i) => i.is_primary)?.image_url || product.images[0]?.image_url

  return (
    <div className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-gray-100">
      <Link to={`/product/${product.slug}`} className="block no-underline">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {product.sale_price && (
            <span className="absolute top-2 left-2 bg-sale text-white text-xs px-2 py-1 rounded font-bold">
              -{getDiscountPercent(product.price, product.sale_price)}%
            </span>
          )}
          {product.is_featured && (
            <span className="absolute top-2 right-2 bg-gold text-white text-xs px-2 py-1 rounded font-bold">
              精選
            </span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="absolute bottom-2 left-2 bg-warning text-white text-xs px-2 py-1 rounded">
              即將售罄
            </span>
          )}
        </div>
      </Link>

      <div className="p-3 md:p-4">
        <p className="text-xs text-warm-gray mb-1">SKU: {product.sku}</p>
        <Link to={`/product/${product.slug}`} className="no-underline">
          <h3 className="font-sans text-sm font-medium text-navy line-clamp-2 min-h-[2.5rem] hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          {product.sale_price ? (
            <>
              <span className="text-sale font-bold text-lg">{formatPrice(product.sale_price)}</span>
              <span className="text-warm-gray text-xs line-through">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="text-navy font-bold text-lg">{formatPrice(product.price)}</span>
          )}
        </div>

        <button
          onClick={() => addItem(product)}
          disabled={product.stock === 0}
          className="w-full py-2 px-4 bg-primary text-white text-sm rounded-lg hover:bg-primary-light transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
        >
          <ShoppingBag size={14} />
          {product.stock === 0 ? '已售完' : '加入購物車'}
        </button>
      </div>
    </div>
  )
}
