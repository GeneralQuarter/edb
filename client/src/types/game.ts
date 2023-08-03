import type { Entity } from './entity';
import type { Map } from './map';
import type { Player } from './player';

export type Game = {
  state: 'Lobby' | 'Game';
  players: Player[];
  entities: Entity[];
  entityTypes: string[];
  map: Map;
}
