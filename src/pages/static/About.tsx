import { Heart, ShieldCheck, Sparkles, Eye } from 'lucide-react'

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <p className="text-gold text-sm tracking-widest uppercase mb-3">Our Story</p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy mb-4">品牌故事</h1>
        <div className="w-16 h-0.5 bg-gold mx-auto mb-6" />
        <p className="text-warm-gray leading-relaxed max-w-2xl mx-auto">
          秘境選物，成立於 2026 年 2 月，是一間以「優雅、私密、精選」為核心理念的情趣用品電商平台。
        </p>
      </div>

      {/* Origin story */}
      <section className="mb-16">
        <h2 className="font-serif text-2xl font-bold text-navy mb-6">品牌誕生</h2>
        <div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 leading-relaxed text-warm-gray space-y-4">
          <p>
            2026 年 2 月，秘境選物正式創立。我們觀察到台灣的情趣用品市場雖然日趨成熟，但大多數電商平台仍停留在傳統、直白的風格，許多消費者——尤其是女性——在瀏覽與購買時缺乏一個讓人感到安心與舒適的環境。
          </p>
          <p>
            我們相信，探索親密關係是一件美好而自然的事，不應該被尷尬或不安所包圍。於是，秘境選物應運而生——一個如同精品選物店般的空間，讓每一位消費者都能在優雅的氛圍中，自在地探索與選購。
          </p>
          <p>
            從品牌命名到視覺設計，從商品挑選到包裝配送，我們在每一個環節都傾注心力，只為了給您最安心的購物體驗。
          </p>
        </div>
      </section>

      {/* Brand values */}
      <section className="mb-16">
        <h2 className="font-serif text-2xl font-bold text-navy mb-6">品牌理念</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              icon: Eye,
              title: '秘境 — 隱密安心',
              desc: '我們深知隱私對您的重要性。從外包裝無任何情趣字樣、付款帳戶顯示中性商號名稱，到簡訊通知不含敏感商品資訊，全流程守護您的隱私。',
            },
            {
              icon: Sparkles,
              title: '選物 — 嚴選精品',
              desc: '我們不做大量鋪貨，每一件商品都經過嚴格篩選。從材質安全性、使用體驗到設計美感，只有通過我們標準的好物，才會出現在秘境選物上。',
            },
            {
              icon: Heart,
              title: '優雅 — 質感體驗',
              desc: '告別傳統情趣網站的刺激直白，秘境選物以溫暖的色調、精緻的排版和優雅的視覺設計，打造如同逛精品店般的購物氛圍。',
            },
            {
              icon: ShieldCheck,
              title: '信任 — 安全保障',
              desc: '所有商品皆為正品保證，享有完善的售後服務與保固。我們採用 SSL 加密技術保護您的個人資料與交易安全。',
            },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="w-12 h-12 rounded-full bg-primary-bg flex items-center justify-center mb-4">
                <item.icon size={24} className="text-primary" />
              </div>
              <h3 className="font-serif text-lg font-bold text-navy mb-2">{item.title}</h3>
              <p className="text-warm-gray text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="mb-16">
        <h2 className="font-serif text-2xl font-bold text-navy mb-6">品牌大事記</h2>
        <div className="space-y-6">
          {[
            { date: '2026 年 2 月', event: '秘境選物品牌正式成立，開始籌備電商平台開發' },
            { date: '2026 年 3 月', event: '網站開發完成，首批精選商品上架，平台正式上線營運' },
          ].map((item) => (
            <div key={item.date} className="flex gap-4 items-start">
              <div className="w-3 h-3 rounded-full bg-primary mt-1.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-primary">{item.date}</p>
                <p className="text-warm-gray text-sm mt-1">{item.event}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="bg-navy rounded-2xl p-8 md:p-12 text-center">
        <p className="text-gold text-sm tracking-widest uppercase mb-3">Our Mission</p>
        <h2 className="font-serif text-2xl font-bold text-white mb-4">我們的使命</h2>
        <p className="text-white/70 leading-relaxed max-w-xl mx-auto">
          讓每一個人都能在安心、自在、優雅的環境中，探索屬於自己的親密世界。
          秘境選物不只是一間商店，更是一個理解您、尊重您的夥伴。
        </p>
      </section>
    </div>
  )
}
