import React, { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import type { Project } from '../../data/projects'
import { LiveProjectButton } from '../common/LiveProjectButton'
import { ImageWithFallback } from '../common/ImageWithFallback'

export interface ProjectCardProps {
  project: Project
  index: number
  totalCards: number
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, totalCards }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'start start'],
  })

  // Stacking scale formula: targetScale = 1 - (totalCards - 1 - index) * 0.03
  const targetScale = 1 - (totalCards - 1 - index) * 0.03
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale])

  // Responsive sticky top offset: 68px + index * 16px on mobile, 96px + index * 28px on desktop
  const [topOffset, setTopOffset] = React.useState(96 + index * 28)

  React.useEffect(() => {
    const updateOffset = () => {
      const isMobile = window.innerWidth < 640
      setTopOffset((isMobile ? 68 : 96) + index * (isMobile ? 18 : 28))
    }
    updateOffset()
    window.addEventListener('resize', updateOffset)
    return () => window.removeEventListener('resize', updateOffset)
  }, [index])

  return (
    <div
      ref={containerRef}
      className="w-full flex items-center justify-center sticky mb-16 sm:mb-24 px-2 sm:px-4"
      style={{
        top: `${topOffset}px`,
        zIndex: index + 10,
      }}
    >
      <motion.div
        style={{ scale: shouldReduceMotion ? 1 : scale }}
        className="w-full max-w-6xl bg-[#0C0C0C] border-2 border-[#D7E2EA] rounded-[30px] sm:rounded-[45px] md:rounded-[60px] p-4 sm:p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.95)] flex flex-col gap-4 sm:gap-6 will-change-transform"
      >
        {/* Top Header Row */}
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#D7E2EA]/20 pb-4 sm:pb-6">
          <div className="flex items-baseline gap-4 sm:gap-6">
            <span
              className="font-black text-[#D7E2EA] leading-none select-none tracking-tighter"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
            >
              {project.number}
            </span>
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-widest text-[#D7E2EA]/60 font-mono">
                {project.type}
              </span>
              <h3
                className="font-bold text-[#D7E2EA] uppercase tracking-tight"
                style={{ fontSize: 'clamp(1.2rem, 2.5vw, 2.2rem)' }}
              >
                {project.name}
              </h3>
            </div>
          </div>

          <LiveProjectButton href={project.liveUrl} text="LIVE PROJECT" />
        </div>

        {/* Image Grid: Left 40% (2 stacked), Right 60% (1 tall) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 w-full">
          {/* Left Column - 40% (5 cols out of 12) */}
          <div className="md:col-span-5 flex flex-col gap-3 sm:gap-4">
            {/* Left Top Image */}
            <div
              className="w-full overflow-hidden rounded-[24px] sm:rounded-[36px] md:rounded-[48px]"
              style={{ height: 'clamp(140px, 16vw, 230px)' }}
            >
              <ImageWithFallback
                src={project.images[0]}
                alt={`${project.name} preview top`}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* Left Bottom Image */}
            <div
              className="w-full overflow-hidden rounded-[24px] sm:rounded-[36px] md:rounded-[48px]"
              style={{ height: 'clamp(170px, 22vw, 340px)' }}
            >
              <ImageWithFallback
                src={project.images[1]}
                alt={`${project.name} preview bottom`}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>

          {/* Right Column - 60% (7 cols out of 12) */}
          <div className="md:col-span-7 h-[280px] sm:h-[350px] md:h-auto overflow-hidden rounded-[24px] sm:rounded-[36px] md:rounded-[48px]">
            <ImageWithFallback
              src={project.images[2]}
              alt={`${project.name} preview right featured`}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
