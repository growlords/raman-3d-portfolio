import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export interface FadeInProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  x?: number
  y?: number
  className?: string
  style?: React.CSSProperties
  viewportAmount?: number | 'some' | 'all'
  viewportMargin?: string
  once?: boolean
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  className = '',
  style,
  viewportAmount = 0,
  viewportMargin = '50px',
  once = true,
}) => {
  const shouldReduceMotion = useReducedMotion()

  const initial = shouldReduceMotion
    ? { opacity: 0 }
    : { opacity: 0, x, y }

  const animate = shouldReduceMotion
    ? { opacity: 1 }
    : { opacity: 1, x: 0, y: 0 }

  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{
        once,
        margin: viewportMargin,
        amount: viewportAmount,
      }}
      transition={{
        duration: shouldReduceMotion ? 0.2 : duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}
