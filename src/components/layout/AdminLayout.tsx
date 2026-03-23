import { Link, Outlet, useLocation, Navigate } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: '儀表板' },
  { to: '/admin/orders', icon: ShoppingCart, label: '訂單管理' },
  { to: '/admin/products', icon: Package, label: '商品管理' },
  { to: '/admin/settings', icon: Settings, label: '店家資訊' },
]

export default function AdminLayout() {
  const isAdmin = useAuthStore((s) => s.isAdmin)
  const logout = useAuthStore((s) => s.logout)
  const adminEmail = useAuthStore((s) => s.adminEmail)
  const location = useLocation()

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-navy text-white flex flex-col shrink-0">
        <div className="p-5 border-b border-white/10">
          <Link to="/admin/dashboard" className="flex items-center gap-2 no-underline">
            <img src="/logo.png" alt="秘境選物" className="w-8 h-8 rounded-full object-cover" />
            <span className="font-serif text-lg font-bold text-white">管理後台</span>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.to)
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors no-underline ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          <p className="text-xs text-white/40 px-4 mb-2">{adminEmail}</p>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors w-full"
          >
            <LogOut size={18} />
            登出
          </button>
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2 mt-1 rounded-lg text-xs text-white/40 hover:text-white/60 transition-colors no-underline"
          >
            ← 返回前台
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
