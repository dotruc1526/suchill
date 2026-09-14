export default function EpisodeProgress({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-1.5 mt-3" aria-label={`Tiến độ tập: bước ${current + 1} trên 5`}>
      {[0, 1, 2, 3, 4].map(index => (
        <div key={index} className="flex items-center flex-1 last:flex-none">
          <div className="w-3 h-3 rounded-full shrink-0" style={{ background: index < current ? "#35495B" : index === current ? "#A84D3F" : "#D6C5AA" }} />
          {index < 4 && <div className="h-px flex-1 mx-1" style={{ background: index < current ? "#35495B" : "#D6C5AA" }} />}
        </div>
      ))}
    </div>
  )
}
