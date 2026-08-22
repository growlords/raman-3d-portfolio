import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  type PortfolioData,
  type HeroData,
  type AboutData,
  type ContactData,
  initialPortfolioData,
  getStoredPortfolioData,
  saveStoredPortfolioData,
  clearStoredPortfolioData,
} from '../data/portfolioData'
import type { Project } from '../data/projects'
import type { ServiceItem } from '../data/services'

interface PortfolioDataContextType {
  data: PortfolioData
  updateHero: (hero: Partial<HeroData>) => void
  updateAbout: (about: Partial<AboutData>) => void
  updateContact: (contact: Partial<ContactData>) => void
  addProject: (project: Omit<Project, 'id' | 'number'>) => void
  updateProject: (id: string, project: Partial<Project>) => void
  deleteProject: (id: string) => void
  reorderProjects: (projects: Project[]) => void
  updateServices: (services: ServiceItem[]) => void
  resetToDefaults: () => void
  exportDataAsJSON: () => void
  importDataFromJSON: (jsonString: string) => boolean
}

const PortfolioDataContext = createContext<PortfolioDataContextType | undefined>(undefined)

export const PortfolioDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(() => getStoredPortfolioData())

  useEffect(() => {
    saveStoredPortfolioData(data)
  }, [data])

  const updateHero = (hero: Partial<HeroData>) => {
    setData((prev) => ({
      ...prev,
      hero: { ...prev.hero, ...hero },
    }))
  }

  const updateAbout = (about: Partial<AboutData>) => {
    setData((prev) => ({
      ...prev,
      about: { ...prev.about, ...about },
    }))
  }

  const updateContact = (contact: Partial<ContactData>) => {
    setData((prev) => ({
      ...prev,
      contact: { ...prev.contact, ...contact },
    }))
  }


  const addProject = (projectInput: Omit<Project, 'id' | 'number'>) => {
    setData((prev) => {
      const nextIndex = prev.projects.length + 1
      const formattedNumber = nextIndex < 10 ? `0${nextIndex}` : `${nextIndex}`
      const newProject: Project = {
        ...projectInput,
        id: `project-${Date.now()}`,
        number: formattedNumber,
      }
      return {
        ...prev,
        projects: [...prev.projects, newProject],
      }
    })
  }

  const updateProject = (id: string, projectUpdate: Partial<Project>) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...projectUpdate } : p)),
    }))
  }

  const deleteProject = (id: string) => {
    setData((prev) => {
      const filtered = prev.projects.filter((p) => p.id !== id)
      // Renumber remaining projects sequentially
      const renumbered = filtered.map((p, idx) => ({
        ...p,
        number: idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`,
      }))
      return {
        ...prev,
        projects: renumbered,
      }
    })
  }

  const reorderProjects = (reordered: Project[]) => {
    const renumbered = reordered.map((p, idx) => ({
      ...p,
      number: idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`,
    }))
    setData((prev) => ({
      ...prev,
      projects: renumbered,
    }))
  }

  const updateServices = (services: ServiceItem[]) => {
    setData((prev) => ({
      ...prev,
      services,
    }))
  }

  const resetToDefaults = () => {
    clearStoredPortfolioData()
    setData(initialPortfolioData)
  }

  const exportDataAsJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', 'raman_portfolio_data.json')
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  const importDataFromJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString)
      if (parsed && parsed.hero && Array.isArray(parsed.projects)) {
        setData(parsed)
        return true
      }
    } catch (e) {
      console.error('Failed to import JSON data:', e)
    }
    return false
  }

  return (
    <PortfolioDataContext.Provider
      value={{
        data,
        updateHero,
        updateAbout,
        updateContact,
        addProject,
        updateProject,
        deleteProject,
        reorderProjects,
        updateServices,
        resetToDefaults,
        exportDataAsJSON,
        importDataFromJSON,
      }}
    >
      {children}
    </PortfolioDataContext.Provider>
  )
}

export const usePortfolioData = () => {
  const context = useContext(PortfolioDataContext)
  if (!context) {
    throw new Error('usePortfolioData must be used within a PortfolioDataProvider')
  }
  return context
}
