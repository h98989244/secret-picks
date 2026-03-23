import { Truck, Store, Clock, ShieldCheck, MapPin } from 'lucide-react'

export default function Shipping() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <p className="text-gold text-sm tracking-widest uppercase mb-3">Shipping Info</p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy mb-4">配送說明</h1>
        <div className="w-16 h-0.5 bg-gold mx-auto mb-6" />
        <p className="text-warm-gray">秘境選物提供多種配送方式，所有包裹皆採隱密包裝，安心送達。</p>
      </div>

      {/* Shipping methods */}
      <section className="mb-12">
        <h2 className="font-serif text-2xl font-bold text-navy mb-6">配送方式</h2>
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-bg flex items-center justify-center shrink-0">
                <Truck size={22} className="text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif text-lg font-bold text-navy">宅配到府</h3>
                  <span className="text-sm text-primary font-medium">NT$ 80</span>
                </div>
                <ul className="text-warm-gray text-sm leading-relaxed space-y-1.5 list-none p-0">
                  <li>• 配送夥伴：黑貓宅急便 / 新竹物流</li>
                  <li>• 配送時間：付款後 1-3 個工作天出貨，出貨後 1-2 天送達</li>
                  <li>• 配送範圍：台灣本島全區（離島另計）</li>
                  <li>• 可指定配送時段：上午（9-12）、下午（12-17）、晚上（17-20）</li>
                  <li>• 支援 ATM 轉帳、超商代碼付款</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-bg flex items-center justify-center shrink-0">
                <Store size={22} className="text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif text-lg font-bold text-navy">超商取貨</h3>
                  <span className="text-sm text-primary font-medium">NT$ 60</span>
                </div>
                <ul className="text-warm-gray text-sm leading-relaxed space-y-1.5 list-none p-0">
                  <li>• 支援門市：7-ELEVEN、全家 FamilyMart</li>
                  <li>• 配送時間：付款後 1-3 個工作天出貨，出貨後 2-4 天送達門市</li>
                  <li>• 取貨期限：商品到店後 7 天內取貨，逾期將退回</li>
                  <li>• 結帳時可選擇方便的門市地點</li>
                  <li>• 支援 ATM 轉帳、超商代碼付款</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free shipping */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-primary to-primary-light rounded-2xl p-8 text-white text-center">
          <p className="text-2xl font-bold font-serif mb-2">消費滿 NT$ 999 享全台免運</p>
          <p className="text-white/80 text-sm">宅配、超商取貨皆適用（離島除外）</p>
        </div>
      </section>

      {/* Shipping schedule */}
      <section className="mb-12">
        <h2 className="font-serif text-2xl font-bold text-navy mb-6">出貨時程</h2>
        <div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 text-navy font-medium">付款方式</th>
                  <th className="text-left py-3 text-navy font-medium">確認付款時間</th>
                  <th className="text-left py-3 text-navy font-medium">預計出貨</th>
                </tr>
              </thead>
              <tbody className="text-warm-gray">
                <tr className="border-b border-gray-50">
                  <td className="py-3">ATM 轉帳</td>
                  <td className="py-3">轉帳後 1-2 小時</td>
                  <td className="py-3">確認付款後 1-3 個工作天</td>
                </tr>
                <tr>
                  <td className="py-3">超商代碼</td>
                  <td className="py-3">繳費後 1-2 小時</td>
                  <td className="py-3">確認付款後 1-3 個工作天</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-2 mt-4 text-xs text-warm-gray">
            <Clock size={12} />
            <span>工作天不含週六、週日及國定假日</span>
          </div>
        </div>
      </section>

      {/* Shipping areas */}
      <section className="mb-12">
        <h2 className="font-serif text-2xl font-bold text-navy mb-6">配送區域與運費</h2>
        <div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 text-navy font-medium">配送區域</th>
                  <th className="text-left py-3 text-navy font-medium">宅配運費</th>
                  <th className="text-left py-3 text-navy font-medium">超商取貨</th>
                  <th className="text-left py-3 text-navy font-medium">免運門檻</th>
                </tr>
              </thead>
              <tbody className="text-warm-gray">
                <tr className="border-b border-gray-50">
                  <td className="py-3 flex items-center gap-1"><MapPin size={12} /> 台灣本島</td>
                  <td className="py-3">NT$ 80</td>
                  <td className="py-3">NT$ 60</td>
                  <td className="py-3">滿 NT$ 999 免運</td>
                </tr>
                <tr>
                  <td className="py-3 flex items-center gap-1"><MapPin size={12} /> 離島地區</td>
                  <td className="py-3">NT$ 150</td>
                  <td className="py-3">不適用</td>
                  <td className="py-3">滿 NT$ 1,500 免運</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Privacy packaging */}
      <section className="bg-primary-bg rounded-2xl p-6 md:p-8">
        <div className="flex gap-4 items-start">
          <ShieldCheck size={24} className="text-primary shrink-0 mt-0.5" />
          <div>
            <h3 className="font-serif text-lg font-bold text-navy mb-3">隱密包裝保證</h3>
            <ul className="text-warm-gray text-sm leading-relaxed space-y-2 list-none p-0">
              <li>• 外箱使用素面牛皮紙箱或黑色無印紙盒，無任何品牌標誌或情趣相關字樣</li>
              <li>• 寄件人名稱顯示為「生活百貨」或「日用品出貨中心」等中性名稱</li>
              <li>• 物流單據上的品名標示為「日用百貨」或「生活用品」</li>
              <li>• 超商取貨時，門市人員無法得知包裹內容</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
