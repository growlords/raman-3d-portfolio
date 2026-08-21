import React from 'react'
import { FadeIn } from '../common/FadeIn'
import { ProjectCard } from './ProjectCard'
import { usePortfolioData } from '../../context/PortfolioDataContext'

export const ProjectsSection: React.FC = () => {
  const { data } = usePortfolioData()

  return (
    <section
      id="projects"
      className="relative w-full bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 pt-20 sm:pt-28 md:pt-36 pb-24 sm:pb-32 px-4 sm:px-8 md:px-12 z-10"
      aria-label="Selected Projects"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Heading */}
        <FadeIn delay={0} y={30} duration={0.8} className="mb-16 sm:mb-24 md:mb-32">
          <h2
            className="hero-heading font-black uppercase text-center leading-none tracking-tight"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            PROJECTS
          </h2>
        </FadeIn>

        {/* Dynamic Sticky Stacking Cards Container */}
        <div className="relative w-full flex flex-col items-center">
          {data.projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              totalCards={data.projects.length}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
