import { useState, useEffect } from 'react'
import { FileText, Download, Trash2, HardDrive } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../../lib/api'
import { Card } from '../../../components/ui/Card'
import { Select } from '../../../components/ui/Select'
import { Button } from '../../../components/ui/Button'
import { DataTable } from '../../../components/ui/DataTable'
import { UploadZone } from './UploadZone'
import { formatDate } from '../../../lib/utils'

export const DocumentosPage = () => {
  const [processos, setProcessos] = useState([])
  const [selectedProcessoId, setSelectedProcessoId] = useState('')
  const [documentos, setDocumentos] = useState([])
  const [loading, setLoading] = useState(false)

  // Load all processos for the dropdown
  useEffect(() => {
    const fetchProcessos = async () => {
      try {
        const res = await api.get('/api/processos')
        setProcessos(res.data)
      } catch (err) {
        toast.error('Erro ao carregar lista de processos')
      }
    }
    fetchProcessos()
  }, [])

  // Load documents when a processo is selected
  const fetchDocumentos = async (procId) => {
    if (!procId) {
      setDocumentos([])
      return
    }
    setLoading(true)
    try {
      const res = await api.get(`/api/documentos/processo/${procId}`)
      setDocumentos(res.data)
    } catch (err) {
      console.error('Failed to fetch docs:', err)
      toast.error('Erro ao buscar os documentos do processo selecionado.')
      setDocumentos([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocumentos(selectedProcessoId)
  }, [selectedProcessoId])

  const handleDownload = async (docId, fileName) => {
    try {
      // Create an invisible anchor to trigger download from blob
      const response = await api.get(`/api/documentos/${docId}/download`, {
        responseType: 'blob'
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      toast.error('Erro ao fazer download do arquivo.')
    }
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A'
    const mb = bytes / 1024 / 1024
    if (mb < 1) return `${(bytes / 1024).toFixed(1)} KB`
    return `${mb.toFixed(2)} MB`
  }

  const columns = [
    {
      header: 'Nome do Arquivo',
      key: 'nomeArquivo',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={18} style={{ color: 'var(--color-primary)' }} />
          <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{row.nomeArquivo}</span>
        </div>
      )
    },
    {
      header: 'Tipo',
      key: 'tipoArquivo',
      render: (row) => <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{row.tipoArquivo}</span>
    },
    {
      header: 'Tamanho',
      key: 'tamanhoBytes',
      render: (row) => <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{formatFileSize(row.tamanhoBytes)}</span>
    },
    {
      header: 'Data de Upload',
      key: 'dataUpload',
      render: (row) => <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{formatDate(row.dataUpload)}</span>
    },
    {
      header: 'Ações',
      key: 'actions',
      style: { width: '80px', textAlign: 'right' },
      render: (row) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="ghost" size="sm" onClick={() => handleDownload(row.id, row.nomeArquivo)} style={{ padding: '6px' }}>
            <Download size={18} style={{ color: 'var(--color-primary)' }} />
          </Button>
        </div>
      )
    }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700 }}>
            Documentos Eletrônicos
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
            Gerencie petições, contratos e provas vinculadas aos seus processos.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', alignItems: 'start' }} className="grid-responsive-docs">
        
        {/* Left Column: Selector & Uploader */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '16px' }}>
              Selecionar Processo
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
              Como os documentos na API são sempre vinculados a um processo judicial, escolha-o abaixo:
            </p>
            <Select 
              value={selectedProcessoId}
              onChange={(e) => setSelectedProcessoId(e.target.value)}
              options={[
                { value: '', label: '--- Selecione um Processo ---' },
                ...processos.map(p => ({ value: p.id.toString(), label: `${p.numeroProcesso || 'S/N'} - ${p.titulo}` }))
              ]}
            />
          </Card>

          {selectedProcessoId && (
            <Card>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '16px' }}>
                Fazer Upload
              </h3>
              <UploadZone 
                processoId={selectedProcessoId} 
                onUploadComplete={() => fetchDocumentos(selectedProcessoId)} 
              />
            </Card>
          )}
        </div>

        {/* Right Column: Document List */}
        <div style={{ flex: 2 }}>
          <Card style={{ minHeight: '400px' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HardDrive size={20} />
              Arquivos do Processo
            </h3>
            
            {!selectedProcessoId ? (
              <div style={{ 
                height: '300px', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'var(--color-text-secondary)',
                border: '1px dashed var(--color-border-subtle)',
                borderRadius: 'var(--radius-md)'
              }}>
                <FileText size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                <p>Selecione um processo ao lado para visualizar e gerenciar os documentos.</p>
              </div>
            ) : (
              <DataTable 
                columns={columns} 
                data={documentos} 
                loading={loading}
                emptyMessage="Nenhum documento encontrado para este processo."
              />
            )}
          </Card>
        </div>

      </div>
    </div>
  )
}
