'use client'

import React, { useEffect, useState } from 'react'
import { CmsClient, MediaItem, MediaListResponse } from '@/lib/cmsClient'
import ConfirmationModal from '../ConfirmationModal'
import CmsCard from '../ui/CmsCard'
import { CmsBadge } from '../ui/CmsBadge'
import { CmsButton, CmsInput, CmsLabel } from '../ui/CmsInput'

interface MediaManagerProps {
  onMediaChanged?: () => void
  showToast: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void
}

export default function MediaManager({ onMediaChanged, showToast }: MediaManagerProps) {
  const [mediaData, setMediaData] = useState<MediaListResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [customName, setCustomName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Confirmation Modal State
  const [modalOpen, setModalOpen] = useState(false)
  const [modalAction, setModalAction] = useState<'upload' | 'delete'>('upload')
  const [targetFilename, setTargetFilename] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [modalError, setModalError] = useState<string | null>(null)

  const loadMedia = async () => {
    try {
      setLoading(true)
      const data = await CmsClient.listMedia()
      setMediaData(data)
    } catch (err: any) {
      showToast('error', 'Error al cargar medios', err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMedia()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      if (!customName) {
        setCustomName(file.name.replace(/\.[^/.]+$/, ''))
      }
    }
  }

  const handleOpenUploadConfirm = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) return
    setModalAction('upload')
    setModalError(null)
    setModalOpen(true)
  }

  const handleOpenDeleteConfirm = (filename: string) => {
    setTargetFilename(filename)
    setModalAction('delete')
    setModalError(null)
    setModalOpen(true)
  }

  const handleConfirmAction = async (password: string, commitMsg: string) => {
    setIsSubmitting(true)
    setModalError(null)

    try {
      if (modalAction === 'upload') {
        if (!selectedFile) throw new Error('No hay archivo seleccionado')
        const res = await CmsClient.uploadMedia(selectedFile, customName, password)
        showToast('success', 'Imagen optimizada', res.message)
        setSelectedFile(null)
        setCustomName('')
      } else if (modalAction === 'delete') {
        const res = await CmsClient.deleteMedia(targetFilename, password)
        showToast('success', 'Archivo eliminado', res.message)
      }

      setModalOpen(false)
      await loadMedia()
      if (onMediaChanged) onMediaChanged()
    } catch (err: any) {
      setModalError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredItems = (mediaData?.items || []).filter((item) =>
    item.filename.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const usedPercentage = mediaData
    ? Math.min(100, Math.round((mediaData.total_size_mb / mediaData.budget_mb) * 100))
    : 0

  return (
    <div className="space-y-6">
      {/* Budget & Metrics Card */}
      <CmsCard
        title="Gestor de Medios y Presupuesto de Peso (public/)"
        description="Imágenes, logos y capturas. Next.js copia esta carpeta íntegra al build estático."
        action={
          <CmsButton
            type="button"
            size="sm"
            variant="secondary"
            onClick={loadMedia}
            disabled={loading}
          >
            {loading ? 'Cargando...' : '↻ Refrescar'}
          </CmsButton>
        }
      >
        <div className="space-y-4">
          <div className="bg-background border border-border rounded-xl p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <span>
                Presupuesto utilizado:{' '}
                <strong className="text-foreground">
                  {mediaData?.total_size_mb.toFixed(2) || '0.00'} MB
                </strong>{' '}
                / {mediaData?.budget_mb || 8.0} MB ({usedPercentage}%)
              </span>
              <span>
                Espacio disponible:{' '}
                <strong className="text-emerald-500">
                  {mediaData?.budget_remaining_mb.toFixed(2) || '8.00'} MB
                </strong>
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-surface border border-border rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  usedPercentage > 85
                    ? 'bg-red-500'
                    : usedPercentage > 60
                    ? 'bg-amber-500'
                    : 'bg-accent'
                }`}
                style={{ width: `${usedPercentage}%` }}
              />
            </div>

            <p className="text-[11px] text-muted font-sans">
              * Límite estricto fijado en 8 MB para asegurar despliegues rápidos en GitHub Pages y evitar que el job quede en <code>deployment_queued</code>.
            </p>
          </div>

          {/* Upload Box */}
          <form
            onSubmit={handleOpenUploadConfirm}
            className="border-2 border-dashed border-border hover:border-accent rounded-xl p-5 bg-surface/40 transition-colors space-y-4"
          >
            <div className="text-center space-y-1">
              <h4 className="text-sm font-bold text-foreground">
                Subir y Optimizar Nueva Imagen
              </h4>
              <p className="text-xs text-muted">
                Formatos admitidos: PNG, JPG, JPEG, WEBP, ICO. Conversión automática a WebP al 85% de calidad.
                SVG no se admite por seguridad: puede contener JavaScript ejecutable.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <CmsLabel required>Seleccionar Archivo</CmsLabel>
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp,.ico"
                  onChange={handleFileSelect}
                  className="w-full text-xs text-muted file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-border file:text-xs file:font-mono file:bg-surface file:text-foreground hover:file:border-accent cursor-pointer"
                  required
                />
              </div>

              <div>
                <CmsLabel>Nombre del Archivo Final (Slug Opcional)</CmsLabel>
                <CmsInput
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="ej. nuevo-logo-empresa"
                  className="text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <CmsButton
                type="submit"
                variant="primary"
                size="md"
                disabled={!selectedFile}
              >
                Subir y Convertir a WebP
              </CmsButton>
            </div>
          </form>
        </div>
      </CmsCard>

      {/* Media Grid */}
      <CmsCard
        title={`Archivos en public/ (${filteredItems.length})`}
        description="Explorador de recursos disponibles para asignar en cualquier sección del sitio."
        action={
          <div className="w-48 sm:w-64">
            <CmsInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar archivo..."
              className="text-xs py-1"
            />
          </div>
        }
      >
        {filteredItems.length === 0 ? (
          <p className="text-center py-8 text-xs font-mono text-muted">
            No se encontraron archivos que coincidan con la búsqueda.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-2">
            {filteredItems.map((item) => (
              <div
                key={item.filename}
                className="bg-background border border-border rounded-lg p-2.5 flex flex-col justify-between group hover:border-accent/50 transition-colors"
              >
                <div className="w-full h-24 bg-surface border border-border rounded flex items-center justify-center overflow-hidden mb-2 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt={item.filename}
                    className="max-h-full max-w-full object-contain p-1"
                    onError={(e) => {
                      ;(e.target as HTMLElement).style.display = 'none'
                    }}
                  />
                  <span className="absolute top-1 right-1 bg-black/70 text-white font-mono text-[9px] px-1 rounded">
                    {item.format}
                  </span>
                </div>

                <div className="space-y-1">
                  <p
                    className="text-xs font-mono font-medium text-foreground truncate"
                    title={item.filename}
                  >
                    {item.filename}
                  </p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-muted">
                    <span>{item.size_kb} KB</span>
                    {item.width && item.height && (
                      <span>
                        {item.width}×{item.height}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-2 mt-2 border-t border-border/50 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleOpenDeleteConfirm(item.filename)}
                    className="text-[11px] text-red-500 hover:text-red-700 font-mono"
                    title="Eliminar archivo"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CmsCard>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalOpen}
        title={
          modalAction === 'upload'
            ? 'Confirmar Subida y Optimización'
            : `Eliminar Archivo '${targetFilename}'`
        }
        description={
          modalAction === 'upload'
            ? `Se convertirá y optimizará el archivo como '${customName || selectedFile?.name}' en public/.`
            : `Se eliminará '${targetFilename}' de public/. Asegúrate de que ninguna sección lo esté utilizando.`
        }
        diffSummary={{
          section: 'Media Manager',
          fieldsModified: [
            modalAction === 'upload' ? selectedFile?.name || '' : targetFilename,
          ],
        }}
        isSubmitting={isSubmitting}
        errorMessage={modalError}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmAction}
      />
    </div>
  )
}
