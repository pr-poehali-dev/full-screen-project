export interface Vec2 { x: number; y: number; }

export interface Bullet {
  id: number;
  x: number; y: number;
  vx: number; vy: number;
  ownerId: number;
  damage: number;
  radius: number;
  life: number;
  maxLife: number;
  color: string;
}

export interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number;
  maxLife: number;
  color: string;
  radius: number;
}

export interface Brawler {
  id: number;
  name: string;
  x: number; y: number;
  vx: number; vy: number;
  angle: number;
  hp: number;
  maxHp: number;
  speed: number;
  damage: number;
  range: number;
  bulletSpeed: number;
  color: string;
  accentColor: string;
  emoji: string;
  isPlayer: boolean;
  team: 0 | 1; // 0 = player team, 1 = enemy
  shotCooldown: number;
  shotCooldownMax: number;
  superCharge: number;
  superMax: number;
  alive: boolean;
  // AI state
  aiTarget: Vec2 | null;
  aiShootTimer: number;
  aiMoveTimer: number;
  stunTimer: number;
}

export type TileType = "empty" | "wall" | "bush" | "water";

export interface GameState {
  brawlers: Brawler[];
  bullets: Bullet[];
  particles: Particle[];
  tiles: TileType[][];
  mapW: number;
  mapH: number;
  tileSize: number;
  camera: Vec2;
  time: number;
  gameOver: boolean;
  victory: boolean;
  score: { player: number; enemy: number };
  mode: string;
  timeLeft: number;
  crystals: Crystal[];
}

export interface Crystal {
  id: number;
  x: number; y: number;
  carried: number | null; // brawler id or null
}

export interface InputState {
  moveJoystick: Vec2 | null;
  shootJoystick: Vec2 | null;
  superPressed: boolean;
}
