import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ShoppingBag, User, Menu, X, LogOut } from 'lucide-react'
import { useCartStore, getTotalItems } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const items = useCartStore((s) => s.items)
  const totalItems = getTotalItems(items)
  const navigate = useNavigate()

  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const user = useAuthStore((s) => s.user)
  const customerLogout = useAuthStore((s) => s.customerLogout)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/category/all?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const handleLogout = async () => {
    await customerLogout()
    setUserMenuOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-primary-soft/30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-navy"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 no-underline">
            <img src="/logo.png" alt="秘境選物" className="w-10 h-10 rounded-full object-cover" />
            <span className="font-serif text-xl md:text-2xl font-bold text-primary hidden sm:block">
              秘境選物
            </span>
          </Link>

          {/* Search bar - desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜尋商品..."
                className="w-full pl-4 pr-10 py-2 rounded-full border border-primary-soft/50 bg-primary-bg/50 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-gray hover:text-primary transition-colors">
                <Search size={18} />
              </button>
            </div>
          </form>

          {/* Right icons */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 p-2 text-primary hover:text-primary-light transition-colors cursor-pointer"
                  title={user?.name || user?.email || '會員'}
                >
                  <User size={22} />
                  <span className="hidden md:inline text-sm font-medium max-w-[80px] truncate">
                    {user?.name || '會員'}
                  </span>
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-navy truncate">{user?.name}</p>
                        <p className="text-xs text-warm-gray truncate">{user?.email}</p>
                      </div>
                      <Link
                        to="/order/track"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-navy hover:bg-gray-50 no-underline"
                      >
                        訂單查詢
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 cursor-pointer text-left"
                      >
                        <LogOut size={14} />
                        登出
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link to="/login" className="p-2 text-navy hover:text-primary transition-colors" title="會員登入">
                <User size={22} />
              </Link>
            )}
            <Link to="/cart" className="relative p-2 text-navy hover:text-primary transition-colors" title="購物車">
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile search */}
        <form onSubmit={handleSearch} className="md:hidden pb-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜尋商品..."
              className="w-full pl-4 pr-10 py-2 rounded-full border border-primary-soft/50 bg-white text-sm focus:outline-none focus:border-primary"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-gray">
              <Search size={18} />
            </button>
          </div>
        </form>
      </div>

      {/* Category Nav */}
      <nav className="bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4">
          <ul className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row items-start md:items-center gap-0 md:gap-1 py-2 md:py-0`}>
            {[
              { name: '全部商品', slug: 'all' },
              { name: '女性玩具', slug: 'female-toys' },
              { name: '男性玩具', slug: 'male-toys' },
              { name: '雙人情趣', slug: 'couples' },
              { name: '潤滑液', slug: 'lubricants' },
              { name: '保險套', slug: 'condoms' },
              { name: '情趣內衣', slug: 'lingerie' },
              { name: '保健護理', slug: 'care' },
            ].map((cat) => (
              <li key={cat.slug}>
                <Link
                  to={`/category/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 text-sm text-white/85 hover:text-gold hover:bg-white/5 rounded transition-colors no-underline whitespace-nowrap"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}
