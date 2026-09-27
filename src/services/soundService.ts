/**
 * Sử Chill UI Sound Service
 * Phát âm thanh tương tác nhẹ nhàng (Web Audio API synthesis), không dùng file nặng.
 * Hỗ trợ mute và lưu trạng thái vào localStorage.
 * Tuân thủ quy định: UI sound chỉ phát sau tương tác người dùng, có mute.
 */

class SoundService {
  private ctx: AudioContext | null = null
  private muted: boolean = false
  private readonly STORAGE_KEY = 'suchill_sound_muted'

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(this.STORAGE_KEY)
      this.muted = saved === 'true'
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {})
    }
    return this.ctx
  }

  public isMuted(): boolean {
    return this.muted
  }

  public setMuted(muted: boolean): void {
    this.muted = muted
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, String(muted))
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.muted)
    return this.muted
  }

  /**
   * Âm thanh chạm nhẹ (Tap / Click)
   */
  public playTap(): void {
    if (this.muted) return
    const ctx = this.getAudioContext()
    if (!ctx) return

    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(600, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.04)

      gain.gain.setValueAtTime(0.08, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.04)
    } catch {
      // Ignore audio failure
    }
  }

  /**
   * Âm thanh trả lời đúng (Chime vui tươi)
   */
  public playCorrect(): void {
    if (this.muted) return
    const ctx = this.getAudioContext()
    if (!ctx) return

    try {
      const now = ctx.currentTime
      const notes = [523.25, 659.25] // C5, E5

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, now + i * 0.08)

        gain.gain.setValueAtTime(0.12, now + i * 0.08)
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.15)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(now + i * 0.08)
        osc.stop(now + i * 0.08 + 0.15)
      })
    } catch {
      // Ignore
    }
  }

  /**
   * Âm thanh trả lời sai (Buzz nhẹ, không chói tai)
   */
  public playIncorrect(): void {
    if (this.muted) return
    const ctx = this.getAudioContext()
    if (!ctx) return

    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(180, ctx.currentTime)
      osc.frequency.linearRampToValueAtTime(130, ctx.currentTime + 0.12)

      gain.gain.setValueAtTime(0.07, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.12)
    } catch {
      // Ignore
    }
  }
}

export const soundService = new SoundService()
