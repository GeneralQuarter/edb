import type { Direction } from '../direction';
import type { GameEvent } from '../game-event';
import type { PlayerEventData } from './player-event-data';

export type MoveData = {
  entityId: number;
  direction: Direction;
} & PlayerEventData;

export type MoveGameEvent = GameEvent<MoveData> & {
  type: 'Move';
}
