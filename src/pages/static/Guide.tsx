import { ShoppingBag, Wallet, Truck, PackageCheck, ShieldCheck } from 'lucide-react'

export default function Guide() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <p className="text-gold text-sm tracking-widest uppercase mb-3">Shopping Guide</p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy mb-4">購物須知</h1>
        <div className="w-16 h-0.5 bg-gold mx-auto mb-6" />
        <p className="text-warm-gray">在秘境選物購物，簡單又安心。以下為您說明完整的購物流程。</p>
      </div>

      {/* Steps */}
      <section className="mb-16">
        <h2 className="font-serif text-2xl font-bold text-navy mb-8">購物流程</h2>
        <div className="space-y-6">
          {[
            { icon: ShoppingBag, step: '1', title: '選購商品', desc: '瀏覽商品分類或使用搜尋功能，找到您喜歡的商品。點選「加入購物車」即可將商品放入購物車。您可以繼續選購或前往購物車結帳。' },
            { icon: Wallet, step: '2', title: '填寫訂單', desc: '確認購物車商品與數量後，填寫收件人資訊、選擇配送方式與付款方式。我們支援 ATM 轉帳及超商代碼繳費。' },
            { icon: Truck, step: '3', title: '等待配送', desc: '完成付款後，我們將於 1-3 個工作天內出貨。您可透過訂單查詢功能追蹤物流進度。所有包裹皆採隱密包裝。' },
            { icon: PackageCheck, step: '4', title: '收貨確認', desc: '收到商品後請當場確認外箱是否完好。如有任何問題，請於收貨後 3 日內聯繫客服，我們將為您處理。' },
          ].map((item) => (
            <div key={item.step} className="flex gap-5 bg-white rounded-xl border border-gray-100 p-6">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0">
                <item.icon size={22} className="text-white" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-navy mb-1">
                  Step {item.step}：{item.title}
                </h3>
                <p className="text-warm-gray text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Payment methods */}
      <section className="mb-16">
        <h2 className="font-serif text-2xl font-bold text-navy mb-6">付款方式</h2>
        <div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 text-navy font-medium">付款方式</th>
                  <th className="text-left py-3 text-navy font-medium">說明</th>
                  <th className="text-left py-3 text-navy font-medium">到帳時間</th>
                </tr>
              </thead>
              <tbody className="text-warm-gray">
                <tr className="border-b border-gray-50">
                  <td className="py-3">ATM 轉帳</td>
                  <td className="py-3">取得虛擬帳號後，至 ATM 或網路銀行轉帳</td>
                  <td className="py-3">1-2 小時</td>
                </tr>
                <tr>
                  <td className="py-3">超商代碼</td>
                  <td className="py-3">取得繳費代碼後，至 7-ELEVEN 或全家繳費</td>
                  <td className="py-3">1-2 小時</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Privacy packaging */}
      <section className="bg-primary-bg rounded-2xl p-8 md:p-10 flex gap-4 items-start">
        <ShieldCheck size={28} className="text-primary shrink-0 mt-1" />
        <div>
          <h3 className="font-serif text-lg font-bold text-navy mb-2">隱密包裝承諾</h3>
          <ul className="text-warm-gray text-sm leading-relaxed space-y-2 list-none p-0">
            <li>• 外箱採用素面牛皮紙箱，無任何品牌名稱或情趣相關字樣</li>
            <li>• 寄件人名稱顯示為「生活百貨」等中性名稱</li>
            <li>• 簡訊與 Email 通知內容皆經過隱私處理</li>
          </ul>
        </div>
      </section>
    </div>
  )
}
