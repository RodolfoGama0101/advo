import { useState, useRef } from 'react'
import { UploadCloud, File, X } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../../lib/api'
import { useAuthStore } from '../../../stores/authStore'
import { Button } from '../../../components/ui/Button'

export const UploadZone = ({ processoId, onUploadComplete }) => {
  const { user } = useAuthStore()
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      setFile(droppedFile)
    }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) return
    if (!processoId) {
      toast.error('Selecione um processo antes de fazer upload.')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('processoId', processoId)
    formData.append('usuarioId', user?.usuarioId)

    try {
      // The API expects multipart/form-data
      await api.post('/api/documentos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      toast.success('Documento enviado com sucesso!')
      setFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      onUploadComplete && onUploadComplete()
    } catch (error) {
      console.error('Upload failed:', error)
      toast.error('Erro ao fazer upload do documento.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${isDragging ? 'var(--color-primary)' : 'var(--color-border-subtle)'}`,
            borderRadius: 'var(--radius-lg)',
            padding: '40px 20px',
            textAlign: 'center',
            backgroundColor: isDragging ? 'var(--color-primary-subtle)' : 'var(--color-bg-base)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <div style={{ 
            width: '48px', height: '48px', borderRadius: '50%', 
            background: 'var(--color-bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: isDragging ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <UploadCloud size={24} />
          </div>
          <div>
            <h4 style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Clique ou arraste um arquivo aqui</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
              Suporta PDF, DOCX, Imagens (Máx 10MB)
            </p>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
            // accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" // optional constraint
          />
        </div>
      ) : (
        <div style={{ 
          border: '1px solid var(--color-border-subtle)', 
          borderRadius: 'var(--radius-md)', 
          padding: '16px',
          background: 'var(--color-bg-surface)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <File size={24} style={{ color: 'var(--color-primary)' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>{file.name}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setFile(null)} disabled={uploading}>
            <X size={18} style={{ color: 'var(--color-danger)' }} />
          </Button>
        </div>
      )}

      {file && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="primary" onClick={handleUpload} disabled={uploading}>
            {uploading ? 'Enviando...' : 'Enviar Documento'}
          </Button>
        </div>
      )}

    </div>
  )
}
