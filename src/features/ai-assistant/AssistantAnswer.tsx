import React, { Fragment } from 'react'

/** A small text-only subset: never interprets model output as HTML or executable links. */
export function AssistantAnswer({ text }: { text: string }) {
  return <div className="space-y-3">{text.split(/\n\s*\n/).map((paragraph, index) => (
    <p key={index} className="whitespace-pre-wrap break-words">{paragraph.split(/(\*\*[^*\n]+\*\*|\*[^*\n]+\*)/g).map((part, inline) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) return <strong key={inline}>{part.slice(2, -2)}</strong>
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) return <em key={inline}>{part.slice(1, -1)}</em>
      return <Fragment key={inline}>{part}</Fragment>
    })}</p>
  ))}</div>
}
