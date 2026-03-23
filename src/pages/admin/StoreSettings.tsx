import { useState } from 'react'
import { Save, CheckCircle } from 'lucide-react'
import { useStoreInfoStore } from '@/stores/storeInfoStore'

export default function StoreSettings() {
  const info = useStoreInfoStore((s) => s.info)
  const updateInfo = useStoreInfoStore((s) => s.updateInfo)
  const [form, setForm] = useState({ ...info })
  const [saved, setSaved] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateInfo(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  return (
    <div className="p-6 md:p-8">
      <h1 className="font-serif text-2xl font-bold text-navy mb-2">店家資訊設定</h1>
      <p className="text-warm-gray text-sm mb-8">編輯店家基本資訊，修改後將即時反映在前台頁尾。</p>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">Email 信箱</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              required
            />
            <p className="text-xs text-warm-gray mt-1">顧客聯繫用的電子郵件</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">客服電話</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              required
            />
            <p className="text-xs text-warm-gray mt-1">顯示在前台頁尾的電話號碼</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">公司地址</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              required
            />
            <p className="text-xs text-warm-gray mt-1">公司登記地址或營業地址</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">統一編號</label>
            <input
              type="text"
              value={form.tax_id}
              onChange={(e) => handleChange('tax_id', e.target.value)}
              pattern="\d{8}"
              maxLength={8}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              required
            />
            <p className="text-xs text-warm-gray mt-1">8 位數統一編號，顯示在前台頁尾</p>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center gap-4">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-light transition-colors cursor-pointer"
            >
              <Save size={16} />
              儲存變更
            </button>
            {saved && (
              <span className="flex items-center gap-1 text-sm text-success">
                <CheckCircle size={16} />
                已儲存成功
              </span>
            )}
          </div>
        </div>

        <p className="text-xs text-warm-gray mt-4">
          最後更新時間：{new Date(info.updated_at).toLocaleString('zh-TW')}
        </p>
      </form>
    </div>
  )
}
