'use client'

import React, {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  useEffect,
  useRef,
} from 'react'

export function CmsLabel({
  children,
  htmlFor,
  required,
  className = '',
}: {
  children: ReactNode
  htmlFor?: string
  required?: boolean
  className?: string
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block font-mono text-xs font-bold uppercase tracking-wider text-muted mb-1.5 ${className}`}
    >
      {children}
      {required && <span className="text-accent ml-1">*</span>}
    </label>
  )
}

export const CmsInput = React.forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function CmsInput({ className = '', ...props }, ref) {
    return (
      <input
        ref={ref}
        className={`w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        {...props}
      />
    )
  }
)

/**
 * Crece con el contenido en vez de recortarlo tras `rows` líneas: el texto
 * de una viñeta o de un resumen no se sabe de antemano y una caja fija
 * obligaba a hacer scroll dentro de un formulario que ya se desplaza entero.
 * `rows` sigue marcando la altura mínima de partida.
 */
export function CmsTextarea({
  className = '',
  rows = 4,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [props.value])

  return (
    <textarea
      ref={ref}
      rows={rows}
      className={`w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent resize-none overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed leading-relaxed ${className}`}
      {...props}
    />
  )
}

export function CmsSelect({
  children,
  className = '',
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </select>
  )
}

interface CmsButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function CmsButton({
  children,
  variant = 'secondary',
  size = 'md',
  className = '',
  disabled,
  ...props
}: CmsButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center gap-1.5 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:opacity-50 disabled:cursor-not-allowed select-none'

  const sizeStyles = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3.5 py-1.5 text-sm',
    lg: 'px-5 py-2.5 text-base',
  }[size]

  const variantStyles = {
    primary:
      'bg-accent text-white hover:opacity-90 active:opacity-100 font-semibold shadow-none border-transparent',
    secondary:
      'bg-surface border border-border text-foreground hover:border-accent hover:text-accent active:bg-background',
    danger:
      'bg-danger/10 border border-danger/30 text-danger hover:bg-danger/20 active:bg-danger/30',
    ghost:
      'bg-transparent text-muted hover:text-foreground hover:bg-surface/60 border-transparent',
  }[variant]

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
