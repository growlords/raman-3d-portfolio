import React from 'react'
import { FadeIn } from '../common/FadeIn'
import { AnimatedText } from '../common/AnimatedText'
import { ContactButton } from '../common/ContactButton'
import { decorativeAssets } from '../../data/projects'
import { usePortfolioData } from '../../context/PortfolioDataContext'

export const AboutSection: React.FC = () => {
  const { data } = usePortfolioData()

  return (
    <section
      id="about"
      className="relative min-h-[100svh] w-full bg-[#0C0C0C] px-4 sm:px-8 md:px-10 py-16 sm:py-20 flex flex-col items-center justify-center overflow-hidden select-none"
      aria-label="About Raman"
    >
      {/* 4 Corner Decorative 3D Objects */}
      {/* Top-Left: Moon */}
      <div className="absolute top-[3%] left-[2%] sm:left-[3%] md:left-[4%] z-10 pointer-events-none w-12 sm:w-20 md:w-32 lg:w-40 select-none opacity-80 sm:opacity-100">
        <FadeIn
          delay={decorativeAssets.moon.delay}
          x={decorativeAssets.moon.x}
          duration={decorativeAssets.moon.duration}
        >
          <img
            src={decorativeAssets.moon.url}
            alt="Floating Moon 3D"
            className="w-full h-auto drop-shadow-[0_15px_25px_rgba(0,0,0,0.7)] animate-[float_6s_ease-in-out_infinite]"
            loading="lazy"
          />
        </FadeIn>
      </div>

      {/* Bottom-Left: Object */}
      <div className="absolute bottom-[4%] left-[2%] sm:left-[4%] md:left-[8%] z-10 pointer-events-none w-10 sm:w-16 md:w-28 lg:w-36 select-none opacity-80 sm:opacity-100">
        <FadeIn
          delay={decorativeAssets.object.delay}
          x={decorativeAssets.object.x}
          duration={decorativeAssets.object.duration}
        >
          <img
            src={decorativeAssets.object.url}
            alt="3D Creative Geometry"
            className="w-full h-auto drop-shadow-[0_15px_25px_rgba(0,0,0,0.7)] animate-[float_7s_ease-in-out_infinite_1s]"
            loading="lazy"
          />
        </FadeIn>
      </div>

      {/* Top-Right: Lego */}
      <div className="absolute top-[3%] right-[2%] sm:right-[3%] md:right-[4%] z-10 pointer-events-none w-12 sm:w-18 md:w-30 lg:w-38 select-none opacity-80 sm:opacity-100">
        <FadeIn
          delay={decorativeAssets.lego.delay}
          x={decorativeAssets.lego.x}
          duration={decorativeAssets.lego.duration}
        >
          <img
            src={decorativeAssets.lego.url}
            alt="3D Lego Icon"
            className="w-full h-auto drop-shadow-[0_15px_25px_rgba(0,0,0,0.7)] animate-[float_5.5s_ease-in-out_infinite_0.5s]"
            loading="lazy"
          />
        </FadeIn>
      </div>

      {/* Bottom-Right: 3D Group */}
      <div className="absolute bottom-[4%] right-[2%] sm:right-[4%] md:right-[8%] z-10 pointer-events-none w-12 sm:w-20 md:w-32 lg:w-40 select-none opacity-80 sm:opacity-100">
        <FadeIn
          delay={decorativeAssets.group3d.delay}
          x={decorativeAssets.group3d.x}
          duration={decorativeAssets.group3d.duration}
        >
          <img
            src={decorativeAssets.group3d.url}
            alt="3D Group Icon"
            className="w-full h-auto drop-shadow-[0_15px_25px_rgba(0,0,0,0.7)] animate-[float_6.5s_ease-in-out_infinite_1.5s]"
            loading="lazy"
          />
        </FadeIn>
      </div>

      {/* Central Content Container */}
      <div className="relative z-20 flex flex-col items-center text-center max-w-3xl mx-auto w-full px-2">
        {/* Heading */}
        <FadeIn delay={0} y={30} duration={0.8} className="w-full">
          <h2
            className="hero-heading font-black uppercase leading-none tracking-tight text-center"
            style={{ fontSize: 'clamp(2.5rem, 10vw, 150px)' }}
          >
            {data.about.heading}
          </h2>
        </FadeIn>

        {/* Spacing: Heading -> text */}
        <div className="h-8 sm:h-12 md:h-16" />

        {/* Scroll Animated Paragraph */}
        <div className="max-w-[560px] mx-auto px-3 sm:px-6">
          <AnimatedText
            text={data.about.paragraph}
            className="text-[#D7E2EA] font-medium text-center leading-relaxed"
          />
        </div>

        {/* Spacing: Text -> button */}
        <div className="h-10 sm:h-16 md:h-24" />

        {/* Contact Button */}
        <FadeIn delay={0.2} y={20} duration={0.7}>
          <ContactButton text={data.about.ctaText} />
        </FadeIn>
      </div>
    </section>
  )
}
