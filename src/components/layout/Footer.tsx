import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'
import { useStoreInfoStore } from '@/stores/storeInfoStore'

export default function Footer() {
  const info = useStoreInfoStore((s) => s.info)

  return (
    <footer className="bg-navy text-white/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="秘境選物" className="w-8 h-8 rounded-full object-cover" />
              <span className="font-serif text-lg font-bold text-white">秘境選物</span>
            </div>
            <p className="text-sm leading-relaxed text-white/60">
              優雅私密的情趣用品精選電商。<br />
              嚴選好物，隱密包裝，安心購物。
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-serif text-gold text-sm font-bold mb-4">關於我們</h4>
            <ul className="space-y-2 text-sm list-none p-0">
              <li><Link to="/about" className="text-white/60 hover:text-gold transition-colors no-underline">品牌故事</Link></li>
              <li><Link to="/guide" className="text-white/60 hover:text-gold transition-colors no-underline">購物須知</Link></li>
              <li><Link to="/privacy" className="text-white/60 hover:text-gold transition-colors no-underline">隱私政策</Link></li>
              <li><Link to="/faq" className="text-white/60 hover:text-gold transition-colors no-underline">常見問題</Link></li>
            </ul>
          </div>

          {/* Customer service */}
          <div>
            <h4 className="font-serif text-gold text-sm font-bold mb-4">顧客服務</h4>
            <ul className="space-y-2 text-sm list-none p-0">
              <li><Link to="/order/track" className="text-white/60 hover:text-gold transition-colors no-underline">訂單查詢</Link></li>
              <li><Link to="/return-policy" className="text-white/60 hover:text-gold transition-colors no-underline">退換貨政策</Link></li>
              <li><Link to="/shipping" className="text-white/60 hover:text-gold transition-colors no-underline">配送說明</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-gold text-sm font-bold mb-4">聯絡我們</h4>
            <ul className="space-y-3 text-sm list-none p-0">
              <li className="flex items-center gap-2 text-white/60">
                <Mail size={14} className="text-gold shrink-0" />
                {info.email}
              </li>
              <li className="flex items-center gap-2 text-white/60">
                <Phone size={14} className="text-gold shrink-0" />
                {info.phone}
              </li>
              <li className="flex items-start gap-2 text-white/60">
                <MapPin size={14} className="text-gold shrink-0 mt-0.5" />
                {info.address}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/40">
              統一編號：{info.tax_id} | © 2026 秘境選物 All rights reserved.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/40">付款方式：</span>
              {['ATM 轉帳', '超商代碼'].map((m) => (
                <span key={m} className="text-xs px-2 py-1 bg-white/10 rounded text-white/50">{m}</span>
              ))}
            </div>
          </div>
          <p className="text-center text-xs text-white/30 mt-4">
            ⚠️ 本網站商品僅供年滿18歲之成人選購 | 外包裝無任何情趣字樣，保障您的隱私
          </p>
        </div>
      </div>
    </footer>
  )
}
