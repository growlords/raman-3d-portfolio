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
    const startTime = performance.now()
    const MIN_DISPLAY_TIME_MS = 500 // Quick luxury reveal, no artificial long waiting

    // 1. Check critical assets (Hero image & Web Fonts)
    const checkAssets = async () => {
      try {
        // Preload and verify hero image
        const imgPromise = new Promise<void>((resolve) => {
          const img = new Image()
          img.src = '/raman-hero.webp'
          img.onload = () => resolve()
          img.onerror = () => {
            // Fallback to png if webp failed
            const fallback = new Image()
            fallback.src = '/raman-hero.png'
            fallback.onload = () => resolve()
            fallback.onerror = () => resolve()
          }
        })

        // Check web fonts readiness
        const fontsPromise = document.fonts ? document.fonts.ready : Promise.resolve()

        // Fast progress animation while waiting for real assets
        const interval = setInterval(() => {
          if (!isMounted) {
            clearInterval(interval)
            return
          }
          setProgress((prev) => {
            if (prev >= 90) {
              clearInterval(interval)
              return 90
            }
            return prev + Math.floor(Math.random() * 14) + 8
          })
        }, 50)

        await Promise.all([imgPromise, fontsPromise])

        clearInterval(interval)
        if (!isMounted) return

        // Ensure minimum smooth display time to prevent visual flicker
        const elapsed = performance.now() - startTime
        const remaining = Math.max(0, MIN_DISPLAY_TIME_MS - elapsed)

        setTimeout(() => {
          if (!isMounted) return
          setProgress(100)
          setTimeout(() => {
            if (!isMounted) return
            setIsReady(true)
            if (onLoadingComplete) onLoadingComplete()
          }, 150)
        }, remaining)
      } catch (err) {
        console.warn('Asset check fallback:', err)
        setProgress(100)
        setIsReady(true)
        if (onLoadingComplete) onLoadingComplete()
      }
    }

    checkAssets()

    return () => {
      isMounted = false
    }
  }, [onLoadingComplete])

  if (isFinished) return null

  return (
    <AnimatePresence onExitComplete={() => setIsFinished(true)}>
      {!isReady && (
        <motion.div
          key="loader-container"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            y: -24,
            scale: 1.02,
            filter: 'blur(8px)',
            transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0C0C0C] text-[#D7E2EA] select-none pointer-events-auto"
          aria-label="Loading Raman 3D Portfolio"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-gradient-to-tr from-purple-700/20 via-pink-600/10 to-transparent blur-[100px] rounded-full pointer-events-none" />

          {/* Central Branded Content */}
          <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
            {/* Monogram / Logo Mark */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="w-12 h-12 mb-4 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-500 to-purple-800 p-[1px] shadow-[0_0_30px_rgba(168,85,247,0.3)]"
            >
              <div className="w-full h-full bg-[#0C0C0C] rounded-2xl flex items-center justify-center">
                <span className="font-black text-lg tracking-tighter bg-gradient-to-r from-white via-[#BBCCD7] to-purple-300 bg-clip-text text-transparent">
                  R
                </span>
              </div>
            </motion.div>

            {/* RAMAN Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="font-black text-3xl sm:text-4xl tracking-tight uppercase leading-none mb-1.5 hero-heading"
            >
              RAMAN
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#D7E2EA]/60 mb-6"
            >
              3D Creator & Visual Designer
            </motion.p>

            {/* Minimal Luxury Progress Bar */}
            <div className="w-48 sm:w-56 h-[2px] bg-white/10 rounded-full overflow-hidden relative mb-3">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-300 rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
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
