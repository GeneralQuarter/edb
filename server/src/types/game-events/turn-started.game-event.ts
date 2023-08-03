import type { GameEvent } from '../game-event';
import type { PlayerEventData } from './player-event-data';

export type TurnStartedData = {
  entityId: number;
} & PlayerEventData;

export type TurnStartedGameEvent = GameEvent<TurnStartedData> & {
  type: 'TurnStarted';
}
