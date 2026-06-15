import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../../lib/api'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { DataTable } from '../../../components/ui/DataTable'
import { Badge } from '../../../components/ui/Badge'
import { formatCurrency } from '../../../lib/utils'

export const ProcessosListPage = () => {
  const navigate = useNavigate()
  const [processos, setProcessos] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    const fetchProcessos = async () => {
      try {
        const response = await api.get('/api/processos')
        setProcessos(response.data)
      } catch (error) {
        console.error('Failed to fetch processos:', error)
        toast.error('Erro ao buscar a lista de processos.')
      } finally {
        setLoading(false)
      }
    }
    fetchProcessos()
  }, [])

  const filteredProcessos = useMemo(() => {
    return processos.filter(p => {
      const searchMatch = !searchTerm || 
        (p.titulo?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
        (p.numeroProcesso || '').includes(searchTerm)
      
      const statusMatch = !statusFilter || p.status === statusFilter

      return searchMatch && statusMatch
    })
  }, [processos, searchTerm, statusFilter])

  const getStatusBadgeVariant = (status) => {
    if (status === 'ATIVO') return 'success'
    if (status === 'ARQUIVADO') return 'neutral'
    if (status === 'SUSPENSO') return 'warning'
    if (status === 'ENCERRADO') return 'danger'
    return 'default'
  }

  const columns = [
    {
      header: 'Nº Processo / Título',
      key: 'titulo',
      render: (row) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{row.titulo}</span>
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontFamily: 'monospace' }}>
            {row.numeroProcesso || 'Sem número'}
          </span>
        </div>
      )
    },
    {
      header: 'Fase / Tribunal',
      key: 'fase',
      render: (row) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Badge variant="outline">{row.faseProcessual || 'N/A'}</Badge>
          {row.tribunal && <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{row.tribunal}</span>}
        </div>
      )
    },
    {
      header: 'Valor da Causa',
      key: 'valorCausa',
      render: (row) => <span style={{ fontWeight: 500 }}>{formatCurrency(row.valorCausa)}</span>
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <Badge variant={getStatusBadgeVariant(row.status)}>{row.status || 'ATIVO'}</Badge>
    },
    {
      header: 'Ações',
      key: 'actions',
      style: { width: '80px', textAlign: 'right' },
      render: (row) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/processos/${row.id}`) }} style={{ padding: '6px' }}>
            <Eye size={18} style={{ color: 'var(--color-primary)' }} />
          </Button>
        </div>
      )
    }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700 }}>
            Processos
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
            Gerencie os processos judiciais e extrajudiciais do escritório.
          </p>
        </div>
        <Button variant="primary" onClick={() => navigate('/processos/novo')} icon={<Plus size={18} />}>
          Novo Processo
        </Button>
      </div>

      <Card style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Filters */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'end' }}>
          <div style={{ flex: 2, minWidth: '300px' }}>
            <Input 
              icon={<Search size={18} />}
              placeholder="Buscar por título ou número..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ flex: 1 }}>
            <Select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: '', label: 'Todos os status' },
                { value: 'ATIVO', label: 'Ativo' },
                { value: 'ARQUIVADO', label: 'Arquivado' },
                { value: 'SUSPENSO', label: 'Suspenso' },
                { value: 'ENCERRADO', label: 'Encerrado' }
              ]}
            />
          </div>
        </div>

        {/* Data Table */}
        <DataTable 
          columns={columns} 
          data={filteredProcessos} 
          loading={loading}
          emptyMessage={searchTerm || statusFilter ? 'Nenhum processo encontrado com esses filtros.' : 'Nenhum processo cadastrado. Clique em "Novo Processo" para começar.'}
          onRowClick={(row) => navigate(`/processos/${row.id}`)}
        />
      </Card>
    </div>
  )
}
