import { useStoreInfoStore } from '@/stores/storeInfoStore'

export default function Privacy() {
  const info = useStoreInfoStore((s) => s.info)
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <p className="text-gold text-sm tracking-widest uppercase mb-3">Privacy Policy</p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy mb-4">隱私政策</h1>
        <div className="w-16 h-0.5 bg-gold mx-auto mb-6" />
        <p className="text-warm-gray text-sm">最後更新日期：2026 年 2 月 1 日</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 md:p-10 space-y-8">
        {[
          {
            title: '一、前言',
            content: '秘境選物（以下簡稱「本公司」）非常重視您的隱私權。本隱私政策說明我們如何蒐集、使用、保護及分享您的個人資料。當您使用本網站及相關服務時，即表示您同意本政策所述之資料處理方式。本政策依據台灣《個人資料保護法》制定。',
          },
          {
            title: '二、資料蒐集範圍',
            content: `我們可能蒐集以下類型的個人資料：

• 基本資料：姓名、電子郵件、手機號碼、收件地址
• 帳戶資料：帳號、加密後的密碼
• 交易資料：訂單內容、付款方式、交易紀錄
• 瀏覽資料：IP 位址、瀏覽器類型、瀏覽頁面、停留時間
• 裝置資料：作業系統、螢幕解析度（用於優化瀏覽體驗）`,
          },
          {
            title: '三、資料使用目的',
            content: `您的個人資料將僅用於以下目的：

• 處理訂單及提供配送服務
• 客戶服務與售後支援
• 帳戶管理及身份驗證
• 寄送交易相關通知（出貨通知、訂單確認等）
• 在您同意的情況下，提供優惠資訊及行銷內容
• 改善網站服務品質與使用者體驗
• 遵循法律規定及配合主管機關要求`,
          },
          {
            title: '四、資料保護措施',
            content: `我們採取以下措施保護您的個人資料：

• 全站採用 SSL/TLS 加密傳輸
• 密碼以不可逆加密方式儲存
• 資料庫採用存取權限控管（Row Level Security）
• 定期進行安全性檢測與更新
• 內部人員依職務需要授予最小權限存取`,
          },
          {
            title: '五、資料分享與揭露',
            content: `我們不會出售您的個人資料。僅在以下情況下可能與第三方分享：

• 物流夥伴：為完成配送服務，需提供收件人姓名、電話及地址
• 金流服務商：為處理付款，需透過加密連線傳輸交易資訊
• 法律要求：依法院命令或主管機關合法要求時

所有合作夥伴皆經過嚴格審核，並簽署資料保密協議。`,
          },
          {
            title: '六、Cookie 使用',
            content: `本網站使用 Cookie 以提供更好的瀏覽體驗：

• 必要性 Cookie：維持登入狀態、購物車功能
• 分析性 Cookie：了解網站使用情況以改善服務
• 行銷 Cookie：在您同意後，用於提供個人化推薦

您可透過瀏覽器設定管理或拒絕 Cookie，但部分功能可能因此受到限制。`,
          },
          {
            title: '七、您的權利',
            content: `依據《個人資料保護法》，您享有以下權利：

• 查詢及閱覽您的個人資料
• 要求補充或更正個人資料
• 要求停止蒐集、處理或利用個人資料
• 要求刪除個人資料

如需行使上述權利，請聯繫客服信箱，我們將於收到申請後 30 日內處理。`,
          },
          {
            title: '八、隱私政策修訂',
            content: '本公司保留隨時修訂本隱私政策之權利。修訂後的政策將公告於本網站，重大變更時將以 Email 通知會員。繼續使用本網站即表示您同意修訂後的隱私政策。',
          },
          {
            title: '九、聯絡方式',
            content: `如對本隱私政策有任何疑問，歡迎透過以下方式與我們聯繫：

• Email：${info.email}
• 電話：${info.phone}
• 服務時間：週一至週五 10:00 - 18:00`,
          },
        ].map((section) => (
          <div key={section.title}>
            <h2 className="font-serif text-lg font-bold text-navy mb-3">{section.title}</h2>
            <p className="text-warm-gray text-sm leading-relaxed whitespace-pre-line">{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
