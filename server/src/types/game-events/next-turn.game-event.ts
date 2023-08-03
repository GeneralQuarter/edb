import type { GameEvent } from '../game-event';
import type { PlayerEventData } from './player-event-data';

export type NextTurnData = {} & PlayerEventData;

export type NextTurnEvent = GameEvent<NextTurnData> & {
  type: 'NextTurn';
}
