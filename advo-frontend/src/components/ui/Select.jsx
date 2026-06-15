import { forwardRef } from 'react'
import { clsx } from '../../lib/utils'

export const Select = forwardRef(({
  label,
  error,
  options = [],
  className,
  id,
  placeholder,
  ...props
}, ref) => {
  const selectId = id || props.name
  return (
    <div className="form-group">
      {label && <label htmlFor={selectId} className="form-label">{label}</label>}
      <select
        ref={ref}
        id={selectId}
        className={clsx('input-field', error && 'input-error', className)}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="error-message">{error}</span>}
    </div>
  )
})

Select.displayName = 'Select'
