import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import api from '../../../lib/api'
import { Modal } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { cleanNumbers } from '../../../lib/utils'

const schema = z.object({
  tipo: z.enum(['RECEITA', 'DESPESA']),
  valor: z.string().min(1, 'Valor obrigatório'),
  dataVencimento: z.string().min(1, 'Data de vencimento obrigatória'),
  descricao: z.string().min(3, 'Descrição obrigatória'),
  clienteId: z.string().optional(),
  processoId: z.string().optional()
})

export const TransacaoFormModal = ({ isOpen, onClose, onCreated }) => {
  const [saving, setSaving] = useState(false)
  const [clientes, setClientes] = useState([])
  const [processos, setProcessos] = useState([])

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      tipo: 'RECEITA',
      valor: '',
      dataVencimento: '',
      descricao: '',
      clienteId: '',
      processoId: ''
    }
  })

  useEffect(() => {
    if (isOpen) {
      reset()
      // Load dependencies for selects
      Promise.all([
        api.get('/api/clientes').catch(() => ({ data: [] })),
        api.get('/api/processos').catch(() => ({ data: [] }))
      ]).then(([cRes, pRes]) => {
        setClientes(cRes.data)
        setProcessos(pRes.data)
      })
    }
  }, [isOpen, reset])

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      const payload = {
        tipo: data.tipo,
        valor: parseFloat(cleanNumbers(data.valor)) / 100, // Converts "R$ 1.500,50" -> 1500.5
        dataVencimento: data.dataVencimento,
        descricao: data.descricao,
        clienteId: data.clienteId ? parseInt(data.clienteId, 10) : null,
        processoId: data.processoId ? parseInt(data.processoId, 10) : null
      }

      await api.post('/api/financeiro', payload)
      toast.success('Transação lançada com sucesso!')
      onCreated && onCreated()
      handleClose()
    } catch (error) {
      console.error('Failed to create transaction:', error)
      toast.error('Erro ao lançar transação.')
    } finally {
      setSaving(false)
    }
  }

  // Currency mask
  const handleCurrency = (e) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value) {
      value = (parseInt(value, 10) / 100).toFixed(2) + ''
      value = value.replace('.', ',')
      value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
      e.target.value = `R$ ${value}`
    }
  }

  const footer = (
    <>
      <Button variant="ghost" onClick={handleClose} disabled={saving}>Cancelar</Button>
      <Button variant="primary" onClick={handleSubmit(onSubmit)} disabled={saving}>
        {saving ? 'Lançando...' : 'Lançar Transação'}
      </Button>
    </>
  )

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Novo Lançamento Financeiro" footer={footer}>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '8px 0' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Select 
            label="Tipo *" 
            {...register('tipo')}
            error={errors.tipo?.message}
            options={[
              { value: 'RECEITA', label: 'Receita (Entrada)' },
              { value: 'DESPESA', label: 'Despesa (Saída)' }
            ]}
          />
          <Input 
            label="Valor *" 
            placeholder="R$ 0,00"
            {...register('valor')}
            onChange={handleCurrency}
            error={errors.valor?.message} 
          />
        </div>

        <Input 
          label="Descrição *" 
          placeholder="Ex: Honorários do processo XYZ" 
          {...register('descricao')} 
          error={errors.descricao?.message} 
        />

        <Input 
          label="Data de Vencimento *" 
          type="date"
          {...register('dataVencimento')} 
          error={errors.dataVencimento?.message} 
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Select 
            label="Vincular a Cliente (Opcional)" 
            {...register('clienteId')}
            options={[
              { value: '', label: 'Nenhum' },
              ...clientes.map(c => ({ value: c.id.toString(), label: c.nome }))
            ]}
          />
          <Select 
            label="Vincular a Processo (Opcional)" 
            {...register('processoId')}
            options={[
              { value: '', label: 'Nenhum' },
              ...processos.map(p => ({ value: p.id.toString(), label: p.numeroProcesso || p.titulo }))
            ]}
          />
        </div>

      </form>
    </Modal>
  )
}
