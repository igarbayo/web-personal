import React, { ReactNode } from 'react'

interface CmsBadgeProps {
  children: ReactNode
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md'
  className?: string
}

export function CmsBadge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}: CmsBadgeProps) {
  const sizeStyles = {
    sm: 'text-[11px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-0.5',
  }[size]

  const variantStyles = {
    default: 'bg-background border border-border text-foreground',
    accent: 'bg-accent/10 border border-accent/30 text-accent font-semibold',
    success: 'bg-ok/10 border border-ok/30 text-ok',
    warning: 'bg-accent/10 border border-accent/30 text-accent',
    danger: 'bg-danger/10 border border-danger/30 text-danger',
  }[variant]

  return (
    <span
      className={`inline-flex items-center gap-1 font-mono rounded ${sizeStyles} ${variantStyles} ${className}`}
    >
      {children}
    </span>
  )
}
