import type { EpisodeStage } from "../../models/episode"
import EpisodeProgress from "./EpisodeProgress"

export default function EpisodeHeader({ stage, progress, onBack }: { stage: EpisodeStage; progress: number; onBack: () => void }) {
  return (
    <div className="px-5 pt-4 pb-3 shrink-0" style={{ borderBottom: "1px solid rgba(48,40,32,0.11)" }}>
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="font-sans text-base" style={{ color: "#35495B" }}>←</button>
        <div className="font-sans text-[11px] font-bold tracking-[0.13em]" style={{ color: "#35495B" }}>{stage === "intro" ? "TẬP 01" : "TẬP 01 · BỐI CẢNH"}</div>
        <button className="font-sans text-lg leading-none" style={{ color: "#35495B" }}>⋯</button>
      </div>
      <EpisodeProgress current={progress} />
    </div>
  )
}
