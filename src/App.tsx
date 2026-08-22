import { lazy, Suspense } from 'react'
import { PortfolioDataProvider } from './context/PortfolioDataContext'
import { HeroSection } from './components/sections/HeroSection'
import { LoadingScreen } from './components/common/LoadingScreen'

// Code-split below-the-fold sections for instant mobile loading & FCP
const MarqueeSection = lazy(() =>
  import('./components/sections/MarqueeSection').then((m) => ({ default: m.MarqueeSection }))
)
const AboutSection = lazy(() =>
  import('./components/sections/AboutSection').then((m) => ({ default: m.AboutSection }))
)
const ServicesSection = lazy(() =>
  import('./components/sections/ServicesSection').then((m) => ({ default: m.ServicesSection }))
)
const ProjectsSection = lazy(() =>
  import('./components/sections/ProjectsSection').then((m) => ({ default: m.ProjectsSection }))
)
const FooterSection = lazy(() =>
  import('./components/sections/FooterSection').then((m) => ({ default: m.FooterSection }))
)

export function App() {
  return (
    <PortfolioDataProvider>
      {/* 0. Luxury Brand Loading Screen */}
      <LoadingScreen />

      <main className="w-full min-h-screen bg-[#0C0C0C] text-[#D7E2EA] overflow-x-clip font-['Kanit',sans-serif] selection:bg-purple-600 selection:text-white">
        {/* 1. Hero Section (Eagerly loaded for instant visible interactive viewport) */}
        <HeroSection />

        {/* 2. Below-the-fold sections (Progressively streamed & loaded) */}
        <Suspense fallback={null}>
          <MarqueeSection />
          <AboutSection />
          <ServicesSection />
          <ProjectsSection />
          <FooterSection />
        </Suspense>
      </main>
    </PortfolioDataProvider>
  )
}

export default App
