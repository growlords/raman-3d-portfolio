import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, ArrowUpRight, Copy, Check, Sparkles, MessageCircle } from 'lucide-react'
import { usePortfolioData } from '../../context/PortfolioDataContext'

export interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const { data } = usePortfolioData()
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [copiedPhone, setCopiedPhone] = useState(false)

  // Dynamic Contact Data from PortfolioContext
  const whatsappNumber = data?.contact?.whatsapp || '+91 8505002058'
  const whatsappRaw = data?.contact?.whatsappRaw || '918505002058'
  const emailAddress = data?.contact?.email || 'ramandeepkamboj4574@gmail.com'
  const defaultMessage = data?.contact?.whatsappMessage || "Hi Raman, I'd like to discuss a 3D project with you!"
  const availabilityText = data?.contact?.availabilityText || 'Available for freelance & 3D projects'

  const whatsappUrl = `https://wa.me/${whatsappRaw}?text=${encodeURIComponent(defaultMessage)}`
  const emailUrl = `mailto:${emailAddress}?subject=${encodeURIComponent('Project Inquiry — 3D Collaboration')}`

  // Close on Escape key and prevent background scroll when open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    navigator.clipboard.writeText(emailAddress)
    setCopiedEmail(true)
    setTimeout(() => setCopiedEmail(false), 2000)
  }

  const handleCopyPhone = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    navigator.clipboard.writeText(whatsappNumber)
    setCopiedPhone(true)
    setTimeout(() => setCopiedPhone(false), 2000)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 select-none">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl"
          />

          {/* Modal / Bottom-Sheet Container */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="
              relative w-full max-w-lg
              bg-[#12131A] border-t sm:border border-[#D7E2EA]/20
              rounded-t-[32px] sm:rounded-3xl
              p-5 sm:p-8
              shadow-[0_-10px_40px_rgba(0,0,0,0.8)] sm:shadow-[0_25px_60px_rgba(0,0,0,0.9)]
              overflow-hidden text-[#D7E2EA] z-10
              max-h-[90vh] overflow-y-auto
            "
          >
            {/* Mobile Sheet Handle Bar */}
            <div className="sm:hidden w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-4" />

            {/* Ambient Background Glow inside Modal */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Modal Header */}
            <div className="flex items-start sm:items-center justify-between border-b border-[#D7E2EA]/10 pb-4 mb-5 sm:mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] sm:text-xs font-mono font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE
                  </span>
                  <span className="text-[11px] sm:text-xs text-[#D7E2EA]/60 font-mono">
                    Direct Contact
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                  <span>GET IN TOUCH</span>
                </h3>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 -mr-1 -mt-1 rounded-full hover:bg-white/10 text-[#D7E2EA]/70 hover:text-white transition-colors cursor-pointer"
                aria-label="Close Contact Options"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Contact Options List */}
            <div className="flex flex-col gap-3 sm:gap-4">
              {/* 1. DYNAMIC WHATSAPP OPTION */}
              <motion.a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="group relative p-4 sm:p-5 rounded-2xl bg-[#181B24] hover:bg-[#1E2330] active:bg-[#202534] border border-emerald-500/30 hover:border-emerald-400/60 shadow-lg transition-all duration-200 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-md shrink-0">
                    <MessageCircle className="w-6 h-6" />
                  </div>

                  <div className="flex flex-col text-left overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-lg font-bold text-white uppercase tracking-wide">
                        WhatsApp
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                        Instant
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm text-emerald-300/90 font-mono tracking-wider truncate">
                      {whatsappNumber}
                    </span>
                    <span className="text-[11px] text-[#D7E2EA]/50 hidden sm:inline">
                      Chat directly & discuss projects
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 pl-2">
                  <button
                    type="button"
                    onClick={handleCopyPhone}
                    title="Copy Phone Number"
                    className="p-2 sm:p-2.5 rounded-lg bg-white/5 hover:bg-white/15 text-[#D7E2EA]/70 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedPhone ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-500/15 group-hover:bg-emerald-500 text-emerald-300 group-hover:text-white flex items-center justify-center transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.a>

              {/* 2. DYNAMIC EMAIL OPTION */}
              <motion.a
                href={emailUrl}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="group relative p-4 sm:p-5 rounded-2xl bg-[#181B24] hover:bg-[#1E2330] active:bg-[#202534] border border-purple-500/30 hover:border-purple-400/60 shadow-lg transition-all duration-200 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-md shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>

                  <div className="flex flex-col text-left overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-lg font-bold text-white uppercase tracking-wide">
                        Email
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
                        Inquiries
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm text-purple-300/90 font-mono truncate">
                      {emailAddress}
                    </span>
                    <span className="text-[11px] text-[#D7E2EA]/50 hidden sm:inline">
                      Detailed briefs & project proposals
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 pl-2">
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    title="Copy Email Address"
                    className="p-2 sm:p-2.5 rounded-lg bg-white/5 hover:bg-white/15 text-[#D7E2EA]/70 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedEmail ? (
                      <Check className="w-4 h-4 text-purple-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-purple-500/15 group-hover:bg-purple-600 text-purple-300 group-hover:text-white flex items-center justify-center transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.a>
            </div>

            {/* Dynamic Status & Availability Footer */}
            <div className="mt-5 pt-3.5 border-t border-[#D7E2EA]/10 flex items-center justify-between text-[11px] text-[#D7E2EA]/50 font-mono">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="truncate">{availabilityText}</span>
              </span>
              <span className="shrink-0 font-medium text-white/70">{data?.hero?.name || 'Raman'}</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
