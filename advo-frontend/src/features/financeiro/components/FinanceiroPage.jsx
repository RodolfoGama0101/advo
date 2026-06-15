import { useState, useEffect, useMemo } from 'react'
import { Plus, CheckCircle, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../../lib/api'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Select } from '../../../components/ui/Select'
import { DataTable } from '../../../components/ui/DataTable'
import { Badge } from '../../../components/ui/Badge'
import { TransacaoFormModal } from './TransacaoFormModal'
import { formatCurrency, formatDate } from '../../../lib/utils'

export const FinanceiroPage = () => {
  const [transacoes, setTransacoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Filters
  const [tipoFilter, setTipoFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const fetchTransacoes = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (tipoFilter) params.append('tipo', tipoFilter)
      if (statusFilter) params.append('status', statusFilter)

      const res = await api.get(`/api/financeiro?${params.toString()}`)
      setTransacoes(res.data)
    } catch (error) {
      console.error('Failed to fetch financeiro:', error)
      toast.error('Erro ao buscar movimentações financeiras.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransacoes()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipoFilter, statusFilter])

  const handlePagar = async (id) => {
    try {
      await api.patch(`/api/financeiro/${id}/pagar`)
      toast.success('Transação marcada como paga!')
      fetchTransacoes()
    } catch (err) {
      toast.error('Erro ao atualizar status da transação.')
    }
  }

  // Calculate totals from current transacoes
  const { totalReceitas, totalDespesas, saldo } = useMemo(() => {
    let r = 0, d = 0
    transacoes.forEach(t => {
      if (t.tipo === 'RECEITA') r += t.valor
      if (t.tipo === 'DESPESA') d += t.valor
    })
    return { totalReceitas: r, totalDespesas: d, saldo: r - d }
  }, [transacoes])

  const getStatusBadge = (status) => {
    if (status === 'PAGO') return <Badge variant="success">Pago</Badge>
    if (status === 'PENDENTE') return <Badge variant="warning">Pendente</Badge>
    if (status === 'ATRASADO') return <Badge variant="danger">Atrasado</Badge>
    return <Badge variant="default">{status}</Badge>
  }

  const columns = [
    {
      header: 'Descrição',
      key: 'descricao',
      render: (row) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{row.descricao}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
            Venc: {formatDate(row.dataVencimento)}
          </span>
        </div>
      )
    },
    {
      header: 'Tipo',
      key: 'tipo',
      render: (row) => (
        <span style={{ 
          color: row.tipo === 'RECEITA' ? 'var(--color-success)' : 'var(--color-danger)',
          display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500, fontSize: '0.875rem' 
        }}>
          {row.tipo === 'RECEITA' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {row.tipo}
        </span>
      )
    },
    {
      header: 'Valor',
      key: 'valor',
      render: (row) => <span style={{ fontWeight: 600 }}>{formatCurrency(row.valor)}</span>
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => getStatusBadge(row.status)
    },
    {
      header: 'Ações',
      key: 'actions',
      style: { width: '100px', textAlign: 'right' },
      render: (row) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {row.status !== 'PAGO' ? (
            <Button variant="ghost" size="sm" onClick={() => handlePagar(row.id)} title="Marcar como Pago" style={{ padding: '6px' }}>
              <CheckCircle size={18} style={{ color: 'var(--color-success)' }} />
            </Button>
          ) : (
             <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Liquidado</span>
          )}
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
            Financeiro
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
            Controle de honorários, despesas processuais e faturamento geral.
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)} icon={<Plus size={18} />}>
          Novo Lançamento
        </Button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
        <Card style={{ borderLeft: '4px solid var(--color-success)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-success-subtle)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Total Receitas (Filtro)</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '4px 0 0' }}>{formatCurrency(totalReceitas)}</h3>
          </div>
        </Card>
        
        <Card style={{ borderLeft: '4px solid var(--color-danger)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-danger-subtle)', color: 'var(--color-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingDown size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Total Despesas (Filtro)</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '4px 0 0' }}>{formatCurrency(totalDespesas)}</h3>
          </div>
        </Card>

        <Card style={{ borderLeft: `4px solid ${saldo >= 0 ? 'var(--color-primary)' : 'var(--color-warning)'}`, display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-bg-subtle)', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Saldo Líquido</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '4px 0 0' }}>{formatCurrency(saldo)}</h3>
          </div>
        </Card>
      </div>

      <Card style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Filters */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <Select 
            value={tipoFilter}
            onChange={(e) => setTipoFilter(e.target.value)}
            options={[
              { value: '', label: 'Todas as Movimentações' },
              { value: 'RECEITA', label: 'Apenas Receitas' },
              { value: 'DESPESA', label: 'Apenas Despesas' }
            ]}
          />
          <Select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: '', label: 'Todos os Status' },
              { value: 'PENDENTE', label: 'Pendentes' },
              { value: 'PAGO', label: 'Pagos / Liquidados' },
              { value: 'ATRASADO', label: 'Atrasados' }
            ]}
          />
        </div>

        {/* Data Table */}
        <DataTable 
          columns={columns} 
          data={transacoes} 
          loading={loading}
          emptyMessage="Nenhuma transação encontrada com os filtros atuais."
        />
      </Card>

      <TransacaoFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={fetchTransacoes}
      />
    </div>
  )
}
