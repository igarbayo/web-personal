import type { ReactNode } from 'react'

// Parses [text](url) and **bold** syntax within a string and returns React nodes.
// All generated links open in a new tab.
export function renderText(text: string): ReactNode {
  const regex = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g
  const nodes: ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }
    if (match[3] !== undefined) {
      nodes.push(<strong key={match.index}>{match[3]}</strong>)
    } else {
      nodes.push(
        <a
          key={match.index}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline underline-offset-2"
        >
          {match[1]}
        </a>
      )
    }
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  if (nodes.length === 0) return text
  if (nodes.length === 1) return nodes[0]
  return <>{nodes}</>
}
