export default function XPBadge({ text }: { text: string }) {
  return <span className="px-3 py-1 rounded-full font-sans text-xs font-semibold" style={{ background: "#EBD9B9", color: "#35495B" }}>{text}</span>
}
