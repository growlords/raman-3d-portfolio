import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface LoadingScreenProps {
  onLoadingComplete?: () => void
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    let isMounted = true
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
    const targetHeroSrc = isMobile ? '/raman-hero-mobile.webp' : '/raman-hero.webp'

    // 1. Preload hero image in parallel (non-blocking)
    let imageLoaded = false
    const img = new Image()
    img.src = targetHeroSrc
    img.onload = () => {
      imageLoaded = true
    }
    img.onerror = () => {
      imageLoaded = true // Fail-safe: continue even if image error
    }

    // 2. Smooth, rapid intro timer that completes in ~650ms - 850ms
    const startTime = performance.now()
    const TARGET_DURATION = 750 // 750ms total intro duration
    const MAX_FAILSAFE_MS = 1100 // Hard maximum fail-safe

    const interval = setInterval(() => {
      if (!isMounted) {
        clearInterval(interval)
        return
      }

      const elapsed = performance.now() - startTime
      const timeProgress = Math.min(100, Math.floor((elapsed / TARGET_DURATION) * 100))

      // If image is already ready or time passed 90%, advance smoothly to 100%
      if (timeProgress >= 90) {
        if (imageLoaded || elapsed >= TARGET_DURATION) {
          clearInterval(interval)
          setProgress(100)
          setTimeout(() => {
            if (!isMounted) return
            setIsReady(true)
            if (onLoadingComplete) onLoadingComplete()
          }, 120)
          return
        }
      }

      setProgress(Math.max(timeProgress, 12))
    }, 30)

    // 3. Absolute fail-safe: never hold the screen for more than MAX_FAILSAFE_MS
    const failsafe = setTimeout(() => {
      if (!isMounted) return
      clearInterval(interval)
      setProgress(100)
      setIsReady(true)
      if (onLoadingComplete) onLoadingComplete()
    }, MAX_FAILSAFE_MS)

    return () => {
      isMounted = false
      clearInterval(interval)
      clearTimeout(failsafe)
    }
  }, [onLoadingComplete])

  if (isFinished) return null

  return (
    <AnimatePresence onExitComplete={() => setIsFinished(true)}>
      {!isReady && (
        <motion.div
          key="luxury-loader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            y: -20,
            scale: 1.02,
            transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0C0C0C] text-[#D7E2EA] select-none pointer-events-auto"
          aria-label="Loading Raman 3D Portfolio"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute w-[280px] sm:w-[500px] h-[280px] sm:h-[500px] bg-gradient-to-tr from-purple-700/20 via-pink-600/10 to-transparent blur-[90px] rounded-full pointer-events-none" />

          {/* Central Branded Content */}
          <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
            {/* Monogram / Logo Mark */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-12 h-12 mb-4 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-500 to-purple-800 p-[1px] shadow-[0_0_25px_rgba(168,85,247,0.25)]"
            >
              <div className="w-full h-full bg-[#0C0C0C] rounded-2xl flex items-center justify-center">
                <span className="font-black text-lg tracking-tighter bg-gradient-to-r from-white via-[#BBCCD7] to-purple-300 bg-clip-text text-transparent">
                  R
                </span>
              </div>
            </motion.div>

            {/* RAMAN Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.08 }}
              className="font-black text-3xl sm:text-4xl tracking-tight uppercase leading-none mb-1.5 hero-heading"
            >
              RAMAN
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.12 }}
              className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#D7E2EA]/60 mb-6"
            >
              3D Creator & Visual Designer
            </motion.p>

            {/* Minimal Luxury Progress Bar */}
            <div className="w-48 sm:w-56 h-[2px] bg-white/10 rounded-full overflow-hidden relative mb-3">
              <div
                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-300 rounded-full transition-all duration-75 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Progress Percentage Counter */}
            <div className="flex items-center justify-between w-48 sm:w-56 text-[10px] font-mono text-[#D7E2EA]/40">
              <span className="tracking-wider uppercase">Loading</span>
              <span className="text-purple-300 font-bold">
                {progress < 10 ? `0${progress}` : progress}%
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
