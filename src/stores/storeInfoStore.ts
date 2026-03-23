import { create } from 'zustand'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import type { StoreInfo } from '@/types'

const defaultInfo: StoreInfo = {
  id: '',
  email: 'service@secretpicks.com',
  phone: '02-2345-6789',
  address: '台北市大安區忠孝東路四段100號5樓',
  tax_id: '12345678',
  updated_at: new Date().toISOString(),
}

interface StoreInfoState {
  info: StoreInfo
  loading: boolean
  initialized: boolean
  fetchInfo: () => Promise<void>
  updateInfo: (data: Partial<StoreInfo>) => Promise<void>
}

export const useStoreInfoStore = create<StoreInfoState>()((set, get) => ({
  info: defaultInfo,
  loading: false,
  initialized: false,

  fetchInfo: async () => {
    if (get().initialized) return
    set({ loading: true })

    const { data } = await supabase
      .from('store_info')
      .select('*')
      .limit(1)
      .single()

    if (data) {
      set({ info: data as StoreInfo, loading: false, initialized: true })
    } else {
      set({ loading: false, initialized: true })
    }
  },

  updateInfo: async (data) => {
    const currentId = get().info.id
    const updateData = { ...data, updated_at: new Date().toISOString() }

    if (currentId) {
      const { error } = await supabaseAdmin.from('store_info').update(updateData).eq('id', currentId)
      if (error) {
        console.error('Failed to update store info:', error.message)
        return
      }
    }

    set({ info: { ...get().info, ...updateData } as StoreInfo, initialized: false })
  },
}))
