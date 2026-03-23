import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useStoreInfoStore } from '@/stores/storeInfoStore'

interface FaqItem {
  q: string
  a: string
}

const faqs: Record<string, FaqItem[]> = {
  '購物相關': [
    {
      q: '如何下訂單？',
      a: '選擇您喜歡的商品後，點擊「加入購物車」，確認購物車內容後點擊「前往結帳」，填寫收件資訊與付款方式即可完成訂購。',
    },
    {
      q: '可以不註冊會員就購買嗎？',
      a: '目前需要註冊會員才能購買商品。註冊僅需提供 Email 或手機號碼，過程簡單快速，也方便您後續查詢訂單。',
    },
    {
      q: '商品售價含稅嗎？',
      a: '是的，本站所有商品標示價格皆為含稅價格，結帳時不會額外加收稅金。',
    },
    {
      q: '有提供優惠券嗎？',
      a: '我們不定期推出優惠活動與折扣碼，請關注首頁公告或訂閱電子報，即可第一時間獲得優惠資訊。',
    },
  ],
  '配送與物流': [
    {
      q: '出貨需要多久？',
      a: '付款完成後，我們將於 1-3 個工作天內出貨（不含例假日）。急件需求請聯繫客服協助處理。',
    },
    {
      q: '運費怎麼計算？',
      a: '消費滿 NT$ 999 享全台免運。未達免運門檻，宅配運費為 NT$ 80，超商取貨運費為 NT$ 60。',
    },
    {
      q: '可以選擇超商取貨嗎？',
      a: '可以，我們支援 7-11 及全家超商取貨。結帳時選擇超商取貨，並選擇方便的門市即可。',
    },
    {
      q: '包裹外觀會不會看出是情趣用品？',
      a: '絕對不會。我們採用素面牛皮紙箱，外箱無任何品牌名稱或情趣相關字樣，寄件人名稱顯示為中性名稱，完全保障您的隱私。',
    },
  ],
  '退換貨相關': [
    {
      q: '可以退換貨嗎？',
      a: '依據消費者保護法，商品享有 7 天鑑賞期（非試用期）。未拆封且保持完好狀態的商品可申請退換貨。已拆封或使用過的商品，基於衛生考量恕不接受退換。',
    },
    {
      q: '退款多久會入帳？',
      a: '退貨商品經檢查確認後，退款將於 3-5 個工作天匯入您指定的銀行帳戶。',
    },
    {
      q: '商品有保固嗎？',
      a: '電動類商品享有 6 個月保固服務。保固期間如因非人為因素導致故障，可免費維修或更換。請保留購買證明以利保固服務。',
    },
  ],
  '帳戶與隱私': [
    {
      q: '忘記密碼怎麼辦？',
      a: '在登入頁面點擊「忘記密碼」，輸入您的註冊信箱或手機號碼，系統會發送重設密碼的連結給您。',
    },
    {
      q: 'ATM 轉帳或超商繳費的帳戶名稱會顯示什麼？',
      a: '轉帳帳戶及超商繳費單上的收款名稱將顯示為「生活百貨」等中性名稱，不會出現任何與情趣用品相關的字樣。',
    },
    {
      q: '我的個人資料安全嗎？',
      a: '我們採用 SSL 加密技術保護所有資料傳輸，資料庫亦採用嚴格的存取權限控管。詳細內容請參閱隱私政策頁面。',
    },
  ],
}

export default function Faq() {
  const info = useStoreInfoStore((s) => s.info)
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  const toggle = (key: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <p className="text-gold text-sm tracking-widest uppercase mb-3">FAQ</p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy mb-4">常見問題</h1>
        <div className="w-16 h-0.5 bg-gold mx-auto mb-6" />
        <p className="text-warm-gray">找不到答案？請聯繫客服 {info.email}</p>
      </div>

      <div className="space-y-10">
        {Object.entries(faqs).map(([category, items]) => (
          <section key={category}>
            <h2 className="font-serif text-xl font-bold text-navy mb-4">{category}</h2>
            <div className="space-y-2">
              {items.map((item) => {
                const key = `${category}-${item.q}`
                const isOpen = openItems.has(key)
                return (
                  <div key={key} className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                    <button
                      onClick={() => toggle(key)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer hover:bg-gray-50/50 transition-colors"
                    >
                      <span className="text-sm font-medium text-navy pr-4">{item.q}</span>
                      <ChevronDown
                        size={16}
                        className={`text-warm-gray shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4">
                        <p className="text-sm text-warm-gray leading-relaxed">{item.a}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
