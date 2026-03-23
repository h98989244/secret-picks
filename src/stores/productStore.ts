import { create } from 'zustand'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import type { Product, Category } from '@/types'

interface ProductState {
  products: Product[]
  categories: Category[]
  loading: boolean
  initialized: boolean

  fetchProducts: () => Promise<void>
  fetchCategories: () => Promise<void>
  initData: () => Promise<void>

  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'images'>, imageUrls?: string[]) => Promise<Product | null>
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  toggleActive: (id: string) => Promise<void>
}

export const useProductStore = create<ProductState>()((set, get) => ({
  products: [],
  categories: [],
  loading: false,
  initialized: false,

  fetchCategories: async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order')

    if (data) {
      set({ categories: data as Category[] })
    }
  },

  fetchProducts: async () => {
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (!products) return

    // Fetch all images
    const productIds = products.map((p) => p.id)
    const { data: images } = await supabase
      .from('product_images')
      .select('*')
      .in('product_id', productIds)
      .order('sort_order')

    // Merge images into products
    const productsWithImages: Product[] = products.map((p) => ({
      ...p,
      images: (images || []).filter((img) => img.product_id === p.id),
    }))

    set({ products: productsWithImages })
  },

  initData: async () => {
    if (get().initialized) return
    set({ loading: true })
    await Promise.all([get().fetchCategories(), get().fetchProducts()])
    set({ loading: false, initialized: true })
  },

  addProduct: async (productData, imageUrls) => {
    const { data, error } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single()

    if (error || !data) return null

    const product = data as Product
    product.images = []

    // Insert images
    if (imageUrls && imageUrls.length > 0) {
      const imageRows = imageUrls.map((url, i) => ({
        product_id: product.id,
        image_url: url,
        sort_order: i,
        is_primary: i === 0,
      }))

      const { data: imgs } = await supabase
        .from('product_images')
        .insert(imageRows)
        .select()

      if (imgs) product.images = imgs
    }

    set({ products: [product, ...get().products] })
    return product
  },

  updateProduct: async (id, data) => {
    const { images, ...updateData } = data as any
    const cleanData = { ...updateData }
    delete cleanData.id
    delete cleanData.created_at
    cleanData.updated_at = new Date().toISOString()

    await supabaseAdmin.from('products').update(cleanData).eq('id', id)

    set({
      products: get().products.map((p) =>
        p.id === id ? { ...p, ...data, updated_at: new Date().toISOString() } : p
      ),
    })
  },

  deleteProduct: async (id) => {
    await supabaseAdmin.from('product_images').delete().eq('product_id', id)
    await supabaseAdmin.from('products').delete().eq('id', id)

    set({ products: get().products.filter((p) => p.id !== id) })
  },

  toggleActive: async (id) => {
    const product = get().products.find((p) => p.id === id)
    if (!product) return

    const newActive = !product.is_active
    await supabaseAdmin.from('products').update({ is_active: newActive }).eq('id', id)

    set({
      products: get().products.map((p) =>
        p.id === id ? { ...p, is_active: newActive } : p
      ),
    })
  },
}))
