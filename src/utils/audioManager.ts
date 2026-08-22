// Unified High-Performance Audio Engine for Raman 3D Portfolio
// Handles Generative Ambient Soundtrack + Interactive Elastic Deformation SFX + Browser Autoplay Restrictions

export interface AudioState {
  isPlaying: boolean
  isMuted: boolean
  needsInteraction: boolean
}

type AudioListener = (state: AudioState) => void

class AudioManager {
  private ctx: AudioContext | null = null
  private isInitialized = false
  private isMuted = false
  private isPlaying = false
  private needsInteraction = false
  private listeners: Set<AudioListener> = new Set()
  private userInteracted = false

  // Ambient generative background music nodes
  private masterGain: GainNode | null = null
  private ambientGain: GainNode | null = null
  private ambientFilter: BiquadFilterNode | null = null
  private ambientLfo: OscillatorNode | null = null

  // Elastic deformation SFX nodes
  private stretchOsc: OscillatorNode | null = null
  private stretchGain: GainNode | null = null
  private stretchFilter: BiquadFilterNode | null = null
  private stretchLfo: OscillatorNode | null = null
  private stretchLfoGain: GainNode | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('raman_audio_muted')
      if (saved !== null) {
        this.isMuted = saved === 'true'
      }
    }
  }

  public subscribe(listener: AudioListener): () => void {
    this.listeners.add(listener)
    listener(this.getState())
    return () => {
      this.listeners.delete(listener)
    }
  }

  private notify() {
    const state = this.getState()
    this.listeners.forEach((listener) => listener(state))
  }

  public getState(): AudioState {
    return {
      isPlaying: this.isPlaying && !this.isMuted,
      isMuted: this.isMuted,
      needsInteraction: this.needsInteraction && !this.isMuted,
    }
  }

  // Initialize Web Audio graph
  private initAudio() {
    if (this.isInitialized && this.ctx) return
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return

      this.ctx = new AudioCtx()

      // Master output gain
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.85, this.ctx.currentTime)
      this.masterGain.connect(this.ctx.destination)

      this.setupAmbientMusic()
      this.setupContinuousStretch()

      this.isInitialized = true
    } catch (e) {
      console.warn('Web Audio API initialization error:', e)
    }
  }

  // Generative atmospheric ambient chord drone (Ethereal luxury 3D soundscape)
  private setupAmbientMusic() {
    if (!this.ctx || !this.masterGain) return

    this.ambientGain = this.ctx.createGain()
    this.ambientGain.gain.setValueAtTime(0.14, this.ctx.currentTime)

    this.ambientFilter = this.ctx.createBiquadFilter()
    this.ambientFilter.type = 'lowpass'
    this.ambientFilter.frequency.setValueAtTime(380, this.ctx.currentTime)
    this.ambientFilter.Q.setValueAtTime(1.8, this.ctx.currentTime)

    // LFO for breathing filter modulation
    this.ambientLfo = this.ctx.createOscillator()
    this.ambientLfo.type = 'sine'
    this.ambientLfo.frequency.setValueAtTime(0.08, this.ctx.currentTime) // slow 12-second cycle

    const lfoGain = this.ctx.createGain()
    lfoGain.gain.setValueAtTime(140, this.ctx.currentTime)
    this.ambientLfo.connect(lfoGain)
    lfoGain.connect(this.ambientFilter.frequency)

    // Chord frequencies: D2 (73.42Hz), A2 (110Hz), F3 (174.61Hz), C4 (261.63Hz), E4 (329.63Hz)
    const chordFreqs = [73.42, 110.0, 174.61, 261.63, 329.63]
    chordFreqs.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator()
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle'
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime)

      // Slight detune for lush chorus width
      osc.detune.setValueAtTime((idx - 2) * 5, this.ctx!.currentTime)

      const noteGain = this.ctx!.createGain()
      noteGain.gain.setValueAtTime(0.18 / (idx + 1), this.ctx!.currentTime)

      osc.connect(noteGain)
      noteGain.connect(this.ambientFilter!)
      osc.start()
    })

    this.ambientFilter.connect(this.ambientGain)
    this.ambientGain.connect(this.masterGain)
    this.ambientLfo.start()
  }

  // Interactive elastic stretch sound
  private setupContinuousStretch() {
    if (!this.ctx || !this.masterGain) return

    this.stretchOsc = this.ctx.createOscillator()
    this.stretchOsc.type = 'triangle'
    this.stretchOsc.frequency.setValueAtTime(65, this.ctx.currentTime)

    this.stretchLfo = this.ctx.createOscillator()
    this.stretchLfo.type = 'sine'
    this.stretchLfo.frequency.setValueAtTime(14, this.ctx.currentTime)

    this.stretchLfoGain = this.ctx.createGain()
    this.stretchLfoGain.gain.setValueAtTime(15, this.ctx.currentTime)
    this.stretchLfo.connect(this.stretchLfoGain)
    this.stretchLfoGain.connect(this.stretchOsc.frequency)

    this.stretchFilter = this.ctx.createBiquadFilter()
    this.stretchFilter.type = 'lowpass'
    this.stretchFilter.frequency.setValueAtTime(220, this.ctx.currentTime)
    this.stretchFilter.Q.setValueAtTime(3.5, this.ctx.currentTime)

    this.stretchGain = this.ctx.createGain()
    this.stretchGain.gain.setValueAtTime(0, this.ctx.currentTime)

    this.stretchOsc.connect(this.stretchFilter)
    this.stretchFilter.connect(this.stretchGain)
    this.stretchGain.connect(this.masterGain)

    this.stretchOsc.start()
    this.stretchLfo.start()
  }

  // Attempt initial autoplay with browser policy check
  public async attemptAutoplay(): Promise<void> {
    // If user explicitly muted earlier, respect preference
    if (this.isMuted) {
      this.isPlaying = false
      this.needsInteraction = false
      this.notify()
      return
    }

    this.initAudio()
    if (!this.ctx) return

    try {
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume()
      }

      if (this.ctx.state === 'running') {
        this.isPlaying = true
        this.needsInteraction = false
        this.notify()
      } else {
        // Browser blocked autoplay
        this.isPlaying = false
        this.needsInteraction = true
        this.setupOneTimeInteractionUnlock()
        this.notify()
      }
    } catch {
      this.isPlaying = false
      this.needsInteraction = true
      this.setupOneTimeInteractionUnlock()
      this.notify()
    }
  }

  // Unlock audio on first user touch/click/key without blocking interactions
  private setupOneTimeInteractionUnlock() {
    if (typeof window === 'undefined' || this.userInteracted) return

    const handleUnlock = async () => {
      if (this.userInteracted) return
      this.userInteracted = true

      // Clean up event listeners
      window.removeEventListener('pointerdown', handleUnlock)
      window.removeEventListener('touchstart', handleUnlock)
      window.removeEventListener('click', handleUnlock)
      window.removeEventListener('keydown', handleUnlock)

      this.initAudio()
      if (this.ctx) {
        try {
          if ((this.ctx.state as string) === 'suspended') {
            await this.ctx.resume()
          }
          if ((this.ctx.state as string) === 'running') {
            this.isPlaying = true
            this.needsInteraction = false
            this.notify()
          }
        } catch (e) {
          console.warn('Audio resume error on interaction:', e)
        }
      }
    }

    window.addEventListener('pointerdown', handleUnlock, { passive: true, once: true })
    window.addEventListener('touchstart', handleUnlock, { passive: true, once: true })
    window.addEventListener('click', handleUnlock, { passive: true, once: true })
    window.addEventListener('keydown', handleUnlock, { passive: true, once: true })
  }

  // Manual Toggle by User (Clicks Audio Button)
  public async toggleAudio(): Promise<boolean> {
    this.initAudio()
    if (!this.ctx) return false

    // If currently muted or paused -> Unmute / Play
    if (this.isMuted || !this.isPlaying || this.ctx.state === 'suspended') {
      try {
        if (this.ctx.state === 'suspended') {
          await this.ctx.resume()
        }
        this.isMuted = false
        this.isPlaying = true
        this.needsInteraction = false
        if (typeof window !== 'undefined') {
          localStorage.setItem('raman_audio_muted', 'false')
        }
        if (this.masterGain) {
          this.masterGain.gain.setTargetAtTime(0.85, this.ctx.currentTime, 0.05)
        }
        this.notify()
        return true
      } catch (e) {
        console.warn('Failed to start audio on toggle:', e)
        return false
      }
    } else {
      // Currently playing -> Mute / Pause
      this.isMuted = true
      this.isPlaying = false
      this.needsInteraction = false
      if (typeof window !== 'undefined') {
        localStorage.setItem('raman_audio_muted', 'true')
      }
      if (this.masterGain) {
        this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05)
      }
      this.notify()
      return false
    }
  }

  // SFX Methods
  public playGrab() {
    if (this.isMuted || !this.isPlaying) return
    this.initAudio()
    if (!this.ctx || this.ctx.state !== 'running' || !this.masterGain) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    const filter = this.ctx.createBiquadFilter()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(140, now)
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.06)

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(450, now)

    gain.gain.setValueAtTime(0.22, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.masterGain)

    osc.start(now)
    osc.stop(now + 0.07)
  }

  public updateStretch(stretchNormalized: number, velocityNormalized: number) {
    if (this.isMuted || !this.isPlaying || !this.ctx || this.ctx.state !== 'running' || !this.stretchGain || !this.stretchOsc || !this.stretchFilter || !this.stretchLfo) {
      return
    }

    const now = this.ctx.currentTime

    if (stretchNormalized > 0.02) {
      const targetFreq = 65 + stretchNormalized * 160 + velocityNormalized * 40
      this.stretchOsc.frequency.setTargetAtTime(targetFreq, now, 0.05)

      this.stretchLfo.frequency.setTargetAtTime(12 + velocityNormalized * 25, now, 0.05)

      const targetCutoff = 200 + stretchNormalized * 650 + velocityNormalized * 300
      this.stretchFilter.frequency.setTargetAtTime(targetCutoff, now, 0.04)

      const targetVol = Math.min(0.25, 0.04 + stretchNormalized * 0.14 + velocityNormalized * 0.12)
      this.stretchGain.gain.setTargetAtTime(targetVol, now, 0.03)
    } else {
      this.stretchGain.gain.setTargetAtTime(0, now, 0.05)
    }
  }

  public playSnapBack(intensity = 0.5) {
    if (this.isMuted || !this.isPlaying) return
    this.initAudio()
    if (!this.ctx || this.ctx.state !== 'running' || !this.masterGain) return

    if (this.stretchGain) {
      this.stretchGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.02)
    }

    const now = this.ctx.currentTime
    const clampedIntensity = Math.min(Math.max(intensity, 0.2), 1.0)

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    const filter = this.ctx.createBiquadFilter()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(280 * clampedIntensity + 100, now)
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.18)

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(800 * clampedIntensity + 300, now)
    filter.frequency.exponentialRampToValueAtTime(120, now + 0.18)

    const vol = Math.min(0.35, 0.15 + clampedIntensity * 0.2)
    gain.gain.setValueAtTime(vol, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.masterGain)

    osc.start(now)
    osc.stop(now + 0.22)
  }
}

export const audioManager = new AudioManager()
export const elasticAudio = audioManager // Backward compatibility
