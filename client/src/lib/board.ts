import type { TilePosition } from '../types/tile-position';

export function toTilePosition(tileIndex: number, width: number): TilePosition {
  return {
    x: tileIndex % width,
    y: Math.floor(tileIndex / width),
  };
}

export function toTileIndex(position: TilePosition, width: number): number {
  return position.y * width + position.x;
}

export function allTiles(width: number, height: number): TilePosition[] {
  return Array(width * height).map((_, i) => toTilePosition(i, width));
}

export function isTileInMap(position: TilePosition, width: number, height: number): boolean {
  const index = toTileIndex(position, width);
  return index >= 0 && index < width * height;
}

export function isTileInTiles(tile: TilePosition, tiles: TilePosition[]) {
  return tiles.some(t => t.x === tile.x && t.y === tile.y);
}
