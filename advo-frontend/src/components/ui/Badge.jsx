import { clsx } from '../../lib/utils'

export const Badge = ({
  children,
  className,
  variant = 'neutral',
  ...props
}) => {
  return (
    <span
      className={clsx('badge', `badge-${variant}`, className)}
      {...props}
    >
      {children}
    </span>
  )
}
