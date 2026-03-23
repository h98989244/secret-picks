import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { UserProfile } from '@/types'

interface AuthState {
  // Admin state (kept for backward compat)
  isAdmin: boolean
  adminEmail: string | null

  // Customer state
  user: UserProfile | null
  isLoggedIn: boolean
  loading: boolean
  error: string | null

  // Admin actions
  login: (email: string, password: string) => boolean
  logout: () => void

  // Customer actions
  customerSignUp: (email: string, password: string, name: string, phone: string) => Promise<boolean>
  customerLogin: (email: string, password: string) => Promise<boolean>
  customerLogout: () => Promise<void>
  restoreSession: () => Promise<void>
  clearError: () => void
}

const ADMIN_EMAIL = 'admin@secretpicks.com'
const ADMIN_PASSWORD = 'admin123'

export const useAuthStore = create<AuthState>()((set) => ({
  // Admin
  isAdmin: false,
  adminEmail: null,

  // Customer
  user: null,
  isLoggedIn: false,
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  // Admin login (unchanged)
  login: (email, password) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      set({ isAdmin: true, adminEmail: email })
      return true
    }
    return false
  },

  logout: () => set({ isAdmin: false, adminEmail: null }),

  // Customer sign up
  customerSignUp: async (email, password, name, phone) => {
    set({ loading: true, error: null })

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, phone },
        emailRedirectTo: window.location.origin,
      },
    })

    if (error) {
      const msg = error.message === 'User already registered'
        ? '此 Email 已註冊，請直接登入。'
        : `註冊失敗：${error.message}`
      set({ loading: false, error: msg })
      return false
    }

    if (data.user) {
      // If session exists, user is auto-confirmed
      if (data.session) {
        set({
          loading: false,
          user: {
            id: data.user.id,
            email: data.user.email || email,
            name: data.user.user_metadata?.name || name,
            phone: data.user.user_metadata?.phone || phone,
            created_at: data.user.created_at,
          },
          isLoggedIn: true,
        })
        return true
      }

      // If no session, email confirmation may be required
      // Try to sign in immediately (works if autoconfirm is enabled in Supabase settings)
      const { data: loginData } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (loginData?.user) {
        set({
          loading: false,
          user: {
            id: loginData.user.id,
            email: loginData.user.email || email,
            name: loginData.user.user_metadata?.name || name,
            phone: loginData.user.user_metadata?.phone || phone,
            created_at: loginData.user.created_at,
          },
          isLoggedIn: true,
        })
        return true
      }

      // Email confirmation is required
      set({
        loading: false,
        error: '註冊成功！請至您的信箱確認 Email 後再登入。',
      })
      return false
    }

    set({ loading: false, error: '註冊失敗，請稍後再試。' })
    return false
  },

  // Customer login
  customerLogin: async (email, password) => {
    set({ loading: true, error: null })

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      const msg = error.message === 'Invalid login credentials'
        ? '帳號或密碼錯誤，請重新輸入。'
        : '登入失敗，請稍後再試。'
      set({ loading: false, error: msg })
      return false
    }

    if (data.user) {
      set({
        loading: false,
        user: {
          id: data.user.id,
          email: data.user.email || email,
          name: data.user.user_metadata?.name || '',
          phone: data.user.user_metadata?.phone || '',
          created_at: data.user.created_at,
        },
        isLoggedIn: true,
      })
      return true
    }

    set({ loading: false, error: '登入失敗。' })
    return false
  },

  // Customer logout
  customerLogout: async () => {
    await supabase.auth.signOut()
    set({ user: null, isLoggedIn: false })
  },

  // Restore session on page load
  restoreSession: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      set({
        user: {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || '',
          phone: session.user.user_metadata?.phone || '',
          created_at: session.user.created_at,
        },
        isLoggedIn: true,
      })
    }
  },
}))
