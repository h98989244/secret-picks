import type { Product } from '@/types'
import ProductCard from './ProductCard'

interface Props {
  products: Product[]
  title?: string
  subtitle?: string
}

export default function ProductGrid({ products, title, subtitle }: Props) {
  return (
    <section>
      {title && (
        <div className="text-center mb-6">
          <h2 className="font-serif text-2xl font-bold text-navy">{title}</h2>
          {subtitle && <p className="text-warm-gray text-sm mt-1">{subtitle}</p>}
          <div className="w-16 h-0.5 bg-gold mx-auto mt-3" />
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
