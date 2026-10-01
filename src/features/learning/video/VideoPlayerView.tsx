import type { RefObject, SyntheticEvent } from 'react'
import { Button, Card } from '../../../components/ui'
import type { ResolvedMediaAsset } from '../../../services/next/contracts'
import { theme } from '../../../theme/tokens'

type Props = {
  asset: ResolvedMediaAsset
  videoRef: RefObject<HTMLVideoElement | null>
  mediaFailed: boolean
  retryKey: number
  onLoadedMetadata: (event: SyntheticEvent<HTMLVideoElement>) => void
  onPlay: (event: SyntheticEvent<HTMLVideoElement>) => void
  onPause: (event: SyntheticEvent<HTMLVideoElement>) => void
  onTimeUpdate: (event: SyntheticEvent<HTMLVideoElement>) => void
  onSeeking: () => void
  onSeeked: (event: SyntheticEvent<HTMLVideoElement>) => void
  onEnded: (event: SyntheticEvent<HTMLVideoElement>) => void
  onError: () => void
  onRetry: () => void
}

function TranscriptLink({ asset }: { asset: ResolvedMediaAsset }) {
  if (!asset.transcript) return null
  return <a className="inline-flex min-h-11 items-center font-bold underline" href={asset.transcript.url} target="_blank" rel="noreferrer">
    Mở {asset.transcript.label.toLowerCase()}
  </a>
}

export function VideoPlayerView({ asset, videoRef, mediaFailed, retryKey, onLoadedMetadata, onPlay, onPause, onTimeUpdate, onSeeking, onSeeked, onEnded, onError, onRetry }: Props) {
  return <Card data-testid="video-player" className="space-y-4">
    <header><h2 className="font-bold text-xl" style={{ color: theme.colors.textPrimary }}>{asset.title}</h2>{asset.caption && <p>{asset.caption}</p>}</header>
    {mediaFailed ? <section role="alert" aria-label="Video không phát được" className="space-y-3">
      <p>Video chưa thể phát. Bạn vẫn có thể học bằng nội dung thay thế bên dưới.</p>
      {asset.fallback?.kind === 'poster' && <img src={asset.fallback.url} alt={asset.fallback.altText} className="w-full rounded-md" />}
      {asset.fallback?.kind === 'transcript' && <TranscriptLink asset={asset} />}
      {!asset.fallback && <p>Chưa có nội dung thay thế khả dụng.</p>}
      <Button onClick={onRetry}>THỬ PHÁT LẠI</Button>
    </section> : <video
      key={retryKey}
      ref={videoRef}
      controls
      preload="metadata"
      poster={asset.poster?.url}
      className="w-full rounded-md"
      aria-label={`Video: ${asset.title}`}
      onLoadedMetadata={onLoadedMetadata}
      onPlay={onPlay}
      onPause={onPause}
      onTimeUpdate={onTimeUpdate}
      onSeeking={onSeeking}
      onSeeked={onSeeked}
      onEnded={onEnded}
      onError={onError}
    >
      <source src={asset.url} type="video/mp4" />
      {asset.captionTracks.map((track, index) => <track key={track.id} kind="captions" src={track.url} srcLang="vi" label={track.label} default={index === 0} />)}
      Trình duyệt không hỗ trợ video. Hãy dùng bản chép lời.
    </video>}
    {!mediaFailed && asset.transcript && <details><summary className="min-h-11 cursor-pointer font-bold">Bản chép lời và nội dung thay thế</summary><TranscriptLink asset={asset} /></details>}
    {asset.attribution && <p className="text-sm" style={{ color: theme.colors.textSecondary }}>Nguồn media: {asset.attribution}</p>}
  </Card>
}
