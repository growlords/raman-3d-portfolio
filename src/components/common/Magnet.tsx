import React, { useRef, useState, useEffect, useCallback } from 'react'

export interface MagnetProps {
  children: React.ReactNode
  padding?: number
  strength?: number
  className?: string
  style?: React.CSSProperties
  disabled?: boolean
}

export const Magnet: React.FC<MagnetProps> = ({
  children,
  padding = 150,
  strength = 3,
  className = '',
  style,
  disabled = false,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    // Detect touch-only devices to avoid unnecessary listeners and lag
    if (typeof window !== 'undefined') {
      setIsTouchDevice(
        'ontouchstart' in window ||
          navigator.maxTouchPoints > 0 ||
          window.matchMedia('(pointer: coarse)').matches
      )
    }
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (disabled || isTouchDevice || !ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const distX = e.clientX - centerX
      const distY = e.clientY - centerY
      const distance = Math.hypot(distX, distY)

      const activeRadius = Math.max(rect.width, rect.height) / 2 + padding

      if (distance < activeRadius) {
        setIsHovered(true)
        setPosition({
          x: distX / strength,
          y: distY / strength,
        })
      } else {
        setIsHovered(false)
        setPosition({ x: 0, y: 0 })
      }
    },
    [disabled, isTouchDevice, padding, strength]
  )

  const handleMouseLeaveWindow = useCallback(() => {
    setIsHovered(false)
    setPosition({ x: 0, y: 0 })
  }, [])

  useEffect(() => {
    if (disabled || isTouchDevice) return

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeaveWindow)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeaveWindow)
    }
  }, [disabled, isTouchDevice, handleMouseMove, handleMouseLeaveWindow])

  const transformStyle: React.CSSProperties = {
    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
    transition: isHovered ? 'transform 0.3s ease-out' : 'transform 0.6s ease-in-out',
    willChange: 'transform',
    ...style,
  }

  return (
    <div ref={ref} className={`inline-block ${className}`} style={transformStyle}>
      {children}
    </div>
  )
}
