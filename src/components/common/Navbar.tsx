import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { siteConfig } from '../../config/site'

export interface NavbarProps {
  className?: string
}

export const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      setMobileMenuOpen(false)
      const targetId = href.substring(1)
      const element = document.getElementById(targetId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <>
      <nav
        className={`
          w-full flex items-center justify-between
          px-5 sm:px-8 md:px-10 pt-5 sm:pt-6 md:pt-8
          text-[#D7E2EA] z-40 relative select-none
          ${className}
        `}
        aria-label="Main Navigation"
      >
        {/* Mobile Left Brand Name (shown on mobile, hidden on desktop if desktop is centered/spaced) */}
        <a
          href="#"
          onClick={(e) => handleScrollTo(e, '#')}
          className="md:hidden font-black text-lg tracking-wider text-[#D7E2EA] hover:opacity-80 transition-opacity"
        >
          {siteConfig.name.toUpperCase()}
        </a>

        {/* Desktop Nav Links (Full width justify-between across screen) */}
        <div className="hidden md:flex w-full items-center justify-between font-medium uppercase tracking-wider text-base lg:text-[1.35rem]">
          {siteConfig.navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="hover:opacity-70 transition-opacity duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded px-1 py-1"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#D7E2EA] hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-lg"
          aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 bg-[#0C0C0C]/95 backdrop-blur-xl flex flex-col justify-between p-6 sm:p-8 md:hidden"
          >
            {/* Top Bar inside Menu */}
            <div className="flex items-center justify-between border-b border-[#D7E2EA]/10 pb-4">
              <span className="font-black text-xl tracking-wider text-[#D7E2EA]">
                {siteConfig.name.toUpperCase()}
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-[#D7E2EA] hover:text-white rounded-lg"
                aria-label="Close menu"
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            {/* Menu Links */}
            <div className="flex flex-col items-center justify-center gap-8 my-auto">
              {siteConfig.navLinks.map((link, idx) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleScrollTo(e, link.href)}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.07 + 0.1 }}
                  className="text-2xl sm:text-3xl font-bold uppercase tracking-widest text-[#D7E2EA] hover:text-white transition-colors"
                >
                  {link.name}
                </motion.a>
              ))}
            </div>

            {/* Bottom info inside Menu */}
            <div className="border-t border-[#D7E2EA]/10 pt-4 text-center text-xs text-[#D7E2EA]/50">
              <p>Raman — 3D Creator</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
