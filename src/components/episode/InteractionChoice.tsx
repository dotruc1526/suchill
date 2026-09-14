
export default function InteractionChoice({ children, onClick }: { children: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full min-h-14 text-left rounded-lg px-4 py-3 font-sans text-sm" style={{ background: '#FFF9EC', color: '#35495B', border: '1.5px solid rgba(53,73,91,0.24)' }}>
      {children}
    </button>
  )
}

