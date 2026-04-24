'use client'

import {
  cloneElement,
  forwardRef,
  isValidElement,
  useId,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react'
import { cn } from '../../lib/cn'

export interface FormFieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  label: ReactNode
  description?: ReactNode
  error?: ReactNode
  id?: string
  children: ReactElement
  labelClassName?: string
}

/**
 * FormField — accessible wrapper that wires label, description, and error to a single input child
 * via aria-describedby + aria-invalid. Pass exactly one ReactElement child.
 *
 * @example
 * ```tsx
 * <FormField label="Email" description="We won't share" error={errors.email}>
 *   <Input type="email" />
 * </FormField>
 * ```
 */
export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(function FormField(
  { label, description, error, id, children, className, labelClassName, ...rest },
  ref,
) {
  const autoId = useId()
  const fieldId = id ?? `fld-${autoId}`
  const descriptionId = description ? `${fieldId}-desc` : undefined
  const errorId = error ? `${fieldId}-err` : undefined
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined

  let slot: ReactNode = children
  if (isValidElement(children)) {
    const childProps = (children.props ?? {}) as Record<string, unknown>
    const existingDescribedBy =
      typeof childProps['aria-describedby'] === 'string'
        ? (childProps['aria-describedby'] as string)
        : undefined
    const mergedDescribedBy =
      [existingDescribedBy, describedBy].filter(Boolean).join(' ') || undefined
    slot = cloneElement(children as ReactElement<Record<string, unknown>>, {
      id: (childProps.id as string | undefined) ?? fieldId,
      'aria-describedby': mergedDescribedBy,
      'aria-invalid': error ? true : childProps['aria-invalid'],
    })
  }

  return (
    <div ref={ref} className={cn('flex flex-col gap-1', className)} {...rest}>
      <label
        htmlFor={fieldId}
        className={cn(
          'text-xs font-semibold uppercase tracking-wider text-ink-muted',
          labelClassName,
        )}
      >
        {label}
      </label>
      {slot}
      {description && (
        <span id={descriptionId} className="text-xs text-ink-muted">
          {description}
        </span>
      )}
      {error && (
        <span id={errorId} className="text-xs font-semibold text-danger">
          {error}
        </span>
      )}
    </div>
  )
})
