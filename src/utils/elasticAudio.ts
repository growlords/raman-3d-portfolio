// Web Audio API Synthesis for Elastic Rubber & Deformation Interaction
// Completely original procedural audio (Zero copyrighted or external audio files)

class ElasticAudioEngine {
  private ctx: AudioContext | null = null
  private isMuted: boolean = false
  private isInitialized: boolean = false

  // Continuous stretch oscillator nodes
  private stretchOsc: OscillatorNode | null = null
  private stretchGain: GainNode | null = null
  private stretchFilter: BiquadFilterNode | null = null
  private lfoOsc: OscillatorNode | null = null
  private lfoGain: GainNode | null = null

  constructor() {
    // Check saved mute preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('raman_audio_muted')
      if (saved !== null) {
        this.isMuted = saved === 'true'
      }
    }
  }

  public init() {
    if (this.isInitialized) return
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
        this.setupContinuousStretch()
        this.isInitialized = true
      }
    } catch (e) {
      console.warn('AudioContext not available:', e)
    }
  }

  private setupContinuousStretch() {
    if (!this.ctx) return

    // Base sub-oscillator for rubber tension
    this.stretchOsc = this.ctx.createOscillator()
    this.stretchOsc.type = 'triangle'
    this.stretchOsc.frequency.setValueAtTime(65, this.ctx.currentTime)

    // LFO for rubber friction / wobble texture
    this.lfoOsc = this.ctx.createOscillator()
    this.lfoOsc.type = 'sine'
    this.lfoOsc.frequency.setValueAtTime(14, this.ctx.currentTime)

    this.lfoGain = this.ctx.createGain()
    this.lfoGain.gain.setValueAtTime(15, this.ctx.currentTime)
    this.lfoOsc.connect(this.lfoGain)
    this.lfoGain.connect(this.stretchOsc.frequency)

    // Filter
    this.stretchFilter = this.ctx.createBiquadFilter()
    this.stretchFilter.type = 'lowpass'
    this.stretchFilter.frequency.setValueAtTime(220, this.ctx.currentTime)
    this.stretchFilter.Q.setValueAtTime(3.5, this.ctx.currentTime)

    // Master stretch gain
    this.stretchGain = this.ctx.createGain()
    this.stretchGain.gain.setValueAtTime(0, this.ctx.currentTime)

    this.stretchOsc.connect(this.stretchFilter)
    this.stretchFilter.connect(this.stretchGain)
    this.stretchGain.connect(this.ctx.destination)

    this.stretchOsc.start()
    this.lfoOsc.start()
  }

  // 1. Grab sound: Subtle soft rubber tactile plop
  public playGrab() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }

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
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.07)
  }

  // 2. Continuous stretch sound: Pitch & intensity respond dynamically to deformation distance & speed
  public updateStretch(stretchNormalized: number, velocityNormalized: number) {
    if (this.isMuted || !this.ctx || !this.stretchGain || !this.stretchOsc || !this.stretchFilter || !this.lfoOsc) {
      return
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }

    const now = this.ctx.currentTime

    if (stretchNormalized > 0.02) {
      // Dynamic frequency from 65Hz to 260Hz as it stretches
      const targetFreq = 65 + stretchNormalized * 160 + velocityNormalized * 40
      this.stretchOsc.frequency.setTargetAtTime(targetFreq, now, 0.05)

      // LFO rate speeds up with velocity
      this.lfoOsc.frequency.setTargetAtTime(12 + velocityNormalized * 25, now, 0.05)

      // Filter opens up as tension increases
      const targetCutoff = 200 + stretchNormalized * 650 + velocityNormalized * 300
      this.stretchFilter.frequency.setTargetAtTime(targetCutoff, now, 0.04)

      // Target volume based on tension & movement speed
      const targetVol = Math.min(0.25, (0.04 + stretchNormalized * 0.14 + velocityNormalized * 0.12))
      this.stretchGain.gain.setTargetAtTime(targetVol, now, 0.03)
    } else {
      this.stretchGain.gain.setTargetAtTime(0, now, 0.05)
    }
  }

  // 3. Snap-back sound: Satisfying rubber release + settling wobble
  public playSnapBack(intensity: number = 0.5) {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }

    // Stop continuous stretch sound immediately
    if (this.stretchGain) {
      this.stretchGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.02)
    }

    const now = this.ctx.currentTime
    const clampedIntensity = Math.min(Math.max(intensity, 0.2), 1.0)

    // Snap whip oscillator
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
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.22)
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted
    if (typeof window !== 'undefined') {
      localStorage.setItem('raman_audio_muted', String(this.isMuted))
    }
    if (this.isMuted && this.stretchGain && this.ctx) {
      this.stretchGain.gain.setValueAtTime(0, this.ctx.currentTime)
    }
    return this.isMuted
  }

  public getIsMuted(): boolean {
    return this.isMuted
  }
}

export const elasticAudio = new ElasticAudioEngine()
