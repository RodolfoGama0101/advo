import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../../lib/api'
import { useAuthStore } from '../../../stores/authStore'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { cleanNumbers } from '../../../lib/utils'

// Static list since there's no endpoint
const AREAS_DIREITO = [
  { id: 1, nome: 'Cível' },
  { id: 2, nome: 'Trabalhista' },
  { id: 3, nome: 'Criminal' },
  { id: 4, nome: 'Tributário' },
  { id: 5, nome: 'Previdenciário' },
  { id: 6, nome: 'Família' },
  { id: 7, nome: 'Empresarial' },
  { id: 8, nome: 'Consumidor' }
]

const formSchema = z.object({
  clienteId: z.string().min(1, 'Selecione um cliente'),
  titulo: z.string().min(3, 'Título é obrigatório'),
  numeroProcesso: z.string().optional(),
  tribunal: z.string().optional(),
  vara: z.string().optional(),
  descricao: z.string().optional(),
  areaDireitoId: z.string().optional(),
  dataDistribuicao: z.string().optional(),
  valorCausa: z.string().optional(),
  partesContrarias: z.array(z.object({
    nome: z.string().min(1, 'Nome da parte contrária é obrigatório'),
    tipoParte: z.string().min(1, 'Tipo da parte é obrigatório'),
    cpfCnpj: z.string().optional(),
    advogadoContrario: z.string().optional(),
    oabAdvogadoContrario: z.string().optional()
  })).optional()
})

export const ProcessoFormPage = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [clientes, setClientes] = useState([])
  const [saving, setSaving] = useState(false)

  const { register, control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clienteId: '',
      titulo: '',
      numeroProcesso: '',
      tribunal: '',
      vara: '',
      descricao: '',
      areaDireitoId: '',
      dataDistribuicao: '',
      valorCausa: '',
      partesContrarias: []
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "partesContrarias"
  })

  useEffect(() => {
    const loadDependencies = async () => {
      try {
        const response = await api.get('/api/clientes')
        setClientes(response.data)
      } catch (err) {
        toast.error('Erro ao carregar lista de clientes')
      }
    }
    loadDependencies()
  }, [])

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      const payload = {
        ...data,
        clienteId: parseInt(data.clienteId, 10),
        areaDireitoId: data.areaDireitoId ? parseInt(data.areaDireitoId, 10) : null,
        valorCausa: data.valorCausa ? parseFloat(cleanNumbers(data.valorCausa)) / 100 : null,
        advogadosResponsaveisIds: user?.usuarioId ? [user.usuarioId] : [],
        // Clean parts CPF/CNPJ
        partesContrarias: data.partesContrarias?.map(p => ({
          ...p,
          cpfCnpj: p.cpfCnpj ? cleanNumbers(p.cpfCnpj) : ''
        })) || []
      }

      await api.post('/api/processos', payload)
      toast.success('Processo cadastrado com sucesso!')
      navigate('/processos')
    } catch (error) {
      console.error('Save failed:', error)
      toast.error('Erro ao cadastrar processo.')
    } finally {
      setSaving(false)
    }
  }

  // Helper mask for currency typing
  const handleCurrency = (e) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value) {
      value = (parseInt(value, 10) / 100).toFixed(2) + ''
      value = value.replace('.', ',')
      value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
      e.target.value = `R$ ${value}`
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Button variant="ghost" size="sm" onClick={() => navigate('/processos')} style={{ padding: '8px' }}>
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700 }}>
            Novo Processo
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
            Preencha os dados abaixo para cadastrar um novo processo.
          </p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Dados Principais */}
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '16px', color: 'var(--color-text-primary)' }}>Dados Principais</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <Select 
                label="Cliente Vinculado *" 
                {...register('clienteId')} 
                error={errors.clienteId?.message}
                options={[
                  { value: '', label: 'Selecione um cliente...' },
                  ...clientes.map(c => ({ value: c.id.toString(), label: `${c.nome} - ${c.cpfCnpj}` }))
                ]}
              />
              
              <Input 
                label="Título de Identificação *" 
                {...register('titulo')} 
                error={errors.titulo?.message}
                placeholder="Ex: Ação Trabalhista - João Silva"
              />

              <Select 
                label="Área do Direito" 
                {...register('areaDireitoId')} 
                error={errors.areaDireitoId?.message}
                options={[
                  { value: '', label: 'Selecione uma área...' },
                  ...AREAS_DIREITO.map(a => ({ value: a.id.toString(), label: a.nome }))
                ]}
              />
            </div>
          </div>

          <hr style={{ border: 0, borderTop: '1px solid var(--color-border-subtle)' }} />

          {/* Dados Judiciais */}
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '16px', color: 'var(--color-text-primary)' }}>Dados Judiciais</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <Input 
                label="Número do Processo (CNJ)" 
                {...register('numeroProcesso')} 
                error={errors.numeroProcesso?.message}
                placeholder="0000000-00.0000.0.00.0000"
              />
              <Input 
                label="Tribunal" 
                {...register('tribunal')} 
                error={errors.tribunal?.message}
                placeholder="Ex: TJSP, TRT-2"
              />
              <Input 
                label="Vara" 
                {...register('vara')} 
                error={errors.vara?.message}
                placeholder="Ex: 1ª Vara Cível"
              />
              <Input 
                label="Data de Distribuição" 
                type="date"
                {...register('dataDistribuicao')} 
                error={errors.dataDistribuicao?.message}
              />
              <Input 
                label="Valor da Causa" 
                {...register('valorCausa')} 
                onChange={handleCurrency}
                error={errors.valorCausa?.message}
                placeholder="R$ 0,00"
              />
            </div>
          </div>

          <hr style={{ border: 0, borderTop: '1px solid var(--color-border-subtle)' }} />

          {/* Partes Contrárias */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Partes Contrárias</h3>
              <Button type="button" variant="secondary" size="sm" onClick={() => append({ nome: '', tipoParte: '', cpfCnpj: '', advogadoContrario: '', oabAdvogadoContrario: '' })} icon={<Plus size={16} />}>
                Adicionar Parte
              </Button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {fields.length === 0 && (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-secondary)', border: '1px dashed var(--color-border-subtle)', borderRadius: 'var(--radius-md)' }}>
                  Nenhuma parte contrária adicionada. Clique no botão acima para adicionar.
                </div>
              )}
              {fields.map((field, index) => (
                <div key={field.id} style={{ padding: '16px', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Parte Contrária {index + 1}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)} style={{ padding: '4px', color: 'var(--color-danger)' }}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <Input label="Nome *" {...register(`partesContrarias.${index}.nome`)} error={errors.partesContrarias?.[index]?.nome?.message} />
                    <Input label="Tipo (Reú, Polo Passivo) *" {...register(`partesContrarias.${index}.tipoParte`)} error={errors.partesContrarias?.[index]?.tipoParte?.message} />
                    <Input label="CPF/CNPJ" {...register(`partesContrarias.${index}.cpfCnpj`)} />
                    <Input label="Nome do Advogado" {...register(`partesContrarias.${index}.advogadoContrario`)} />
                    <Input label="OAB do Advogado" {...register(`partesContrarias.${index}.oabAdvogadoContrario`)} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <hr style={{ border: 0, borderTop: '1px solid var(--color-border-subtle)' }} />

          {/* Descrição */}
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '16px', color: 'var(--color-text-primary)' }}>Descrição / Objeto da Ação</h3>
            <textarea 
              {...register('descricao')}
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-subtle)',
                background: 'var(--color-bg-base)',
                color: 'var(--color-text-primary)',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
              placeholder="Descreva o objeto principal da ação judicial..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <Button variant="ghost" type="button" onClick={() => navigate('/processos')} disabled={saving}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={saving} icon={<Save size={18} />}>
              {saving ? 'Cadastrando...' : 'Cadastrar Processo'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
