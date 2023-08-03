import getRandomInt from './lib/random';
import type { TilePosition } from './types/tile-position';

export default class Map {
  private width: number;
  private height: number;
  private entityTiles: number[];
  private spawnLocations: Record<string, number[]>;

  constructor(width: number, height: number, spawnLocations: Record<string, number[]>) {
    this.width = width;
    this.height = height;
    this.entityTiles = Array(this.width * this.height).fill(0);
    this.spawnLocations = spawnLocations;
  }

  getEntityTilePosition(entityId: number): TilePosition | null {
    const tileIndex = this.getEntityTileIndex(entityId);

    if (tileIndex === -1) {
      return null;
    }

    return this.toTilePosition(tileIndex);
  }

  getAllTiles(): TilePosition[] {
    return this.entityTiles.map((_, i) => this.toTilePosition(i));
  }

  getEntityIdAtPosition(position: TilePosition): number | null {
    const id = this.entityTiles[this.toTileIndex(position)] as (number | undefined);
    return id ? id : null;
  }

  swapTiles(a: TilePosition, b: TilePosition) {
    const aIndex = this.toTileIndex(a);
    const bIndex = this.toTileIndex(b);
    const aValue = this.entityTiles[aIndex];
    const bValue = this.entityTiles[bIndex];

    this.entityTiles[aIndex] = bValue;
    this.entityTiles[bIndex] = aValue;
  }

  placeEntity(entityId: number, position: TilePosition) {
    const index = this.toTileIndex(position);
    this.entityTiles[index] = entityId;
  }

  debugRender(): string {
    return '\n' + this.entityTiles.reduce((acc, entityId, index) => {
      acc += `${entityId} `;

      if (index % this.width === (this.width - 1)) {
        acc += '\n';
      }

      return acc;
    }, '');
  }

  isInMap(position: TilePosition) {
    const index = this.toTileIndex(position);
    return index >= 0 && index < this.width * this.height;
  }

  isEmpty(position: TilePosition) {
    const index = this.toTileIndex(position);
    return !this.entityTiles[index];
  }

  getRandomSpawnLocation(type: string): TilePosition | null {
    const spawnLocations = (this.spawnLocations[type] ?? []).filter(index => !this.entityTiles[index]);

    if (spawnLocations.length === 0) {
      return null;
    }

    return this.toTilePosition(spawnLocations[getRandomInt(0, spawnLocations.length - 1)]);
  }

  getSpawnLocations(type: string): TilePosition[] {
    return (this.spawnLocations[type] ?? []).map(index => this.toTilePosition(index));
  }
  
  private getEntityTileIndex(entityId: number): number {
    return this.entityTiles.findIndex(e => e === entityId);
  }

  toTilePosition(tileIndex: number): TilePosition {
    return {
      x: tileIndex % this.width,
      y: Math.floor(tileIndex / this.width),
    };
  }

  toTileIndex(tilePosition: TilePosition): number {
    return tilePosition.y * this.width + tilePosition.x;
  }

  toState() {
    return {
      width: this.width,
      height: this.height,
      entityTiles: this.entityTiles,
    };
  }

  toServerState() {
    return {
      width: this.width,
      height: this.height,
      entityTiles: this.entityTiles,
      spawnLocations: this.spawnLocations,
    };
  }

  restoreFromSave(save: Record<string, any>) {
    if (save.width) {
      this.width = save.width;
    }

    if (save.height) {
      this.width = save.height;
    }

    if (save.entityTiles) {
      this.entityTiles = save.entityTiles;
    }

    if (save.spawnLocations) {
      this.spawnLocations = save.spawnLocations;
    }
  }
}
