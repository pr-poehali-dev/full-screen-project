import { GameState, Brawler, Bullet, Particle } from "./types";
import { TILE } from "./mapGen";

const TILE_COLORS = {
  empty: "#2D4A1E",
  wall: "#4A3728",
  bush: "#1B5E20",
  water: "#0D47A1",
};

const TILE_BORDER = {
  empty: "#253D18",
  wall: "#3E2E21",
  bush: "#154F1A",
  water: "#0A3880",
};

export function renderGame(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  canvasW: number,
  canvasH: number
) {
  ctx.clearRect(0, 0, canvasW, canvasH);

  const camX = state.camera.x - canvasW / 2;
  const camY = state.camera.y - canvasH / 2;

  ctx.save();
  ctx.translate(-camX, -camY);

  // ── TILES ──
  const startTX = Math.max(0, Math.floor(camX / TILE));
  const endTX = Math.min(state.mapW, Math.ceil((camX + canvasW) / TILE) + 1);
  const startTY = Math.max(0, Math.floor(camY / TILE));
  const endTY = Math.min(state.mapH, Math.ceil((camY + canvasH) / TILE) + 1);

  for (let ty = startTY; ty < endTY; ty++) {
    for (let tx = startTX; tx < endTX; tx++) {
      const tile = state.tiles[ty][tx];
      const wx = tx * TILE;
      const wy = ty * TILE;

      ctx.fillStyle = TILE_COLORS[tile];
      ctx.fillRect(wx, wy, TILE, TILE);

      // Tile border
      ctx.strokeStyle = TILE_BORDER[tile];
      ctx.lineWidth = 0.5;
      ctx.strokeRect(wx + 0.5, wy + 0.5, TILE - 1, TILE - 1);

      // Wall 3D effect
      if (tile === "wall") {
        ctx.fillStyle = "rgba(255,255,255,0.06)";
        ctx.fillRect(wx, wy, TILE, 4);
        ctx.fillStyle = "rgba(0,0,0,0.25)";
        ctx.fillRect(wx, wy + TILE - 4, TILE, 4);
        ctx.fillRect(wx + TILE - 4, wy, 4, TILE);
      }

      // Bush grass texture
      if (tile === "bush") {
        ctx.fillStyle = "rgba(0,200,80,0.15)";
        ctx.beginPath();
        ctx.arc(wx + TILE * 0.3, wy + TILE * 0.4, 6, 0, Math.PI * 2);
        ctx.arc(wx + TILE * 0.7, wy + TILE * 0.35, 7, 0, Math.PI * 2);
        ctx.arc(wx + TILE * 0.5, wy + TILE * 0.65, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // ── PARTICLES (behind brawlers) ──
  for (const p of state.particles) {
    const alpha = p.life / p.maxLife;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius * alpha, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // ── BULLETS ──
  for (const b of state.bullets) {
    const alpha = b.life / b.maxLife;

    // Glow
    const grd = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius * 3);
    grd.addColorStop(0, b.color + "cc");
    grd.addColorStop(1, b.color + "00");
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius * 3, 0, Math.PI * 2);
    ctx.fill();

    // Core
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius * 0.6, 0, Math.PI * 2);
    ctx.fill();

    // Trail
    ctx.strokeStyle = b.color;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.moveTo(b.x - b.vx * 4, b.y - b.vy * 4);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // ── BRAWLERS ──
  for (const b of state.brawlers) {
    if (!b.alive) continue;
    drawBrawler(ctx, b, state.time);
  }

  ctx.restore();
}

function drawBrawler(ctx: CanvasRenderingContext2D, b: Brawler, time: number) {
  ctx.save();
  ctx.translate(b.x, b.y);

  const r = 18;

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.beginPath();
  ctx.ellipse(0, 6, r * 0.9, r * 0.4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Team indicator ring
  const teamColor = b.team === 0 ? "#00E676" : "#FF1744";
  ctx.strokeStyle = teamColor;
  ctx.lineWidth = b.isPlayer ? 3 : 2;
  ctx.beginPath();
  ctx.arc(0, 0, r + 3, 0, Math.PI * 2);
  ctx.stroke();

  // Body glow (pulse for player)
  if (b.isPlayer) {
    const pulse = 0.5 + 0.5 * Math.sin(time * 0.1);
    const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 2);
    grd.addColorStop(0, b.accentColor + "44");
    grd.addColorStop(1, b.color + "00");
    ctx.fillStyle = grd;
    ctx.globalAlpha = pulse;
    ctx.beginPath();
    ctx.arc(0, 0, r * 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // Body
  const bodyGrd = ctx.createRadialGradient(-4, -4, 2, 0, 0, r);
  bodyGrd.addColorStop(0, b.accentColor);
  bodyGrd.addColorStop(0.6, b.color);
  bodyGrd.addColorStop(1, darken(b.color, 0.5));
  ctx.fillStyle = bodyGrd;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  // Stun effect
  if (b.stunTimer > 0) {
    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.arc(0, 0, r + 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Gun barrel
  ctx.save();
  ctx.rotate(b.angle);
  ctx.fillStyle = darken(b.color, 0.4);
  ctx.fillRect(r * 0.4, -4, r * 0.9, 8);
  ctx.fillStyle = b.accentColor;
  ctx.fillRect(r * 0.5, -3, r * 0.7, 6);
  ctx.restore();

  // Emoji / face
  ctx.font = `${r}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(b.emoji, 0, 0);

  // Health bar
  const barW = 36;
  const barH = 5;
  const barX = -barW / 2;
  const barY = -(r + 14);

  ctx.fillStyle = "rgba(0,0,0,0.6)";
  roundRect(ctx, barX - 1, barY - 1, barW + 2, barH + 2, 3);
  ctx.fill();

  const hpRatio = b.hp / b.maxHp;
  const hpColor = hpRatio > 0.6 ? "#00E676" : hpRatio > 0.3 ? "#FFB800" : "#FF1744";
  ctx.fillStyle = hpColor;
  roundRect(ctx, barX, barY, barW * hpRatio, barH, 2);
  ctx.fill();

  // Name
  if (b.isPlayer || b.team === 0) {
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = "bold 10px Montserrat, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(b.name, 0, -(r + 22));
  }

  ctx.restore();
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function darken(hex: string, factor: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${Math.floor(r * factor)},${Math.floor(g * factor)},${Math.floor(b * factor)})`;
}

export function renderHUD(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  canvasW: number,
  canvasH: number
) {
  const player = state.brawlers.find(b => b.isPlayer);
  if (!player) return;

  // ── TOP BAR ──
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(0, 0, canvasW, 44);

  // Scores
  const midX = canvasW / 2;

  // Player team score
  ctx.fillStyle = "#00E676";
  ctx.font = "bold 22px 'Bebas Neue', sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.fillText(String(state.score.player), midX - 30, 22);

  // VS
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.font = "bold 14px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("VS", midX, 22);

  // Enemy score
  ctx.fillStyle = "#FF1744";
  ctx.font = "bold 22px 'Bebas Neue', sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(String(state.score.enemy), midX + 30, 22);

  // Timer
  const secs = Math.ceil(state.timeLeft / 60);
  const mm = Math.floor(secs / 60);
  const ss = secs % 60;
  ctx.fillStyle = secs <= 30 ? "#FF1744" : "white";
  ctx.font = "bold 16px 'Oswald', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`${mm}:${ss.toString().padStart(2, "0")}`, midX, 34);

  // ── SUPER CHARGE ──
  const superRatio = player.superCharge / player.superMax;
  const superW = 120;
  const superX = canvasW / 2 - superW / 2;
  const superY = canvasH - 80;

  ctx.fillStyle = "rgba(0,0,0,0.5)";
  roundRectHUD(ctx, superX - 2, superY - 2, superW + 4, 14, 6);
  ctx.fill();

  const superGrd = ctx.createLinearGradient(superX, 0, superX + superW, 0);
  superGrd.addColorStop(0, "#9C27B0");
  superGrd.addColorStop(1, "#E040FB");
  ctx.fillStyle = superGrd;
  roundRectHUD(ctx, superX, superY, superW * superRatio, 10, 5);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = "bold 9px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("СУПЕР", canvasW / 2, superY + 20);

  // Player HP bar (bottom center)
  const hpW = 160;
  const hpX = canvasW / 2 - hpW / 2;
  const hpY = canvasH - 58;
  const hpRatio = player.hp / player.maxHp;

  ctx.fillStyle = "rgba(0,0,0,0.6)";
  roundRectHUD(ctx, hpX - 2, hpY - 2, hpW + 4, 14, 6);
  ctx.fill();

  const hpColor = hpRatio > 0.6 ? "#00E676" : hpRatio > 0.3 ? "#FFB800" : "#FF1744";
  const hpGrd = ctx.createLinearGradient(hpX, 0, hpX + hpW, 0);
  hpGrd.addColorStop(0, hpColor);
  hpGrd.addColorStop(1, hpColor + "99");
  ctx.fillStyle = hpGrd;
  roundRectHUD(ctx, hpX, hpY, hpW * hpRatio, 10, 5);
  ctx.fill();

  ctx.fillStyle = "white";
  ctx.font = "bold 9px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`❤️ ${Math.ceil(player.hp)}`, canvasW / 2, hpY + 20);

  // Cooldown indicator
  const cdRatio = 1 - (player.shotCooldown / player.shotCooldownMax);
  ctx.fillStyle = cdRatio >= 1 ? "#FFB800" : "rgba(255,184,0,0.3)";
  ctx.font = "bold 11px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(cdRatio >= 1 ? "🔫 ГОТОВО" : "🔫 ●●●", canvasW / 2 + 95, canvasH - 46);
}

function roundRectHUD(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  if (w <= 0) return;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
