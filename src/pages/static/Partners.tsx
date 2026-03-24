import { useEffect } from 'react'
import { Building2, MapPin, Phone, Mail, User, FileText, Smartphone } from 'lucide-react'
import { usePartnerStore } from '@/stores/partnerStore'

export default function Partners() {
  const { partners, loading, fetchPartners } = usePartnerStore()

  useEffect(() => {
    fetchPartners()
  }, [fetchPartners])

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <p className="text-gold text-sm tracking-widest uppercase mb-3">Partners</p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy mb-4">合作夥伴</h1>
        <div className="w-16 h-0.5 bg-gold mx-auto mb-6" />
        <p className="text-warm-gray leading-relaxed max-w-2xl mx-auto">
          秘境選物與以下優質企業攜手合作，共同為您打造最佳的購物體驗與服務品質。
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-warm-gray">載入中...</div>
      ) : (
        <div className="space-y-8">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
            >
              {/* Header */}
              <div className="bg-navy px-6 py-4 md:px-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                    <Building2 size={20} className="text-gold" />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg font-bold text-white">
                      {partner.company_name}
                    </h2>
                    <p className="text-white/50 text-xs">
                      統編：{partner.tax_id}
                    </p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 md:p-8">
                {partner.description && (
                  <p className="text-warm-gray leading-relaxed mb-6">
                    {partner.description}
                  </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-primary-bg flex items-center justify-center shrink-0">
                      <User size={14} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-warm-gray">負責人</p>
                      <p className="text-navy font-medium">{partner.contact_name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-primary-bg flex items-center justify-center shrink-0">
                      <Phone size={14} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-warm-gray">市話</p>
                      <p className="text-navy font-medium">{partner.phone}</p>
                    </div>
                  </div>

                  {partner.mobile && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-primary-bg flex items-center justify-center shrink-0">
                        <Smartphone size={14} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-warm-gray">手機</p>
                        <p className="text-navy font-medium">{partner.mobile}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-primary-bg flex items-center justify-center shrink-0">
                      <Mail size={14} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-warm-gray">信箱</p>
                      <p className="text-navy font-medium">{partner.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-sm md:col-span-2">
                    <div className="w-8 h-8 rounded-full bg-primary-bg flex items-center justify-center shrink-0">
                      <MapPin size={14} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-warm-gray">地址</p>
                      <p className="text-navy font-medium">{partner.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-primary-bg flex items-center justify-center shrink-0">
                      <FileText size={14} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-warm-gray">統一編號</p>
                      <p className="text-navy font-medium">{partner.tax_id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <section className="mt-16 bg-navy rounded-2xl p-8 md:p-12 text-center">
        <p className="text-gold text-sm tracking-widest uppercase mb-3">Cooperation</p>
        <h2 className="font-serif text-2xl font-bold text-white mb-4">合作洽詢</h2>
        <p className="text-white/70 leading-relaxed max-w-xl mx-auto">
          如果您有興趣成為秘境選物的合作夥伴，歡迎透過以下信箱與我們聯繫，我們期待與更多優質企業共同成長。
        </p>
        <a
          href="mailto:Culturalbbc@outlook.com"
          className="inline-block mt-6 px-8 py-3 bg-gold text-navy font-medium rounded-lg hover:bg-gold/90 transition-colors no-underline"
        >
          聯繫我們
        </a>
      </section>
    </div>
  )
}
