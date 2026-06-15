import { clsx } from '../../lib/utils'

export const Card = ({
  children,
  className,
  variant = 'base',
  interactive = false,
  ...props
}) => {
  return (
    <div
      className={clsx(
        variant === 'glass' ? 'card card-glass' : 'card',
        interactive && 'card-interactive',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
