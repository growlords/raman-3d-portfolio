import { PortfolioDataProvider } from './context/PortfolioDataContext'
import { HeroSection } from './components/sections/HeroSection'
import { MarqueeSection } from './components/sections/MarqueeSection'
import { AboutSection } from './components/sections/AboutSection'
import { ServicesSection } from './components/sections/ServicesSection'
import { ProjectsSection } from './components/sections/ProjectsSection'
import { FooterSection } from './components/sections/FooterSection'

export function App() {
  return (
    <PortfolioDataProvider>
      <main className="w-full min-h-screen bg-[#0C0C0C] text-[#D7E2EA] overflow-x-clip font-['Kanit',sans-serif] selection:bg-purple-600 selection:text-white">
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. Marquee Section */}
        <MarqueeSection />

        {/* 3. About Section */}
        <AboutSection />

        {/* 4. Services Section */}
        <ServicesSection />

        {/* 5. Projects Section */}
        <ProjectsSection />

        {/* Footer & Contact Section */}
        <FooterSection />
      </main>
    </PortfolioDataProvider>
  )
}

export default App
