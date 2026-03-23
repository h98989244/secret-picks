import { AlertTriangle, CheckCircle, XCircle, HelpCircle } from 'lucide-react'
import { useStoreInfoStore } from '@/stores/storeInfoStore'

export default function ReturnPolicy() {
  const info = useStoreInfoStore((s) => s.info)
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <p className="text-gold text-sm tracking-widest uppercase mb-3">Return Policy</p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy mb-4">退換貨政策</h1>
        <div className="w-16 h-0.5 bg-gold mx-auto mb-6" />
        <p className="text-warm-gray">秘境選物致力於為您提供優質的商品與服務。若有不滿意之處，請參閱以下退換貨規定。</p>
      </div>

      {/* Key info */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5 text-center">
            <p className="text-3xl font-bold text-primary mb-1">7 天</p>
            <p className="text-sm text-warm-gray">鑑賞期（非試用期）</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5 text-center">
            <p className="text-3xl font-bold text-primary mb-1">6 個月</p>
            <p className="text-sm text-warm-gray">電動商品保固</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5 text-center">
            <p className="text-3xl font-bold text-primary mb-1">3 日內</p>
            <p className="text-sm text-warm-gray">瑕疵商品通報期限</p>
          </div>
        </div>
      </section>

      {/* Can / Cannot return */}
      <section className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle size={20} className="text-success" />
            <h2 className="font-serif text-lg font-bold text-navy">可辦理退換貨</h2>
          </div>
          <ul className="text-warm-gray text-sm leading-relaxed space-y-3 list-none p-0">
            <li>• 商品未拆封、未使用，且保持完整包裝</li>
            <li>• 自收到商品起 7 天內提出申請</li>
            <li>• 收到的商品與訂單不符</li>
            <li>• 商品有明顯瑕疵或損壞（請於 3 日內通報並附照片）</li>
            <li>• 電動商品保固期內非人為因素故障</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <XCircle size={20} className="text-error" />
            <h2 className="font-serif text-lg font-bold text-navy">恕不接受退換貨</h2>
          </div>
          <ul className="text-warm-gray text-sm leading-relaxed space-y-3 list-none p-0">
            <li>• 已拆封或已使用之商品（基於衛生考量）</li>
            <li>• 超過 7 天鑑賞期</li>
            <li>• 因個人因素導致商品損壞</li>
            <li>• 贈品、特價品或出清品（購買前已註明）</li>
            <li>• 消耗性商品（潤滑液、保險套等）已拆封</li>
          </ul>
        </div>
      </section>

      {/* Process */}
      <section className="mb-12">
        <h2 className="font-serif text-2xl font-bold text-navy mb-6">退換貨流程</h2>
        <div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8">
          <div className="space-y-6">
            {[
              { step: '1', title: '提出申請', desc: `透過 Email（${info.email}）聯繫客服，提供訂單編號、退換原因及商品照片。` },
              { step: '2', title: '審核通知', desc: '客服將於 1-2 個工作天內審核並回覆，確認退換貨資格後提供退貨地址。' },
              { step: '3', title: '寄回商品', desc: '請將商品以原包裝妥善包好後寄回指定地址。因個人因素退貨之運費由消費者自行負擔；商品瑕疵則由本公司負擔。' },
              { step: '4', title: '退款處理', desc: '收到退貨商品並確認無誤後，退款將於 3-5 個工作天匯入您指定的銀行帳戶。' },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-medium text-navy mb-1">{item.title}</h3>
                  <p className="text-warm-gray text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important notes */}
      <section className="bg-primary-bg rounded-2xl p-6 md:p-8">
        <div className="flex gap-3 items-start">
          <AlertTriangle size={22} className="text-warning shrink-0 mt-0.5" />
          <div>
            <h3 className="font-serif text-lg font-bold text-navy mb-3">注意事項</h3>
            <ul className="text-warm-gray text-sm leading-relaxed space-y-2 list-none p-0">
              <li>• 7 天鑑賞期自「收到商品」隔日起算，非下單日起算</li>
              <li>• 退換貨商品請保持原包裝完整，包含外盒、說明書、配件等</li>
              <li>• 保固維修請保留購買證明（訂單確認信即可）</li>
              <li>• 如有任何疑問，歡迎隨時聯繫客服，我們樂意為您協助</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Contact */}
      <div className="mt-8 text-center">
        <p className="text-warm-gray text-sm">
          需要退換貨協助？請聯繫客服：
          <a href={`mailto:${info.email}`} className="text-primary font-medium ml-1 no-underline hover:text-primary-light">
            {info.email}
          </a>
        </p>
        <HelpCircle size={14} className="inline text-warm-gray ml-1" />
      </div>
    </div>
  )
}
