import React from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

export interface LiveProjectButtonProps {
  href?: string
  text?: string
  className?: string
}

export const LiveProjectButton: React.FC<LiveProjectButtonProps> = ({
  href = '#',
  text = 'LIVE PROJECT',
  className = '',
}) => {
  return (
    <motion.a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      whileHover={{ scale: 1.03, backgroundColor: 'rgba(215, 226, 234, 0.12)' }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA]
        uppercase tracking-widest font-medium
        px-6 py-2.5 sm:px-10 sm:py-3.5
        text-xs sm:text-sm md:text-base
        transition-colors duration-200
        select-none whitespace-nowrap
        ${className}
      `}
    >
      <span>{text}</span>
      <ArrowUpRight className="w-4 h-4 opacity-80" />
    </motion.a>
  )
}
