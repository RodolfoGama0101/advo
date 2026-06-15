import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Eye, Edit } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../../lib/api'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { DataTable } from '../../../components/ui/DataTable'
import { Badge } from '../../../components/ui/Badge'
import { formatCpfCnpj, formatPhone } from '../../../lib/utils'

export const ClientesListPage = () => {
  const navigate = useNavigate()
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await api.get('/api/clientes')
        setClientes(response.data)
      } catch (error) {
        console.error('Failed to fetch clientes:', error)
        toast.error('Erro ao buscar a lista de clientes.')
      } finally {
        setLoading(false)
      }
    }
    fetchClientes()
  }, [])

  const filteredClientes = useMemo(() => {
    return clientes.filter(c => {
      const search = searchTerm.toLowerCase()
      const nome = c.nome?.toLowerCase() || ''
      const cpfCnpj = c.cpfCnpj || ''
      const email = c.email?.toLowerCase() || ''
      return nome.includes(search) || cpfCnpj.includes(search) || email.includes(search)
    })
  }, [clientes, searchTerm])

  const columns = [
    {
      header: 'Nome',
      key: 'nome',
      render: (row) => (
        <div style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>
          {row.nome}
          {row.tipoPessoa && (
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', marginLeft: '8px', background: 'var(--color-bg-surface)', padding: '2px 6px', borderRadius: '4px' }}>
              {row.tipoPessoa}
            </span>
          )}
        </div>
      )
    },
    {
      header: 'CPF/CNPJ',
      key: 'cpfCnpj',
      render: (row) => <span style={{ color: 'var(--color-text-secondary)', fontFamily: 'monospace' }}>{formatCpfCnpj(row.cpfCnpj)}</span>
    },
    {
      header: 'E-mail / Telefone',
      key: 'contato',
      render: (row) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {row.email && <span style={{ fontSize: '0.875rem' }}>{row.email}</span>}
          {row.telefone && <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>{formatPhone(row.telefone)}</span>}
        </div>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => {
        let variant = 'default'
        if (row.status === 'ATIVO') variant = 'success'
        if (row.status === 'INATIVO') variant = 'neutral'
        if (row.status === 'PROSPECTO') variant = 'info'
        return <Badge variant={variant}>{row.status || 'ATIVO'}</Badge>
      }
    },
    {
      header: 'Ações',
      key: 'actions',
      style: { width: '120px', textAlign: 'right' },
      render: (row) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/clientes/${row.id}`) }} style={{ padding: '6px' }}>
            <Eye size={18} style={{ color: 'var(--color-text-secondary)' }} />
          </Button>
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/clientes/editar/${row.id}`) }} style={{ padding: '6px' }}>
            <Edit size={18} style={{ color: 'var(--color-primary)' }} />
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
            Clientes
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
            Gerencie as pessoas físicas e jurídicas atendidas pelo escritório.
          </p>
        </div>
        <Button variant="primary" onClick={() => navigate('/clientes/novo')} icon={<Plus size={18} />}>
          Novo Cliente
        </Button>
      </div>

      <Card style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ maxWidth: '400px', width: '100%' }}>
            <Input 
              icon={<Search size={18} />}
              placeholder="Buscar por nome, e-mail ou CPF/CNPJ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Data Table */}
        <DataTable 
          columns={columns} 
          data={filteredClientes} 
          loading={loading}
          emptyMessage={searchTerm ? 'Nenhum cliente encontrado com esse filtro.' : 'Nenhum cliente cadastrado. Clique em "Novo Cliente" para começar.'}
          onRowClick={(row) => navigate(`/clientes/${row.id}`)}
        />
      </Card>
    </div>
  )
}
