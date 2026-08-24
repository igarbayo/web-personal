import React, {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
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

export function CmsInput({
  className = '',
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    />
  )
}

export function CmsTextarea({
  className = '',
  rows = 4,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={rows}
      className={`w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors resize-y disabled:opacity-50 disabled:cursor-not-allowed leading-relaxed ${className}`}
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
      className={`w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
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
    'inline-flex items-center justify-center gap-1.5 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:opacity-50 disabled:cursor-not-allowed select-none'

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
      'bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/20 active:bg-red-500/30',
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
