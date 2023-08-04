
import Map from './map';
import type { AbilityBlueprint } from './types/ability-blueprint';
import type { Entity } from './types/entity';
import type { EntityBlueprint } from './types/entity-blueprint';
import type { Player } from './types/player';
import type { TilePosition } from './types/tile-position';
import type { ShapeOptions, TileShape } from './types/tile-shape';
import { TileShapeReference } from './types/tile-shape-reference';

export default class Game {
  public map: Map;
  public entities: Entity[];
  public state: 'Lobby' | 'Game';
  public players: Player[];
  public entityTypes: string[];
  public turnEntityId: number | undefined;

  public tileShapeByShapeType: Record<string, TileShape>;
  public abilityBlueprintByAbilityId: Record<string, AbilityBlueprint>;
  public entityBlueprintByEntityType: Record<string, EntityBlueprint>;

  constructor() {
    this.map = new Map(19, 19, {Player: [42, 78, 82, 118], Boss: [280], Minion: [242, 278, 282, 318]});
    this.entities = [];
    this.state = 'Lobby';
    this.players = [];
    this.entityTypes = [];
    this.tileShapeByShapeType = {};
    this.abilityBlueprintByAbilityId = {};
    this.entityBlueprintByEntityType = {};
  }

  placeEntity(entity: Entity, position: TilePosition) {
    this.map.placeEntity(entity.id, position);
    this.entities.push(entity);
  }

  moveEntity(entityId: number, target: TilePosition) {
    const previousPosition = this.map.getEntityTilePosition(entityId);

    if (!previousPosition) {
      return;
    }

    this.map.swapTiles(previousPosition, target);
  }

  getEntity(entityId: number): Entity | null {
    return this.entities.find(e => e.id === entityId) ?? null;
  }

  getPlayerWithToken(token: string) {
    return this.players.find(p => p.token === token);
  }

  getPlayerWithUsername(username: string) {
    return this.players.find(p => p.username === username);
  }

  addPlayer(player: Player) {
    this.players.push(player);
  }

  isEntityControlledByPlayer(entityId: number, playerToken: string) {
    const player = this.getPlayerWithToken(playerToken);
    return player && player.entityId === entityId;
  }

  isEntityPlayerControlled(entityId: number) {
    return this.players.some(p => p.entityId === entityId);
  }

  removePlayer(token: string) {
    const player = this.getPlayerWithToken(token);

    if (!player) {
      return;
    }

    const playerIndex = this.players.indexOf(player);
    this.players.splice(playerIndex, 1);

    if (player.entityId) {
      this.removeEntity(player.entityId);
    }
  }

  removeEntity(entityId: number) {
    const entity = this.getEntity(entityId);

    if (!entity) {
      return;
    }

    const entityIndex = this.entities.indexOf(entity);
    this.entities.splice(entityIndex, 1);
    this.map.removeEntity(entityId);
  }

  toState() {
    return {
      state: this.state,
      players: this.players.map(p => ({
        username: p.username,
        connected: p.connected,
        entityId: p.entityId,
        entityType: p.entityType,
      })),
      turnEntityId: this.turnEntityId,
      entities: this.entities,
      entityTypes: this.entityTypes,
      map: this.map.toState(),
    };
  }

  toServerState() {
    return {
      state: this.state,
      players: this.players.map(({disconnectTimeout, connected, ...p}) => ({...p, connected: false})),
      turnEntityId: this.turnEntityId,
      entities: this.entities,
      entityTypes: this.entityTypes,
      map: this.map.toServerState(),
    }
  }

  restoreFromSave(save: Record<string, any>) {
    if (save.state) {
      this.state = save.state;
    }

    if (save.turnEntityId) {
      this.turnEntityId = save.turnEntityId;
    }

    if (save.players) {
      this.players = save.players;
    }

    if (save.entities) {
      this.entities = save.entities;
    }

    if (save.map) {
      this.map.restoreFromSave(save.map);
    }
  }

  getEntitiesOfType(entityType: string) {
    return this.entities.filter(e => e.type === entityType);
  }

  getPlayerEntityIds(): number[] {
    return this.players.map(p => p.entityId).filter(n => !!n) as number[];
  }

  getClosestPlayerEntity(from: TilePosition): {entityId: number, position: TilePosition} | null {
    const playerEntityIds = this.getPlayerEntityIds();

    if (playerEntityIds.length === 0) {
      return null;
    }

    let distance = Infinity;
    let entityId: number | null = null;
    let position: TilePosition | null = null;

    for (const playerEntityId of playerEntityIds) {
      const playerPosition = this.map.getEntityTilePosition(playerEntityId);

      if (!playerPosition) {
        continue;
      }

      const d = this.map.distance(from, playerPosition);

      if (d < distance) {
        distance = d;
        entityId = playerEntityId;
        position = playerPosition;
      }
    }

    if (!entityId || !position) {
      return null;
    }

    return {entityId, position};
  }

  computeShape(tileShapeReference: TileShapeReference, origin: TilePosition): TilePosition[] {
    const tileShapeId = typeof tileShapeReference === 'string' ? tileShapeReference : tileShapeReference.shape;
    const options: ShapeOptions = typeof tileShapeReference === 'string' ? {map: this.map} : {map: this.map, size: tileShapeReference.size, includeOrigin: tileShapeReference.includeOrigin};
    const tileShape = this.tileShapeByShapeType[tileShapeId];

    if (!tileShape) {
      return [];
    }

    return tileShape(origin, options).filter(position => this.map.isInMap(position));
  }

  getPlayerTiles() {
    return this.getPlayerEntityIds()
    .map(id => this.map.getEntityTilePosition(id))
    .filter(n => !!n) as TilePosition[];
  }

  getEntitiesInTiles(tiles: TilePosition[]) {
    return tiles.map(tile => this.map.getEntityIdAtPosition(tile))
      .map(entityId => entityId ? this.getEntity(entityId) : null)
      .filter(entity => !!entity) as Entity[];
  }

  returnToLobby() {
    this.state = 'Lobby';
    
    for (const entity of this.entities) {
      this.removeEntity(entity.id);
    }
  }
}
