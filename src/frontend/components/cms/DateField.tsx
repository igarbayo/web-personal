'use client'

import React, { useRef } from 'react'
import { CmsInput, CmsLabel } from './ui/CmsInput'
import { TOKENS } from '@/lib/tokens.mjs'

interface DateFieldProps {
  /** Formato esperado, que cambia según la sección: "MM/YYYY", "YYYY o MM/YYYY"… */
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  /** Aviso extra bajo el campo, encima de los atajos. */
  helpText?: string
}

const tokenNames = Object.keys(TOKENS)

/**
 * Campo de fechas de una entrada. A diferencia del resto del formulario no es
 * trilingüe: la fecha se escribe una vez y el editor la copia a los tres
 * diccionarios, porque "09/2021 – 06/2027" es igual en los tres idiomas.
 *
 * Las palabras no lo son, y de ahí los atajos: `{present}` se guarda literal y
 * se convierte en "presente" o "present" al renderizar cada idioma. Los
 * botones lo insertan donde esté el cursor. Ver lib/tokens.mjs.
 */
export default function DateField({
  label,
  value,
  onChange,
  placeholder,
  helpText,
}: DateFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const insertToken = (name: string) => {
    const token = `{${name}}`
    const input = inputRef.current
    // El input conserva la selección tras perder el foco, y el onMouseDown del
    // botón evita que la pierda, así que el atajo cae donde estaba el cursor.
    const at = input?.selectionStart ?? value.length
    const to = input?.selectionEnd ?? value.length
    const next = value.slice(0, at) + token + value.slice(to)
    onChange(next)
    requestAnimationFrame(() => {
      input?.focus()
      input?.setSelectionRange(at + token.length, at + token.length)
    })
  }

  return (
    <div>
      <CmsLabel required>{label}</CmsLabel>
      <CmsInput
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {helpText && <p className="text-[11px] text-muted font-mono mt-1">{helpText}</p>}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
        <span className="text-[11px] text-muted font-mono">Atajos:</span>
        {tokenNames.map((name) => (
          <button
            key={name}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => insertToken(name)}
            title={`Se traduce solo: ${TOKENS[name].es} · ${TOKENS[name].en} · ${TOKENS[name].gl}`}
            className="text-[11px] font-mono text-accent hover:underline underline-offset-2"
          >
            {`{${name}}`}
          </button>
        ))}
      </div>
    </div>
  )
}
