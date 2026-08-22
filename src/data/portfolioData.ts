import { siteConfig } from '../config/site'
import { projectsData, type Project } from './projects'
import { servicesData, type ServiceItem } from './services'

export interface HeroData {
  name: string
  title: string
  greeting: string
  leftBio: string
  ctaText: string
  portraitPath: string
}

export interface AboutData {
  heading: string
  paragraph: string
  ctaText: string
  skills?: string[]
  experienceYears?: string
  completedProjects?: string
}

export interface SocialLinkData {
  name: string
  href: string
}

export interface ContactData {
  whatsapp: string
  whatsappRaw: string
  whatsappMessage: string
  email: string
  availabilityText: string
}

export interface PortfolioData {
  hero: HeroData
  about: AboutData
  contact: ContactData
  projects: Project[]
  services: ServiceItem[]
  socials: SocialLinkData[]
}

export const initialPortfolioData: PortfolioData = {
  hero: {
    name: siteConfig.name,
    title: siteConfig.title,
    greeting: siteConfig.hero.greeting,
    leftBio: siteConfig.hero.leftBio,
    ctaText: siteConfig.hero.ctaText,
    portraitPath: siteConfig.portraitPath,
  },
  about: {
    heading: siteConfig.about.heading,
    paragraph: siteConfig.about.paragraph,
    ctaText: siteConfig.about.ctaText,
    skills: ["3D Modeling", "Octane Render", "Character Art", "Motion Graphics", "WebGL Interactive", "Art Direction"],
    experienceYears: "5+",
    completedProjects: "40+",
  },
  contact: {
    whatsapp: "+91 8505002058",
    whatsappRaw: "918505002058",
    whatsappMessage: "Hi Raman, I saw your 3D portfolio and would love to discuss a project!",
    email: "ramandeepkamboj4574@gmail.com",
    availabilityText: "Available for freelance & 3D projects",
  },
  projects: projectsData,
  services: servicesData,
  socials: siteConfig.socials.map(s => ({ name: s.name, href: s.href })),
}

const STORAGE_KEY = 'raman_portfolio_data_v1'

export const getStoredPortfolioData = (): PortfolioData => {
  if (typeof window === 'undefined') return initialPortfolioData
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed && parsed.hero && Array.isArray(parsed.projects)) {
        return {
          ...initialPortfolioData,
          ...parsed,
          contact: {
            ...initialPortfolioData.contact,
            ...(parsed.contact || {}),
          },
        }
      }
    }
  } catch (e) {
    console.warn('Failed to parse stored portfolio data:', e)
  }
  return initialPortfolioData
}

export const saveStoredPortfolioData = (data: PortfolioData): void => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save portfolio data:', e)
  }
}

export const clearStoredPortfolioData = (): void => {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (e) {
    console.error('Failed to clear portfolio data:', e)
  }
}
