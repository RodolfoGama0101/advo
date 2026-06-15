import { forwardRef } from 'react'
import { clsx } from '../../lib/utils'

export const Input = forwardRef(({
  label,
  error,
  className,
  id,
  style,
  startIcon,
  endIcon,
  ...props
}, ref) => {
  const inputId = id || props.name
  return (
    <div className="form-group">
      {label && <label htmlFor={inputId} className="form-label">{label}</label>}
      <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
        {startIcon && (
          <div style={{
            position: 'absolute',
            left: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-text-muted)',
            pointerEvents: 'none',
            zIndex: 10
          }}>
            {startIcon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx('input-field', error && 'input-error', className)}
          style={{
            ...style,
            paddingLeft: startIcon ? '40px' : style?.paddingLeft,
            paddingRight: endIcon ? '40px' : style?.paddingRight,
            width: '100%',
          }}
          {...props}
        />
        {endIcon && (
          <div style={{
            position: 'absolute',
            right: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}>
            {endIcon}
          </div>
        )}
      </div>
      {error && <span className="error-message">{error}</span>}
    </div>
  )
})

Input.displayName = 'Input'
