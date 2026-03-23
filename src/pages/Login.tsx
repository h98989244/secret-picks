import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

export default function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const customerLogin = useAuthStore((s) => s.customerLogin)
  const customerSignUp = useAuthStore((s) => s.customerSignUp)
  const loading = useAuthStore((s) => s.loading)
  const error = useAuthStore((s) => s.error)
  const clearError = useAuthStore((s) => s.clearError)

  const [isRegister, setIsRegister] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [localError, setLocalError] = useState('')

  // If already logged in, redirect
  useEffect(() => {
    if (isLoggedIn) {
      navigate(redirect, { replace: true })
    }
  }, [isLoggedIn, navigate, redirect])

  const toggleMode = () => {
    setIsRegister(!isRegister)
    clearError()
    setLocalError('')
    setPassword('')
    setConfirmPassword('')
  }

  const validate = (): boolean => {
    setLocalError('')

    if (!email.trim()) {
      setLocalError('請輸入電子郵件')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setLocalError('請輸入有效的 Email 格式')
      return false
    }
    if (!password) {
      setLocalError('請輸入密碼')
      return false
    }
    if (password.length < 6) {
      setLocalError('密碼至少需要 6 個字元')
      return false
    }

    if (isRegister) {
      if (!name.trim()) {
        setLocalError('請輸入姓名')
        return false
      }
      if (!phone.trim()) {
        setLocalError('請輸入手機號碼')
        return false
      }
      if (password !== confirmPassword) {
        setLocalError('兩次輸入的密碼不一致')
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    if (isRegister) {
      const success = await customerSignUp(email.trim(), password, name.trim(), phone.trim())
      if (success) {
        navigate(redirect, { replace: true })
      }
    } else {
      const success = await customerLogin(email.trim(), password)
      if (success) {
        navigate(redirect, { replace: true })
      }
    }
  }

  const displayError = localError || error

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="no-underline">
            <img src="/logo.png" alt="秘境選物" className="w-16 h-16 rounded-full object-cover mx-auto mb-4" />
          </Link>
          <h1 className="font-serif text-2xl font-bold text-navy">秘境選物</h1>
          <p className="text-warm-gray text-sm mt-1">優雅私密 · 精選好物</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8">
            <h2 className="font-serif text-lg font-bold text-navy mb-6">
              {isRegister ? '註冊新帳號' : '會員登入'}
            </h2>

            {/* Redirect notice */}
            {redirect === '/checkout' && !isRegister && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
                請先登入或註冊帳號，即可前往結帳。
              </div>
            )}

            {/* Error */}
            {displayError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2 items-start">
                <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{displayError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <>
                  <div>
                    <label className="block text-sm text-navy font-medium mb-1.5">姓名 <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="請輸入您的姓名"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-navy font-medium mb-1.5">手機號碼 <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0912-345-678"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm text-navy font-medium mb-1.5">
                  電子郵件 <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="請輸入電子郵件"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-navy font-medium mb-1.5">密碼 <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isRegister ? '至少 6 個字元' : '請輸入密碼'}
                    className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-gray hover:text-navy cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {isRegister && (
                <div>
                  <label className="block text-sm text-navy font-medium mb-1.5">確認密碼 <span className="text-red-500">*</span></label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="請再次輸入密碼"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary-light transition-colors cursor-pointer shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? (isRegister ? '註冊中...' : '登入中...')
                  : (isRegister ? '立即註冊' : '立即登入')
                }
              </button>
            </form>

            {/* Toggle */}
            <p className="text-center text-sm text-warm-gray mt-6">
              {isRegister ? '已有帳號？' : '還沒有帳號？'}
              <button
                onClick={toggleMode}
                className="text-primary font-medium ml-1 hover:text-primary-light cursor-pointer"
              >
                {isRegister ? '立即登入' : '免費註冊'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
