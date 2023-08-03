
import Map from './map';
import type { Entity } from './types/entity';
import { EntityBlueprint } from './types/entity-blueprint';
import type { EntityStatsBlueprint } from './types/entity-stats-blueprint';
import type { Player } from './types/player';
import type { TilePosition } from './types/tile-position';

export default class Game {
  public map: Map;
  public entities: Entity[];
  public state: 'Lobby' | 'Game';
  public players: Player[];
  public entityTypes: string[];
  public turnEntityId: number | undefined;

  public entityBlueprintByEntityType: Record<string, EntityBlueprint>;

  constructor() {
    this.map = new Map(19, 19, {Player: [42, 78, 82, 118], Boss: [280], Minion: [242, 278, 282, 318]});
    this.entities = [];
    this.state = 'Lobby';
    this.players = [];
    this.entityTypes = [];
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
}
