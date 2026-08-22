import React, { useState } from 'react'
import { FadeIn } from '../common/FadeIn'
import { ContactButton } from '../common/ContactButton'
import { ArrowUp, Lock } from 'lucide-react'
import { usePortfolioData } from '../../context/PortfolioDataContext'
import { AdminCMSModal } from '../admin/AdminCMSModal'

export const FooterSection: React.FC = () => {
  const { data } = usePortfolioData()
  const [isCMSOpen, setIsCMSOpen] = useState(false)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer
      id="contact"
      className="relative w-full bg-[#0C0C0C] border-t border-[#D7E2EA]/10 pt-16 sm:pt-20 pb-10 sm:pb-12 px-4 sm:px-8 md:px-12 z-20 overflow-hidden select-none"
      aria-label="Footer and Contact"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Contact CTA */}
        <FadeIn delay={0.1} y={20} className="w-full flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] sm:text-xs uppercase tracking-widest text-emerald-300/80 font-mono">
              {data?.contact?.availabilityText || 'Available for freelance & 3D projects'}
            </span>
          </div>
          <h2
            className="hero-heading font-black uppercase tracking-tight leading-none mb-6 sm:mb-8"
            style={{ fontSize: 'clamp(2rem, 7vw, 5.5rem)' }}
          >
            LET'S CONNECT
          </h2>
          <div className="mb-6 sm:mb-8">
            <ContactButton text="START A CONVERSATION" />
          </div>

          {/* Quick Direct Contact Links */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 mb-8 sm:mb-12">
            <a
              href={`https://wa.me/${data?.contact?.whatsappRaw || '918505002058'}?text=${encodeURIComponent(data?.contact?.whatsappMessage || "Hi Raman, I'd like to discuss a project!")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-mono transition-all duration-200 active:scale-95"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>WhatsApp: {data?.contact?.whatsapp || '+91 8505002058'}</span>
            </a>

            <a
              href={`mailto:${data?.contact?.email || 'ramandeepkamboj4574@gmail.com'}`}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-mono transition-all duration-200 active:scale-95"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <span>{data?.contact?.email || 'ramandeepkamboj4574@gmail.com'}</span>
            </a>
          </div>
        </FadeIn>

        {/* Social Links */}
        <div className="w-full flex flex-wrap items-center justify-center gap-4 sm:gap-8 md:gap-10 border-y border-[#D7E2EA]/10 py-6 sm:py-8 mb-8 sm:mb-10 text-xs sm:text-sm md:text-base uppercase tracking-wider">
          {data.socials.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D7E2EA]/80 hover:text-white transition-colors duration-200 py-1 px-2"
            >
              {social.name}
            </a>
          ))}
        </div>

        {/* Bottom copyright, Admin CMS trigger, and scroll to top */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-[#D7E2EA]/40 font-mono">
          <div className="flex items-center gap-3">
            <p>© {new Date().getFullYear()} {data.hero.name}. All rights reserved.</p>
            <button
              onClick={() => setIsCMSOpen(true)}
              className="inline-flex items-center gap-1 text-[11px] text-[#D7E2EA]/30 hover:text-purple-400 transition-colors py-1 px-2 rounded-md hover:bg-white/5 cursor-pointer"
              title="Admin CMS Login (raman)"
            >
              <Lock size={12} />
              <span>Admin CMS</span>
            </button>
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 hover:text-[#D7E2EA] transition-colors duration-200 cursor-pointer p-2 focus:outline-none focus:ring-1 focus:ring-purple-500 rounded"
            aria-label="Scroll to top of page"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Admin CMS Modal */}
      <AdminCMSModal isOpen={isCMSOpen} onClose={() => setIsCMSOpen(false)} />
    </footer>
  )
}
