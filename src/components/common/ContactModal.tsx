import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, ArrowUpRight, Copy, Check, MessageSquare } from 'lucide-react'

export interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [copiedPhone, setCopiedPhone] = useState(false)

  const whatsappNumber = '+91 8505002058'
  const whatsappUrl = 'https://wa.me/918505002058'
  const emailAddress = 'ramandeepkamboj4574@gmail.com'
  const emailUrl = `mailto:${emailAddress}`

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
    navigator.clipboard.writeText('+918505002058')
    setCopiedPhone(true)
    setTimeout(() => setCopiedPhone(false), 2000)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-[#12131A] border border-[#D7E2EA]/20 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden text-[#D7E2EA] z-10"
          >
            {/* Ambient Background Glow inside Modal */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#D7E2EA]/10 pb-4 mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                  <span>GET IN TOUCH</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#D7E2EA]/60 font-mono mt-0.5">
                  Choose how you'd like to connect
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 text-[#D7E2EA]/70 hover:text-white transition-colors cursor-pointer"
                aria-label="Close Contact Options"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contact Options List */}
            <div className="flex flex-col gap-3.5 sm:gap-4">
              {/* 1. WHATSAPP OPTION */}
              <motion.a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative p-4 sm:p-5 rounded-2xl bg-[#181B24] hover:bg-[#1E2330] border border-emerald-500/30 hover:border-emerald-400/60 shadow-lg transition-all duration-200 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3.5 sm:gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-md shrink-0">
                    <svg
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-6 h-6"
                    >
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                  </div>

                  <div className="flex flex-col text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-lg font-bold text-white uppercase tracking-wide">
                        WhatsApp
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                        Instant Chat
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm text-emerald-300/90 font-mono tracking-wider">
                      {whatsappNumber}
                    </span>
                    <span className="text-[11px] text-[#D7E2EA]/50 hidden sm:inline">
                      Direct chat & quick responses
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyPhone}
                    title="Copy Phone Number"
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-[#D7E2EA]/70 hover:text-white transition-colors"
                  >
                    {copiedPhone ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <div className="w-8 h-8 rounded-full bg-emerald-500/15 group-hover:bg-emerald-500 text-emerald-300 group-hover:text-white flex items-center justify-center transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.a>

              {/* 2. EMAIL OPTION */}
              <motion.a
                href={emailUrl}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative p-4 sm:p-5 rounded-2xl bg-[#181B24] hover:bg-[#1E2330] border border-purple-500/30 hover:border-purple-400/60 shadow-lg transition-all duration-200 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3.5 sm:gap-4 overflow-hidden">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-md shrink-0">
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

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    title="Copy Email Address"
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-[#D7E2EA]/70 hover:text-white transition-colors"
                  >
                    {copiedEmail ? (
                      <Check className="w-4 h-4 text-purple-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <div className="w-8 h-8 rounded-full bg-purple-500/15 group-hover:bg-purple-600 text-purple-300 group-hover:text-white flex items-center justify-center transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.a>
            </div>

            {/* Bottom quick tip */}
            <div className="mt-5 pt-3 border-t border-[#D7E2EA]/10 flex items-center justify-between text-[11px] text-[#D7E2EA]/40 font-mono">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                Available for freelance & contract work
              </span>
              <span>Raman • 3D Creator</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
