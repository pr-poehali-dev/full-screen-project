import { useRef, useEffect, useState, useCallback } from "react";
import { createGame, updateGame, spawnBullet } from "@/game/engine";
import { renderGame, renderHUD } from "@/game/renderer";
import { GameState } from "@/game/types";

interface Props {
  brawlerIdx: number;
  mode: string;
  onExit: (victory: boolean, score: { player: number; enemy: number }) => void;
}

interface JoystickState {
  active: boolean;
  startX: number;
  startY: number;
  curX: number;
  curY: number;
  touchId: number;
}

const JOYSTICK_R = 50;
const KNOB_R = 22;

export default function GameCanvas({ brawlerIdx, mode, onExit }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<GameState | null>(null);
  const rafRef = useRef<number>(0);
  const moveJoy = useRef<JoystickState>({ active: false, startX: 0, startY: 0, curX: 0, curY: 0, touchId: -1 });
  const shootJoy = useRef<JoystickState>({ active: false, startX: 0, startY: 0, curX: 0, curY: 0, touchId: -1 });
  const keysRef = useRef<Set<string>>(new Set());
  const mouseRef = useRef<{ x: number; y: number; down: boolean }>({ x: 0, y: 0, down: false });
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState<{ victory: boolean; score: { player: number; enemy: number } } | null>(null);
  const [paused, setPaused] = useState(false);

  // Init game
  useEffect(() => {
    gameRef.current = createGame(brawlerIdx, mode);
    gameRef.current.camera.x = gameRef.current.brawlers[0].x;
    gameRef.current.camera.y = gameRef.current.brawlers[0].y;
  }, [brawlerIdx, mode]);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const loop = () => {
      if (!gameRef.current || paused) { rafRef.current = requestAnimationFrame(loop); return; }
      const state = gameRef.current;
      const W = canvas.width;
      const H = canvas.height;

      // Build input from joysticks + keyboard + mouse
      const moveInput = getMoveInput(keysRef.current, moveJoy.current);
      const shootInput = getShootInput(keysRef.current, shootJoy.current, mouseRef.current, state, W, H);

      updateGame(state, { move: moveInput, shoot: shootInput, superPressed: false }, 1);

      // Render
      renderGame(ctx, state, W, H);
      renderHUD(ctx, state, W, H);

      // Joystick overlays
      drawJoystick(ctx, moveJoy.current, W, H, "left");
      drawJoystick(ctx, shootJoy.current, W, H, "right");

      if (state.gameOver && !gameOver) {
        setGameOver(true);
        setResult({ victory: state.victory, score: state.score });
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [paused, gameOver]);

  // Keyboard
  useEffect(() => {
    const down = (e: KeyboardEvent) => { keysRef.current.add(e.key.toLowerCase()); e.preventDefault(); };
    const up = (e: KeyboardEvent) => keysRef.current.delete(e.key.toLowerCase());
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []);

  // Mouse shoot
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const move = (e: MouseEvent) => { mouseRef.current.x = e.clientX; mouseRef.current.y = e.clientY; };
    const down = (e: MouseEvent) => { mouseRef.current.down = true; };
    const up = () => { mouseRef.current.down = false; };
    canvas.addEventListener("mousemove", move);
    canvas.addEventListener("mousedown", down);
    canvas.addEventListener("mouseup", up);
    return () => { canvas.removeEventListener("mousemove", move); canvas.removeEventListener("mousedown", down); canvas.removeEventListener("mouseup", up); };
  }, []);

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.offsetWidth;

    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      const x = t.clientX;
      const y = t.clientY;

      if (x < W / 2 && !moveJoy.current.active) {
        moveJoy.current = { active: true, startX: x, startY: y, curX: x, curY: y, touchId: t.identifier };
      } else if (x >= W / 2 && !shootJoy.current.active) {
        shootJoy.current = { active: true, startX: x, startY: y, curX: x, curY: y, touchId: t.identifier };
      }
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (t.identifier === moveJoy.current.touchId) {
        moveJoy.current.curX = t.clientX;
        moveJoy.current.curY = t.clientY;
      } else if (t.identifier === shootJoy.current.touchId) {
        shootJoy.current.curX = t.clientX;
        shootJoy.current.curY = t.clientY;
      }
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (t.identifier === moveJoy.current.touchId) {
        moveJoy.current.active = false;
      } else if (t.identifier === shootJoy.current.touchId) {
        shootJoy.current.active = false;
      }
    }
  }, []);

  if (gameOver && result) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ background: result.victory ? "radial-gradient(ellipse, #0D2E0D, #0A0B14)" : "radial-gradient(ellipse, #2E0D0D, #0A0B14)" }}>
        <div className="text-center animate-scale-in" style={{ opacity: 0 }}>
          <div className="font-bebas text-8xl mb-2" style={{
            color: result.victory ? "#00E676" : "#FF1744",
            textShadow: `0 0 40px ${result.victory ? "#00E676" : "#FF1744"}`,
          }}>
            {result.victory ? "ПОБЕДА!" : "ПОРАЖЕНИЕ"}
          </div>
          <div className="text-6xl mb-6">{result.victory ? "🏆" : "💀"}</div>
          <div className="flex gap-8 justify-center mb-8">
            <div className="text-center">
              <div className="font-bebas text-4xl" style={{ color: "#00E676" }}>{result.score.player}</div>
              <div className="text-sm opacity-60">Убийства команды</div>
            </div>
            <div className="font-bebas text-4xl opacity-30 self-center">VS</div>
            <div className="text-center">
              <div className="font-bebas text-4xl" style={{ color: "#FF1744" }}>{result.score.enemy}</div>
              <div className="text-sm opacity-60">Убийства врагов</div>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => { gameRef.current = createGame(brawlerIdx, mode); setGameOver(false); setResult(null); }}
              className="px-8 py-3 rounded-xl font-bebas text-xl tracking-widest transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #FF6B00, #FFB800)", color: "#0A0B14" }}>
              ⚔️ СНОВА
            </button>
            <button
              onClick={() => onExit(result.victory, result.score)}
              className="px-8 py-3 rounded-xl font-bebas text-xl tracking-widest transition-all hover:scale-105"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", color: "white" }}>
              🏠 В МЕНЮ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50" style={{ background: "#1A2E0A" }}>
      {/* Game canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ touchAction: "none", cursor: "crosshair" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      />

      {/* Pause button */}
      <button
        onClick={() => setPaused(p => !p)}
        className="absolute top-12 right-4 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg z-10 transition-all hover:scale-110"
        style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.2)", color: "white" }}>
        {paused ? "▶" : "⏸"}
      </button>

      {/* Back button */}
      <button
        onClick={() => onExit(false, gameRef.current?.score ?? { player: 0, enemy: 0 })}
        className="absolute top-12 right-16 w-10 h-10 rounded-xl flex items-center justify-center text-lg z-10 transition-all hover:scale-110"
        style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)" }}>
        ✕
      </button>

      {/* Pause overlay */}
      {paused && (
        <div className="absolute inset-0 flex items-center justify-center z-10"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}>
          <div className="text-center">
            <div className="font-bebas text-5xl mb-6 tracking-widest" style={{ color: "#FFB800" }}>ПАУЗА</div>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setPaused(false)}
                className="px-6 py-3 rounded-xl font-bebas text-xl tracking-widest transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #FF6B00, #FFB800)", color: "#0A0B14" }}>
                ▶ ПРОДОЛЖИТЬ
              </button>
              <button onClick={() => onExit(false, gameRef.current?.score ?? { player: 0, enemy: 0 })}
                className="px-6 py-3 rounded-xl font-bebas text-xl tracking-widest transition-all hover:scale-105"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", color: "white" }}>
                🏠 В МЕНЮ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Controls hint */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs opacity-30 pointer-events-none">
        WASD/стрелки — движение · мышь/ПКМ — прицел · пробел — стрельба
      </div>
    </div>
  );
}

// ── Input helpers ──

function getMoveInput(keys: Set<string>, joy: JoystickState) {
  if (joy.active) {
    const dx = joy.curX - joy.startX;
    const dy = joy.curY - joy.startY;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 5) return null;
    return { x: dx / Math.max(len, JOYSTICK_R), y: dy / Math.max(len, JOYSTICK_R) };
  }
  let x = 0, y = 0;
  if (keys.has("w") || keys.has("arrowup")) y -= 1;
  if (keys.has("s") || keys.has("arrowdown")) y += 1;
  if (keys.has("a") || keys.has("arrowleft")) x -= 1;
  if (keys.has("d") || keys.has("arrowright")) x += 1;
  if (x === 0 && y === 0) return null;
  return { x, y };
}

function getShootInput(
  keys: Set<string>,
  joy: JoystickState,
  mouse: { x: number; y: number; down: boolean },
  state: GameState,
  W: number,
  H: number
) {
  // Touch joystick
  if (joy.active) {
    const dx = joy.curX - joy.startX;
    const dy = joy.curY - joy.startY;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 8) return null;
    return { x: dx / len, y: dy / len };
  }
  // Mouse
  if (mouse.down) {
    const player = state.brawlers.find(b => b.isPlayer && b.alive);
    if (!player) return null;
    const camX = state.camera.x - W / 2;
    const camY = state.camera.y - H / 2;
    const wx = mouse.x + camX;
    const wy = mouse.y + camY;
    const dx = wx - player.x;
    const dy = wy - player.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 5) return null;
    return { x: dx / len, y: dy / len };
  }
  // Space / J
  if (keys.has(" ") || keys.has("j")) {
    const player = state.brawlers.find(b => b.isPlayer && b.alive);
    if (!player) return null;
    return { x: Math.cos(player.angle), y: Math.sin(player.angle) };
  }
  return null;
}

// ── Joystick renderer ──

function drawJoystick(
  ctx: CanvasRenderingContext2D,
  joy: JoystickState,
  W: number,
  H: number,
  side: "left" | "right"
) {
  const baseX = side === "left" ? 90 : W - 90;
  const baseY = H - 90;

  // Base circle
  ctx.globalAlpha = joy.active ? 0.45 : 0.2;
  ctx.strokeStyle = "rgba(255,255,255,0.8)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(baseX, baseY, JOYSTICK_R, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.beginPath();
  ctx.arc(baseX, baseY, JOYSTICK_R, 0, Math.PI * 2);
  ctx.fill();

  // Knob
  if (joy.active) {
    const dx = Math.min(JOYSTICK_R, Math.max(-JOYSTICK_R, joy.curX - joy.startX));
    const dy = Math.min(JOYSTICK_R, Math.max(-JOYSTICK_R, joy.curY - joy.startY));
    const kx = baseX + dx * 0.7;
    const ky = baseY + dy * 0.7;

    const knobColor = side === "left" ? "#00E5FF" : "#FFB800";
    ctx.fillStyle = knobColor;
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.arc(kx, ky, KNOB_R, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.globalAlpha = 0.9;
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(side === "left" ? "↕" : "🔫", kx, ky);
  } else {
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.arc(baseX, baseY, KNOB_R, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.globalAlpha = 0.5;
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(side === "left" ? "↕" : "🔫", baseX, baseY);
  }

  ctx.globalAlpha = 1;
}
