import React, { useState } from 'react'
import {
  X,
  Plus,
  Trash2,
  Save,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  Layers,
  FileText,
  Eye,
  EyeOff,
  Lock,
  LogOut,
  ShieldCheck,
} from 'lucide-react'
import { usePortfolioData } from '../../context/PortfolioDataContext'
import type { Project } from '../../data/projects'

export interface AdminCMSModalProps {
  isOpen: boolean
  onClose: () => void
}

export const AdminCMSModal: React.FC<AdminCMSModalProps> = ({ isOpen, onClose }) => {
  const {
    data,
    updateHero,
    updateAbout,
    addProject,
    updateProject,
    deleteProject,
    resetToDefaults,
    exportDataAsJSON,
    importDataFromJSON,
  } = usePortfolioData()

  // Authentication State (Credentials: raman / Raman1@69)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return sessionStorage.getItem('raman_cms_auth') === 'true'
  })
  const [usernameInput, setUsernameInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const [activeTab, setActiveTab] = useState<'hero' | 'projects' | 'about' | 'import_export'>('projects')
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null)
  const [newProjectForm, setNewProjectForm] = useState<Omit<Project, 'id' | 'number'>>({
    name: '',
    type: 'Client',
    liveUrl: '#',
    images: [
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85',
    ],
    description: '',
  })
  const [isAddingNewProject, setIsAddingNewProject] = useState(false)
  const [importJsonText, setImportJsonText] = useState('')
  const [importStatus, setImportStatus] = useState<string | null>(null)

  if (!isOpen) return null

  // Handle Login Authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (usernameInput.trim() === 'raman' && passwordInput === 'Raman1@69') {
      setIsAuthenticated(true)
      sessionStorage.setItem('raman_cms_auth', 'true')
      setAuthError(null)
      setUsernameInput('')
      setPasswordInput('')
    } else {
      setAuthError('Invalid administrator credentials. Please check your username and password.')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem('raman_cms_auth')
  }

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProjectForm.name.trim()) return
    addProject(newProjectForm)
    setNewProjectForm({
      name: '',
      type: 'Client',
      liveUrl: '#',
      images: [
        'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85',
        'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85',
        'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85',
      ],
      description: '',
    })
    setIsAddingNewProject(false)
  }

  const handleImportSubmit = () => {
    if (!importJsonText.trim()) return
    const success = importDataFromJSON(importJsonText)
    if (success) {
      setImportStatus('Successfully imported portfolio data!')
      setTimeout(() => setImportStatus(null), 3000)
    } else {
      setImportStatus('Error: Invalid JSON structure.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] sm:max-h-[88vh] bg-[#121318] border border-[#D7E2EA]/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[#D7E2EA]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 sm:py-4 border-b border-[#D7E2EA]/15 bg-[#161820]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md">
              {isAuthenticated ? <Sparkles size={16} /> : <Lock size={16} />}
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                {isAuthenticated ? 'Portfolio CMS / Admin' : 'Admin Authentication'}
              </h2>
              <p className="text-[10px] sm:text-[11px] text-[#D7E2EA]/60 font-mono">
                {isAuthenticated ? 'Logged in as Raman • Live Updates' : 'Protected Area • Authorization Required'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 text-xs font-mono transition-colors cursor-pointer"
                title="Log out from CMS"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-full hover:bg-white/10 text-[#D7E2EA]/70 hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* 1. AUTHENTICATION LOGIN VIEW (When not logged in) */}
        {!isAuthenticated ? (
          <div className="p-6 sm:p-10 flex flex-col items-center justify-center my-auto">
            <div className="w-full max-w-sm space-y-6">
              <div className="text-center space-y-1.5">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3 shadow-lg">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Administrator Login</h3>
                <p className="text-xs text-[#D7E2EA]/60 font-mono">Enter credentials to edit portfolio content</p>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs text-center font-mono">
                  {authError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-[#D7E2EA]/70 mb-1.5">Username</label>
                  <input
                    type="text"
                    required
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="Enter admin username"
                    autoCapitalize="none"
                    autoComplete="username"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E0F14] border border-white/15 text-white text-xs font-mono focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#D7E2EA]/70 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Enter password"
                      autoComplete="current-password"
                      className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-[#0E0F14] border border-white/15 text-white text-xs font-mono focus:border-purple-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all active:scale-[0.98] cursor-pointer mt-2"
                >
                  Authorize & Access CMS
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* 2. AUTHENTICATED CMS MANAGER VIEW */
          <>
            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 px-4 sm:px-6 py-2 border-b border-[#D7E2EA]/10 bg-[#0E0F14] text-xs font-mono overflow-x-auto">
              <button
                onClick={() => setActiveTab('projects')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeTab === 'projects'
                    ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40 font-bold'
                    : 'text-[#D7E2EA]/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Layers size={14} />
                <span>Projects ({data.projects.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('hero')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeTab === 'hero'
                    ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40 font-bold'
                    : 'text-[#D7E2EA]/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Eye size={14} />
                <span>Hero Section</span>
              </button>

              <button
                onClick={() => setActiveTab('about')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeTab === 'about'
                    ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40 font-bold'
                    : 'text-[#D7E2EA]/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <FileText size={14} />
                <span>About Section</span>
              </button>

              <button
                onClick={() => setActiveTab('import_export')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeTab === 'import_export'
                    ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40 font-bold'
                    : 'text-[#D7E2EA]/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Download size={14} />
                <span>Export / Import JSON</span>
              </button>
            </div>

            {/* Tab Content Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* TAB 1: PROJECTS */}
              {activeTab === 'projects' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-white text-base uppercase">Manage Projects</h3>
                      <p className="text-xs text-[#D7E2EA]/60 font-mono">
                        Add, edit, reorder or remove projects. The 3D sticky stack updates dynamically.
                      </p>
                    </div>

                    {!isAddingNewProject && (
                      <button
                        onClick={() => setIsAddingNewProject(true)}
                        className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs shadow-lg transition-colors cursor-pointer"
                      >
                        <Plus size={15} />
                        <span>Add New Project</span>
                      </button>
                    )}
                  </div>

                  {/* Add New Project Form Drawer */}
                  {isAddingNewProject && (
                    <form
                      onSubmit={handleCreateProject}
                      className="p-4 sm:p-5 rounded-2xl bg-[#1A1C24] border border-purple-500/30 space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <h4 className="text-sm font-bold text-purple-300 uppercase">New Project Details</h4>
                        <button
                          type="button"
                          onClick={() => setIsAddingNewProject(false)}
                          className="text-xs text-[#D7E2EA]/60 hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-xs font-mono text-[#D7E2EA]/70 mb-1">Project Name *</label>
                          <input
                            type="text"
                            required
                            value={newProjectForm.name}
                            onChange={(e) => setNewProjectForm({ ...newProjectForm, name: e.target.value })}
                            placeholder="e.g. Cyberpunk Hologram"
                            className="w-full px-3 py-2 rounded-lg bg-[#0E0F14] border border-white/15 text-white text-xs focus:border-purple-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-[#D7E2EA]/70 mb-1">Category / Type</label>
                          <select
                            value={newProjectForm.type}
                            onChange={(e) => setNewProjectForm({ ...newProjectForm, type: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#0E0F14] border border-white/15 text-white text-xs focus:border-purple-500 focus:outline-none"
                          >
                            <option value="Client">Client</option>
                            <option value="Personal">Personal</option>
                            <option value="Commercial">Commercial</option>
                            <option value="R&D Experiment">R&D Experiment</option>
                          </select>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-mono text-[#D7E2EA]/70 mb-1">Live URL</label>
                          <input
                            type="text"
                            value={newProjectForm.liveUrl}
                            onChange={(e) => setNewProjectForm({ ...newProjectForm, liveUrl: e.target.value })}
                            placeholder="https://..."
                            className="w-full px-3 py-2 rounded-lg bg-[#0E0F14] border border-white/15 text-white text-xs focus:border-purple-500 focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2 space-y-2">
                          <label className="block text-xs font-mono text-[#D7E2EA]/70">3 Preview Image URLs (Top Left, Bottom Left, Right Featured)</label>
                          <input
                            type="text"
                            value={newProjectForm.images[0]}
                            onChange={(e) => {
                              const imgs = [...newProjectForm.images] as [string, string, string]
                              imgs[0] = e.target.value
                              setNewProjectForm({ ...newProjectForm, images: imgs })
                            }}
                            placeholder="Image 1 (Top Left URL)"
                            className="w-full px-3 py-1.5 rounded-lg bg-[#0E0F14] border border-white/15 text-white text-xs"
                          />
                          <input
                            type="text"
                            value={newProjectForm.images[1]}
                            onChange={(e) => {
                              const imgs = [...newProjectForm.images] as [string, string, string]
                              imgs[1] = e.target.value
                              setNewProjectForm({ ...newProjectForm, images: imgs })
                            }}
                            placeholder="Image 2 (Bottom Left URL)"
                            className="w-full px-3 py-1.5 rounded-lg bg-[#0E0F14] border border-white/15 text-white text-xs"
                          />
                          <input
                            type="text"
                            value={newProjectForm.images[2]}
                            onChange={(e) => {
                              const imgs = [...newProjectForm.images] as [string, string, string]
                              imgs[2] = e.target.value
                              setNewProjectForm({ ...newProjectForm, images: imgs })
                            }}
                            placeholder="Image 3 (Right Featured URL)"
                            className="w-full px-3 py-1.5 rounded-lg bg-[#0E0F14] border border-white/15 text-white text-xs"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors cursor-pointer"
                        >
                          Save & Add Project
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Projects List */}
                  <div className="space-y-3">
                    {data.projects.map((project) => (
                      <div
                        key={project.id}
                        className="p-3.5 sm:p-4 rounded-2xl bg-[#171922] border border-white/10 flex flex-col gap-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-sm font-bold text-purple-400 bg-purple-500/15 px-2.5 py-0.5 rounded-md border border-purple-500/30">
                              {project.number}
                            </span>
                            <div>
                              <h4 className="font-bold text-white text-sm">{project.name}</h4>
                              <span className="text-[11px] text-[#D7E2EA]/60 uppercase font-mono">{project.type}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingProjectId(editingProjectId === project.id ? null : project.id)}
                              className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white transition-colors cursor-pointer"
                            >
                              {editingProjectId === project.id ? 'Close' : 'Edit'}
                            </button>

                            <button
                              onClick={() => deleteProject(project.id)}
                              className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 transition-colors cursor-pointer"
                              title="Delete project"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>

                        {/* Inline Edit Box */}
                        {editingProjectId === project.id && (
                          <div className="pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-mono text-[#D7E2EA]/70 mb-1">Title</label>
                              <input
                                type="text"
                                value={project.name}
                                onChange={(e) => updateProject(project.id, { name: e.target.value })}
                                className="w-full px-2.5 py-1.5 rounded bg-[#0E0F14] border border-white/15 text-xs text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-mono text-[#D7E2EA]/70 mb-1">Category / Type</label>
                              <input
                                type="text"
                                value={project.type}
                                onChange={(e) => updateProject(project.id, { type: e.target.value })}
                                className="w-full px-2.5 py-1.5 rounded bg-[#0E0F14] border border-white/15 text-xs text-white"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[11px] font-mono text-[#D7E2EA]/70 mb-1">Live Project Link</label>
                              <input
                                type="text"
                                value={project.liveUrl}
                                onChange={(e) => updateProject(project.id, { liveUrl: e.target.value })}
                                className="w-full px-2.5 py-1.5 rounded bg-[#0E0F14] border border-white/15 text-xs text-white"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: HERO */}
              {activeTab === 'hero' && (
                <div className="space-y-4">
                  <h3 className="font-bold text-white text-base uppercase">Hero Section Content</h3>

                  <div>
                    <label className="block text-xs font-mono text-[#D7E2EA]/70 mb-1">Heading / Greeting *</label>
                    <input
                      type="text"
                      value={data.hero.greeting}
                      onChange={(e) => updateHero({ greeting: e.target.value })}
                      placeholder="HI, I'M RAMAN"
                      className="w-full px-3 py-2 rounded-lg bg-[#0E0F14] border border-white/15 text-white text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#D7E2EA]/70 mb-1">Left Bio Text</label>
                    <textarea
                      rows={3}
                      value={data.hero.leftBio}
                      onChange={(e) => updateHero({ leftBio: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#0E0F14] border border-white/15 text-white text-xs leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-mono text-[#D7E2EA]/70 mb-1">Contact Button Label</label>
                      <input
                        type="text"
                        value={data.hero.ctaText}
                        onChange={(e) => updateHero({ ctaText: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#0E0F14] border border-white/15 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-[#D7E2EA]/70 mb-1">Portrait Path / Image URL</label>
                      <input
                        type="text"
                        value={data.hero.portraitPath}
                        onChange={(e) => updateHero({ portraitPath: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#0E0F14] border border-white/15 text-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: ABOUT */}
              {activeTab === 'about' && (
                <div className="space-y-4">
                  <h3 className="font-bold text-white text-base uppercase">About Section Content</h3>

                  <div>
                    <label className="block text-xs font-mono text-[#D7E2EA]/70 mb-1">Section Heading</label>
                    <input
                      type="text"
                      value={data.about.heading}
                      onChange={(e) => updateAbout({ heading: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#0E0F14] border border-white/15 text-white text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#D7E2EA]/70 mb-1">Story Paragraph</label>
                    <textarea
                      rows={4}
                      value={data.about.paragraph}
                      onChange={(e) => updateAbout({ paragraph: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#0E0F14] border border-white/15 text-white text-xs leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: IMPORT / EXPORT JSON */}
              {activeTab === 'import_export' && (
                <div className="space-y-5">
                  <div>
                    <h3 className="font-bold text-white text-base uppercase">Export / Backup Content</h3>
                    <p className="text-xs text-[#D7E2EA]/60 mb-3 font-mono">
                      Download the current complete portfolio configuration as a clean JSON file.
                    </p>
                    <button
                      onClick={exportDataAsJSON}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      <Download size={15} />
                      <span>Download raman_portfolio_data.json</span>
                    </button>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <h3 className="font-bold text-white text-base uppercase">Import / Restore Content</h3>
                    <p className="text-xs text-[#D7E2EA]/60 mb-3 font-mono">
                      Paste valid JSON configuration below to instantly restore or load custom content.
                    </p>
                    <textarea
                      rows={6}
                      value={importJsonText}
                      onChange={(e) => setImportJsonText(e.target.value)}
                      placeholder='Paste JSON here... { "hero": { ... }, "projects": [ ... ] }'
                      className="w-full px-3 py-2 rounded-lg bg-[#0E0F14] border border-white/15 text-white font-mono text-xs"
                    />
                    {importStatus && (
                      <p className={`text-xs mt-1 ${importStatus.startsWith('Error') ? 'text-red-400' : 'text-emerald-400'}`}>
                        {importStatus}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-2.5 mt-3">
                      <button
                        onClick={handleImportSubmit}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-colors cursor-pointer"
                      >
                        <Upload size={15} />
                        <span>Apply JSON Configuration</span>
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm('Reset all content back to factory defaults?')) {
                            resetToDefaults()
                          }
                        }}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 text-xs transition-colors cursor-pointer"
                      >
                        <RotateCcw size={14} />
                        <span>Reset Defaults</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-3 border-t border-[#D7E2EA]/15 bg-[#161820]">
              <span className="text-[10px] sm:text-[11px] font-mono text-[#D7E2EA]/50">
                Changes saved automatically and persisted.
              </span>
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                <Save size={14} />
                <span>Done</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
