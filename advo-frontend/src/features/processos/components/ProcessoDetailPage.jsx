import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Briefcase, FileText, Calendar, Plus, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../../lib/api'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Badge } from '../../../components/ui/Badge'
import { formatDate, formatCurrency, formatCpfCnpj } from '../../../lib/utils'
import { MovimentacaoModal } from './MovimentacaoModal'

// Need to match ID from the static list in Form
const getAreaName = (id) => {
  const map = { 1: 'Cível', 2: 'Trabalhista', 3: 'Criminal', 4: 'Tributário', 5: 'Previdenciário', 6: 'Família', 7: 'Empresarial', 8: 'Consumidor' }
  return map[id] || `Área ID: ${id}`
}

export const ProcessoDetailPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [processo, setProcesso] = useState(null)
  const [cliente, setCliente] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchDados = async () => {
    try {
      setLoading(true)
      const resProc = await api.get(`/api/processos/${id}`)
      setProcesso(resProc.data)
      
      if (resProc.data.clienteId) {
        try {
          const resCli = await api.get(`/api/clientes/${resProc.data.clienteId}`)
          setCliente(resCli.data)
        } catch (err) {
          console.error('Could not load linked client details')
        }
      }
    } catch (error) {
      console.error('Failed to fetch processo details:', error)
      toast.error('Erro ao carregar detalhes do processo.')
      navigate('/processos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDados()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate])

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
        <div className="skeleton" style={{ height: '60px', width: '100%', borderRadius: 'var(--radius-md)' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
          <div className="skeleton" style={{ height: '300px', borderRadius: 'var(--radius-lg)' }} />
          <div className="skeleton" style={{ height: '300px', borderRadius: 'var(--radius-lg)' }} />
        </div>
      </div>
    )
  }

  if (!processo) return null

  const getStatusBadgeVariant = (status) => {
    if (status === 'ATIVO') return 'success'
    if (status === 'ARQUIVADO') return 'neutral'
    if (status === 'SUSPENSO') return 'warning'
    if (status === 'ENCERRADO') return 'danger'
    return 'default'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      {/* Header Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Button variant="ghost" size="sm" onClick={() => navigate('/processos')} style={{ padding: '8px' }}>
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700 }}>
              Detalhes do Processo
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>ID: {processo.id}</span>
              <span style={{ color: 'var(--color-border-subtle)' }}>|</span>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                Criado em {formatDate(processo.criadoEm)}
              </span>
            </div>
          </div>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)} icon={<Plus size={18} />}>
          Nova Movimentação
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-md)' }} className="grid-responsive-process">
        
        {/* Main Info Card */}
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{ 
              width: '48px', height: '48px', borderRadius: '12px', 
              background: 'var(--color-info-subtle)', color: 'var(--color-info)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <Briefcase size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                {processo.titulo}
              </h3>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                <Badge variant={getStatusBadgeVariant(processo.status)}>{processo.status || 'ATIVO'}</Badge>
                <Badge variant="outline">{processo.faseProcessual || 'FASE INICIAL'}</Badge>
                {processo.areaDireitoId && (
                  <Badge variant="neutral">{getAreaName(processo.areaDireitoId)}</Badge>
                )}
              </div>
            </div>
          </div>

          <hr style={{ border: 0, borderTop: '1px solid var(--color-border-subtle)', margin: '8px 0' }} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FileText size={14} /> Número (CNJ)
              </span>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, fontFamily: 'monospace' }}>
                {processo.numeroProcesso || 'Não informado'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Tribunal / Vara</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                {processo.tribunal ? `${processo.tribunal}${processo.vara ? ` - ${processo.vara}` : ''}` : 'Não informado'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={14} /> Distribuição
              </span>
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                {formatDate(processo.dataDistribuicao)}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Valor da Causa</span>
              <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-success)' }}>
                {formatCurrency(processo.valorCausa)}
              </span>
            </div>
          </div>

          {processo.descricao && (
            <>
              <hr style={{ border: 0, borderTop: '1px solid var(--color-border-subtle)', margin: '8px 0' }} />
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Objeto da Ação / Descrição</span>
                <p style={{ fontSize: '0.875rem', marginTop: '4px', whiteSpace: 'pre-wrap', color: 'var(--color-text-primary)' }}>
                  {processo.descricao}
                </p>
              </div>
            </>
          )}
        </Card>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }} className="grid-responsive-process-details">
          {/* Linked Client */}
          <Card style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                Cliente Vinculado
              </h3>
              {cliente && (
                <Button variant="ghost" size="sm" onClick={() => navigate(`/clientes/${cliente.id}`)} icon={<ExternalLink size={16} />}>
                  Ver Cliente
                </Button>
              )}
            </div>
            
            {cliente ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ fontWeight: 600, fontSize: '1.125rem' }}>{cliente.nome}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{cliente.tipoPessoa === 'PF' ? 'CPF' : 'CNPJ'}: {formatCpfCnpj(cliente.cpfCnpj)}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>E-mail: {cliente.email || 'N/A'}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Telefone: {cliente.telefone ? formatPhone(cliente.telefone) : 'N/A'}</div>
              </div>
            ) : (
              <div style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic', fontSize: '0.875rem' }}>
                Cliente não encontrado ou ID inválido ({processo.clienteId}).
              </div>
            )}
          </Card>

          {/* Timeline / Movimentações Placeholder */}
          <Card style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              Últimas Movimentações
            </h3>
            
            {/* The API does not return a list of movimentações. We must explain this in the UI gracefully. */}
            <div style={{ 
              padding: '24px', 
              background: 'var(--color-bg-base)', 
              borderRadius: 'var(--radius-md)', 
              border: '1px dashed var(--color-border-subtle)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Calendar size={32} style={{ color: 'var(--color-text-secondary)' }} />
              <div>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                  A API atual não suporta a listagem de movimentações.
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                  (Endpoint GET /api/processos/id/movimentacoes não existe). Você ainda pode adicionar movimentações através do botão "Nova Movimentação".
                </p>
              </div>
            </div>
          </Card>
        </div>

      </div>

      <MovimentacaoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        processoId={id} 
        onCreated={() => {
          // In a real app we'd refetch movimentacoes here
        }}
      />
    </div>
  )
}
