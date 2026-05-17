'use client'
import { useEffect, useRef, useState, useCallback } from 'react'

const PX = 4; const GW = 12; const GH = 12
const K = '#1a0a00', O = '#f08030', o = '#ffc870'
const E = '#5dd8f8', W = '#e0f6ff', N = '#ff85b0', D = '#c85a10'
const _ = null as null
type F = (string | null)[][]

// ── Frames (12 × 12) ──────────────────────────────────────────────────────────
const IDLE_0: F = [
  [_,_,K,D,_,_,_,D,K,_,_,_],
  [_,K,O,O,K,_,K,O,O,K,_,_],
  [_,K,O,O,O,O,O,O,O,K,_,_],
  [K,O,O,O,O,O,O,O,O,O,K,_],
  [K,O,E,E,O,O,O,O,E,E,K,_],
  [K,O,E,W,O,O,O,O,E,W,K,_],
  [K,O,O,O,O,N,O,O,O,O,K,_],
  [K,O,O,O,O,O,O,O,O,O,K,_],
  [_,K,O,O,o,o,o,o,O,K,_,_],
  [_,K,O,o,o,o,o,o,O,K,_,_],
  [_,K,O,o,K,_,_,K,o,K,_,_],
  [_,_,K,_,_,_,_,_,_,K,_,_],
]
const IDLE_1: F = [                      // blink
  [_,_,K,D,_,_,_,D,K,_,_,_],
  [_,K,O,O,K,_,K,O,O,K,_,_],
  [_,K,O,O,O,O,O,O,O,K,_,_],
  [K,O,O,O,O,O,O,O,O,O,K,_],
  [K,O,K,K,O,O,O,O,K,K,K,_],
  [K,O,O,O,O,O,O,O,O,O,K,_],
  [K,O,O,O,O,N,O,O,O,O,K,_],
  [K,O,O,O,O,O,O,O,O,O,K,_],
  [_,K,O,O,o,o,o,o,O,K,_,_],
  [_,K,O,o,o,o,o,o,O,K,_,_],
  [_,K,O,o,K,_,_,K,o,K,_,_],
  [_,_,K,_,_,_,_,_,_,K,_,_],
]
const WALK_0: F = [
  [_,_,K,D,_,_,_,D,K,_,_,_],
  [_,K,O,O,K,_,K,O,O,K,_,_],
  [_,K,O,O,O,O,O,O,O,K,_,_],
  [K,O,O,O,O,O,O,O,O,O,K,_],
  [K,O,E,E,O,O,O,O,E,E,K,_],
  [K,O,E,W,O,O,O,O,E,W,K,_],
  [K,O,O,O,O,N,O,O,O,O,K,_],
  [K,O,O,O,O,O,O,O,O,O,K,_],
  [_,K,O,O,o,o,o,O,K,_,_,_],
  [_,K,o,K,o,o,K,O,K,_,_,_],
  [_,K,o,K,_,_,_,K,O,K,_,_],
  [_,_,K,_,_,_,_,_,K,_,_,_],
]
const WALK_1: F = [
  [_,_,K,D,_,_,_,D,K,_,_,_],
  [_,K,O,O,K,_,K,O,O,K,_,_],
  [_,K,O,O,O,O,O,O,O,K,_,_],
  [K,O,O,O,O,O,O,O,O,O,K,_],
  [K,O,E,E,O,O,O,O,E,E,K,_],
  [K,O,E,W,O,O,O,O,E,W,K,_],
  [K,O,O,O,O,N,O,O,O,O,K,_],
  [K,O,O,O,O,O,O,O,O,O,K,_],
  [_,_,K,O,o,o,o,O,K,_,_,_],
  [_,_,K,O,o,o,K,o,K,_,_,_],
  [_,K,O,K,_,_,_,K,o,K,_,_],
  [_,K,_,_,_,_,_,_,K,_,_,_],
]
const RUN_0: F = [
  [_,_,K,D,_,_,_,D,K,_,_,_],
  [_,K,O,O,K,_,K,O,O,K,_,_],
  [K,O,O,O,O,O,O,O,O,O,K,_],
  [K,O,E,E,O,O,O,O,E,E,O,K],
  [K,O,E,W,O,O,O,O,E,W,O,K],
  [K,O,O,O,O,N,O,O,O,O,O,K],
  [_,K,O,O,O,O,O,O,O,O,K,_],
  [_,K,o,O,o,o,o,o,O,K,_,_],
  [_,K,o,K,_,_,_,K,O,K,_,_],
  [_,K,_,_,_,_,_,_,O,K,_,_],
  [_,_,_,_,_,_,_,_,K,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_],
]
const RUN_1: F = [
  [_,_,K,D,_,_,_,D,K,_,_,_],
  [_,K,O,O,K,_,K,O,O,K,_,_],
  [K,O,O,O,O,O,O,O,O,O,K,_],
  [K,O,E,E,O,O,O,O,E,E,O,K],
  [K,O,E,W,O,O,O,O,E,W,O,K],
  [K,O,O,O,O,N,O,O,O,O,O,K],
  [_,K,O,O,O,O,O,O,O,O,K,_],
  [_,K,O,o,o,o,o,O,o,K,_,_],
  [_,_,K,O,_,_,K,o,o,K,_,_],
  [_,_,K,O,_,_,_,_,K,_,_,_],
  [_,_,K,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_],
]
const SLEEP: F = [
  [_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,K,D,_,_,_,D,K,_,_,_],
  [_,K,O,O,K,_,K,O,O,K,_,_],
  [_,K,O,O,O,O,O,O,O,K,_,_],
  [K,O,O,O,O,O,O,O,O,O,K,_],
  [K,O,K,K,O,O,O,O,K,K,K,_],
  [K,O,O,O,O,N,O,O,O,O,K,_],
  [K,O,O,O,O,O,O,O,O,O,K,_],
  [_,K,O,o,o,o,o,o,O,K,_,_],
  [_,K,o,o,o,o,o,o,o,K,_,_],
  [_,_,K,K,K,K,K,K,K,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_],
]
const WOW: F = [
  [_,K,D,_,_,_,_,D,K,_,_,_],
  [K,O,O,K,_,_,K,O,O,K,_,_],
  [K,O,O,O,O,O,O,O,O,O,K,_],
  [K,O,O,O,O,O,O,O,O,O,O,K],
  [K,O,E,E,O,O,O,O,E,E,O,K],
  [K,O,E,W,O,O,O,O,E,W,O,K],
  [K,O,O,O,N,O,O,N,O,O,O,K],
  [_,K,O,O,O,O,O,O,O,O,K,_],
  [_,_,K,O,o,o,o,o,O,K,_,_],
  [_,K,_,K,o,o,o,o,K,_,K,_],
  [_,K,_,_,K,_,_,K,_,_,K,_],
  [K,_,_,_,_,_,_,_,_,_,_,K],
]
const EAT: F = [                          // happy eating – UwU eyes
  [_,_,K,D,_,_,_,D,K,_,_,_],
  [_,K,O,O,K,_,K,O,O,K,_,_],
  [_,K,O,O,O,O,O,O,O,K,_,_],
  [K,O,O,O,O,O,O,O,O,O,K,_],
  [K,O,E,K,O,O,O,O,K,E,K,_],
  [K,O,K,E,O,O,O,O,E,K,K,_],
  [K,O,O,O,N,O,O,N,O,O,K,_],
  [K,O,O,O,O,O,O,O,O,O,K,_],
  [_,K,O,O,o,o,o,o,O,K,_,_],
  [_,K,O,o,o,o,o,o,O,K,_,_],
  [_,K,O,o,K,_,_,K,o,K,_,_],
  [_,_,K,_,_,_,_,_,_,K,_,_],
]

function draw(ctx: CanvasRenderingContext2D, frame: F, flip: boolean) {
  ctx.clearRect(0, 0, GW * PX, GH * PX)
  if (flip) { ctx.save(); ctx.translate(GW * PX, 0); ctx.scale(-1, 1) }
  for (let r = 0; r < GH; r++)
    for (let c = 0; c < GW; c++) {
      const col = frame[r]?.[c]
      if (col) { ctx.fillStyle = col; ctx.fillRect(c * PX, r * PX, PX, PX) }
    }
  if (flip) ctx.restore()
}

// ── Particle / fireworks ───────────────────────────────────────────────────────
interface Particle {
  x: number; y: number; vx: number; vy: number
  color: string; life: number; size: number; trail: boolean
}
const FW_COLORS = ['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#ff85b8','#c77dff','#ff9f43','#fff']

function burst(particles: Particle[], x: number, y: number, n = 38) {
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2 + Math.random() * 0.4
    const spd   = 2.5 + Math.random() * 5.5
    particles.push({
      x, y,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd - 1.5,
      color: FW_COLORS[Math.floor(Math.random() * FW_COLORS.length)],
      life: 1,
      size: 2 + Math.random() * 3.5,
      trail: Math.random() < 0.3,
    })
  }
}

// ── React sub-components ──────────────────────────────────────────────────────
function Heart({ x, y, onDone }: { x: number; y: number; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 1100); return () => clearTimeout(t) }, [onDone])
  return <div style={{ position:'fixed', left:x-8, top:y, fontSize:15,
    pointerEvents:'none', zIndex:9999, animation:'catHeart 1.1s ease-out forwards' }}>💕</div>
}
const MEOWS = ['Meow!','Purr~','=^.^=','Mrrr~','Nyaa~','喵~','摸摸我~','别摸了！','再摸我咬你']
function Bubble({ x, y, msg, onDone }: { x: number; y: number; msg: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 1800); return () => clearTimeout(t) }, [onDone])
  return <div style={{
    position:'fixed', left:x-32, top:y-40, background:'#fff',
    border:'1.5px solid #1a0a00', borderRadius:'8px 8px 8px 2px',
    boxShadow:'1px 1px 0 #1a0a00', fontSize:11, fontFamily:'monospace',
    padding:'3px 9px', pointerEvents:'none', zIndex:9999, whiteSpace:'nowrap',
    animation:'catMeow 1.8s ease-out forwards',
  }}>{msg}</div>
}

// ── Main ──────────────────────────────────────────────────────────────────────
type Mode = 'idle' | 'walk' | 'run' | 'sleep' | 'wow' | 'eat'

export default function PixelCat() {
  const cvs   = useRef<HTMLCanvasElement>(null)
  const fwCvs = useRef<HTMLCanvasElement>(null)
  const zzzEl = useRef<HTMLDivElement>(null)

  // cat state (all refs → updated in RAF, never causes re-render)
  const pos    = useRef({ x: 0, y: 0 })
  const jy     = useRef(0)
  const jvy    = useRef(0)
  const mode   = useRef<Mode>('idle')
  const dir    = useRef<'l' | 'r'>('r')
  const tgt    = useRef({ x: 0, y: 0 })
  const spd    = useRef(0)
  const nextAt = useRef(0)
  const af     = useRef(0)
  const lastAF = useRef(0)
  const parts  = useRef<Particle[]>([])

  // lollipop (React state for emoji render, ref for RAF)
  const [lolli, setLolli] = useState<{ x: number; y: number } | null>(null)
  const lolliR = useRef<{ x: number; y: number } | null>(null)

  // hearts / bubbles
  const [hearts,  setHearts]  = useState<{ id: number; x: number; y: number }[]>([])
  const [bubbles, setBubbles] = useState<{ id: number; x: number; y: number; msg: string }[]>([])
  const uid = useRef(0)

  // ── helpers ─────────────────────────────────────────────────────────────────
  const spawnFW = useCallback((x: number, y: number, count = 1) => {
    for (let i = 0; i < count; i++) {
      burst(parts.current,
        x + (Math.random() - 0.5) * 120 * i,
        y + (Math.random() - 0.5) * 60 * i)
    }
  }, [])

  const jump = useCallback(() => {
    jy.current = 0; jvy.current = -9
  }, [])

  const placeLolly = useCallback((x: number, y: number) => {
    const lp = { x, y }
    lolliR.current = lp
    setLolli(lp)
    // cat immediately notices & runs
    tgt.current = { x: x - GW * PX / 2, y: y - GH * PX / 2 }
    dir.current  = tgt.current.x > pos.current.x ? 'r' : 'l'
    mode.current = 'run'
    spd.current  = 4 + Math.random()
  }, [])

  // ── cat click ────────────────────────────────────────────────────────────────
  const clickCat = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    const cx = pos.current.x + GW * PX / 2
    const cy = pos.current.y + jy.current
    mode.current = 'wow'
    nextAt.current = performance.now() + 900
    jump()

    const msg = MEOWS[Math.floor(Math.random() * MEOWS.length)]
    setBubbles(b => [...b, { id: uid.current++, x: cx, y: cy, msg }])
    for (let i = 0; i < 4; i++) {
      const hid = uid.current++
      setTimeout(() => setHearts(h => [...h,
        { id: hid, x: cx + (Math.random() - 0.5) * 50, y: cy - 6 - i * 10 }
      ]), i * 160)
    }
  }, [jump])

  // ── main effect ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = cvs.current
    const fwc    = fwCvs.current
    if (!canvas || !fwc) return
    const ctx   = canvas.getContext('2d')!
    const fwCtx = fwc.getContext('2d')!

    const resize = () => { fwc.width = window.innerWidth; fwc.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    const vw = window.innerWidth, vh = window.innerHeight
    const ground = () => window.innerHeight - GH * PX - 22
    pos.current  = { x: vw * 0.7, y: ground() }
    tgt.current  = { ...pos.current }
    nextAt.current = performance.now() + 1500

    draw(ctx, IDLE_0, false)
    canvas.style.left = pos.current.x + 'px'
    canvas.style.top  = pos.current.y + 'px'

    // ── document-level clicks ─────────────────────────────────────────────────
    let lastClick = 0
    const onDocClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a, button, input, canvas')) return
      const now = Date.now()
      if (now - lastClick < 350) {
        // double-click → fireworks
        spawnFW(e.clientX, e.clientY, 2)
        lastClick = 0
        return
      }
      lastClick = now
      // single click → lollipop
      setTimeout(() => {
        if (Date.now() - lastClick >= 340) placeLolly(e.clientX, e.clientY)
      }, 340)
    }
    document.addEventListener('click', onDocClick)

    // ── RAF loop ──────────────────────────────────────────────────────────────
    let rafId = 0
    const loop = (now: number) => {
      const vw2 = window.innerWidth, vh2 = window.innerHeight
      const gnd = vh2 - GH * PX - 22
      const m   = mode.current
      const p   = pos.current

      // jump physics
      if (jvy.current !== 0 || jy.current < 0) {
        jvy.current += 0.55
        jy.current = Math.min(jy.current + jvy.current, 0)
        if (jy.current >= 0) { jy.current = 0; jvy.current = 0 }
      }

      // sprite
      const fps = m === 'run' ? 14 : m === 'walk' ? 8 : 5
      if (now - lastAF.current > 1000 / fps) {
        lastAF.current = now; af.current ^= 1
        const a = af.current, flip = dir.current === 'l'
        let frame: F
        if      (m === 'idle')  frame = a ? IDLE_1 : IDLE_0
        else if (m === 'walk')  frame = a ? WALK_1 : WALK_0
        else if (m === 'run')   frame = a ? RUN_1  : RUN_0
        else if (m === 'sleep') frame = SLEEP
        else if (m === 'eat')   frame = a ? EAT    : IDLE_0
        else                    frame = WOW
        draw(ctx, frame, flip)
      }

      // movement (walk / run can go anywhere on screen)
      if (m === 'walk' || m === 'run') {
        const dx   = tgt.current.x - p.x
        const dy   = tgt.current.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const s    = Math.min(spd.current, dist / 5 + 0.5)

        if (dist < 5) {
          // arrived – check if lollipop nearby
          const lp = lolliR.current
          if (lp) {
            const ldist = Math.sqrt((p.x + GW*PX/2 - lp.x)**2 + (p.y + GH*PX/2 - lp.y)**2)
            if (ldist < 55) {
              mode.current = 'eat'
              lolliR.current = null
              setLolli(null)
              nextAt.current = now + 1400
              setTimeout(() => spawnFW(p.x + GW*PX/2, p.y, 3), 500)
              setTimeout(() => spawnFW(p.x + GW*PX/2, p.y - 30, 2), 900)
            }
          }
          if (mode.current !== 'eat') {
            mode.current = 'idle'
            nextAt.current = now + 800 + Math.random() * 2000
          }
        } else {
          p.x += (dx / dist) * s
          p.y += (dy / dist) * s
          p.x = Math.max(8, Math.min(vw2 - GW*PX - 8, p.x))
          p.y = Math.max(8, Math.min(vh2 - GH*PX - 8, p.y))
          dir.current = dx >= 0 ? 'r' : 'l'
          if (m === 'walk' && jy.current === 0 && Math.random() < 0.003) jump()
        }
      } else if (m === 'idle' || m === 'sleep') {
        // drift back to ground
        p.y += (gnd - p.y) * 0.04
      }

      // apply position
      canvas.style.left = p.x + 'px'
      canvas.style.top  = (p.y + jy.current) + 'px'

      // zzz
      if (zzzEl.current) {
        const sl = m === 'sleep'
        zzzEl.current.style.display   = sl ? 'block' : 'none'
        zzzEl.current.style.left      = (p.x + GW*PX + 2) + 'px'
        zzzEl.current.style.top       = (p.y - 14) + 'px'
      }

      // ── state machine ────────────────────────────────────────────────────────
      if ((m === 'idle' || m === 'sleep') && now > nextAt.current) {
        const lp = lolliR.current
        if (lp) {
          // chase lollipop
          tgt.current  = { x: lp.x - GW*PX/2, y: lp.y - GH*PX/2 }
          dir.current  = tgt.current.x > p.x ? 'r' : 'l'
          mode.current = 'run'; spd.current = 4 + Math.random()
        } else {
          const r = Math.random()
          if (r < 0.30) {
            // walk to random position on screen
            tgt.current  = {
              x: 8 + Math.random() * (vw2 - GW*PX - 16),
              y: Math.random() < 0.25
                ? 30 + Math.random() * (vh2 * 0.4)   // somewhere mid-screen
                : gnd,
            }
            dir.current  = tgt.current.x > p.x ? 'r' : 'l'
            mode.current = 'walk'; spd.current = 1.4 + Math.random() * 0.8
          } else if (r < 0.48) {
            // RUN!
            tgt.current  = { x: 8 + Math.random() * (vw2 - GW*PX - 16), y: gnd }
            dir.current  = tgt.current.x > p.x ? 'r' : 'l'
            mode.current = 'run'; spd.current = 4 + Math.random() * 2
          } else if (r < 0.60) {
            mode.current = 'sleep'; nextAt.current = now + 5000 + Math.random() * 7000
          } else if (r < 0.65) {
            // spontaneous fireworks!
            spawnFW(p.x + GW*PX/2, p.y - 10)
            jump()
            nextAt.current = now + 2000 + Math.random() * 3000
          } else {
            mode.current = 'idle'; nextAt.current = now + 1000 + Math.random() * 2500
          }
        }
      }
      if (m === 'wow' && now > nextAt.current) {
        mode.current = 'idle'; nextAt.current = now + 1500 + Math.random() * 2000
      }
      if (m === 'eat' && now > nextAt.current) {
        mode.current = 'idle'; nextAt.current = now + 800 + Math.random() * 1500
      }

      // ── fireworks render ─────────────────────────────────────────────────────
      fwCtx.clearRect(0, 0, fwc.width, fwc.height)
      for (let i = parts.current.length - 1; i >= 0; i--) {
        const pt = parts.current[i]
        pt.x  += pt.vx; pt.y += pt.vy
        pt.vy += 0.13; pt.vx *= 0.98; pt.vy *= 0.99
        pt.life -= 0.018
        if (pt.life <= 0) { parts.current.splice(i, 1); continue }
        fwCtx.globalAlpha = pt.life
        fwCtx.fillStyle   = pt.color
        if (pt.trail) {
          fwCtx.beginPath()
          fwCtx.arc(pt.x, pt.y, pt.size * pt.life * 0.7, 0, Math.PI * 2)
          fwCtx.fill()
          fwCtx.globalAlpha = pt.life * 0.3
          fwCtx.beginPath()
          fwCtx.arc(pt.x - pt.vx * 2, pt.y - pt.vy * 2, pt.size * pt.life * 0.4, 0, Math.PI * 2)
          fwCtx.fill()
        } else {
          fwCtx.beginPath()
          fwCtx.arc(pt.x, pt.y, pt.size * pt.life, 0, Math.PI * 2)
          fwCtx.fill()
        }
      }
      fwCtx.globalAlpha = 1

      rafId = requestAnimationFrame(loop)
    }

    rafId = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('click', onDocClick)
      window.removeEventListener('resize', resize)
    }
  }, [spawnFW, jump, placeLolly])

  return (
    <>
      <style>{`
        @keyframes catHeart  { 0%{transform:translateY(0) scale(1);opacity:1} 100%{transform:translateY(-60px) scale(1.6);opacity:0} }
        @keyframes catMeow   { 0%{opacity:1;transform:translateY(0)} 80%{opacity:1} 100%{opacity:0;transform:translateY(-20px)} }
        @keyframes catZzz    { 0%,100%{opacity:.4;transform:translateY(0)} 50%{opacity:1;transform:translateY(-6px)} }
        @keyframes lolliPop  { 0%{transform:translate(-50%,-50%) scale(0) rotate(-20deg);opacity:0}
                               60%{transform:translate(-50%,-50%) scale(1.2) rotate(8deg);opacity:1}
                               100%{transform:translate(-50%,-50%) scale(1) rotate(0deg);opacity:1} }
        @keyframes lolliEat  { 0%{opacity:1;transform:translate(-50%,-50%)}
                               100%{opacity:0;transform:translate(-50%,-120%) scale(0.3)} }
      `}</style>

      {/* fireworks fullscreen canvas – below cat */}
      <canvas ref={fwCvs} style={{
        position: 'fixed', left: 0, top: 0, zIndex: 8999, pointerEvents: 'none',
      }} />

      {/* lollipop */}
      {lolli && (
        <div style={{
          position: 'fixed', left: lolli.x, top: lolli.y, zIndex: 8998,
          fontSize: 30, transform: 'translate(-50%,-50%)',
          pointerEvents: 'none',
          animation: 'lolliPop 0.35s cubic-bezier(.34,1.56,.64,1) forwards',
        }}>🍭</div>
      )}

      {/* cat canvas */}
      <canvas ref={cvs} width={GW * PX} height={GH * PX}
        onClick={clickCat} title="点我！"
        style={{
          position: 'fixed', zIndex: 9000,
          imageRendering: 'pixelated', cursor: 'pointer',
          filter: 'drop-shadow(0 3px 6px rgba(0,0,0,.3))',
        }}
      />

      {/* zzz */}
      <div ref={zzzEl} style={{
        position: 'fixed', display: 'none', zIndex: 9001,
        fontSize: 11, fontWeight: 700, color: '#7575b8',
        fontFamily: 'monospace', pointerEvents: 'none',
        animation: 'catZzz 1.8s ease-in-out infinite',
      }}>z z z</div>

      {hearts.map(h => (
        <Heart key={h.id} x={h.x} y={h.y}
          onDone={() => setHearts(p => p.filter(x => x.id !== h.id))} />
      ))}
      {bubbles.map(b => (
        <Bubble key={b.id} x={b.x} y={b.y} msg={b.msg}
          onDone={() => setBubbles(p => p.filter(x => x.id !== b.id))} />
      ))}
    </>
  )
}
