import { Modal } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'
import { formatDateTime } from '../../../lib/utils'

export const CompromissoDetailModal = ({ isOpen, onClose, compromisso }) => {
  if (!compromisso) return null

  const footer = (
    <Button variant="primary" onClick={onClose}>Fechar</Button>
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalhes do Compromisso" footer={footer}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '8px 0' }}>
        
        <div>
          <h4 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
            {compromisso.titulo}
          </h4>
          <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            ID do registro: {compromisso.id}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'var(--color-bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr' }}>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Início:</span>
            <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{formatDateTime(compromisso.dataHoraInicio)}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr' }}>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Término:</span>
            <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{formatDateTime(compromisso.dataHoraFim)}</span>
          </div>
          {compromisso.localCompromisso && (
            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr' }}>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Local:</span>
              <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{compromisso.localCompromisso}</span>
            </div>
          )}
        </div>

        {(compromisso.processoId || compromisso.clienteId) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h5 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Vínculos</h5>
            {compromisso.clienteId && (
              <div style={{ fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Cliente ID:</span> {compromisso.clienteId}
              </div>
            )}
            {compromisso.processoId && (
              <div style={{ fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Processo ID:</span> {compromisso.processoId}
              </div>
            )}
          </div>
        )}

        {compromisso.descricao && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h5 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Descrição</h5>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', whiteSpace: 'pre-wrap' }}>
              {compromisso.descricao}
            </p>
          </div>
        )}

      </div>
    </Modal>
  )
}
