import React from 'react'
import { FadeIn } from '../common/FadeIn'
import { servicesData } from '../../data/services'

export const ServicesSection: React.FC = () => {
  return (
    <section
      id="services"
      className="relative w-full bg-[#FFFFFF] text-[#0C0C0C] rounded-t-[32px] sm:rounded-t-[48px] md:rounded-t-[60px] px-4 sm:px-8 md:px-10 py-16 sm:py-24 md:py-32 z-0 overflow-hidden"
      aria-label="Services offered by Raman"
    >
      <div className="max-w-5xl mx-auto w-full">
        {/* Section Heading */}
        <FadeIn delay={0} y={30} duration={0.7}>
          <h2
            className="text-[#0C0C0C] font-black uppercase text-center mb-12 sm:mb-20 md:mb-28 leading-none tracking-tight"
            style={{ fontSize: 'clamp(2.5rem, 10vw, 150px)' }}
          >
            SERVICES
          </h2>
        </FadeIn>

        {/* Services List */}
        <div className="flex flex-col border-t border-[rgba(12,12,12,0.15)]">
          {servicesData.map((service, index) => (
            <FadeIn
              key={service.number}
              delay={index * 0.08}
              y={20}
              duration={0.5}
            >
              <div className="group py-6 sm:py-8 md:py-12 border-b border-[rgba(12,12,12,0.15)] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-6 md:gap-12 transition-colors duration-300 hover:bg-black/[0.02] px-2 sm:px-4 rounded-xl">
                {/* Number */}
                <div
                  className="font-black text-[#0C0C0C] leading-none shrink-0 select-none tracking-tighter"
                  style={{ fontSize: 'clamp(2.4rem, 8vw, 130px)' }}
                >
                  {service.number}
                </div>

                {/* Service Name & Description */}
                <div className="flex flex-col gap-1.5 sm:gap-2 md:gap-3 flex-1 w-full">
                  <h3
                    className="font-semibold uppercase text-[#0C0C0C] tracking-wide"
                    style={{ fontSize: 'clamp(1.1rem, 2vw, 1.9rem)' }}
                  >
                    {service.title}
                  </h3>
                  <p
                    className="font-light leading-relaxed text-[#0C0C0C] opacity-70 max-w-2xl text-sm sm:text-base md:text-lg"
                  >
                    {service.description}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
