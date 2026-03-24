import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { Partner } from '@/types'

interface PartnerState {
  partners: Partner[]
  loading: boolean
  initialized: boolean
  fetchPartners: () => Promise<void>
}

export const usePartnerStore = create<PartnerState>()((set, get) => ({
  partners: [],
  loading: false,
  initialized: false,

  fetchPartners: async () => {
    if (get().initialized) return
    set({ loading: true })

    const { data } = await supabase
      .from('partners')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')

    set({
      partners: (data as Partner[]) || [],
      loading: false,
      initialized: true,
    })
  },
}))
