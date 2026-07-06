import { useEffect, useRef, useState, useCallback } from 'react'

/* ==================================================================
   KANGAL: NIGHT WATCH  —  browser action demo (mobile-ready).
   You are a Kangal guarding the moonlit steppe. Wolves close in from
   the dark; move to survive and bark to drive them back. You no longer
   heal over time — grab bones and meat to recover. Vector art, glow,
   particles, screen shake. Touch: floating joystick + BARK button.
   ================================================================== */

const CFG = {
  playerR: 21,
  playerSpeed: 335,
  playerHp: 100,
  wolfR: 15,
  wolfBaseSpeed: 92,
  biteDmg: 24,            // hp/sec while a wolf overlaps you
  barkRadius: 172,
  barkCooldown: 2.1,
  barkKnock: 640,
  foodR: 15,
  boneHeal: 15,
  meatHeal: 30,
  joyMax: 66,
}

export default function GuardianGame({ standalone = false }) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const rafRef = useRef(0)
  const gameRef = useRef(null)
  const dimRef = useRef({ w: 1000, h: 562, dpr: 1 })
  const inputRef = useRef({ keys: {}, ptr: { active: false, ox: 0, oy: 0, x: 0, y: 0 } })
  const phaseRef = useRef('idle')

  const [phase, setPhase] = useState('idle') // idle | playing | over
  const [hud, setHud] = useState({ score: 0, hp: 100, wave: 1, cd: 1 })
  const [best, setBest] = useState(() => {
    const v = Number(localStorage.getItem('kangal_guardian_best') || 0)
    return Number.isFinite(v) ? v : 0
  })

  const setPhaseBoth = (p) => { phaseRef.current = p; setPhase(p) }

  const newGame = useCallback(() => {
    const { w, h } = dimRef.current
    return {
      player: { x: w / 2, y: h / 2, vx: 0, vy: 0, angle: -Math.PI / 2, hp: CFG.playerHp, hurt: 0, heal: 0, gait: 0 },
      wolves: [], foods: [], parts: [], rings: [],
      joy: { active: false },
      bark: 0, spawnT: 0, foodT: 2, t: 0, wave: 1, waveT: 0,
      score: 0, kills: 0, shake: 0, over: false,
    }
  }, [])

  const start = useCallback(() => {
    gameRef.current = newGame()
    setHud({ score: 0, hp: 100, wave: 1, cd: 1 })
    setPhaseBoth('playing')
  }, [newGame])

  const triggerBark = useCallback(() => {
    const g = gameRef.current
    if (!g || g.over || phaseRef.current !== 'playing' || g.bark > 0) return
    g.bark = CFG.barkCooldown
    g.shake = Math.min(1, g.shake + 0.9)
    const p = g.player
    g.rings.push({ x: p.x, y: p.y, r: 26, max: CFG.barkRadius, a: 1 })
    burst(g, p.x, p.y, 26, '#ffce7a', 5.5)
    for (const w of g.wolves) {
      const dx = w.x - p.x, dy = w.y - p.y
      const d = Math.hypot(dx, dy) || 1
      if (d < CFG.barkRadius + CFG.wolfR) {
        const nx = dx / d, ny = dy / d
        const force = CFG.barkKnock * (1 - d / (CFG.barkRadius + 120))
        w.vx += nx * Math.max(190, force)
        w.vy += ny * Math.max(190, force)
        w.hp -= 2
        w.stun = 0.5
      }
    }
  }, [])

  /* resize / DPR */
  useEffect(() => {
    const wrap = wrapRef.current, canvas = canvasRef.current
    const resize = () => {
      const rect = wrap.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.max(320, rect.width), h = Math.max(240, rect.height)
      dimRef.current = { w, h, dpr }
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      const g = gameRef.current
      if (g) { g.player.x = Math.min(g.player.x, w - CFG.playerR); g.player.y = Math.min(g.player.y, h - CFG.playerR) }
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)
    window.addEventListener('orientationchange', resize)
    return () => { ro.disconnect(); window.removeEventListener('orientationchange', resize) }
  }, [])

  /* keyboard */
  useEffect(() => {
    const keys = inputRef.current.keys
    const down = (e) => {
      const k = e.key.toLowerCase()
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd', ' '].includes(k) && phaseRef.current === 'playing') e.preventDefault()
      keys[k] = true
      if (k === ' ') { phaseRef.current === 'playing' ? triggerBark() : start() }
    }
    const up = (e) => { keys[e.key.toLowerCase()] = false }
    window.addEventListener('keydown', down, { passive: false })
    window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [triggerBark, start])

  /* pointer / touch — floating joystick */
  const ptrPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const t = e.touches ? e.touches[0] : e
    return { x: t.clientX - rect.left, y: t.clientY - rect.top }
  }
  const onDown = (e) => {
    if (phaseRef.current !== 'playing') return
    const p = ptrPos(e)
    inputRef.current.ptr = { active: true, ox: p.x, oy: p.y, x: p.x, y: p.y }
  }
  const onMove = (e) => {
    const ptr = inputRef.current.ptr
    if (!ptr.active) return
    const p = ptrPos(e); ptr.x = p.x; ptr.y = p.y
  }
  const onUp = () => { inputRef.current.ptr.active = false }

  /* main loop */
  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d')
    let last = performance.now(), hudAcc = 0
    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now
      const g = gameRef.current, dim = dimRef.current
      if (g && phaseRef.current === 'playing' && !g.over) {
        update(g, dt, dim, inputRef.current)
        hudAcc += dt
        if (hudAcc > 0.1) {
          hudAcc = 0
          setHud({ score: Math.floor(g.score), hp: Math.max(0, Math.round(g.player.hp)), wave: g.wave, cd: 1 - g.bark / CFG.barkCooldown })
        }
        if (g.player.hp <= 0) {
          g.over = true
          const fs = Math.floor(g.score)
          setHud((h) => ({ ...h, hp: 0, score: fs }))
          setBest((prev) => { const nb = Math.max(prev, fs); localStorage.setItem('kangal_guardian_best', String(nb)); return nb })
          setPhaseBoth('over')
        }
      }
      render(ctx, g, dim)
      rafRef.current = requestAnimationFrame(frame)
    }
    rafRef.current = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <div className={`game-shell ${standalone ? 'game-shell--full' : ''}`}>
      <div className={`game-frame ${standalone ? 'game-frame--full' : ''}`} ref={wrapRef}>
        <canvas
          ref={canvasRef}
          className="game-canvas"
          onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
          onTouchStart={(e) => { e.preventDefault(); onDown(e) }}
          onTouchMove={(e) => { e.preventDefault(); onMove(e) }}
          onTouchEnd={onUp}
        />

        {phase === 'playing' && (
          <>
            <div className="g-hud g-hud--tl">
              <div className="g-hp">
                <div className="g-hp-bar" style={{ width: `${hud.hp}%` }} />
                <span className="g-hp-txt">{hud.hp} HP</span>
              </div>
              <div className="g-wave">WAVE {hud.wave}</div>
            </div>
            <div className="g-hud g-hud--tr">
              <div className="g-score">{String(hud.score).padStart(5, '0')}</div>
              <div className="g-best">BEST {String(best).padStart(5, '0')}</div>
            </div>
            <button
              className={`g-bark ${hud.cd >= 1 ? 'ready' : ''}`}
              onMouseDown={(e) => { e.preventDefault(); triggerBark() }}
              onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); triggerBark() }}
              aria-label="Bark"
            >
              <svg viewBox="0 0 36 36" className="g-bark-ring">
                <circle cx="18" cy="18" r="16" className="g-bark-track" />
                <circle cx="18" cy="18" r="16" className="g-bark-fill" style={{ strokeDashoffset: 100.5 * (1 - hud.cd) }} />
              </svg>
              <span>BARK</span>
            </button>
          </>
        )}

        {phase !== 'playing' && (
          <div className="g-overlay">
            <div className="g-card">
              <div className="g-kicker">{phase === 'over' ? 'The pack fell' : 'Playable demo'}</div>
              <h3 className="g-title">{phase === 'over' ? 'Watch is over' : 'Kangal: Night Watch'}</h3>
              {phase === 'over' ? (
                <p className="g-score-line">Score <b>{String(hud.score).padStart(5, '0')}</b><span> · Best {String(best).padStart(5, '0')}</span></p>
              ) : (
                <p className="g-desc">Guard the moonlit steppe. Move to dodge the wolves, bark to drive them back, and grab <b style={{ color: '#f4e9d8' }}>bones</b> &amp; <b style={{ color: '#ff8a6a' }}>meat</b> to heal. How long can you hold the line?</p>
              )}
              <button className="btn btn--primary" onClick={start}>{phase === 'over' ? 'Hold again' : 'Start watch'}</button>
              <div className="g-keys">
                <span><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> / drag — move</span>
                <span><kbd>Space</kbd> / BARK — shockwave</span>
              </div>
            </div>
          </div>
        )}
      </div>
      {!standalone && <p className="g-note">A tiny in-browser tech demo. A taste of the feel we care about.</p>}
    </div>
  )
}

/* ================= simulation ================= */
function update(g, dt, dim, input) {
  const { w, h } = dim
  const p = g.player
  g.t += dt; g.waveT += dt
  if (g.bark > 0) g.bark = Math.max(0, g.bark - dt)
  if (g.shake > 0) g.shake = Math.max(0, g.shake - dt * 2.2)
  if (p.hurt > 0) p.hurt = Math.max(0, p.hurt - dt)
  if (p.heal > 0) p.heal = Math.max(0, p.heal - dt)
  if (g.waveT > 16) { g.waveT = 0; g.wave += 1 }

  // input -> direction + magnitude
  const k = input.keys
  let dirx = 0, diry = 0, mag = 0
  let kx = (k['arrowright'] || k['d'] ? 1 : 0) - (k['arrowleft'] || k['a'] ? 1 : 0)
  let ky = (k['arrowdown'] || k['s'] ? 1 : 0) - (k['arrowup'] || k['w'] ? 1 : 0)
  if (kx || ky) { const l = Math.hypot(kx, ky); dirx = kx / l; diry = ky / l; mag = 1; g.joy = { active: false } }
  else if (input.ptr.active) {
    const dx = input.ptr.x - input.ptr.ox, dy = input.ptr.y - input.ptr.oy
    const len = Math.hypot(dx, dy)
    if (len > 6) { dirx = dx / len; diry = dy / len; mag = Math.min(1, len / CFG.joyMax) }
    g.joy = { active: true, ox: input.ptr.ox, oy: input.ptr.oy, kx: input.ptr.ox + dirx * Math.min(len, CFG.joyMax), ky: input.ptr.oy + diry * Math.min(len, CFG.joyMax) }
  } else g.joy = { active: false }

  const tvx = dirx * CFG.playerSpeed * mag, tvy = diry * CFG.playerSpeed * mag
  const moving = mag > 0.02
  p.vx += (tvx - p.vx) * Math.min(1, dt * 14)
  p.vy += (tvy - p.vy) * Math.min(1, dt * 14)
  p.x = clamp(p.x + p.vx * dt, CFG.playerR, w - CFG.playerR)
  p.y = clamp(p.y + p.vy * dt, CFG.playerR, h - CFG.playerR)
  const spd = Math.hypot(p.vx, p.vy)
  g.player.gait += dt * (2 + spd * 0.02)
  if (moving) {
    p.angle = lerpAngle(p.angle, Math.atan2(p.vy, p.vx), Math.min(1, dt * 12))
    if (Math.random() < dt * 26) burst(g, p.x - Math.cos(p.angle) * 16, p.y - Math.sin(p.angle) * 16, 1, 'rgba(200,170,120,0.5)', 1.4, 0.5)
  }

  // spawn wolves
  g.spawnT -= dt
  const interval = Math.max(0.42, 1.5 - g.wave * 0.12)
  const cap = 8 + g.wave * 3
  if (g.spawnT <= 0 && g.wolves.length < cap) { g.spawnT = interval; g.wolves.push(spawnWolf(w, h, g.wave)) }

  // spawn food
  g.foodT -= dt
  if (g.foodT <= 0 && g.foods.length < 3) {
    g.foodT = 4 + Math.random() * 2.5
    const meat = Math.random() < 0.35
    g.foods.push({
      x: 60 + Math.random() * (w - 120), y: 60 + Math.random() * (h - 120),
      type: meat ? 'meat' : 'bone', heal: meat ? CFG.meatHeal : CFG.boneHeal,
      life: 11, bob: Math.random() * 6,
    })
  }

  // wolves
  const speed = CFG.wolfBaseSpeed + g.wave * 9
  for (const wf of g.wolves) {
    if (wf.stun > 0) wf.stun = Math.max(0, wf.stun - dt)
    const dx = p.x - wf.x, dy = p.y - wf.y
    const d = Math.hypot(dx, dy) || 1
    wf.angle = lerpAngle(wf.angle, Math.atan2(dy, dx), Math.min(1, dt * 8))
    if (wf.stun <= 0) { const s = speed * wf.sp; wf.vx += (dx / d * s - wf.vx) * Math.min(1, dt * 4); wf.vy += (dy / d * s - wf.vy) * Math.min(1, dt * 4) }
    for (const o of g.wolves) {
      if (o === wf) continue
      const ox = wf.x - o.x, oy = wf.y - o.y, od = Math.hypot(ox, oy)
      if (od > 0 && od < CFG.wolfR * 2) { wf.vx += (ox / od) * 48 * dt; wf.vy += (oy / od) * 48 * dt }
    }
    wf.vx *= 0.98; wf.vy *= 0.98
    wf.x = clamp(wf.x + wf.vx * dt, -40, w + 40)
    wf.y = clamp(wf.y + wf.vy * dt, -40, h + 40)
    wf.gait += dt * (2 + Math.hypot(wf.vx, wf.vy) * 0.012)
    if (d < CFG.playerR + CFG.wolfR) {
      p.hp -= CFG.biteDmg * dt; p.hurt = 0.6; g.shake = Math.min(1, g.shake + dt * 3)
      if (Math.random() < dt * 20) burst(g, p.x - dx / d * 4, p.y - dy / d * 4, 1, '#ff6a5a', 2)
    }
  }
  g.wolves = g.wolves.filter((wf) => {
    if (wf.hp <= 0) { g.kills += 1; g.score += 12; burst(g, wf.x, wf.y, 14, '#9aa3b2', 4); burst(g, wf.x, wf.y, 6, '#e8a23d', 3); return false }
    return true
  })

  // foods
  for (const f of g.foods) {
    f.life -= dt; f.bob += dt
    const d = Math.hypot(p.x - f.x, p.y - f.y)
    if (d < CFG.playerR + CFG.foodR) {
      f.eaten = true
      p.hp = Math.min(CFG.playerHp, p.hp + f.heal); p.heal = 0.5
      g.score += f.type === 'meat' ? 20 : 10
      g.rings.push({ x: f.x, y: f.y, r: 8, max: 40, a: 0.8, heal: true })
      burst(g, f.x, f.y, 12, f.type === 'meat' ? '#ff8a6a' : '#efe3cf', 3)
      burst(g, f.x, f.y, 8, '#8fe6a0', 2.6)
    }
  }
  g.foods = g.foods.filter((f) => !f.eaten && f.life > 0)

  // rings
  for (const r of g.rings) { r.r += (r.max - r.r) * Math.min(1, dt * 7) + 260 * dt; r.a -= dt * 1.7 }
  g.rings = g.rings.filter((r) => r.a > 0)

  // particles
  for (const pt of g.parts) { pt.x += pt.vx * dt; pt.y += pt.vy * dt; pt.vx *= 0.92; pt.vy *= 0.92; pt.life -= dt }
  g.parts = g.parts.filter((pt) => pt.life > 0)

  g.score += dt * 6
}

function spawnWolf(w, h, wave) {
  const side = Math.floor(Math.random() * 4)
  let x, y
  if (side === 0) { x = Math.random() * w; y = -30 }
  else if (side === 1) { x = w + 30; y = Math.random() * h }
  else if (side === 2) { x = Math.random() * w; y = h + 30 }
  else { x = -30; y = Math.random() * h }
  return { x, y, vx: 0, vy: 0, angle: 0, hp: 1, sp: 0.85 + Math.random() * 0.35, stun: 0, gait: Math.random() * 6 }
}

function burst(g, x, y, n, color, spd = 3, life = 0.6) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, s = (0.4 + Math.random()) * spd * 60
    g.parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: life + Math.random() * 0.3, max: life + 0.3, color, r: 1.5 + Math.random() * 2.5 })
  }
}
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v)
function lerpAngle(a, b, t) { let d = b - a; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2; return a + d * t }

/* ================= rendering ================= */
function render(ctx, g, dim) {
  const { w, h, dpr } = dim
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  let sx = 0, sy = 0
  if (g && g.shake > 0) { const m = g.shake * 9; sx = (Math.random() - 0.5) * m; sy = (Math.random() - 0.5) * m }
  ctx.save(); ctx.translate(sx, sy)
  drawBackground(ctx, w, h)

  if (g) {
    const pl = g.player
    const pg = ctx.createRadialGradient(pl.x, pl.y, 10, pl.x, pl.y, 190)
    pg.addColorStop(0, 'rgba(232,162,61,0.15)'); pg.addColorStop(1, 'rgba(232,162,61,0)')
    ctx.fillStyle = pg; ctx.fillRect(0, 0, w, h)

    for (const f of g.foods) drawFood(ctx, f)
    for (const r of g.rings) {
      ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2)
      const c = r.heal ? '143,230,160' : '255,206,122'
      ctx.strokeStyle = `rgba(${c},${Math.max(0, r.a)})`
      ctx.lineWidth = 3 + r.a * 4; ctx.shadowColor = `rgba(${c},0.8)`; ctx.shadowBlur = 18; ctx.stroke(); ctx.shadowBlur = 0
    }
    for (const pt of g.parts) { ctx.globalAlpha = Math.max(0, pt.life / pt.max); ctx.fillStyle = pt.color; ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2); ctx.fill() }
    ctx.globalAlpha = 1
    for (const wf of g.wolves) drawWolf(ctx, wf)
    drawKangal(ctx, pl)
    if (g.joy && g.joy.active) drawJoystick(ctx, g.joy)
  }
  ctx.restore()
  drawVignette(ctx, w, h)
}

function drawBackground(ctx, w, h) {
  const sky = ctx.createLinearGradient(0, 0, 0, h)
  sky.addColorStop(0, '#0a0b14'); sky.addColorStop(0.55, '#12101a'); sky.addColorStop(1, '#1a130f')
  ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h)
  const mx = w * 0.8, my = h * 0.22, mr = Math.min(w, h) * 0.11
  const mg = ctx.createRadialGradient(mx, my, mr * 0.2, mx, my, mr * 3)
  mg.addColorStop(0, 'rgba(255,240,210,0.9)'); mg.addColorStop(0.18, 'rgba(255,226,170,0.55)'); mg.addColorStop(1, 'rgba(255,220,160,0)')
  ctx.fillStyle = mg; ctx.beginPath(); ctx.arc(mx, my, mr * 3, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#fdf3dc'; ctx.beginPath(); ctx.arc(mx, my, mr, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  for (let i = 0; i < 46; i++) {
    const x = (i * 97.13 % w), y = ((i * 53.7) % (h * 0.55)), s = (i % 3 === 0) ? 1.4 : 0.8
    ctx.globalAlpha = 0.3 + ((i * 17) % 10) / 20; ctx.fillRect(x, y, s, s)
  }
  ctx.globalAlpha = 1
  hill(ctx, w, h, h * 0.66, '#14110c'); hill(ctx, w, h, h * 0.78, '#100d0a', 0.7)
  const gd = ctx.createLinearGradient(0, h * 0.7, 0, h)
  gd.addColorStop(0, '#171009'); gd.addColorStop(1, '#0d0906')
  ctx.fillStyle = gd; ctx.fillRect(0, h * 0.7, w, h * 0.3)
}
function hill(ctx, w, h, base, color, squash = 1) {
  ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(0, h); ctx.lineTo(0, base)
  const seg = 6
  for (let i = 0; i <= seg; i++) { const x = (w / seg) * i; const y = base - Math.sin(i * 1.3 + 1) * 26 * squash - ((i % 2) * 10); ctx.lineTo(x, y) }
  ctx.lineTo(w, h); ctx.closePath(); ctx.fill()
}
function drawVignette(ctx, w, h) {
  const v = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.75)
  v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.55)')
  ctx.fillStyle = v; ctx.fillRect(0, 0, w, h)
}

function drawJoystick(ctx, j) {
  ctx.save()
  ctx.beginPath(); ctx.arc(j.ox, j.oy, CFG.joyMax, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.fill()
  ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(255,206,122,0.4)'; ctx.stroke()
  ctx.beginPath(); ctx.arc(j.kx, j.ky, 24, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255,206,122,0.35)'; ctx.fill()
  ctx.strokeStyle = 'rgba(255,206,122,0.8)'; ctx.stroke()
  ctx.restore()
}

/* ---- food ---- */
function drawFood(ctx, f) {
  const y = f.y + Math.sin(f.bob * 2.2) * 3
  const blink = f.life < 3 && Math.floor(f.life * 6) % 2 === 0
  ctx.save()
  ctx.globalAlpha = blink ? 0.35 : 1
  // glow
  const gr = ctx.createRadialGradient(f.x, y, 2, f.x, y, 26)
  const gc = f.type === 'meat' ? '255,138,106' : '244,233,216'
  gr.addColorStop(0, `rgba(${gc},0.5)`); gr.addColorStop(1, `rgba(${gc},0)`)
  ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(f.x, y, 26, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(f.x, f.y + 12, 12, 4, 0, 0, Math.PI * 2); ctx.fill()
  ctx.translate(f.x, y)
  if (f.type === 'bone') {
    ctx.rotate(-0.5); ctx.fillStyle = '#f4e9d8'; ctx.strokeStyle = '#c9bda6'; ctx.lineWidth = 1
    roundRect(ctx, -9, -2.5, 18, 5, 2.5); ctx.fill()
    for (const ex of [-9, 9]) { ctx.beginPath(); ctx.arc(ex - Math.sign(ex) * 0.5, -3.5, 3.4, 0, Math.PI * 2); ctx.arc(ex - Math.sign(ex) * 0.5, 3.5, 3.4, 0, Math.PI * 2); ctx.fill() }
  } else {
    // meat: drumstick
    ctx.rotate(0.4)
    ctx.fillStyle = '#8a4a2a'; ctx.beginPath(); ctx.ellipse(1, -1, 9, 7, 0, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#b5623a'; ctx.beginPath(); ctx.ellipse(0, -2, 7, 5, 0, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#f4e9d8'; ctx.beginPath(); ctx.moveTo(6, 3); ctx.lineTo(13, 8); ctx.lineTo(11, 10); ctx.lineTo(5, 5); ctx.closePath(); ctx.fill()
    ctx.beginPath(); ctx.arc(13, 8, 2.4, 0, Math.PI * 2); ctx.fill()
  }
  ctx.restore()
}
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath()
}

/* ---- Kangal (detailed top-down) ---- */
function drawKangal(ctx, p) {
  ctx.save()
  ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(p.x, p.y + 13, 24, 10, 0, 0, Math.PI * 2); ctx.fill()
  ctx.translate(p.x, p.y); ctx.rotate(p.angle + Math.PI / 2) // faces up
  const hurt = p.hurt > 0 && Math.floor(p.hurt * 20) % 2 === 0
  const heal = p.heal > 0
  const legSwing = Math.sin(p.gait * 6) * 3

  // curled tail over the back (rear = +y)
  ctx.strokeStyle = '#9c6f3c'; ctx.lineWidth = 8; ctx.lineCap = 'round'
  ctx.beginPath(); ctx.moveTo(0, 20); ctx.bezierCurveTo(12, 26, 14, 14, 4, 12); ctx.stroke()
  ctx.strokeStyle = '#7c5630'; ctx.lineWidth = 3
  ctx.beginPath(); ctx.moveTo(0, 20); ctx.bezierCurveTo(11, 25, 12.5, 15, 5, 12.5); ctx.stroke()

  // hind paws
  ctx.fillStyle = '#7c5630'
  ctx.beginPath(); ctx.ellipse(-11, 12 - legSwing, 4.5, 6, 0, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.ellipse(11, 12 + legSwing, 4.5, 6, 0, 0, Math.PI * 2); ctx.fill()

  // body — sturdy, with fur gradient
  const bg = ctx.createRadialGradient(-4, -2, 4, 0, 2, 26)
  bg.addColorStop(0, hurt ? '#ffe0cb' : '#e6c489'); bg.addColorStop(0.7, hurt ? '#ffcbb0' : '#c99a5b'); bg.addColorStop(1, '#9c6f3c')
  ctx.fillStyle = bg
  ctx.beginPath(); ctx.moveTo(0, -18)
  ctx.bezierCurveTo(16, -16, 18, 12, 9, 20)
  ctx.bezierCurveTo(3, 24, -3, 24, -9, 20)
  ctx.bezierCurveTo(-18, 12, -16, -16, 0, -18); ctx.closePath(); ctx.fill()
  // dorsal shading
  ctx.strokeStyle = 'rgba(124,86,48,0.5)'; ctx.lineWidth = 3
  ctx.beginPath(); ctx.moveTo(0, -6); ctx.lineTo(0, 14); ctx.stroke()

  // front paws
  ctx.fillStyle = '#8a5f30'
  ctx.beginPath(); ctx.ellipse(-9, -12 + legSwing, 4.5, 6, 0, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.ellipse(9, -12 - legSwing, 4.5, 6, 0, 0, Math.PI * 2); ctx.fill()

  // spiked collar (traditional Kangal)
  ctx.strokeStyle = '#3a2c1e'; ctx.lineWidth = 4
  ctx.beginPath(); ctx.arc(0, -10, 11, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke()
  ctx.fillStyle = '#c9c4bd'
  for (const a of [0.28, 0.5, 0.72]) { const ax = Math.cos(a * Math.PI) * 11, ay = -10 + Math.sin(a * Math.PI) * 11; ctx.beginPath(); ctx.arc(ax, ay, 1.5, 0, Math.PI * 2); ctx.fill() }

  // head
  const hg = ctx.createRadialGradient(0, -18, 3, 0, -16, 15)
  hg.addColorStop(0, hurt ? '#ffe0cb' : '#e2ba7e'); hg.addColorStop(1, hurt ? '#ffcbb0' : '#c1904f')
  ctx.fillStyle = hg
  ctx.beginPath(); ctx.ellipse(0, -18, 13.5, 13, 0, 0, Math.PI * 2); ctx.fill()
  // drop ears
  ctx.fillStyle = '#6f4e2b'
  ctx.beginPath(); ctx.ellipse(-12, -17, 5.5, 8, -0.5, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.ellipse(12, -17, 5.5, 8, 0.5, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#4f3921'
  ctx.beginPath(); ctx.ellipse(-12, -15, 2.6, 4.5, -0.5, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.ellipse(12, -15, 2.6, 4.5, 0.5, 0, Math.PI * 2); ctx.fill()
  // black mask + muzzle
  ctx.fillStyle = '#241812'
  ctx.beginPath(); ctx.moveTo(-8, -20); ctx.quadraticCurveTo(0, -16, 8, -20); ctx.quadraticCurveTo(7, -30, 0, -32); ctx.quadraticCurveTo(-7, -30, -8, -20); ctx.closePath(); ctx.fill()
  ctx.fillStyle = '#0e0a08'; ctx.beginPath(); ctx.ellipse(0, -31, 3.2, 2.6, 0, 0, Math.PI * 2); ctx.fill()
  // amber glowing eyes
  ctx.shadowColor = '#ffcf6b'; ctx.shadowBlur = 9
  ctx.fillStyle = heal ? '#b6ffcf' : '#ffce7a'
  ctx.beginPath(); ctx.arc(-5.5, -19, 2.3, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(5.5, -19, 2.3, 0, Math.PI * 2); ctx.fill()
  ctx.shadowBlur = 0
  ctx.fillStyle = '#3a2410'
  ctx.beginPath(); ctx.arc(-5.5, -19, 1, 0, Math.PI * 2); ctx.arc(5.5, -19, 1, 0, Math.PI * 2); ctx.fill()
  ctx.restore()
}

/* ---- Wolf (lean, menacing top-down) ---- */
function drawWolf(ctx, wf) {
  ctx.save()
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(wf.x, wf.y + 10, 16, 6, 0, 0, Math.PI * 2); ctx.fill()
  ctx.translate(wf.x, wf.y); ctx.rotate(wf.angle + Math.PI / 2)
  const legSwing = Math.sin(wf.gait * 6) * 3

  // straight bushy tail (rear = +y)
  ctx.strokeStyle = '#3f444e'; ctx.lineWidth = 7; ctx.lineCap = 'round'
  ctx.beginPath(); ctx.moveTo(0, 14); ctx.quadraticCurveTo(-3, 24, -5, 30); ctx.stroke()
  ctx.strokeStyle = '#2b2f37'; ctx.lineWidth = 3
  ctx.beginPath(); ctx.moveTo(-4, 27); ctx.lineTo(-5, 31); ctx.stroke()

  // hind paws
  ctx.fillStyle = '#2f333b'
  ctx.beginPath(); ctx.ellipse(-8, 9 - legSwing, 3.3, 5, 0, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.ellipse(8, 9 + legSwing, 3.3, 5, 0, 0, Math.PI * 2); ctx.fill()

  // lean body with darker saddle
  const bg = ctx.createRadialGradient(-3, -2, 3, 0, 2, 20)
  bg.addColorStop(0, '#949ba9'); bg.addColorStop(0.7, '#6b727e'); bg.addColorStop(1, '#454b56')
  ctx.fillStyle = bg
  ctx.beginPath(); ctx.moveTo(0, -16)
  ctx.bezierCurveTo(11, -14, 12, 12, 6, 17)
  ctx.bezierCurveTo(2, 20, -2, 20, -6, 17)
  ctx.bezierCurveTo(-12, 12, -11, -14, 0, -16); ctx.closePath(); ctx.fill()
  ctx.fillStyle = 'rgba(43,47,55,0.55)'
  ctx.beginPath(); ctx.ellipse(0, 0, 4, 12, 0, 0, Math.PI * 2); ctx.fill()

  // front paws
  ctx.fillStyle = '#3a3f49'
  ctx.beginPath(); ctx.ellipse(-7, -10 + legSwing, 3.3, 5, 0, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.ellipse(7, -10 - legSwing, 3.3, 5, 0, 0, Math.PI * 2); ctx.fill()

  // neck ruff
  ctx.fillStyle = '#5a616d'
  ctx.beginPath(); ctx.ellipse(0, -9, 10, 6, 0, 0, Math.PI * 2); ctx.fill()

  // head (narrow)
  ctx.fillStyle = '#727986'
  ctx.beginPath(); ctx.ellipse(0, -15, 8.5, 9.5, 0, 0, Math.PI * 2); ctx.fill()
  // pointed erect ears
  ctx.fillStyle = '#4a505b'
  ctx.beginPath(); ctx.moveTo(-8, -18); ctx.lineTo(-4.5, -11); ctx.lineTo(-10.5, -12.5); ctx.closePath(); ctx.fill()
  ctx.beginPath(); ctx.moveTo(8, -18); ctx.lineTo(4.5, -11); ctx.lineTo(10.5, -12.5); ctx.closePath(); ctx.fill()
  ctx.fillStyle = '#2f333b'
  ctx.beginPath(); ctx.moveTo(-7.5, -17); ctx.lineTo(-5.5, -13); ctx.lineTo(-9, -13.5); ctx.closePath(); ctx.fill()
  ctx.beginPath(); ctx.moveTo(7.5, -17); ctx.lineTo(5.5, -13); ctx.lineTo(9, -13.5); ctx.closePath(); ctx.fill()
  // elongated snout
  ctx.fillStyle = '#5a616d'
  ctx.beginPath(); ctx.moveTo(-4, -19); ctx.lineTo(4, -19); ctx.lineTo(2.2, -28); ctx.lineTo(-2.2, -28); ctx.closePath(); ctx.fill()
  ctx.fillStyle = '#161a20'; ctx.beginPath(); ctx.ellipse(0, -27.5, 2.2, 1.8, 0, 0, Math.PI * 2); ctx.fill()
  // glowing red eyes (angled)
  ctx.shadowColor = '#ff3a2a'; ctx.shadowBlur = 8
  ctx.fillStyle = '#ff5a48'
  ctx.save(); ctx.translate(-3.8, -16); ctx.rotate(0.5); ctx.beginPath(); ctx.ellipse(0, 0, 2.4, 1.4, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore()
  ctx.save(); ctx.translate(3.8, -16); ctx.rotate(-0.5); ctx.beginPath(); ctx.ellipse(0, 0, 2.4, 1.4, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore()
  ctx.shadowBlur = 0
  ctx.restore()
}
