import { useState, useEffect } from 'react'

export default function AgeVerification() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const verified = document.cookie.includes('age_verified=true')
    if (!verified) setShow(true)
  }, [])

  const handleVerify = () => {
    const expires = new Date()
    expires.setDate(expires.getDate() + 7)
    document.cookie = `age_verified=true; expires=${expires.toUTCString()}; path=/`
    setShow(false)
  }

  const handleLeave = () => {
    window.location.href = 'https://www.google.com'
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Background with candle-like ambiance */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #1A1A2E 0%, #2D1B3D 30%, #1A1A2E 60%, #0F0F1A 100%)',
        }}
      >
        {/* Warm glow spots */}
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-orange-400/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Content card */}
      <div className="relative z-10 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-12 max-w-md mx-4 text-center">
        {/* Logo */}
        <img src="/logo.png" alt="秘境選物" className="w-20 h-20 rounded-full object-cover mx-auto mb-6" />

        <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy mb-3">
          本網站包含成人商品，
          <br />
          請確認您已滿18歲
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <button
            onClick={handleLeave}
            className="flex-1 px-6 py-3 rounded-lg border-2 border-warm-gray/30 text-warm-gray font-medium text-sm hover:bg-gray-50 transition-colors cursor-pointer"
          >
            我未滿18歲，離開
          </button>
          <button
            onClick={handleVerify}
            className="flex-1 px-6 py-3 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary-light transition-colors cursor-pointer shadow-lg shadow-primary/25"
          >
            我已滿18歲，進入網站
          </button>
        </div>

        <p className="text-xs text-warm-gray mt-6">
          請注意：本網站內容僅適用於年滿18歲之人士。
        </p>

        <p className="text-primary font-serif text-sm font-bold mt-4">秘境選物</p>
      </div>
    </div>
  )
}
