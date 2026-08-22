import React, { useState, useEffect, lazy, Suspense } from 'react'
import { Volume2, Volume1, VolumeX, Edit3 } from 'lucide-react'
import { FadeIn } from '../common/FadeIn'
import { Navbar } from '../common/Navbar'
import { ContactButton } from '../common/ContactButton'
import { ElasticCharacter } from '../common/ElasticCharacter'
import { audioManager, type AudioState } from '../../utils/audioManager'
import { usePortfolioData } from '../../context/PortfolioDataContext'

const AdminCMSModal = lazy(() =>
  import('../admin/AdminCMSModal').then((m) => ({ default: m.AdminCMSModal }))
)

export const HeroSection: React.FC = () => {
  const { data } = usePortfolioData()
  const [audioState, setAudioState] = useState<AudioState>(audioManager.getState())
  const [isCMSOpen, setIsCMSOpen] = useState(false)

  useEffect(() => {
    const unsubscribe = audioManager.subscribe((state) => {
      setAudioState(state)
    })
    // Attempt graceful initial autoplay according to browser policy
    audioManager.attemptAutoplay()
    return () => {
      unsubscribe()
    }
  }, [])

  const handleToggleSound = () => {
    audioManager.toggleAudio()
  }

  // Global keyboard shortcut (Ctrl+K or Cmd+K) to open Admin CMS
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsCMSOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <header className="relative w-full h-[100svh] min-h-[100vh] flex flex-col justify-between bg-[#0C0C0C] select-none overflow-hidden">
      {/* 1. LAYER 0: Ambient Center Radial Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-[320px] sm:w-[540px] md:w-[700px] h-[320px] sm:h-[540px] md:h-[700px] bg-gradient-to-t from-purple-700/25 via-pink-600/10 to-transparent blur-[120px] rounded-full opacity-65 pointer-events-none" />
      </div>

      {/* 2. Top Header: Clean Navbar + "HI, I'M RAMAN" Heading */}
      <div className="relative z-30 w-full flex flex-col items-center">
        {/* Navigation Bar */}
        <FadeIn delay={0} y={-20} duration={0.6} className="w-full">
          <Navbar />
        </FadeIn>

        {/* Heading: Positioned clearly on top with dedicated space below */}
        <div className="w-full flex items-center justify-center pt-2 sm:pt-3 md:pt-4 px-3 sm:px-6 pointer-events-none">
          <FadeIn delay={0.15} y={20} duration={0.8} className="w-full flex justify-center">
            <h1
              className="hero-heading font-black uppercase tracking-tight text-center whitespace-nowrap leading-none select-none pointer-events-none"
              style={{
                fontSize: 'clamp(2.2rem, 11vw, 13.5rem)',
                letterSpacing: '-0.035em',
              }}
            >
              {data.hero.greeting}
            </h1>
          </FadeIn>
        </div>
      </div>

      {/* 3. 3D Elastic Character Canvas (Positioned below heading with clean space, zero overlap) */}
      <div className="absolute inset-0 w-full h-full z-20 flex items-center justify-center pointer-events-auto">
        <ElasticCharacter
          imageSrc={data.hero.portraitPath}
          className="w-full h-full"
        />
      </div>

      {/* 4. Hero Bottom Bar (Bio Text on Left, Contact CTA on Right with generous spacing) */}
      <div className="relative z-30 w-full flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 sm:gap-4 pb-6 sm:pb-8 md:pb-10 px-5 sm:px-8 md:px-12 pointer-events-none">
        {/* Left Bio text */}
        <FadeIn delay={0.35} y={20} duration={0.7} className="w-full sm:w-auto pointer-events-auto">
          <p
            className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug text-center sm:text-left max-w-[280px] sm:max-w-[220px] md:max-w-[280px] mx-auto sm:mx-0 drop-shadow-md"
            style={{ fontSize: 'clamp(0.75rem, 1.3vw, 1.4rem)' }}
          >
            {data.hero.leftBio}
          </p>
        </FadeIn>

        {/* Right Contact Button (Unobstructed, generous margin) */}
        <FadeIn delay={0.45} y={20} duration={0.7} className="w-full sm:w-auto flex items-center justify-center sm:justify-end pointer-events-auto">
          <ContactButton text={data.hero.ctaText} />
        </FadeIn>
      </div>

      {/* 5. Floating Quick Controls (Audio SFX + Admin CMS Pill, Bottom-Left - Never overlaps Contact or Navbar) */}
      <div className="fixed bottom-4 sm:bottom-6 left-4 sm:left-6 z-40 flex items-center gap-2 pointer-events-auto">
        {/* Sound FX Toggle Pill */}
        <button
          onClick={handleToggleSound}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-full
            border text-xs font-mono tracking-wider backdrop-blur-md
            transition-all duration-200 cursor-pointer shadow-lg active:scale-95
            ${
              audioState.isPlaying
                ? 'bg-purple-600/30 hover:bg-purple-600/50 border-purple-500/40 text-purple-200'
                : audioState.needsInteraction
                ? 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/40 text-amber-200 animate-pulse'
                : 'bg-[#16171E]/90 hover:bg-[#222430] border-[#D7E2EA]/20 text-[#D7E2EA]'
            }
          `}
          title={
            audioState.isPlaying
              ? 'Music & SFX ON (Click to Mute)'
              : audioState.needsInteraction
              ? 'Sound paused by browser autoplay policy (Tap anywhere to enable)'
              : 'Sound Muted (Click to Unmute)'
          }
        >
          {audioState.isPlaying ? (
            <>
              <Volume2 size={13} className="text-purple-400 animate-pulse" />
              <span className="text-[10px] text-purple-300 uppercase font-semibold">SOUND ON</span>
            </>
          ) : audioState.needsInteraction ? (
            <>
              <Volume1 size={13} className="text-amber-400" />
              <span className="text-[10px] text-amber-300 uppercase font-semibold">TAP FOR SOUND</span>
            </>
          ) : (
            <>
              <VolumeX size={13} className="text-red-400" />
              <span className="text-[10px] text-red-400 uppercase">MUTED</span>
            </>
          )}
        </button>

        {/* CMS Edit Trigger Pill */}
        <button
          onClick={() => setIsCMSOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-mono tracking-wider backdrop-blur-md transition-all duration-200 cursor-pointer shadow-lg active:scale-95"
          title="Edit Portfolio Content (Admin CMS)"
        >
          <Edit3 size={13} />
          <span className="text-[10px] uppercase font-bold hidden sm:inline">CMS</span>
          <span className="text-[9px] text-purple-300/70 font-mono hidden md:inline">⌘K</span>
        </button>
      </div>

      {/* Admin CMS Modal (Lazy Loaded) */}
      {isCMSOpen && (
        <Suspense fallback={null}>
          <AdminCMSModal isOpen={isCMSOpen} onClose={() => setIsCMSOpen(false)} />
        </Suspense>
      )}
    </header>
  )
}
