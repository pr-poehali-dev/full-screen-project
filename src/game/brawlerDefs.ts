export interface BrawlerDef {
  name: string;
  emoji: string;
  color: string;
  accentColor: string;
  maxHp: number;
  speed: number;
  damage: number;
  range: number;
  bulletSpeed: number;
  shotCooldownMax: number; // frames
  superMax: number;
}

export const BRAWLER_DEFS: BrawlerDef[] = [
  {
    name: "Сириус",
    emoji: "🟣",
    color: "#9C27B0",
    accentColor: "#E040FB",
    maxHp: 7200,
    speed: 3.5,
    damage: 1680,
    range: 380,
    bulletSpeed: 9,
    shotCooldownMax: 35,
    superMax: 6,
  },
  {
    name: "Наджия",
    emoji: "🔵",
    color: "#0288D1",
    accentColor: "#00E5FF",
    maxHp: 5400,
    speed: 3.2,
    damage: 2100,
    range: 450,
    bulletSpeed: 11,
    shotCooldownMax: 40,
    superMax: 5,
  },
  {
    name: "Буллет",
    emoji: "🔴",
    color: "#C62828",
    accentColor: "#FF1744",
    maxHp: 9200,
    speed: 2.6,
    damage: 980,
    range: 200,
    bulletSpeed: 7,
    shotCooldownMax: 20,
    superMax: 8,
  },
  {
    name: "Нита",
    emoji: "🟢",
    color: "#2E7D32",
    accentColor: "#00E676",
    maxHp: 6600,
    speed: 3.0,
    damage: 1440,
    range: 320,
    bulletSpeed: 8,
    shotCooldownMax: 30,
    superMax: 6,
  },
  {
    name: "Леон",
    emoji: "🟡",
    color: "#F57F17",
    accentColor: "#FFB800",
    maxHp: 5000,
    speed: 4.2,
    damage: 1800,
    range: 280,
    bulletSpeed: 10,
    shotCooldownMax: 28,
    superMax: 5,
  },
  {
    name: "Биби",
    emoji: "🩷",
    color: "#880E4F",
    accentColor: "#F48FB1",
    maxHp: 7400,
    speed: 3.4,
    damage: 1200,
    range: 260,
    bulletSpeed: 8,
    shotCooldownMax: 22,
    superMax: 7,
  },
];
