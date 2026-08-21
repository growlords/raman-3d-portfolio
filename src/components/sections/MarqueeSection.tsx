import React, { useRef, useEffect } from 'react'
import { marqueeRow1, marqueeRow2 } from '../../data/marquee'
import { ImageWithFallback } from '../common/ImageWithFallback'

export const MarqueeSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const row1Ref = useRef<HTMLDivElement>(null)
  const row2Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let animationFrameId: number

    const handleScroll = () => {
      if (!sectionRef.current || !row1Ref.current || !row2Ref.current) return

      const sectionRect = sectionRef.current.getBoundingClientRect()
      const sectionTop = window.scrollY + sectionRect.top
      const offset = (window.scrollY - sectionTop + window.innerHeight) * 0.3

      const row1X = offset - 200
      const row2X = -(offset - 200)

      row1Ref.current.style.transform = `translate3d(${row1X}px, 0, 0)`
      row2Ref.current.style.transform = `translate3d(${row2X}px, 0, 0)`
    }

    const onScroll = () => {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = requestAnimationFrame(handleScroll)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    handleScroll()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // Duplicate items for continuous visuals across wide displays
  const row1Items = [...marqueeRow1, ...marqueeRow1, ...marqueeRow1]
  const row2Items = [...marqueeRow2, ...marqueeRow2, ...marqueeRow2]

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="relative w-full bg-[#0C0C0C] pt-16 sm:pt-28 md:pt-36 pb-8 sm:pb-12 overflow-hidden select-none"
      aria-label="Creative Preview Gallery"
    >
      <div className="flex flex-col gap-2.5 sm:gap-3 w-full">
        {/* Row 1 - Moves Right */}
        <div className="w-full overflow-hidden">
          <div
            ref={row1Ref}
            className="flex gap-2.5 sm:gap-3 will-change-transform"
            style={{ transform: 'translate3d(-200px, 0, 0)' }}
          >
            {row1Items.map((url, idx) => (
              <div
                key={`r1-${idx}`}
                className="shrink-0 w-[180px] h-[115px] sm:w-[260px] sm:h-[165px] md:w-[350px] md:h-[225px] lg:w-[420px] lg:h-[270px] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl transition-transform duration-300 hover:scale-[1.02]"
              >
                <ImageWithFallback
                  src={url}
                  alt={`3D project preview ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 - Moves Left */}
        <div className="w-full overflow-hidden">
          <div
            ref={row2Ref}
            className="flex gap-2.5 sm:gap-3 will-change-transform"
            style={{ transform: 'translate3d(200px, 0, 0)' }}
          >
            {row2Items.map((url, idx) => (
              <div
                key={`r2-${idx}`}
                className="shrink-0 w-[180px] h-[115px] sm:w-[260px] sm:h-[165px] md:w-[350px] md:h-[225px] lg:w-[420px] lg:h-[270px] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl transition-transform duration-300 hover:scale-[1.02]"
              >
                <ImageWithFallback
                  src={url}
                  alt={`3D project preview ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
