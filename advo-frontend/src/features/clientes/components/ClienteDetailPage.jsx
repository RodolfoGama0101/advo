import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Edit, Mail, MapPin, Phone, User, FileText, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../../lib/api'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Badge } from '../../../components/ui/Badge'
import { formatCpfCnpj, formatPhone, formatCEP, formatDate } from '../../../lib/utils'

export const ClienteDetailPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [cliente, setCliente] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const response = await api.get(`/api/clientes/${id}`)
        setCliente(response.data)
      } catch (error) {
        console.error('Failed to fetch cliente details:', error)
        toast.error('Erro ao carregar detalhes do cliente.')
        navigate('/clientes')
      } finally {
        setLoading(false)
      }
    }
    fetchCliente()
  }, [id, navigate])

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
        <div className="skeleton" style={{ height: '60px', width: '100%', borderRadius: 'var(--radius-md)' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          <div className="skeleton" style={{ height: '200px', borderRadius: 'var(--radius-lg)' }} />
          <div className="skeleton" style={{ height: '200px', borderRadius: 'var(--radius-lg)' }} />
        </div>
      </div>
    )
  }

  if (!cliente) return null

  // Format full address string
  const getFullAddress = () => {
    const parts = []
    if (cliente.logradouro) parts.push(`${cliente.logradouro}, ${cliente.numero || 'S/N'}`)
    if (cliente.complemento) parts.push(cliente.complemento)
    if (cliente.bairro) parts.push(cliente.bairro)
    
    let cityState = []
    if (cliente.cidade) cityState.push(cliente.cidade)
    if (cliente.uf) cityState.push(cliente.uf)
    if (cityState.length > 0) parts.push(cityState.join(' - '))
    
    if (cliente.cep) parts.push(`CEP: ${formatCEP(cliente.cep)}`)
    
    return parts.join(' • ') || 'Endereço não informado'
  }

  const getStatusBadgeVariant = (status) => {
    if (status === 'ATIVO') return 'success'
    if (status === 'INATIVO') return 'neutral'
    if (status === 'PROSPECTO') return 'info'
    return 'default'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      {/* Header Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Button variant="ghost" size="sm" onClick={() => navigate('/clientes')} style={{ padding: '8px' }}>
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700 }}>
              Detalhes do Cliente
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>ID: {cliente.id}</span>
              <span style={{ color: 'var(--color-border-subtle)' }}>|</span>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                Criado em {formatDate(cliente.criadoEm)}
              </span>
            </div>
          </div>
        </div>
        <Button variant="primary" onClick={() => navigate(`/clientes/editar/${id}`)} icon={<Edit size={18} />}>
          Editar Cliente
        </Button>
      </div>

      {/* Info Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 'var(--spacing-md)' }}>
        
        {/* Main Info Card */}
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '48px', height: '48px', borderRadius: '50%', 
                background: 'var(--color-primary-subtle)', color: 'var(--color-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <User size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  {cliente.nome}
                </h3>
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <Badge variant="outline">{cliente.tipoPessoa === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}</Badge>
                  <Badge variant={getStatusBadgeVariant(cliente.status)}>{cliente.status || 'ATIVO'}</Badge>
                </div>
              </div>
            </div>
          </div>

          <hr style={{ border: 0, borderTop: '1px solid var(--color-border-subtle)', margin: '4px 0' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FileText size={18} style={{ color: 'var(--color-text-secondary)' }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                  {cliente.tipoPessoa === 'PF' ? 'CPF' : 'CNPJ'}
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{formatCpfCnpj(cliente.cpfCnpj) || 'Não informado'}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Mail size={18} style={{ color: 'var(--color-text-secondary)' }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>E-mail</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{cliente.email || 'Não informado'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Phone size={18} style={{ color: 'var(--color-text-secondary)' }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Telefone</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{formatPhone(cliente.telefone) || 'Não informado'}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Address and Additional Info */}
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={20} style={{ color: 'var(--color-primary)' }} />
              Endereço Completo
            </h3>
            <div style={{ 
              padding: '12px 16px', 
              background: 'var(--color-bg-surface)', 
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-subtle)',
              fontSize: '0.875rem',
              lineHeight: '1.5'
            }}>
              {getFullAddress()}
            </div>
          </div>

          {cliente.observacoes && (
            <>
              <hr style={{ border: 0, borderTop: '1px solid var(--color-border-subtle)', margin: '4px 0' }} />
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '12px' }}>
                  Observações
                </h3>
                <div style={{ 
                  fontSize: '0.875rem', 
                  color: 'var(--color-text-secondary)',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.6'
                }}>
                  {cliente.observacoes}
                </div>
              </div>
            </>
          )}
        </Card>
      </div>

    </div>
  )
}
