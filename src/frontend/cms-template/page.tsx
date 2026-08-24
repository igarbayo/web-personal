'use client'

import React, { useEffect, useState } from 'react'
import { CmsClient, DictionariesBundle } from '@/lib/cmsClient'
import CmsHeader from '@/components/cms/CmsHeader'
import CmsSectionNav, { CmsSectionTab } from '@/components/cms/CmsSectionNav'
import ConfirmationModal from '@/components/cms/ConfirmationModal'
import { ToastContainer, ToastMessage } from '@/components/cms/ui/Toast'
import { CmsButton, CmsInput, CmsLabel } from '@/components/cms/ui/CmsInput'
import CmsCard from '@/components/cms/ui/CmsCard'
import ThemeToggle from '@/components/ThemeToggle'

// Section Editors
import HeaderMetaEditor from '@/components/cms/sections/HeaderMetaEditor'
import SummaryEditor from '@/components/cms/sections/SummaryEditor'
import SkillsEditor from '@/components/cms/sections/SkillsEditor'
import EducationEditor from '@/components/cms/sections/EducationEditor'
import ExperienceEditor from '@/components/cms/sections/ExperienceEditor'
import LeadershipEditor from '@/components/cms/sections/LeadershipEditor'
import ProjectsEditor from '@/components/cms/sections/ProjectsEditor'
import LanguagesEditor from '@/components/cms/sections/LanguagesEditor'
import VolunteeringEditor from '@/components/cms/sections/VolunteeringEditor'
import CertificationsEditor from '@/components/cms/sections/CertificationsEditor'
import MediaManager from '@/components/cms/sections/MediaManager'

export default function CmsDashboardPage() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [loginUsername, setLoginUsername] = useState('ignacio')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState<string | null>(null)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // Content state
  const [bundle, setBundle] = useState<DictionariesBundle | null>(null)
  const [initialBundle, setInitialBundle] = useState<DictionariesBundle | null>(null)
  const [activeTab, setActiveTab] = useState<CmsSectionTab>('header_meta')
  const [isLoadingContent, setIsLoadingContent] = useState(false)

  // Save & Confirmation Modal State
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveModalError, setSaveModalError] = useState<string | null>(null)

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const showToast = (
    type: 'success' | 'error' | 'info' | 'warning',
    title: string,
    description?: string
  ) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, type, title, description }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = CmsClient.getToken()
      if (!token) {
        setIsAuthenticated(false)
        return
      }
      try {
        await CmsClient.getMe()
        setIsAuthenticated(true)
        loadDictionaries()
      } catch {
        CmsClient.removeToken()
        setIsAuthenticated(false)
      }
    }
    checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadDictionaries = async () => {
    try {
      setIsLoadingContent(true)
      const data = await CmsClient.getDictionaries()
      setBundle(data)
      setInitialBundle(JSON.parse(JSON.stringify(data)))
    } catch (err: any) {
      showToast('error', 'Error al cargar diccionarios', err.message)
    } finally {
      setIsLoadingContent(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggingIn(true)
    setLoginError(null)

    try {
      await CmsClient.login(loginUsername, loginPassword)
      setIsAuthenticated(true)
      showToast('success', 'Sesión iniciada', 'Bienvenido al panel de control CMS.')
      loadDictionaries()
    } catch (err: any) {
      setLoginError(err.message)
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleLogout = () => {
    CmsClient.removeToken()
    setIsAuthenticated(false)
    setBundle(null)
    setInitialBundle(null)
    showToast('info', 'Sesión cerrada', 'Has salido del CMS.')
  }

  const hasUnsavedChanges =
    Boolean(bundle && initialBundle) &&
    JSON.stringify(bundle) !== JSON.stringify(initialBundle)

  const getModifiedSections = (): string[] => {
    if (!bundle || !initialBundle) return []
    const sections = [
      'meta',
      'nav',
      'header',
      'summary',
      'skills',
      'education',
      'experience',
      'leadership',
      'projects',
      'languages',
      'volunteering',
      'certifications',
    ]
    return sections.filter(
      (sec) =>
        JSON.stringify(bundle.es[sec as keyof typeof bundle.es]) !==
          JSON.stringify(initialBundle.es[sec as keyof typeof initialBundle.es]) ||
        JSON.stringify(bundle.en[sec as keyof typeof bundle.en]) !==
          JSON.stringify(initialBundle.en[sec as keyof typeof initialBundle.en]) ||
        JSON.stringify(bundle.gl[sec as keyof typeof bundle.gl]) !==
          JSON.stringify(initialBundle.gl[sec as keyof typeof initialBundle.gl])
    )
  }

  const handleConfirmSaveAll = async (password: string, commitMsg: string) => {
    if (!bundle) return
    setIsSaving(true)
    setSaveModalError(null)

    try {
      const res = await CmsClient.saveDictionaries(bundle, password, commitMsg)
      showToast(
        'success',
        'Cambios publicados con éxito',
        res.message || 'Se ha creado el commit y GitHub Pages desplegará la nueva versión.'
      )
      setInitialBundle(JSON.parse(JSON.stringify(bundle)))
      setIsSaveModalOpen(false)
    } catch (err: any) {
      setSaveModalError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDiscardChanges = () => {
    if (!initialBundle) return
    if (
      window.confirm(
        '¿Estás seguro de descartar todos los cambios pendientes sin guardar?'
      )
    ) {
      setBundle(JSON.parse(JSON.stringify(initialBundle)))
      showToast('info', 'Cambios descartados', 'Se han restaurado los datos originales.')
    }
  }

  // 1. Loading state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background font-mono text-xs text-muted">
        Comprobando credenciales...
      </div>
    )
  }

  // 2. Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="max-w-md w-full">
          <CmsCard className="p-6 md:p-8">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-accent rounded-sm flex items-center justify-center text-white font-mono font-bold text-xs">
                  G
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground tracking-tight">
                    Ignacio Garbayo <span className="text-accent">_</span>
                  </h2>
                  <p className="text-[11px] font-mono text-muted uppercase">
                    Acceso al Panel de Control
                  </p>
                </div>
              </div>
              <ThemeToggle />
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <CmsLabel htmlFor="username" required>
                  Usuario
                </CmsLabel>
                <CmsInput
                  id="username"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="ignacio"
                  required
                />
              </div>

              <div>
                <CmsLabel htmlFor="password" required>
                  Contraseña Maestra
                </CmsLabel>
                <CmsInput
                  id="password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Introduce tu contraseña..."
                  required
                  autoFocus
                />
              </div>

              {loginError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-600 dark:text-red-400 font-mono">
                  {loginError}
                </div>
              )}

              <CmsButton
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? 'Verificando...' : 'Iniciar Sesión'}
              </CmsButton>
            </form>
          </CmsCard>
        </div>
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </div>
    )
  }

  // 3. Authenticated Dashboard
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <CmsHeader
        hasUnsavedChanges={hasUnsavedChanges}
        isSaving={isSaving}
        onSaveAll={() => {
          setSaveModalError(null)
          setIsSaveModalOpen(true)
        }}
        onDiscard={handleDiscardChanges}
        onLogout={handleLogout}
      />

      <CmsSectionNav activeTab={activeTab} onSelectTab={setActiveTab} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8 w-full flex-1">
        {isLoadingContent && !bundle ? (
          <div className="p-12 text-center text-xs font-mono text-muted">
            Cargando contenidos trilingües desde FastAPI...
          </div>
        ) : !bundle ? (
          <div className="p-12 text-center text-xs font-mono text-red-500">
            Error al conectar con la API de FastAPI. Asegúrate de que el backend está corriendo en http://localhost:8000.
          </div>
        ) : (
          <div className="space-y-6">
            {activeTab === 'header_meta' && (
              <HeaderMetaEditor bundle={bundle} onChange={setBundle} />
            )}
            {activeTab === 'summary' && (
              <SummaryEditor bundle={bundle} onChange={setBundle} />
            )}
            {activeTab === 'skills' && (
              <SkillsEditor bundle={bundle} onChange={setBundle} />
            )}
            {activeTab === 'education' && (
              <EducationEditor bundle={bundle} onChange={setBundle} />
            )}
            {activeTab === 'experience' && (
              <ExperienceEditor bundle={bundle} onChange={setBundle} />
            )}
            {activeTab === 'leadership' && (
              <LeadershipEditor bundle={bundle} onChange={setBundle} />
            )}
            {activeTab === 'projects' && (
              <ProjectsEditor bundle={bundle} onChange={setBundle} />
            )}
            {activeTab === 'languages' && (
              <LanguagesEditor bundle={bundle} onChange={setBundle} />
            )}
            {activeTab === 'volunteering' && (
              <VolunteeringEditor bundle={bundle} onChange={setBundle} />
            )}
            {activeTab === 'certifications' && (
              <CertificationsEditor bundle={bundle} onChange={setBundle} />
            )}
            {activeTab === 'media' && (
              <MediaManager
                showToast={showToast}
                onMediaChanged={() => loadDictionaries()}
              />
            )}
          </div>
        )}
      </main>

      {/* Confirmation Modal on Save */}
      <ConfirmationModal
        isOpen={isSaveModalOpen}
        title="Publicar Cambios en ignaciogarbayo.com"
        description="Se validarán todos los invariantes (paridad trilingüe y años de 4 cifras) antes de hacer el commit en GitHub."
        diffSummary={{
          section: 'Publicación Global',
          fieldsModified: getModifiedSections(),
          note: `${getModifiedSections().length} sección(es) modificada(s).`,
        }}
        isSubmitting={isSaving}
        errorMessage={saveModalError}
        onClose={() => setIsSaveModalOpen(false)}
        onConfirm={handleConfirmSaveAll}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}
