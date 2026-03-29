import { GameState, Brawler, Bullet, Particle, Crystal, Vec2 } from "./types";
import { isSolid, getTile, TILE, MAP_W, MAP_H, generateMap } from "./mapGen";
import { BRAWLER_DEFS } from "./brawlerDefs";

let _bulletId = 0;
let _crystalId = 0;

export function createGame(playerBrawlerIdx: number, mode: string): GameState {
  const map = generateMap();
  const tileSize = TILE;

  const brawlers: Brawler[] = [];

  // Player
  const pd = BRAWLER_DEFS[playerBrawlerIdx];
  brawlers.push({
    id: 0,
    name: pd.name,
    x: 3 * TILE + TILE / 2,
    y: MAP_H / 2 * TILE,
    vx: 0, vy: 0,
    angle: 0,
    hp: pd.maxHp,
    maxHp: pd.maxHp,
    speed: pd.speed,
    damage: pd.damage,
    range: pd.range,
    bulletSpeed: pd.bulletSpeed,
    color: pd.color,
    accentColor: pd.accentColor,
    emoji: pd.emoji,
    isPlayer: true,
    team: 0,
    shotCooldown: 0,
    shotCooldownMax: pd.shotCooldownMax,
    superCharge: 0,
    superMax: pd.superMax,
    alive: true,
    aiTarget: null,
    aiShootTimer: 0,
    aiMoveTimer: 0,
    stunTimer: 0,
  });

  // Teammates (AI, team 0)
  [2, 4].forEach((defIdx, i) => {
    const d = BRAWLER_DEFS[defIdx % BRAWLER_DEFS.length];
    brawlers.push({
      id: i + 1,
      name: d.name,
      x: 3 * TILE + TILE / 2,
      y: (MAP_H / 2 + (i === 0 ? -3 : 3)) * TILE,
      vx: 0, vy: 0,
      angle: 0,
      hp: d.maxHp,
      maxHp: d.maxHp,
      speed: d.speed,
      damage: d.damage,
      range: d.range,
      bulletSpeed: d.bulletSpeed,
      color: d.color,
      accentColor: d.accentColor,
      emoji: d.emoji,
      isPlayer: false,
      team: 0,
      shotCooldown: Math.random() * 30,
      shotCooldownMax: d.shotCooldownMax,
      superCharge: 0,
      superMax: d.superMax,
      alive: true,
      aiTarget: null,
      aiShootTimer: 0,
      aiMoveTimer: Math.random() * 60,
      stunTimer: 0,
    });
  });

  // Enemies (AI, team 1)
  [1, 3, 5].forEach((defIdx, i) => {
    const d = BRAWLER_DEFS[defIdx % BRAWLER_DEFS.length];
    brawlers.push({
      id: i + 3,
      name: d.name,
      x: (MAP_W - 4) * TILE + TILE / 2,
      y: (MAP_H / 2 + (i - 1) * 3) * TILE,
      vx: 0, vy: 0,
      angle: Math.PI,
      hp: d.maxHp,
      maxHp: d.maxHp,
      speed: d.speed,
      damage: d.damage,
      range: d.range,
      bulletSpeed: d.bulletSpeed,
      color: d.color,
      accentColor: d.accentColor,
      emoji: d.emoji,
      isPlayer: false,
      team: 1,
      shotCooldown: Math.random() * 40,
      shotCooldownMax: d.shotCooldownMax,
      superCharge: 0,
      superMax: d.superMax,
      alive: true,
      aiTarget: null,
      aiShootTimer: Math.random() * 60,
      aiMoveTimer: Math.random() * 60,
      stunTimer: 0,
    });
  });

  // Crystals for gem grab mode
  const crystals: Crystal[] = [];
  if (mode === "gems") {
    for (let i = 0; i < 5; i++) {
      crystals.push({
        id: _crystalId++,
        x: (MAP_W / 2 + (Math.random() - 0.5) * 8) * TILE,
        y: (MAP_H / 2 + (Math.random() - 0.5) * 6) * TILE,
        carried: null,
      });
    }
  }

  return {
    brawlers,
    bullets: [],
    particles: [],
    tiles: map,
    mapW: MAP_W,
    mapH: MAP_H,
    tileSize,
    camera: { x: 0, y: 0 },
    time: 0,
    gameOver: false,
    victory: false,
    score: { player: 0, enemy: 0 },
    mode,
    timeLeft: 60 * 180, // 3 minutes in frames
    crystals,
  };
}

export function spawnBullet(state: GameState, shooter: Brawler, angle: number) {
  if (shooter.shotCooldown > 0) return;
  shooter.shotCooldown = shooter.shotCooldownMax;
  const speed = shooter.bulletSpeed;
  state.bullets.push({
    id: _bulletId++,
    x: shooter.x + Math.cos(angle) * 20,
    y: shooter.y + Math.sin(angle) * 20,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    ownerId: shooter.id,
    damage: shooter.damage,
    radius: 6,
    life: Math.floor(shooter.range / speed),
    maxLife: Math.floor(shooter.range / speed),
    color: shooter.accentColor,
  });

  // Recoil particle
  for (let i = 0; i < 3; i++) {
    const a = angle + Math.PI + (Math.random() - 0.5) * 0.8;
    spawnParticles(state, shooter.x, shooter.y, shooter.accentColor, 1);
  }
}

export function spawnParticles(
  state: GameState, x: number, y: number, color: string, count: number
) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 3;
    state.particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 20 + Math.random() * 20,
      maxLife: 40,
      color,
      radius: 2 + Math.random() * 3,
    });
  }
}

export function updateGame(
  state: GameState,
  input: { move: Vec2 | null; shoot: Vec2 | null; superPressed: boolean },
  dt: number
): void {
  if (state.gameOver) return;

  state.time += dt;
  state.timeLeft = Math.max(0, state.timeLeft - 1);

  const player = state.brawlers.find(b => b.isPlayer && b.alive);

  // ── PLAYER MOVEMENT ──
  if (player && input.move) {
    const len = Math.sqrt(input.move.x ** 2 + input.move.y ** 2);
    if (len > 0.1) {
      const nx = input.move.x / len;
      const ny = input.move.y / len;
      const spd = player.speed * Math.min(len, 1);
      moveEntity(state, player, nx * spd, ny * spd);
    }
  }

  // ── PLAYER SHOOT ──
  if (player && input.shoot) {
    const len = Math.sqrt(input.shoot.x ** 2 + input.shoot.y ** 2);
    if (len > 0.3) {
      const angle = Math.atan2(input.shoot.y, input.shoot.x);
      player.angle = angle;
      spawnBullet(state, player, angle);
    }
  }

  // ── UPDATE ALL BRAWLERS ──
  for (const b of state.brawlers) {
    if (!b.alive) continue;
    if (b.shotCooldown > 0) b.shotCooldown--;
    if (b.stunTimer > 0) b.stunTimer--;

    // AI logic
    if (!b.isPlayer && b.stunTimer === 0) {
      updateAI(state, b);
    }
  }

  // ── BULLETS ──
  for (let i = state.bullets.length - 1; i >= 0; i--) {
    const bullet = state.bullets[i];
    bullet.x += bullet.vx;
    bullet.y += bullet.vy;
    bullet.life--;

    // Wall collision
    if (isSolid(state.tiles, bullet.x, bullet.y)) {
      spawnParticles(state, bullet.x, bullet.y, bullet.color, 5);
      state.bullets.splice(i, 1);
      continue;
    }

    // Brawler hit
    let hit = false;
    for (const b of state.brawlers) {
      if (!b.alive || b.id === bullet.ownerId) continue;
      // don't hit teammates
      const shooter = state.brawlers.find(x => x.id === bullet.ownerId);
      if (shooter && shooter.team === b.team) continue;

      const dx = b.x - bullet.x;
      const dy = b.y - bullet.y;
      if (Math.sqrt(dx * dx + dy * dy) < 20 + bullet.radius) {
        b.hp -= bullet.damage;
        b.stunTimer = 8;
        spawnParticles(state, bullet.x, bullet.y, "#FF1744", 8);
        spawnParticles(state, bullet.x, bullet.y, b.color, 4);

        // Super charge for shooter
        if (shooter) {
          shooter.superCharge = Math.min(shooter.superMax, shooter.superCharge + 1);
        }

        if (b.hp <= 0) {
          b.hp = 0;
          b.alive = false;
          spawnParticles(state, b.x, b.y, b.accentColor, 20);
          // Score
          if (b.team === 1) state.score.player++;
          else state.score.enemy++;

          // Respawn after delay (simplified: just revive in place)
          setTimeout(() => {
            b.alive = true;
            b.hp = b.maxHp;
            b.x = b.team === 0 ? 3 * TILE + TILE / 2 : (MAP_W - 4) * TILE + TILE / 2;
            b.y = MAP_H / 2 * TILE + (b.id % 3 - 1) * 3 * TILE;
          }, 5000);
        }
        hit = true;
        break;
      }
    }

    if (hit || bullet.life <= 0) {
      state.bullets.splice(i, 1);
    }
  }

  // ── PARTICLES ──
  for (let i = state.particles.length - 1; i >= 0; i--) {
    const p = state.particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.92;
    p.vy *= 0.92;
    p.life--;
    if (p.life <= 0) state.particles.splice(i, 1);
  }

  // ── CAMERA (follows player) ──
  if (player) {
    const targetCx = player.x;
    const targetCy = player.y;
    state.camera.x += (targetCx - state.camera.x) * 0.1;
    state.camera.y += (targetCy - state.camera.y) * 0.1;
  }

  // ── GAME OVER CHECK ──
  const aliveEnemies = state.brawlers.filter(b => b.team === 1 && b.alive).length;
  const aliveAllies = state.brawlers.filter(b => b.team === 0 && b.alive).length;

  if (state.timeLeft <= 0) {
    state.gameOver = true;
    state.victory = state.score.player >= state.score.enemy;
  }
}

function moveEntity(state: GameState, b: Brawler, dx: number, dy: number) {
  const r = 16;
  const newX = b.x + dx;
  const newY = b.y + dy;

  // X axis
  if (!isSolid(state.tiles, newX + r * Math.sign(dx || 1), b.y) &&
    !isSolid(state.tiles, newX - r * Math.sign(dx || 1), b.y)) {
    b.x = newX;
  }
  // Y axis
  if (!isSolid(state.tiles, b.x, newY + r * Math.sign(dy || 1)) &&
    !isSolid(state.tiles, b.x, newY - r * Math.sign(dy || 1))) {
    b.y = newY;
  }

  if (dx !== 0 || dy !== 0) {
    b.angle = Math.atan2(dy, dx);
  }
}

function updateAI(state: GameState, b: Brawler) {
  const enemies = state.brawlers.filter(e => e.alive && e.team !== b.team);
  if (enemies.length === 0) return;

  // Find closest enemy
  let closest = enemies[0];
  let closestDist = Infinity;
  for (const e of enemies) {
    const d = dist(b, e);
    if (d < closestDist) { closestDist = d; closest = e; }
  }

  b.aiMoveTimer--;
  b.aiShootTimer--;

  // Move toward enemy (with some randomness)
  if (b.aiMoveTimer <= 0) {
    b.aiMoveTimer = 30 + Math.random() * 60;
    const angle = Math.atan2(closest.y - b.y, closest.x - b.x) + (Math.random() - 0.5) * 0.8;
    b.aiTarget = {
      x: b.x + Math.cos(angle) * 80,
      y: b.y + Math.sin(angle) * 80,
    };
  }

  if (b.aiTarget) {
    const dx = b.aiTarget.x - b.x;
    const dy = b.aiTarget.y - b.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d > 5) {
      const spd = b.speed * 0.85;
      moveEntity(state, b, (dx / d) * spd, (dy / d) * spd);
    }
  }

  // Keep optimal distance
  if (closestDist < b.range * 0.4) {
    const angle = Math.atan2(b.y - closest.y, b.x - closest.x);
    moveEntity(state, b, Math.cos(angle) * b.speed * 0.5, Math.sin(angle) * b.speed * 0.5);
  }

  // Shoot
  if (b.aiShootTimer <= 0 && closestDist < b.range && b.shotCooldown === 0) {
    b.aiShootTimer = 20 + Math.random() * 40;
    const angle = Math.atan2(closest.y - b.y, closest.x - b.x);
    b.angle = angle;
    spawnBullet(state, b, angle);
  }
}

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}
