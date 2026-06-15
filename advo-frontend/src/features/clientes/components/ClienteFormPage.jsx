import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../../lib/api'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { formatCpfCnpj, formatPhone, formatCEP, cleanNumbers } from '../../../lib/utils'

// Zod schema for validation
const formSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  tipoPessoa: z.enum(['PF', 'PJ']),
  cpfCnpj: z.string().min(11, 'CPF/CNPJ inválido'), // simplified length check
  email: z.string().email('E-mail inválido').or(z.literal('')),
  telefone: z.string(),
  cep: z.string(),
  logradouro: z.string(),
  numero: z.string(),
  complemento: z.string(),
  bairro: z.string(),
  cidade: z.string(),
  uf: z.string(),
  observacoes: z.string(),
})

export const ClienteFormPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = !!id
  const [loading, setLoading] = useState(isEditMode)
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      tipoPessoa: 'PF',
      cpfCnpj: '',
      email: '',
      telefone: '',
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      uf: '',
      observacoes: '',
    }
  })

  const tipoPessoa = watch('tipoPessoa')

  useEffect(() => {
    if (isEditMode) {
      const fetchCliente = async () => {
        try {
          const response = await api.get(`/api/clientes/${id}`)
          const data = response.data
          // populate form
          Object.keys(data).forEach(key => {
            if (key !== 'id' && key !== 'criadoEm') {
              let val = data[key] || ''
              if (key === 'cpfCnpj') val = formatCpfCnpj(val)
              if (key === 'telefone') val = formatPhone(val)
              if (key === 'cep') val = formatCEP(val)
              setValue(key, val)
            }
          })
        } catch (error) {
          console.error('Failed to load cliente', error)
          toast.error('Erro ao carregar dados do cliente.')
          navigate('/clientes')
        } finally {
          setLoading(false)
        }
      }
      fetchCliente()
    }
  }, [id, isEditMode, setValue, navigate])

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      // Clean masked values for API
      const payload = {
        ...data,
        telefone: cleanNumbers(data.telefone),
        cep: cleanNumbers(data.cep),
      }

      if (isEditMode) {
        // PUT AtualizarClienteCommand: id and nome are required.
        // cpfCnpj and tipoPessoa must NOT be sent or updated.
        const { cpfCnpj, tipoPessoa, ...updatePayload } = payload
        updatePayload.id = parseInt(id, 10)
        await api.put(`/api/clientes/${id}`, updatePayload)
        toast.success('Cliente atualizado com sucesso!')
      } else {
        // POST CriarClienteCommand
        payload.cpfCnpj = cleanNumbers(data.cpfCnpj)
        await api.post('/api/clientes', payload)
        toast.success('Cliente cadastrado com sucesso!')
      }
      navigate('/clientes')
    } catch (error) {
      console.error('Save failed:', error)
      toast.error(error.response?.data?.message || 'Erro ao salvar cliente.')
    } finally {
      setSaving(false)
    }
  }

  const handleCepBlur = async (e) => {
    const cep = cleanNumbers(e.target.value)
    if (cep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
        const data = await res.json()
        if (!data.erro) {
          setValue('logradouro', data.logradouro)
          setValue('bairro', data.bairro)
          setValue('cidade', data.localidade)
          setValue('uf', data.uf)
          // focus on number
          document.getElementsByName('numero')[0]?.focus()
        }
      } catch (err) {
        console.error('ViaCEP error:', err)
      }
    }
  }

  // Masking functions for input changes
  const handlePhoneChange = (e) => {
    setValue('telefone', formatPhone(e.target.value))
  }
  
  const handleCpfCnpjChange = (e) => {
    setValue('cpfCnpj', formatCpfCnpj(e.target.value))
  }
  
  const handleCepChange = (e) => {
    setValue('cep', formatCEP(e.target.value))
  }

  if (loading) {
    return <div className="skeleton" style={{ height: '400px', borderRadius: 'var(--radius-lg)' }} />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Button variant="ghost" size="sm" onClick={() => navigate('/clientes')} style={{ padding: '8px' }}>
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700 }}>
              {isEditMode ? 'Editar Cliente' : 'Novo Cliente'}
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
              {isEditMode ? 'Atualize os dados do registro existente.' : 'Preencha os dados para cadastrar.'}
            </p>
          </div>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Dados Pessoais / Principais */}
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '16px', color: 'var(--color-text-primary)' }}>Dados Principais</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <Select 
                label="Tipo de Pessoa" 
                {...register('tipoPessoa')} 
                error={errors.tipoPessoa?.message}
                disabled={isEditMode} // Cannot change type after creation according to OpenAPI
                options={[
                  { value: 'PF', label: 'Pessoa Física (PF)' },
                  { value: 'PJ', label: 'Pessoa Jurídica (PJ)' }
                ]}
              />
              
              <Input 
                label={tipoPessoa === 'PF' ? 'CPF' : 'CNPJ'}
                {...register('cpfCnpj')} 
                onChange={handleCpfCnpjChange}
                error={errors.cpfCnpj?.message}
                placeholder={tipoPessoa === 'PF' ? '000.000.000-00' : '00.000.000/0000-00'}
                disabled={isEditMode} // Cannot change CPF/CNPJ according to OpenAPI limitations
              />

              <Input 
                label={tipoPessoa === 'PF' ? 'Nome Completo' : 'Razão Social'} 
                {...register('nome')} 
                error={errors.nome?.message}
                placeholder="Digite o nome..."
              />
            </div>
          </div>

          <hr style={{ border: 0, borderTop: '1px solid var(--color-border-subtle)' }} />

          {/* Contato */}
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '16px', color: 'var(--color-text-primary)' }}>Contato</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <Input 
                label="E-mail" 
                type="email"
                {...register('email')} 
                error={errors.email?.message}
                placeholder="email@exemplo.com"
              />
              <Input 
                label="Telefone / Celular" 
                {...register('telefone')} 
                onChange={handlePhoneChange}
                error={errors.telefone?.message}
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          <hr style={{ border: 0, borderTop: '1px solid var(--color-border-subtle)' }} />

          {/* Endereço */}
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '16px', color: 'var(--color-text-primary)' }}>Endereço</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '16px', marginBottom: '16px' }} className="grid-responsive-address">
              <Input 
                label="CEP" 
                {...register('cep')} 
                onChange={handleCepChange}
                onBlur={handleCepBlur}
                error={errors.cep?.message}
                placeholder="00000-000"
              />
              <Input 
                label="Logradouro" 
                {...register('logradouro')} 
                error={errors.logradouro?.message}
                placeholder="Rua, Avenida, etc."
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
              <Input label="Número" {...register('numero')} error={errors.numero?.message} />
              <Input label="Complemento" {...register('complemento')} error={errors.complemento?.message} />
              <Input label="Bairro" {...register('bairro')} error={errors.bairro?.message} />
              <Input label="Cidade" {...register('cidade')} error={errors.cidade?.message} />
              <Input label="UF" {...register('uf')} error={errors.uf?.message} maxLength={2} />
            </div>
          </div>

          <hr style={{ border: 0, borderTop: '1px solid var(--color-border-subtle)' }} />

          {/* Outros */}
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '16px', color: 'var(--color-text-primary)' }}>Outros</h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '6px', color: 'var(--color-text-primary)' }}>
                Observações
              </label>
              <textarea 
                {...register('observacoes')}
                style={{
                  minHeight: '100px',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border-subtle)',
                  background: 'var(--color-bg-base)',
                  color: 'var(--color-text-primary)',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
                placeholder="Informações adicionais..."
              />
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <Button variant="ghost" type="button" onClick={() => navigate('/clientes')} disabled={saving}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={saving} icon={<Save size={18} />}>
              {saving ? 'Salvando...' : 'Salvar Cliente'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
