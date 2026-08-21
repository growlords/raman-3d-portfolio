import React from 'react'
import { motion } from 'framer-motion'
import { siteConfig } from '../../config/site'

export interface ContactButtonProps {
  href?: string
  text?: string
  className?: string
  onClick?: () => void
}

export const ContactButton: React.FC<ContactButtonProps> = ({
  href = siteConfig.email,
  text = 'CONTACT ME',
  className = '',
  onClick,
}) => {
  return (
    <motion.a
      href={href}
      onClick={onClick}
      whileHover={{ scale: 1.04, filter: 'brightness(1.12)' }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`
        inline-flex items-center justify-center
        contact-btn-gradient
        rounded-full text-white font-medium uppercase tracking-widest cursor-pointer
        px-6 py-2.5 sm:px-9 sm:py-3.5 md:px-12 md:py-4
        text-[11px] sm:text-sm md:text-base
        transition-all duration-300
        select-none whitespace-nowrap
        ${className}
      `}
      style={{
        background:
          'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
        boxShadow:
          '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
        outline: '2px solid #FFFFFF',
        outlineOffset: '-3px',
      }}
    >
      <span>{text}</span>
    </motion.a>
  )
}
