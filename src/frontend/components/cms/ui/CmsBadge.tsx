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
    success: 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
    warning: 'bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400',
    danger: 'bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400',
  }[variant]

  return (
    <span
      className={`inline-flex items-center gap-1 font-mono rounded ${sizeStyles} ${variantStyles} ${className}`}
    >
      {children}
    </span>
  )
}
