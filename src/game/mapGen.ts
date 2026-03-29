import { TileType } from "./types";

export const TILE = 40;
export const MAP_W = 30;
export const MAP_H = 22;

export function generateMap(): TileType[][] {
  const map: TileType[][] = Array.from({ length: MAP_H }, () =>
    Array(MAP_W).fill("empty")
  );

  // Border walls
  for (let x = 0; x < MAP_W; x++) {
    map[0][x] = "wall";
    map[MAP_H - 1][x] = "wall";
  }
  for (let y = 0; y < MAP_H; y++) {
    map[y][0] = "wall";
    map[y][MAP_W - 1] = "wall";
  }

  // Symmetric wall layout (mirrored left-right and top-bottom)
  const wallPatterns: [number, number][] = [
    [2, 3], [2, 4], [3, 3],
    [5, 7], [5, 8], [6, 7],
    [3, 11], [4, 11], [3, 12],
    [7, 5], [8, 5], [7, 6],
    [9, 13], [9, 14], [10, 13],
    [6, 2], [7, 2],
    [10, 8], [10, 9],
  ];

  const bushPatterns: [number, number][] = [
    [4, 5], [4, 6],
    [8, 2], [8, 3],
    [6, 10], [7, 10],
    [9, 6], [9, 7],
    [11, 3], [11, 4],
  ];

  for (const [y, x] of wallPatterns) {
    // mirror horizontally
    safeSet(map, y, x, "wall");
    safeSet(map, y, MAP_W - 1 - x, "wall");
    // mirror vertically
    safeSet(map, MAP_H - 1 - y, x, "wall");
    safeSet(map, MAP_H - 1 - y, MAP_W - 1 - x, "wall");
  }

  for (const [y, x] of bushPatterns) {
    safeSet(map, y, x, "bush");
    safeSet(map, y, MAP_W - 1 - x, "bush");
    safeSet(map, MAP_H - 1 - y, x, "bush");
    safeSet(map, MAP_H - 1 - y, MAP_W - 1 - x, "bush");
  }

  // Center area - some walls for cover
  safeSet(map, 10, 14, "wall");
  safeSet(map, 10, 15, "wall");
  safeSet(map, 11, 14, "wall");
  safeSet(map, 11, 15, "wall");
  safeSet(map, 10, 13, "wall"); // duplicate safe
  safeSet(map, 12, 15, "wall");

  return map;
}

function safeSet(map: TileType[][], y: number, x: number, type: TileType) {
  if (y > 0 && y < MAP_H - 1 && x > 0 && x < MAP_W - 1) {
    map[y][x] = type;
  }
}

export function isSolid(map: TileType[][], x: number, y: number): boolean {
  const tx = Math.floor(x / TILE);
  const ty = Math.floor(y / TILE);
  if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H) return true;
  return map[ty][tx] === "wall" || map[ty][tx] === "water";
}

export function getTile(map: TileType[][], x: number, y: number): TileType {
  const tx = Math.floor(x / TILE);
  const ty = Math.floor(y / TILE);
  if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H) return "wall";
  return map[ty][tx];
}
