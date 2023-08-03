import type { GameEvent } from '../game-event';
import type { PlayerEventData } from './player-event-data';

export type StartGameData = {} & PlayerEventData;

export type StartGameGameEvent = GameEvent<StartGameData> & {
  type: 'StartGame';
}
